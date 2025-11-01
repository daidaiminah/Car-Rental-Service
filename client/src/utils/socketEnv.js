const PROD_API_FALLBACK = 'https://whip-in-time-server.onrender.com/api';
const LOCAL_API_FALLBACK = 'http://localhost:4005/api';

const normalizeBase = (value) => {
  if (!value) return value;
  return value.replace(/\/+$/, '');
};

export const getApiBaseUrl = () => {
  const envBase = normalizeBase(import.meta.env.VITE_API_BASE_URL);
  if (envBase) {
    return envBase;
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return normalizeBase(LOCAL_API_FALLBACK);
    }
  }

  return normalizeBase(PROD_API_FALLBACK);
};

export const getSocketBaseUrl = () => {
  const explicitSocket = normalizeBase(import.meta.env.VITE_SOCKET_URL);
  if (explicitSocket) {
    return explicitSocket;
  }

  const apiBase = getApiBaseUrl();
  if (apiBase) {
    return normalizeBase(apiBase.replace(/\/api$/, ''));
  }

  if (typeof window !== 'undefined' && window.location.origin) {
    return normalizeBase(window.location.origin);
  }

  return normalizeBase(PROD_API_FALLBACK.replace(/\/api$/, ''));
};

export default {
  getApiBaseUrl,
  getSocketBaseUrl,
};
