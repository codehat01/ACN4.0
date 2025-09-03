# Database Setup Instructions

## Step 1: Apply the Migration

You have two options to apply the migration:

### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire content from `supabase/migrations/20250102000000_complete_schema_setup.sql`
5. Paste it into the SQL editor
6. Click **Run** to execute the migration

### Option B: Using Supabase CLI
If you have Supabase CLI installed:
```bash
# Navigate to your project directory
cd d:\ACN4.0\eventspage4.0-main\project

# Apply the migration
supabase db push
```

## Step 2: Verify the Setup

After running the migration, verify that these tables exist in your Supabase database:
- ✅ `profiles`
- ✅ `clubs` 
- ✅ `events`
- ✅ `registrations`
- ✅ `eventsregistrations`
- ✅ `favorites`
- ✅ `payment_proofs`
- ✅ `qr_codes`
- ✅ `tickets`

And these storage buckets:
- ✅ `payment_proofs`
- ✅ `tickets`

## Step 3: Test the Application

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the following features:
   - ✅ User registration/login
   - ✅ Profile page loads without errors
   - ✅ Events display correctly
   - ✅ Toast notifications work when not logged in
   - ✅ Admin dashboard (if you're logged in with an admin email)

## Admin Access

The following emails are configured as admin:
- `admin@acn.com`
- `admin@campus.com`
- `aravindkamal74@gmail.com`
- `superadmin@acn.com`

To access admin features:
1. Sign in with one of the admin emails
2. You'll see an "Admin" button in the navbar
3. Click it to access the admin dashboard

## Troubleshooting

If you still see 406/400 errors:
1. Make sure the migration ran successfully
2. Check that all tables were created in Supabase dashboard
3. Verify RLS policies are enabled
4. Clear browser cache and reload the page

## What This Migration Does

- Creates all required database tables with proper relationships
- Sets up Row Level Security (RLS) policies
- Creates storage buckets for file uploads
- Inserts sample data (clubs and events)
- Configures admin access based on email addresses