'use client';

import React from 'react';
import { useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: formData.email,
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          createdAt: new Date(),
        },
        is_admin: false,
        is_contributor: false,
        is_subscriber: false,
        provider: 'email',
      });

      router.push('/welcome');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userDoc = await doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        // User already exists, show error and redirect to login
        setError('An account with this email already exists. Please sign in instead.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        return;
      }

      // If user doesn't exist, create new profile
      await setDoc(userDoc, {
        email: user.email,
        profile: {
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          createdAt: new Date(),
        },
        is_admin: false,
        is_contributor: false,
        is_subscriber: false,
        provider: 'google',
      });

      router.push('/welcome');
    } catch (err: any) {
      console.error('Google signup error:', err);
      
      // Handle specific error for existing accounts
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email. Please sign in with the correct provider.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        return;
      }

      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please sign in instead.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email. Please sign in with the correct provider.';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/popup-closed-by-user':
        return 'Sign up was cancelled';
      default:
        return 'Failed to create account. Please try again.';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-[calc(100vh-136px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-red-600 hover:text-red-500">
              Sign in
            </Link>
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignup}
          disabled={loading}
        >
          <Image
            src="/google.svg"
            alt="Google"
            width={20}
            height={20}
            className="mr-2"
          />
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">Or sign up with email</span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleEmailSignup}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="sr-only">
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4"
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                'Create Account'
              )}
            </Button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="font-medium text-red-600 hover:text-red-500">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="font-medium text-red-600 hover:text-red-500">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 