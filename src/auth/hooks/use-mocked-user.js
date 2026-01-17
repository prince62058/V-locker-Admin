import { _mock } from 'src/_mock';

// To get the user from the <AuthContext/>, you can use

// Change:
// import { useMockedUser } from 'src/auth/hooks';
// const { user } = useMockedUser();

// To:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

export function useMockedUser() {
  const userData = JSON.parse(sessionStorage.getItem('jwt_access_token'));
  const user = {
    // id: '8864c717-587d-472a-929a-8e5f298024da-0',
    id: `${userData?.id ?? userData?._id}`,
    displayName: 'V-Locker Admin',
    email: `${userData?.email}`,
    photoURL: `${import.meta.env.VITE_APP_BASE_URL}/${userData?.profileUrl}`,
    phoneNumber: _mock.phoneNumber(1),
    country: _mock.countryNames(1),
    address: 'Peplani, bhopal',
    state: 'M.P.',
    city: 'Bhopal',
    zipCode: '94116',
    about: 'Betting app admin dashboard',
    role: userData?.role,
    permission: userData?.permission || [],
    isPublic: true,
  };

  return { user };
}
