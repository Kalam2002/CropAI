'use client';

import { useContext } from 'react';
import { User } from 'firebase/auth';
import { FirebaseContext, FirebaseContextState } from '@/firebase/provider'; // Adjusted import path

/**
 * Interface for the return value of the useUser hook.
 */
export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * It's a lightweight alternative to useFirebase() when only user state is needed.
 * @returns {UserHookResult} Object with user, isUserLoading, userError.
 */
export const useUser = (): UserHookResult => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a FirebaseProvider.');
  }

  // Directly return the user-related state from the context
  const { user, isUserLoading, userError } = context as FirebaseContextState;
  return { user, isUserLoading, userError };
};
