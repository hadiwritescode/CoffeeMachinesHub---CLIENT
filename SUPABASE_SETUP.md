# Supabase Setup Guide

This guide will walk you through setting up Supabase to replace Firebase for your Coffee Machines Hub. 

## 1. Create a Supabase Project
1. Go to [database.new](https://database.new) and sign in.
2. Create a new organization (if needed) and a new project.
3. Wait for the database provisioning to complete (takes ~2 minutes).

## 2. Obtain Credentials
1. In your new project, navigate to **Project Settings** (gear icon) > **API**.
2. Copy the `Project URL` and paste it into your `.env` file for `VITE_SUPABASE_URL`.
3. Copy the `anon` `public` key and paste it into `.env` for `VITE_SUPABASE_ANON_KEY`.

## 3. Run the SQL Schema
1. Open the Supabase Dashboard, go to the **SQL Editor** on the left menu.
2. Click **New query**.
3. Open `database.sql` from your project folder, copy its ENTIRE contents, and paste it into the query editor.
4. Click **Run** at the bottom right.
   > **Note:** If it runs successfully, you'll see a "Success" message. This creates all tables, policies, and storage buckets.

## 4. Enable Authentication
1. Go to **Authentication** > **Providers** in the dashboard.
2. **Email**: Make sure "Enable Email provider" is checked.
3. Turn **OFF** "Confirm email" if you want users to log in immediately without verifying their email first (useful for development/testing).

## 5. Validate the Client Connection
1. Ensure your local server is running (`npm run dev`).
2. Try creating a new account from your website.
3. Check the Supabase Dashboard > **Authentication** > **Users** to verify the user was created.
4. Check **Table Editor** > `users` to confirm the profile row was automatically populated or created.

---
### Troubleshooting
- **Case Sensitivity Errors:** If you see `column does not exist`, ensure you ran the updated `database.sql` which correctly quotes camelCase column names like `"userId"`.
- **Policy Errors:** If data isn't loading, double-check that **RLS** (Row Level Security) policies were created by the SQL script. 
- **Upload Errors:** Ensure you ran the lines at the bottom of the SQL file that create the `products`, `blogs`, and `testimonials` storage buckets and their policies.
