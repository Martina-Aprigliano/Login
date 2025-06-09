// 1. Supabase Client Initialization
const SUPABASE_URL = 'https://bjsppgxzcmghoyqojsqo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqc3BwZ3h6Y21naG95cW9qc3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0Nzg2NjgsImV4cCI6MjA2NTA1NDY2OH0.pD32cl2juICKrKmpx2GmAh0Fru77yZwcRP5S91nGmSY';

const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. DOM Element References
const loginForm = document.getElementById('login-form');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');

const signupForm = document.getElementById('signup-form');
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');

const logoutButton = document.getElementById('logout-button');
const messageArea = document.getElementById('message-area');
const userSessionDiv = document.getElementById('user-session');
const userEmailDisplay = document.getElementById('user-email-display');
const authContainer = document.getElementById('auth-container'); // Container for login/signup sections

// Helper function to display messages
function displayMessage(message, type = 'info') { // type can be 'success', 'error', or 'info'
  messageArea.textContent = message;
  messageArea.className = 'message-area'; // Reset classes
  if (type === 'success') {
    messageArea.classList.add('success-message');
  } else if (type === 'error') {
    messageArea.classList.add('error-message');
  }
  // Automatically clear message after some time
  setTimeout(() => {
    messageArea.textContent = '';
    messageArea.className = 'message-area';
  }, 5000); // Clear after 5 seconds
}

// Helper function to update UI based on auth state
function updateAuthUI(user) {
  if (user) {
    // User is logged in
    if (authContainer) authContainer.style.display = 'none';
    if (userSessionDiv) userSessionDiv.style.display = 'block';
    if (logoutButton) logoutButton.style.display = 'flex'; // Assuming it's a flex item in the header
    if (userEmailDisplay) userEmailDisplay.textContent = user.email;
  } else {
    // User is logged out
    if (authContainer) authContainer.style.display = 'block';
    if (userSessionDiv) userSessionDiv.style.display = 'none';
    if (logoutButton) logoutButton.style.display = 'none';
    if (userEmailDisplay) userEmailDisplay.textContent = '';
  }
}

// 4. Core Functions
async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    displayMessage(`Sign-up error: ${error.message}`, 'error');
    console.error('Sign-up error:', error);
  } else {
    // data.user will be non-null if sign up is successful and email confirmation is not required.
    // If email confirmation is required, data.user might be null, but data.session might exist.
    // Supabase handles email confirmation flow, typically user needs to click a link.
    let successMsg = "Sign-up successful!";
    if (data.user && data.user.identities && data.user.identities.length === 0) {
        successMsg = "Confirmation email sent. Please check your inbox.";
    } else if (data.session) {
        successMsg = "Sign-up successful! You are now logged in.";
        updateAuthUI(data.user); // Update UI as user is logged in
    } else if (!data.user && !data.session) {
        // This case might indicate email confirmation is pending and auto-login didn't occur.
        successMsg = "Sign-up request processed. Check your email for a verification link if required by the project settings.";
    }
    displayMessage(successMsg, 'success');
    // Clear form fields
    // Avoid clearing for the auto-admin signup if inputs are not found (they wouldn't be filled by user)
    if (signupEmailInput && signupPasswordInput) {
        signupEmailInput.value = '';
        signupPasswordInput.value = '';
    }
  }
}

async function logIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    displayMessage(`Login error: Invalid credentials or ${error.message}`, 'error');
    console.error('Login error:', error);
  } else if (data.user) {
    updateAuthUI(data.user);
    displayMessage('Logged in successfully!', 'success');
    // Clear form fields
    if (loginEmailInput) loginEmailInput.value = '';
    if (loginPasswordInput) loginPasswordInput.value = '';
  } else {
    displayMessage('Login failed. Please try again.', 'error');
  }
}

async function logOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    displayMessage(`Logout error: ${error.message}`, 'error');
    console.error('Logout error:', error);
  } else {
    updateAuthUI(null);
    displayMessage('Logged out successfully!', 'success');
  }
}

// 3. Event Listeners
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value.trim();
    if (email && password) {
      await logIn(email, password);
    } else {
      displayMessage('Please enter both email and password.', 'error');
    }
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = signupEmailInput.value.trim();
    const password = signupPasswordInput.value.trim();
    if (email && password) {
      await signUp(email, password);
    } else {
      displayMessage('Please enter both email and password.', 'error');
    }
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    await logOut();
  });
}

// 5. Initial Auth State Check
// This will run when the script loads and also listen for future changes
supabase.auth.onAuthStateChange((event, session) => {
  const user = session ? session.user : null;
  updateAuthUI(user);

  // Optional: Display a message based on the event
  // if (event === 'SIGNED_IN') {
  //   displayMessage('Welcome back!', 'success');
  // } else if (event === 'SIGNED_OUT') {
  //   // Message displayed by logOut function
  // }
});

// Initial check in case onAuthStateChange doesn't fire immediately with current state
// or if there's a race condition with DOM content loading.
// However, onAuthStateChange is generally reliable for this.
// We can also try to get the current session directly on load.
async function checkInitialSession() {
    const { data: { session } } = await supabase.auth.getSession();
    updateAuthUI(session ? session.user : null);
}

// Call this once the DOM is fully loaded to be safe, though onAuthStateChange should handle it.
document.addEventListener('DOMContentLoaded', () => {
    // The onAuthStateChange listener is already set up and will handle the initial state.
    // If needed, an explicit call to checkInitialSession() could be made here,
    // but it's often redundant with onAuthStateChange.
    // For instance, if there was a need to ensure UI is updated before onAuthStateChange fires:
    // checkInitialSession();
});
