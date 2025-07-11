import { createApiUser, generateApiKey } from './momo.js';
import { v4 as uuid } from 'uuid';

// Generate a new UUID to use as the API User ID
const newApiUserId = uuid();
console.log("\n===== MTN MoMo API Setup =====");
console.log("New API User ID:", newApiUserId);
console.log("\nPlease add this to your .env file as API_USER_ID");
console.log("\n1. Creating API User...");

// Create the API User
createApiUser()
  .then(() => {
    console.log("\n2. Generating API Key...");
    return generateApiKey();
  })
  .then(() => {
    console.log("\n3. Setup Complete!");
    console.log("\nPlease update your .env file with the values above.");
    console.log("Make sure API_USER_ID and GENERATED_API_KEY are different values.");
    console.log("\n===== End of Setup =====\n");
  })
  .catch(error => {
    console.error("Setup failed:", error);
  });
