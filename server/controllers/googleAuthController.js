import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  CLIENT_URL,
  JWT_SECRET
} = process.env;

const VALID_ROLES = ['customer', 'owner'];

const DEFAULT_CLIENT_URL = CLIENT_URL || 'http://localhost:5000';

const oauthScopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'openid',
];

const sanitizeRole = (role) => {
  if (!role) return null;
  const normalized = String(role).toLowerCase();
  return VALID_ROLES.includes(normalized) ? normalized : null;
};

const getOAuthClient = () => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    throw new Error('Google OAuth is not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI.');
  }

  return new OAuth2Client({
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: GOOGLE_REDIRECT_URI,
  });
};

const encodeState = (payload) =>
  Buffer.from(JSON.stringify(payload)).toString('base64url');

const decodeState = (state) => {
  if (!state) return {};
  try {
    return JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
  } catch {
    return {};
  }
};

const buildRedirectUrl = (baseUrl, params) => {
  try {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value);
      }
    });
    return url.toString();
  } catch {
    return baseUrl;
  }
};

const createJwtForUser = (user) => {
  const payload = {
    id: user.id,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET || 'your_jwt_secret_key', {
    expiresIn: '30d',
  });
};

const findOrCreateUser = async ({ email, name, picture, googleId, requestedRole }) => {
  let user = await db.User.findOne({ where: { email } });

  if (!user) {
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    user = await db.User.create({
      name: name || 'Google User',
      email,
      password: hashedPassword,
      role: requestedRole || 'customer',
      isVerified: true,
      profileImage: picture,
      authProvider: 'google',
      authProviderId: googleId,
    });
  } else {
    const updates = {};

    if (requestedRole && user.role && user.role !== requestedRole) {
      const error = new Error('ROLE_MISMATCH');
      error.code = 'ROLE_MISMATCH';
      error.details = { expected: user.role, requested: requestedRole };
      throw error;
    }

    if (!user.authProvider) {
      updates.authProvider = 'google';
    }
    if (!user.authProviderId) {
      updates.authProviderId = googleId;
    }
    if (!user.profileImage && picture) {
      updates.profileImage = picture;
    }
    if (!user.role && requestedRole) {
      updates.role = requestedRole;
    }

    if (Object.keys(updates).length > 0) {
      await user.update(updates);
    }
  }

  return user;
};

export const initiateGoogleAuth = (req, res) => {
  try {
    const oauthClient = getOAuthClient();
    const redirectTarget =
      req.query.redirect ||
      req.headers.referer ||
      DEFAULT_CLIENT_URL;
    const requestedRole = sanitizeRole(req.query.role);

    if (!requestedRole) {
      return res.status(400).json({
        success: false,
        message: 'Please choose a valid user type before continuing with Google.'
      });
    }

    const state = encodeState({
      redirect: redirectTarget,
      nonce: crypto.randomBytes(8).toString('hex'),
      role: requestedRole
    });

    const authUrl = oauthClient.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: oauthScopes,
      state,
    });

    return res.redirect(authUrl);
  } catch (error) {
    console.error('Failed to start Google OAuth:', error);
    return res.status(500).json({
      success: false,
      message: 'Google authentication is not available. Please try again later.',
    });
  }
};

export const handleGoogleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Missing authorization code.',
      });
    }

    const oauthClient = getOAuthClient();
    const statePayload = decodeState(state);
    const redirectTarget = statePayload.redirect || DEFAULT_CLIENT_URL;
    const requestedRole = sanitizeRole(statePayload.role);

    if (!requestedRole) {
      const errorUrl = buildRedirectUrl(redirectTarget, {
        provider: 'google',
        status: 'error',
        message: 'User type is missing. Please choose renter or owner before signing in.'
      });
      return res.redirect(errorUrl);
    }

    const { tokens } = await oauthClient.getToken(code);
    const ticket = await oauthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const emailVerified = payload?.email_verified;

    if (!email || !emailVerified) {
      const errorUrl = buildRedirectUrl(redirectTarget, {
        provider: 'google',
        status: 'error',
        message: 'Email not verified with Google.',
      });
      return res.redirect(errorUrl);
    }

    const user = await findOrCreateUser({
      email,
      name: payload.name,
      picture: payload.picture,
      googleId: payload.sub,
      requestedRole
    });

    const token = createJwtForUser(user);
    const successUrl = buildRedirectUrl(redirectTarget, {
      provider: 'google',
      status: 'success',
      token,
    });

    return res.redirect(successUrl);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    if (error.code === 'ROLE_MISMATCH') {
      const fallback = buildRedirectUrl(DEFAULT_CLIENT_URL, {
        provider: 'google',
        status: 'error',
        message: 'This Google account is already registered with a different user type.'
      });
      return res.redirect(fallback);
    }
    const fallbackRedirect = buildRedirectUrl(DEFAULT_CLIENT_URL, {
      provider: 'google',
      status: 'error',
      message: 'Unable to authenticate with Google.',
    });

    if (res.headersSent) {
      return;
    }

    return res.redirect(fallbackRedirect);
  }
};
