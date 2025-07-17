'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      case 'OAuthCallback':
        return 'There was an error with the OAuth provider callback.';
      case 'OAuthCreateAccount':
        return 'Could not create OAuth account.';
      case 'EmailCreateAccount':
        return 'Could not create email account.';
      case 'Callback':
        return 'There was an error in the OAuth callback handler.';
      case 'OAuthAccountNotLinked':
        return 'The OAuth account is not linked to any existing account.';
      case 'EmailSignin':
        return 'Check your email for the sign in link.';
      case 'CredentialsSignin':
        return 'Sign in failed. Check the details you provided are correct.';
      case 'SessionRequired':
        return 'Please sign in to access this page.';
      default:
        return 'An unknown error occurred during authentication.';
    }
  };

  return (
    <div className="min-h-screen bg-body-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-darkmode rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Authentication Error</h1>
          <p className="text-lightblue">
            {getErrorMessage(error)}
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition-colors"
          >
            Go to Home
          </Link>
          <Link
            href="/auth/signin"
            className="block w-full border border-primary text-primary py-2 px-4 rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Try Again
          </Link>
        </div>

        {error && (
          <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            <strong>Error Code:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
}