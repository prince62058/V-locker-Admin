import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import { AuthContext } from '../auth-context';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({
    user: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem('jwt_access_token'));
      if (userData?.token) {
        setState({ user: { user: userData }, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // const checkUserSession = useCallback(async () => {
  //   try {
  //     const accessToken = sessionStorage.getItem(STORAGE_KEY);

  //     if (accessToken && isValidToken(accessToken)) {
  //       setSession(accessToken);

  //       const res = await axios.get(endpoints.auth.me);

  //       const { user } = res.data;

  //       setState({ user: { ...user, accessToken }, loading: false });
  //     } else {
  //       setState({ user: null, loading: false });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setState({ user: null, loading: false });
  //   }
  // }, [setState]);

  // useEffect(() => {
  //   checkUserSession();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'admin',
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );
  // ({
  //   role: 'admin',
  //   authenticated: true,
  //   unauthenticated: false,
  // }),
  // ({
  //   role: 'admin',
  //   authenticated: false,
  //   unauthenticated: true,
  // }),

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
