# Deploying CodonSense on Render

This repository is fully configured for seamless, production-ready deployment on **[Render](https://render.com/)**.

---

## Option 1: Automatic Blueprint Deployment (Recommended)

1. **Push Code to GitHub / GitLab**
   Ensure all your latest changes are pushed to your remote repository.

2. **Log in to Render**
   Go to [dashboard.render.com](https://dashboard.render.com/) and log in.

3. **Deploy with Blueprint**
   - Click **New +** at the top right and select **Blueprint**.
   - Connect your GitHub/GitLab repository (`CodonBwt_FinalYr_Project`).
   - Render will automatically detect `render.yaml` and configure:
     - **Service Name**: `codon-sense`
     - **Runtime**: `Python`
     - **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
     - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --threads 4 --timeout 120`
     - **Health Check Path**: `/health`
   - Click **Apply**.

---

## Option 2: Manual Web Service Deployment

If you prefer to configure the Web Service manually on Render:

1. Click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Fill in the deployment details:
   - **Name**: `codon-sense`
   - **Environment**: `Python`
   - **Region**: Select closest to your users (e.g., Oregon, Frankfurt, Singapore)
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --threads 4 --timeout 120`
4. Expand **Advanced Settings**:
   - **Health Check Path**: `/health`
   - **Environment Variables**:
     - `PYTHON_VERSION`: `3.12.4`
5. Click **Create Web Service**.

---

## Verification & Monitoring

Once deployment completes:
- Access your live app at your Render URL (e.g., `https://codon-sense.onrender.com`).
- Verify system status anytime via the health check endpoint: `https://codon-sense.onrender.com/health`.
