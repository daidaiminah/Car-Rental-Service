// // Generate MoMo API User
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
// import dotenv from 'dotenv';
// dotenv.config();

// // This function creates a MoMo API user and returns the userId (referenceId).
// export const createApiUser = async () => {
//   const referenceId = uuidv4();
//   const subscriptionKey = process.env.SUBSCRIPTION_KEY; // Make sure this is defined in your .env

//   if (!subscriptionKey) {
//     console.error('Missing MOMO_SUBSCRIPTION_KEY in .env');
//     return;
//   }
 
//   try {
//     const response = await axios.post(
//       'https://sandbox.momodeveloper.mtn.com/v1_0/apiuser',
//       {
//         providerCallbackHost: 'https://in-time-whip.onrender.com/momo/notify', 
//       },
//       {
//         headers: {
//           'X-Reference-Id': referenceId,
//           'Ocp-Apim-Subscription-Key': subscriptionKey,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     console.log('API User created successfully!');
//     console.log('Reference ID (userId):', referenceId);
//   } catch (error) {
//     console.error('Failed to create API user');
//     if (error.response) {
//       console.error('Status:', error.response.status);
//       console.error('Data:', error.response.data);
//     } else {
//       console.error(error.message);
//     }
//   }
// };

// // Generate MoMo API key
// export const generateApiKey = async () => {
//   const subscriptionKey = process.env.SUBSCRIPTION_KEY; // Make sure this is defined in your .env
//   const apiUserId = process.env.API_USER_ID; // Use a unique userId for the API key generation
//   if (!subscriptionKey) {
//     console.error('Missing MOMO_SUBSCRIPTION_KEY in .env');
//     return;
//   }

//   try {
//     const response = await axios.post(
//       `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/${apiUserId}/apikey`,
//       {},
//       {
//         headers: {
//           'X-Reference-Id': apiUserId,
//           'Ocp-Apim-Subscription-Key': subscriptionKey,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     console.log('API Key generated successfully!');
//     console.log('API Key:', response.data.apiKey);
//   } catch (error) {
//     console.error('Failed to generate API key');
//     if (error.response) {
//       console.error('Status:', error.response.status);
//       console.error('Data:', error.response.data);
//     } else {
//       console.error(error.message);
//     }
//   }
// };

// //Generate MoMo Access Token
// export const getAccessToken = async () => {
//   const subscriptionKey = process.env.SUBSCRIPTION_KEY; // Make sure this is defined in your .env
//   const apiUserId = process.env.API_USER_ID; // Use the same userId used for API key generation
//   const apiKey = process.env.GENERATED_API_KEY; // Use the API key generated for the userId

//   if (!subscriptionKey || !apiUserId || !apiKey) {
//     console.error('Missing MOMO_SUBSCRIPTION_KEY, MOMO_API_USER, or MOMO_API_KEY in .env');
//     return;
//   }

//   try {
//     const response = await axios.post(
//       'https://sandbox.momodeveloper.mtn.com/collection/token/',
//       null,
//       {
//         auth: {
//           username: apiUserId,
//           password: apiKey,
//         },
//         headers: {
//           'Ocp-Apim-Subscription-Key': subscriptionKey,
//           'Content-Type': 'application/json',
//         }
//       }
//     );  

//     console.log('Access Token generated successfully!');
//     console.log('Access Token:', response.data);
//   } catch (error) {
//     console.error('Failed to generate Access Token');
//     if (error.response) {
//       console.error('Status:', error.response.status);
//       console.error('Data:', error.response.data);
//     } else {
//       console.error(error.message);
//   }}
// }

// export const validateAccountHolder = async (msisdn) => {
//   try {
//     const response = await axios.get(
//       `https://sandbox.momodeveloper.mtn.com/collection/v1_0/accountholder/msisdn/${msisdn}/active`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
//           "Ocp-Apim-Subscription-Key": process.env.SUBSCRIPTION_KEY,
//           "X-Target-Environment": "sandbox",
//         },
//       }
//     );

//     console.log("Account holder status:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Failed to validate account holder:", error.response?.data || error.message);
//   }
// };

// await validateAccountHolder("46733123450"); // returns "not found"
// await validateAccountHolder("46733123499"); // returns "active"
