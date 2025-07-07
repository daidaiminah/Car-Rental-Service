import axios from "axios";
import { v4 as uuid } from "uuid";

// Generate a UUID to use as the X-Reference-Id (User ID)
const referenceId = uuid();

// Define base URL and subscription key
const baseURL = "https://sandbox.momodeveloper.mtn.com/v1_0/apiuser"; // change to sandbox or production as needed
const subscriptionKey = "a74be47095c6431c89167b0e45541e68"; // replace with your real key

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
   const apiUserId = "0dfcf217-9cfc-4f41-ba71-1cf6531b9b49";
    const subscriptionKey = "a74be47095c6431c89167b0e45541e68";

    try {
        const response = await axios.post(
            `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser${apiUserId}/apikey`,
            {},
            {
                headers: {
                    "Ocp-Apim-Subscription-Key": subscriptionKey,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("✅ API key generated successfully with ID:", apiUserId);
        console.log("Status:", response.status);
    } catch (error) {
        console.error("❌ Failed to generate API key:", error.response?.data || error.message);
    }
}



