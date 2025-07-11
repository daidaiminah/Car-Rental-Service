import axios from "axios";
import { v4 as uuid } from "uuid";
import base64 from "base-64";
import * as dotenv from "dotenv";
dotenv.config();

// For debugging purposes
console.log("===== MoMo API Configuration =====");
console.log("Environment variables loaded:", Object.keys(process.env).filter(key => 
  key.includes('API') || key.includes('SUBSCRIPTION')).length > 0 ? 'Yes' : 'No');

// Generate a UUID to use as the X-Reference-Id (User ID)
const referenceId = uuid();

const apiUserId = process.env.API_USER_ID;        // e.g., from env
const apiKey = process.env.GENERATED_API_KEY;               // e.g., from env
const tokenURL = "https://sandbox.momodeveloper.mtn.com/collection/token/";

let cachedToken = null;
let tokenExpiry = null;

// Define base URL and subscription key
const baseURL = "https://sandbox.momodeveloper.mtn.com/v1_0/apiuser"; // change to sandbox or production as needed
const subscriptionKey = process.env.SUBSCRIPTION_KEY; // replace with your real key
console.log("API_USER_ID:", apiUserId);
console.log("API_KEY:", apiKey);
console.log("SUBSCRIPTION_KEY:", subscriptionKey);

// Function to create API User
export const createApiUser = async () => {
  try {
    const response = await axios.post(
      `${baseURL}`,
      {
        providerCallbackHost: "https://in-time-whip.onrender.com/momo/notify", // must be a real and accessible URL
      },
      {
        headers: {
          "X-Reference-Id": referenceId,
          "Ocp-Apim-Subscription-Key": subscriptionKey,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ User created successfully with ID:", referenceId);
    console.log("Status:", response.status);
  } catch (error) {
    console.error("❌ Failed to create API user:", error.response?.data || error.message);
  }
};


export const generateApiKey = async () => {
   const apiUserId = process.env.API_USER_ID;
   const subscriptionKey = process.env.SUBSCRIPTION_KEY;

    try {
        const response = await axios.post(
            `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/${apiUserId}/apikey`,
            {},
            {
                headers: {
                    "Ocp-Apim-Subscription-Key": subscriptionKey,
                },
            }
        );
        console.log("✅ API key generated successfully with ID:", apiUserId);
        console.log("Status:", response.status);
    } catch (error) {
        console.error("❌ Failed to generate API key:", error.response?.data || error.message);
    }
}

//Get Access Token
/* Checks if the cached token is still valid */
const isTokenValid = () => {
  return cachedToken && tokenExpiry && Date.now() < tokenExpiry;
};

/* Fetches a new token and updates the cache */
const fetchNewToken = async () => {
  try {
    // For debugging purposes
    console.log("Attempting to fetch token with credentials:");
    console.log("API User ID:", apiUserId);
    console.log("API Key length:", apiKey ? apiKey.length : 0);
    console.log("Subscription Key length:", subscriptionKey ? subscriptionKey.length : 0);
    
    // Create Basic Auth header
    const auth = base64.encode(`${apiUserId}:${apiKey}`);
    console.log("Basic Auth header created");
    
    // Make the request
    console.log("Making token request to:", tokenURL);
    const response = await axios.post(
      tokenURL,
      {},  // Empty body instead of null
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Ocp-Apim-Subscription-Key": subscriptionKey,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if we have the expected response data
    if (!response.data || !response.data.access_token) {
      console.error("❌ Invalid token response:", response.data);
      throw new Error("Invalid token response format");
    }

    const { access_token, expires_in } = response.data;

    // Cache token and expiry time
    cachedToken = access_token;
    tokenExpiry = Date.now() + (expires_in - 60) * 1000; // subtract 60s buffer

    console.log("✅ Fetched new access token successfully.");
    return cachedToken;
  } catch (error) {
    console.error("❌ Failed to fetch access token:", error.response?.data || error.message);
    console.error("Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
    });
    
    // For development purposes only - in production, don't expose these details
    console.log("Please check your .env file and ensure API_USER_ID and GENERATED_API_KEY are correct and different values");
    
    // Provide more specific error message
    if (error.response?.data?.error === 'login_failed') {
      throw new Error("Authentication failed: Invalid API User ID or API Key");
    } else {
      throw new Error(`Token request failed: ${error.message}`);
    }
  }
};

/* Returns a valid access token (cached or new) */
export const getAccessToken = async () => {
  if (isTokenValid()) {
    console.log("🔁 Reusing cached access token.");
    return cachedToken;
  }

  return await fetchNewToken();
};

