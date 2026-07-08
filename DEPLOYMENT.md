# Railway Deployment Guide

As your instructor, I'm here to guide you through taking our Node.js backend from your local computer and putting it live on the internet using Railway! 🚂

Railway is an excellent platform for beginners because it handles a lot of the complex DevOps work for you.

## Prerequisites

1. You need a GitHub account, and your code must be pushed to a GitHub repository.
2. You need a Railway account (you mentioned you already have one!).
3. Your Supabase PostgreSQL database URL (you also have this!).

## Step 1: Connect GitHub to Railway

1. Log into your Railway Dashboard.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select the repository where you pushed this code.
4. Railway will analyze your code. It will detect `package.json` and know it's a Node.js project.

## Step 2: Configure Environment Variables

Our application crashes on purpose if it doesn't have the required environment variables (remember the `env.ts` file?). We need to provide them to Railway.

1. Click on your newly created service in the Railway dashboard.
2. Go to the **Variables** tab.
3. Add the following variables:
   - `DATABASE_URL`: `postgres://your_user:your_pass@aws-0-eu-central-1.pooler.supabase.com:6543/postgres` (from Supabase, Transaction pooler)
   - `DIRECT_URL`: `postgres://your_user:your_pass@aws-0-eu-central-1.pooler.supabase.com:5432/postgres` (from Supabase, Session pooler)
   - `JWT_SECRET`: Create a strong random string (e.g., `my_super_secret_jwt_key_that_is_long_enough`)
   - `PORT`: `3000` (Railway often provides its own PORT variable automatically, but it's good to set it just in case).

## Step 3: Run Prisma Migrations on Deploy

When we deploy, we need to make sure our database schema is up-to-date. In our `package.json`, we have a script `build: "tsc"`. However, we want to run migrations before we start the app. 

1. Go to the **Settings** tab in your Railway service.
2. Scroll down to **Build Command**. Change it to:
   ```bash
   npx prisma generate && npx prisma migrate deploy && tsc
   ```
   *Explanation: This generates the Prisma client, runs the migration on the database using DIRECT_URL, and then compiles the TypeScript.*
3. Scroll down to **Start Command**. Change it to:
   ```bash
   node dist/server.js
   ```
   *Explanation: This starts the compiled JavaScript version of our app.*

## Step 4: Expose the Application to the Internet

By default, Railway apps are private. Let's get a public URL.

1. Go to the **Settings** tab.
2. Look for the **Domains** section.
3. Click **Generate Domain**. Railway will give you a free `.up.railway.app` URL. 

*You will use this URL in your n8n setup! (e.g., `https://automation-production-cc6c.up.railway.app/api/reports/weekly`)*

## Step 5: Wait for Deploy

1. Go back to the **Deployments** tab.
2. You'll likely see a build in progress. Wait for it to finish.
3. If it fails, check the **View Logs** button. 
   - Did it fail on the environment variables? Double-check them!
   - Did it fail on Prisma? Make sure your `DIRECT_URL` allows port 5432.

Once it says "Active" with a green checkmark, you're live! 🎉 You can test it by going to `https://automation-production-cc6c.up.railway.app/` in your browser. (Since we don't have a route on `/`, it might say "Cannot GET /", but that means Express is running!). Use Postman to hit your `/api/auth/login` endpoint.
