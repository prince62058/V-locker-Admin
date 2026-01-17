import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthSplitLayout } from 'src/layouts/auth-split';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

/** **************************************
 * Jwt
 *************************************** */
const Jwt = {
  SignInPage: lazy(() => import('src/pages/auth/jwt/sign-in')),
};

const authJwt = {
  path: 'jwt',
  children: [
    {
      path: 'sign-in',
      element: (
        <GuestGuard>
          <AuthSplitLayout section={{ title: 'Hi, Welcome back' }}>
            <Jwt.SignInPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
  ],
};

/** **************************************
 * Amplify
 *************************************** */
const Amplify = {
  SignInPage: lazy(() => import('src/pages/auth/amplify/sign-in')),
};

const authAmplify = {
  path: 'amplify',
  children: [
    {
      path: 'sign-in',
      element: (
        <GuestGuard>
          <AuthSplitLayout section={{ title: 'Hi, Welcome back' }}>
            <Amplify.SignInPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
  ],
};

/** **************************************
 * Firebase
 *************************************** */
const Firebase = {
  SignInPage: lazy(() => import('src/pages/auth/firebase/sign-in')),
};

const authFirebase = {
  path: 'firebase',
  children: [
    {
      path: 'sign-in',
      element: (
        <GuestGuard>
          <AuthSplitLayout section={{ title: 'Hi, Welcome back' }}>
            <Firebase.SignInPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
  ],
};

/** **************************************
 * Auth0
 *************************************** */
const Auth0 = {
  SignInPage: lazy(() => import('src/pages/auth/auth0/sign-in')),
  CallbackPage: lazy(() => import('src/pages/auth/auth0/callback')),
};

const authAuth0 = {
  path: 'auth0',
  children: [
    {
      path: 'sign-in',
      element: (
        <GuestGuard>
          <AuthSplitLayout section={{ title: 'Hi, Welcome back' }}>
            <Auth0.SignInPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'callback',
      element: (
        <GuestGuard>
          <Auth0.CallbackPage />
        </GuestGuard>
      ),
    },
  ],
};

/** **************************************
 * Supabase
 *************************************** */
const Supabase = {
  SignInPage: lazy(() => import('src/pages/auth/supabase/sign-in')),
};

const authSupabase = {
  path: 'supabase',
  children: [
    {
      path: 'sign-in',
      element: (
        <GuestGuard>
          <AuthSplitLayout section={{ title: 'Hi, Welcome back' }}>
            <Supabase.SignInPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
  ],
};

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [authJwt, authAmplify, authFirebase, authAuth0, authSupabase],
  },
];
