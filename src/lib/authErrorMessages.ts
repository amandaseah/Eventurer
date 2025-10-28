export function friendlyAuthError(err: any, fallback = 'An unexpected error occurred') {
  if (!err) return fallback;
  const code: string | undefined = err.code || undefined;
  const message: string | undefined = err.message || undefined;

  // Map well-known Firebase auth error codes to friendly messages
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/invalid-credentials':
      return 'Invalid credentials. Please check your email and password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try logging in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Choose a stronger password (at least 6 characters).';
    case 'auth/user-not-found':
      return 'No account found for that email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support if you think this is a mistake.';
    default:
      // If no code, try to extract a readable message from the message string
      if (message) {
        // Strip repetitive firebase prefixes like "Firebase: " and codes in parentheses
        let cleaned = message.replace(/^Firebase:\s*/i, '').replace(/\s*\(auth\/[^)]+\)\s*$/i, '').trim();
        // Remove leading generic 'Error' tokens and trailing punctuation left behind
        cleaned = cleaned.replace(/^Error[:\s]*/i, '').replace(/[.\s]*$/i, '').trim();
        if (!cleaned) return fallback;
        return cleaned;
      }
      return fallback;
  }
}
