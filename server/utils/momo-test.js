import axios from "axios";
import base64 from "base-64";
import * as dotenv from "dotenv";
dotenv.config();

// Load environment variables directly
const apiUserId = process.env.API_USER_ID;
const apiKey = process.env.GENERATED_API_KEY;
const subscriptionKey = process.env.SUBSCRIPTION_KEY;
const tokenURL = "https://sandbox.momodeveloper.mtn.com/collection/token/";

console.log("\n===== MoMo API Test =====");
console.log("Environment check:");
console.log("API_USER_ID:", apiUserId);
console.log("API_KEY:", apiKey ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}` : "Not found");
console.log("SUBSCRIPTION_KEY:", subscriptionKey ? `${subscriptionKey.substring(0, 5)}...${subscriptionKey.substring(subscriptionKey.length - 5)}` : "Not found");

// Test function to get token
const testGetToken = async () => {
  try {
    console.log("\nAttempting to fetch token...");
    console.log("Using API User ID:", apiUserId);
    
    // Create Basic Auth header
    const auth = base64.encode(`${apiUserId}:${apiKey}`);
    console.log("Basic Auth header created (first 10 chars):", auth.substring(0, 10) + "...");
    
    // Make the request with detailed logging
    console.log("Making request to:", tokenURL);
    console.log("Headers:", {
      Authorization: `Basic ${auth.substring(0, 10)}...`,
      "Ocp-Apim-Subscription-Key": subscriptionKey ? `${subscriptionKey.substring(0, 5)}...` : "Not found",
      "Content-Type": "application/json"
    });
    
    const response = await axios.post(
      tokenURL,
      {},  // Empty body
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Ocp-Apim-Subscription-Key": subscriptionKey,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("\n✅ Success! Token received");
    console.log("Status:", response.status);
    console.log("Token (first 10 chars):", response.data.access_token ? response.data.access_token.substring(0, 10) + "..." : "No token in response");
    console.log("Expires in:", response.data.expires_in, "seconds");
    return true;
  } catch (error) {
    console.error("\n❌ Failed to fetch token");
    console.error("Status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    
    // Additional debugging
    console.log("\nPossible issues:");
    console.log("1. API User ID may not be registered correctly in MTN MoMo system");
    console.log("2. API Key may be incorrect or not associated with this API User ID");
    console.log("3. Subscription Key may be invalid or expired");
    console.log("4. MTN MoMo sandbox may be experiencing issues");
    console.log("5. Network connectivity problems");
    
    console.log("\nTroubleshooting steps:");
    console.log("1. Verify API User ID in MTN MoMo developer portal");
    console.log("2. Generate a new API Key for this API User ID");
    console.log("3. Check Subscription Key is valid and has proper permissions");
    console.log("4. Ensure you're using the correct environment (sandbox vs production)");
    
    return false;
  }
};

// Run the test
testGetToken()
  .then(success => {
    if (success) {
      console.log("\n✅ MoMo API integration test passed!");
    } else {
      console.log("\n❌ MoMo API integration test failed. See above for details.");
    }
    console.log("\n===== End of Test =====\n");
  })
  .catch(err => {
    console.error("Test execution error:", err);
  });
