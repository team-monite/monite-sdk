import { SignIn } from '@clerk/react-router';

export function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to SDK Playground
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            If you don't have an account, please contact us at{' '}
            <a href="mailto:support@monite.com" className="text-blue-500">
              support@monite.com
            </a>
          </p>
        </div>
        <div className="mt-8 w-full flex items-center justify-center">
          <SignIn routing="virtual" signUpUrl="/sign-up" redirectUrl="/" />
        </div>
      </div>
    </div>
  );
}
