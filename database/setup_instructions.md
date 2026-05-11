# Supabase Database Setup Instructions

## Overview
This database schema supports user account management with automatic profile creation, business links, and social media integration.

## Setup Steps

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Run Schema Setup
1. Open Supabase SQL Editor
2. Copy and run the contents of `database/schema.sql`
3. This will create all tables, triggers, and RLS policies

### 3. Create User Account
**Option A: Via Supabase Auth Dashboard**
1. Go to Authentication > Users
2. Click "Add user"
3. Email: `amahchibu@gmail.com`
4. Password: `123456@@`
5. Enable auto-confirm

**Option B: Via SQL**
```sql
-- This creates the user in auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'amahchibu@gmail.com',
  crypt('123456@@', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"first_name": "Amah", "last_name": "Precious"}'::jsonb
);
```

### 4. Seed User Data
1. After creating the auth user, get their UUID:
```sql
SELECT id, email FROM auth.users WHERE email = 'amahchibu@gmail.com';
```

2. Update the `seed_data.sql` file with the actual UUID or run it directly (it will find the user automatically)

3. Run the seed data script in SQL Editor

### 5. Environment Variables
Add these to your `.env` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Schema

### Tables
- **users**: Basic user info (extends auth.users)
- **user_profiles**: Detailed profile information
- **business_links**: Business management links (Meta Business, WhatsApp)
- **social_links**: Social media profile links

### Features
- Automatic user profile creation on signup
- Row Level Security (RLS) for data privacy
- Timestamp tracking (created_at, updated_at)
- UUID-based relationships

## Usage in Application

### Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### Create Supabase Client
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Example Queries
```typescript
// Get user profile
const { data: profile } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', user.id)
  .single()

// Get business links
const { data: businessLinks } = await supabase
  .from('business_links')
  .select('*')
  .eq('user_id', user.id)
  .order('sort_order')

// Update profile
const { data } = await supabase
  .from('user_profiles')
  .update({ first_name: 'New Name' })
  .eq('user_id', user.id)
```

## Security Notes
- RLS policies ensure users can only access their own data
- Auth users are automatically created in the users table
- All tables use UUID references for security
- Service role key should only be used on the server side

## Testing
1. Create a test user account
2. Verify automatic profile creation
3. Test data access and updates
4. Verify RLS policies work correctly
