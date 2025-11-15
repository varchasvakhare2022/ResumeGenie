# MongoDB Atlas Setup Guide

## Quick Setup Steps

### 1. Create Account & Cluster
- Go to https://www.mongodb.com/cloud/atlas/register
- Sign up and verify email
- Create **M0 Free** cluster (select region, click "Create")

### 2. Create Database User
- Go to **Security** → **Database Access**
- Click **"Add New Database User"**
- Username: `resumegenie` (or your choice)
- Password: Generate or create one (**save it!**)
- Privileges: **"Read and write to any database"**
- Click **"Add User"**

### 3. Configure Network Access
- Go to **Security** → **Network Access**
- Click **"Add IP Address"**
- For local development: Click **"Allow Access from Anywhere"** (`0.0.0.0/0`)
- Click **"Confirm"**

⚠️ **For production, restrict to specific IPs only!**

### 4. Get Connection String
- Click **"Connect"** on your cluster
- Choose **"Connect your application"**
- Driver: **Python**, Version: **3.6 or later**
- Copy the connection string

### 5. Update backend/.env

Replace this line in `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/resumegenie
```

With your Atlas connection string (format below).

## Connection String Format

### From Atlas (what you'll copy):
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### What you need in backend/.env:
```
MONGODB_URI=mongodb+srv://resumegenie:your-password@cluster0.xxxxx.mongodb.net/resumegenie?retryWrites=true&w=majority
```

**Important changes:**
1. Replace `<username>` with your database username (e.g., `resumegenie`)
2. Replace `<password>` with your actual password
3. **Add database name** before the `?`: change `...mongodb.net/?retryWrites` to `...mongodb.net/resumegenie?retryWrites`

## Password Special Characters

If your password has special characters, URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`

**Example:** If password is `myp@ss#word`, use `myp%40ss%23word`

## Test Your Connection

After updating `backend/.env`, test the connection:

```bash
cd backend
python test_mongodb_connection.py
```

This will verify:
- ✅ Connection to Atlas works
- ✅ Username/password are correct
- ✅ Network access is configured
- ✅ Database is accessible

## Troubleshooting

### ❌ Connection Timeout
- Check **Network Access** in Atlas (IP whitelist)
- Make sure you allowed `0.0.0.0/0` for development
- Verify cluster is running (green status in Atlas)

### ❌ Authentication Failed
- Double-check username and password
- URL-encode special characters in password
- Verify database user exists in **Database Access**

### ❌ Can't find MONGODB_URI
- Make sure `backend/.env` exists (copy from `backend/env.txt`)
- Check file is in `backend/` directory
- Restart your backend server after updating `.env`

## Example Complete Connection String

```env
MONGODB_URI=mongodb+srv://resumegenie:MyP%40ssw0rd@cluster0.abc123.mongodb.net/resumegenie?retryWrites=true&w=majority
```

Replace:
- `resumegenie` → your username
- `MyP%40ssw0rd` → your password (with special chars encoded)
- `cluster0.abc123` → your cluster address from Atlas

