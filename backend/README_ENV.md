# Environment Configuration

## Setup Instructions

### 1. Copy Environment File

Copy `backend/env.txt` to `backend/.env` and replace placeholders:

```bash
cp backend/env.txt backend/.env
```

### 2. Configure Gemini API Key

#### Option 1: API Key (Recommended for Development)

To get a Gemini API key:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key
5. Paste it into `GEMINI_API_KEY` in `backend/.env`
6. Set `GEMINI_PROJECT_ID` to your Google Cloud project ID
7. Set `GEMINI_LOCATION` to your preferred region (e.g., `us-central1`)

#### Option 2: Service Account (Advanced - For Cloud Run/Anthos)

For production deployments on Google Cloud Platform, you can use service account authentication:

1. Create a service account in Google Cloud Console:
   ```bash
   gcloud iam service-accounts create resumegenie-gemini \
     --display-name="ResumeGenie Gemini Service Account"
   ```

2. Grant necessary permissions:
   ```bash
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:resumegenie-gemini@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/aiplatform.user"
   ```

3. Create and download service account key:
   ```bash
   gcloud iam service-accounts keys create ./gemini-service-account.json \
     --iam-account=resumegenie-gemini@YOUR_PROJECT_ID.iam.gserviceaccount.com
   ```

4. Set the environment variable in `backend/.env`:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/gemini-service-account.json
   ```

**Note:** For Cloud Run deployments, use Secret Manager to store the service account JSON securely, then mount it as a file in your container. See `docs/Deployment.md` for details.

**Important:** If `GEMINI_API_KEY` is set, it will be used. Otherwise, the service account credentials will be used automatically.

### 3. Configure MongoDB

You have two options:

**Option A: Local MongoDB (Docker)**
```bash
# From repo root
docker compose up -d
```
This will start MongoDB on `localhost:27017` with the database `resumegenie`.

**Option B: MongoDB Atlas**
1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Paste it into `MONGODB_URI` in `backend/.env`

### 4. Security Note

⚠️ **Never commit `.env` files to git.** The `.env` file is already included in `.gitignore`.

## Environment Variables

- `ENV`: Environment mode (dev, prod, etc.)
- `PORT`: Backend server port (default: 8000)
- `CORS_ORIGINS`: Allowed CORS origins (comma-separated)
- `GEMINI_API_KEY`: Your Google Cloud Gemini API key (recommended)
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to service account JSON file (advanced, alternative to API key)
- `GEMINI_PROJECT_ID`: Your Google Cloud project ID
- `GEMINI_LOCATION`: Google Cloud region for Gemini API
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens (change this in production!)

## Troubleshooting Gemini API Issues

### Check GEMINI_API_KEY Configuration

1. Ensure `GEMINI_API_KEY` exists in `backend/env.txt` or `backend/.env`
2. Verify the key is loaded correctly:
   ```bash
   cd backend
   python -c "from app.config import settings; print('Key loaded:', 'Yes' if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != 'your-gemini-key-here' else 'No')"
   ```

### Enable Logging

The application logs all Gemini API requests and responses (with sensitive data redacted):

- Check logs for request/response details
- Look for authentication method used (API key vs service account)
- Verify HTTP status codes and error messages

### Service Account Setup (Advanced)

If using service account authentication:

1. Install Google Auth libraries:
   ```bash
   pip install google-auth google-auth-oauthlib google-auth-httplib2
   ```

2. Verify credentials path:
   ```bash
   echo $GOOGLE_APPLICATION_CREDENTIALS
   ```

3. Test credentials:
   ```bash
   python -c "from google.auth import default; creds, project = default(); print('Authenticated:', creds.valid)"
   ```

### Common Errors

- **"GEMINI_API_KEY is not configured"**: Set `GEMINI_API_KEY` in `backend/.env`
- **"Service account credentials are not available"**: Install `google-auth` and set `GOOGLE_APPLICATION_CREDENTIALS`
- **HTTP 401/403**: Check API key validity or service account permissions
- **HTTP 429**: Rate limit exceeded - wait and retry
- **Network errors**: Check internet connection and firewall settings

