# Login Application with Supabase

This is a simple web application that demonstrates user login, signup, and logout functionalities using HTML, CSS, JavaScript, and Supabase for backend authentication.

## Features

- User Sign-up
- User Log-in
- User Log-out
- Session management
- Feedback messages for user actions

## Project Structure

- `index.html`: Main HTML file containing the structure for login, signup, and user session views.
- `style.css`: CSS file for styling the application.
- `script.js`: JavaScript file for handling user interactions, authentication logic, and communication with Supabase.

## Setup and Configuration

1.  **Supabase Account:**
    *   Make sure you have a Supabase account and a project created.
    *   You will need your project's URL and Anon Key.

2.  **Update Supabase Credentials:**
    *   Open `script.js`.
    *   Locate the Supabase client initialization section. The credentials are set at the top of the file:
        ```javascript
        // 1. Supabase Client Initialization
        const SUPABASE_URL = 'https://bjsppgxzcmghoyqojsqo.supabase.co';
        const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_AS_DEFINED_IN_SCRIPT_JS';

        const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        ```
    *   If you need to use different credentials, you should replace the values assigned to `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `script.js`.
    *   The values used during development were:
        *   URL: `https://bjsppgxzcmghoyqojsqo.supabase.co`
        *   ANON KEY: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqc3BwZ3h6Y21naG95cW9qc3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0Nzg2NjgsImV4cCI6MjA2NTA1NDY2OH0.pD32cl2juICKrKmpx2GmAh0Fru77yZwcRP5S91nGmSY`
        (Note: This Anon Key is publicly visible in `script.js`. It is designed to be client-safe. Ensure Row Level Security is properly configured in your Supabase dashboard if you have sensitive data.)


3.  **Email Confirmation (Optional):**
    *   By default, Supabase may require users to confirm their email addresses after signing up. You can manage this setting in your Supabase project's authentication settings (typically under Authentication > Providers > Email, then look for "Confirm email"). If email confirmation is enabled, users will need to click a link sent to their email to activate their accounts.

4.  **Admin User:**
    *   An admin user with the email `admin@example.com` (password: `secureAdminPassword123`) was intended to be created during development (this step was done by temporarily modifying `script.js`). You can test with these credentials or create your own users via the signup form.

## How to Run

1.  Ensure `script.js` contains the correct Supabase URL and Anon Key if you are using your own Supabase project.
2.  Open the `index.html` file in a web browser (e.g., by double-clicking it or using a live server extension in your code editor).
3.  You should see the login and signup forms. You can create a new account or log in if you have existing credentials.

## Technologies Used

- HTML
- CSS (Tailwind CSS for initial structure, custom styles in `style.css`)
- JavaScript
- Supabase (for authentication)