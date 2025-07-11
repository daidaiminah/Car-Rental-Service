# MoMo API Setup Instructions

## Issue
The current MoMo API integration is failing with a "login_failed" error because the API_USER_ID and GENERATED_API_KEY in your .env file are identical. These should be different values.

## How to Fix

1. **Generate a new API User ID**:
   - Use the MTN MoMo Developer Portal to create a new API User
   - Or use the UUID generator in your code to create a new unique ID

2. **Generate a new API Key**:
   - After creating the API User, generate a new API Key for that user
   - This will be different from the API User ID

3. **Update your .env file**:
   ```
   API_USER_ID=your-api-user-id-here
   GENERATED_API_KEY=your-generated-api-key-here  # This should be different from API_USER_ID
   SUBSCRIPTION_KEY=your-subscription-key-here
   ```

4. **Test the Integration**:
   - Restart your server after updating the .env file
   - Check the logs for successful authentication

## MTN MoMo API Documentation
For more details, refer to the official MTN MoMo API documentation:
https://momodeveloper.mtn.com/docs

## Using the API User Creation Functions
You can use the functions in momo.js to create a new API User and generate an API Key:

```javascript
// To create a new API User
import { createApiUser } from './utils/momo.js';
await createApiUser();
// This will log the new API User ID to the console

// To generate a new API Key for an existing API User
import { generateApiKey } from './utils/momo.js';
await generateApiKey();
// This will log the new API Key to the console
```

Add these values to your .env file and restart your server.
