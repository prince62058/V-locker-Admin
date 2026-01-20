import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));

// --------------------------------------------- Guru Matka code --------------------------------------------------------

const GraphDashboard = lazy(() => import('src/pages/dashboard/dasboard'));
const UsersList = lazy(() => import('src/pages/dashboard/users/index'));
const LoanList = lazy(() => import('src/pages/dashboard/keys/index'));
const CustomerLoanList = lazy(() => import('src/pages/dashboard/customer-loan/index'));
const CustomersList = lazy(() => import('src/pages/dashboard/customers/index'));
const UserDetailPage = lazy(() => import('src/sections/users/view/user-details-view.jsx'));
const CustomerDetailPage = lazy(
  () => import('src/sections/customers/view/customer-details-view.jsx')
);
const MobileAdminList = lazy(() => import('src/pages/dashboard/mobileAdmin/index'));
const FeedbackList = lazy(() => import('src/pages/dashboard/feedback/index'));
const BrandList = lazy(() => import('src/pages/dashboard/brand/index'));
const ModelList = lazy(() => import('src/pages/dashboard/model/index'));
const StateList = lazy(() => import('src/pages/dashboard/state/index'));
const CityList = lazy(() => import('src/pages/dashboard/city/index'));
const GuideVideoList = lazy(() => import('src/pages/dashboard/guide-video/index'));
const AdminList = lazy(() => import('src/pages/dashboard/adminList/index'));
const CompanyViewPage = lazy(() => import('src/pages/dashboard/company'));
const ProfilePage = lazy(() => import('src/pages/dashboard/profile'));
const LeadboardPage = lazy(() => import('src/pages/dashboard/leadboard'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

const userData = JSON.parse(sessionStorage.getItem('jwt_access_token'));

const filter = [];

const routes = [
  {
    path: 'user-management',
    children: [
      { element: <UsersList />, index: true },
      { path: 'user/:id', element: <UserDetailPage /> },
      { path: 'adminList', element: <AdminList /> },
      { path: 'mobileAdmin', element: <MobileAdminList /> },
    ],
    permission: 'USERMANAGER',
  },
  {
    path: 'loan',
    children: [{ element: <LoanList />, index: true }],
    permission: 'LOAN',
  },
    {
    path: 'customer-loan',
    children: [{ element: <CustomerLoanList />, index: true }],
    permission: 'LOAN',
  },
  {
    path: 'brand',
    children: [{ element: <BrandList />, index: true }],
    permission: 'BRAND',
  },
  {
    path: 'model',
    children: [{ element: <ModelList />, index: true }],
    permission: 'MODEL',
  },
  {
    path: 'feedback',
    children: [{ element: <FeedbackList />, index: true }],
    permission: 'FEEDBACK',
  },
  {
    path: 'guide-video',
    children: [{ element: <GuideVideoList />, index: true }],
    permission: 'GUIDEVIDEOS',
  },
  {
    path: 'state',
    children: [
      { element: <StateList />, index: true },
      { path: ':id', element: <CityList /> },
    ],
    permission: 'STATE',
  },
  {
    path: 'company',
    children: [{ element: <CompanyViewPage />, index: true }],
    permission: 'COMPANY',
  },
  {
    path: 'profile',
    children: [{ element: <ProfilePage />, index: true }],
    permission: 'PROFILE',
  },
];

routes.forEach((route) => {
  if (userData?.userType === 'SUBADMIN' && userData?.permission?.includes(route?.permission)) {
    filter.push(route);
  }
});

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },

      // ---------------------------------------------- LeadKard routes --------------------------------------------------
      { path: 'analytics', element: <GraphDashboard /> },

      ...(userData?.userType === 'SUBADMIN' ? filter : routes),
      // -------------------------------------------- Guru matka routes End --------------------------------------------------
    ],
  },
];
