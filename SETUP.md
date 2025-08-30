# Quick Course - Authentication Setup

This project implements JWT-based authentication with Supabase as the database for a Next.js course platform.

## Features

- JWT-based authentication
- User registration and login
- Supabase database integration
- Redirect to thanks page after successful authentication
- Form validation and error handling

## Setup Instructions

### 1. Install Dependencies

Dependencies are already installed:
- `@supabase/supabase-js` - Supabase client
- `jsonwebtoken` - JWT token handling
- `bcryptjs` - Password hashing

### 2. Configure Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. In your project dashboard, go to **Settings > API**
3. Copy your **Project URL** and **anon/public key**
4. Update the `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 3. Set Up Supabase Database

In your Supabase project, enable authentication:
1. Go to **Authentication > Settings**
2. Enable **Email** provider
3. Configure any additional settings as needed

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## File Structure

```
├── app/
│   ├── api/auth/
│   │   ├── login/route.js     # Login API endpoint
│   │   └── signup/route.js    # Signup API endpoint
│   ├── login/page.jsx         # Login page
│   └── signup/page.jsx        # Signup page
├── lib/
│   ├── supabase.js           # Supabase configuration
│   └── jwt.js                # JWT utilities
├── public/
│   └── (removed thanks.html - now uses role-based redirection)
└── .env.local                # Environment variables
```

## Authentication Flow

1. **Signup**: User fills form → API validates → Creates user in Supabase → Generates JWT → Redirects to role-based dashboard
2. **Login**: User enters credentials → API validates → Generates JWT → Redirects to role-based dashboard

**Role-based Redirection:**
- **Student** → `/student-dashboard`
- **Author** → `/author-dashboard` 
- **Admin** → `/admin-dashboard`
- **Default/Unknown** → `/student-dashboard`
3. **Token Storage**: JWT tokens are stored in localStorage for client-side authentication

## Security Notes

- Passwords are hashed using bcryptjs before storing
- JWT tokens expire after 7 days
- Change the JWT_SECRET in production
- Implement proper CORS policies for production
- Consider implementing refresh tokens for better security

## Next Steps

This is a basic implementation. For production, consider:
- Email verification
- Password reset functionality
- Rate limiting
- Enhanced error handling
- User profile management
- Course integration with Stripe payments