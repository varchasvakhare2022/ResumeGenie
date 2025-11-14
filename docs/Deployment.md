# Deployment Guide

This guide covers deploying ResumeGenie to production environments.

## Table of Contents

1. [Backend Deployment (Google Cloud Run)](#backend-deployment)
2. [MongoDB Setup (Atlas)](#mongodb-setup)
3. [Frontend Deployment (Vercel/Netlify)](#frontend-deployment)
4. [Security Considerations](#security-considerations)
5. [Environment Variables](#environment-variables)

---

## Backend Deployment

### Prerequisites

- Google Cloud Platform (GCP) account
- Google Cloud SDK (`gcloud`) installed and configured
- Docker installed (for building container images)

### Option 1: Google Cloud Run (Recommended for Gemini)

Cloud Run is a fully managed serverless platform that works well with Gemini API integration.

#### Step 1: Create a Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ ./app/

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Expose port (Cloud Run uses PORT env var)
EXPOSE 8080

# Run the application
CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080} --workers 1
```

#### Step 2: Build and Deploy

```bash
cd backend

# Authenticate with GCP
gcloud auth login

# Set your GCP project ID
export PROJECT_ID=your-project-id
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build the container image
gcloud builds submit --tag gcr.io/$PROJECT_ID/resumegenie-backend

# Deploy to Cloud Run
gcloud run deploy resumegenie-backend \
  --image gcr.io/$PROJECT_ID/resumegenie-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --timeout 300 \
  --max-instances 10 \
  --set-env-vars ENV=prod \
  --set-env-vars PORT=8080 \
  --set-secrets GEMINI_API_KEY=gemini-api-key:latest \
  --set-secrets GEMINI_PROJECT_ID=gemini-project-id:latest \
  --set-secrets GEMINI_LOCATION=gemini-location:latest \
  --set-secrets MONGODB_URI=mongodb-uri:latest \
  --set-secrets JWT_SECRET=jwt-secret:latest \
  --set-env-vars CORS_ORIGINS=https://your-frontend-domain.com
```

**Note:** For secure environment variable management, use [Google Secret Manager](https://cloud.google.com/secret-manager):

```bash
# Create secrets in Secret Manager
echo -n "your-gemini-api-key" | gcloud secrets create gemini-api-key --data-file=-
echo -n "your-project-id" | gcloud secrets create gemini-project-id --data-file=-
echo -n "us-central1" | gcloud secrets create gemini-location --data-file=-
echo -n "mongodb+srv://user:pass@cluster.mongodb.net/resumegenie" | gcloud secrets create mongodb-uri --data-file=-
echo -n "your-random-jwt-secret" | gcloud secrets create jwt-secret --data-file=-

# Grant Cloud Run access to secrets
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member=serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor
```

#### Step 3: Get the Backend URL

After deployment, Cloud Run will provide a URL:

```
https://resumegenie-backend-xxxxx-uc.a.run.app
```

Save this URL for frontend configuration.

### Option 2: Cloud Run for Anthos

For Anthos (Kubernetes-based) deployments:

```bash
# Build image (same as above)
gcloud builds submit --tag gcr.io/$PROJECT_ID/resumegenie-backend

# Deploy to Anthos GKE cluster
gcloud run deploy resumegenie-backend \
  --image gcr.io/$PROJECT_ID/resumegenie-backend \
  --platform gke \
  --cluster your-cluster-name \
  --namespace default \
  --region us-central1
```

---

## MongoDB Setup

### Using MongoDB Atlas (Recommended)

#### Step 1: Create Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new cluster (Free tier available for development)
4. Choose a cloud provider and region (preferably same as your backend)

#### Step 2: Configure Database Access

1. Go to **Database Access**
2. Create a database user:
   - Username: `resumegenie-user` (or your choice)
   - Password: Generate a secure password
   - Database User Privileges: `Read and write to any database`

#### Step 3: Configure Network Access

1. Go to **Network Access**
2. Add IP Address:
   - For Cloud Run: Add `0.0.0.0/0` (allow all IPs) OR add Cloud Run's IP ranges
   - For production: Restrict to specific IP ranges

#### Step 4: Get Connection String

1. Go to **Database** → **Connect**
2. Choose **Connect your application**
3. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
4. Replace `<username>`, `<password>`, and `<dbname>` (use `resumegenie`)

#### Step 5: Store in Secret Manager (GCP)

```bash
echo -n "mongodb+srv://resumegenie-user:password@cluster0.xxxxx.mongodb.net/resumegenie?retryWrites=true&w=majority" | \
  gcloud secrets create mongodb-uri --data-file=-
```

### Alternative: Self-Hosted MongoDB

For self-hosted MongoDB (e.g., on GCE):

```bash
# Update MONGODB_URI in your deployment
MONGODB_URI=mongodb://mongo-host:27017/resumegenie
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Configure Project

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Create `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

#### Step 3: Set Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project
3. Go to **Settings** → **Environment Variables**
4. Add:
   ```
   VITE_API_BASE_URL=https://resumegenie-backend-xxxxx-uc.a.run.app
   ```

#### Step 4: Deploy

```bash
vercel --prod
```

Or connect your Git repository for automatic deployments.

### Option 2: Netlify

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Configure Project

Create `frontend/netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Step 3: Set Environment Variables

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Create a new site
3. Go to **Site settings** → **Environment variables**
4. Add:
   ```
   VITE_API_BASE_URL=https://resumegenie-backend-xxxxx-uc.a.run.app
   ```

#### Step 4: Deploy

```bash
netlify deploy --prod
```

Or connect your Git repository for automatic deployments.

### Option 3: Other Platforms

For other platforms (e.g., AWS Amplify, Firebase Hosting), ensure:

1. Build command: `npm run build` or `pnpm build`
2. Output directory: `dist`
3. Environment variable: `VITE_API_BASE_URL` set to your backend URL
4. SPA routing: Configure redirects for client-side routing

---

## Security Considerations

### ⚠️ Critical Security Rules

1. **Never expose `GEMINI_API_KEY` to the client**
   - ✅ Always call Gemini API from the backend server
   - ❌ Never include API keys in frontend code
   - ❌ Never pass API keys through frontend environment variables
   - ✅ Use Google Secret Manager or similar for API keys

2. **Environment Variable Security**
   - Use Secret Manager for sensitive values (API keys, database URIs, JWT secrets)
   - Never commit `.env` files to version control
   - Use different secrets for development, staging, and production

3. **CORS Configuration**
   - Set `CORS_ORIGINS` to your frontend domain only
   - Example: `CORS_ORIGINS=https://your-app.vercel.app,https://your-app.netlify.app`

4. **Database Security**
   - Use connection string authentication
   - Restrict network access to known IPs when possible
   - Use strong passwords for database users
   - Enable TLS/SSL for MongoDB connections (Atlas does this by default)

5. **Rate Limiting**
   - Backend already implements rate limiting for AI endpoints
   - Monitor usage and adjust limits as needed

---

## Environment Variables

### Backend Environment Variables

| Variable | Description | Example | Required | Secret |
|----------|-------------|---------|----------|--------|
| `ENV` | Environment name | `prod` | Yes | No |
| `PORT` | Server port | `8080` | Yes | No |
| `CORS_ORIGINS` | Allowed origins (comma-separated) | `https://app.vercel.app` | Yes | No |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` | Yes | **Yes** |
| `GEMINI_PROJECT_ID` | GCP Project ID | `my-project` | Yes | **Yes** |
| `GEMINI_LOCATION` | Gemini region | `us-central1` | Yes | **Yes** |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` | Yes | **Yes** |
| `JWT_SECRET` | JWT signing secret | `random-string` | Yes | **Yes** |

### Frontend Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API URL | `https://backend.uc.a.run.app` | Yes |

**Note:** Only `VITE_*` prefixed variables are exposed to the frontend bundle. Never use `VITE_*` prefix for sensitive values.

---

## Deployment Checklist

### Backend

- [ ] Dockerfile created
- [ ] Container image built and tested locally
- [ ] GCP project configured
- [ ] Cloud Run API enabled
- [ ] Secret Manager secrets created for:
  - [ ] `GEMINI_API_KEY`
  - [ ] `GEMINI_PROJECT_ID`
  - [ ] `GEMINI_LOCATION`
  - [ ] `MONGODB_URI`
  - [ ] `JWT_SECRET`
- [ ] Cloud Run service deployed
- [ ] Backend URL obtained
- [ ] Health check endpoint tested: `/api/health`

### MongoDB

- [ ] Atlas cluster created (or self-hosted setup)
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string tested
- [ ] Connection string stored in Secret Manager

### Frontend

- [ ] Build command tested locally (`npm run build`)
- [ ] Environment variable `VITE_API_BASE_URL` set to backend URL
- [ ] Deployed to Vercel/Netlify
- [ ] Frontend URL accessible
- [ ] API calls from frontend working
- [ ] SPA routing configured

### Security

- [ ] No API keys in frontend code
- [ ] CORS configured correctly
- [ ] Secrets stored in Secret Manager (not plain env vars)
- [ ] Database access restricted
- [ ] HTTPS enabled (automatic on Vercel/Netlify/Cloud Run)

---

## Troubleshooting

### Backend Issues

**Issue:** Container fails to start
- Check Cloud Run logs: `gcloud run services logs read resumegenie-backend`
- Verify PORT environment variable matches Dockerfile
- Check Secret Manager permissions

**Issue:** Gemini API errors
- Verify `GEMINI_API_KEY` is set correctly in Secret Manager
- Check API key has proper permissions
- Verify project ID and location match your GCP setup

**Issue:** MongoDB connection fails
- Verify connection string format
- Check network access rules in Atlas
- Verify username/password are correct
- Test connection from Cloud Run service account IP

### Frontend Issues

**Issue:** API calls fail with CORS errors
- Verify `CORS_ORIGINS` includes your frontend domain
- Check frontend URL matches exactly (including https)
- Verify backend allows credentials if using cookies

**Issue:** Environment variables not working
- Ensure variables start with `VITE_` prefix
- Rebuild after changing environment variables
- Check build logs for variable substitution

### Common Errors

**Error:** `GEMINI_API_KEY is not configured`
- Solution: Add secret to Secret Manager and reference in Cloud Run deployment

**Error:** `Database is not configured`
- Solution: Add `MONGODB_URI` to Secret Manager and reference in deployment

**Error:** `CORS policy blocked`
- Solution: Update `CORS_ORIGINS` to include your frontend domain

---

## Monitoring and Maintenance

### Health Checks

- Monitor `/api/health` endpoint
- Set up alerts for service downtime
- Track API response times

### Logs

**Cloud Run Logs:**
```bash
gcloud run services logs read resumegenie-backend --limit 50
```

**Vercel Logs:**
- Available in Vercel Dashboard → Deployments → Logs

**Netlify Logs:**
- Available in Netlify Dashboard → Deploys → Logs

### Updates

1. **Backend Updates:**
   ```bash
   gcloud builds submit --tag gcr.io/$PROJECT_ID/resumegenie-backend
   gcloud run deploy resumegenie-backend --image gcr.io/$PROJECT_ID/resumegenie-backend
   ```

2. **Frontend Updates:**
   - Push to connected Git repository (automatic deployment)
   - Or manually: `vercel --prod` or `netlify deploy --prod`

---

## Cost Optimization

### Backend (Cloud Run)

- Use minimum instances: 0 (scale to zero when not in use)
- Set appropriate memory limits (512Mi is usually sufficient)
- Use request timeout to prevent long-running requests
- Monitor usage in GCP Console

### MongoDB Atlas

- Start with Free tier (M0) for development
- Upgrade based on usage and performance needs
- Monitor data storage and transfer

### Frontend (Vercel/Netlify)

- Both offer generous free tiers
- Monitor bandwidth usage
- Enable caching for static assets

---

## Additional Resources

- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Google Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)

