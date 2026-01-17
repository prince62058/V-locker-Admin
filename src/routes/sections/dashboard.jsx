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
const BrandList = lazy(() => import('src/pages/dashboard/brand/index'));
const ModelList = lazy(() => import('src/pages/dashboard/model/index'));
const StateList = lazy(() => import('src/pages/dashboard/state/index'));
const CityList = lazy(() => import('src/pages/dashboard/city/index'));
const AdminList = lazy(() => import('src/pages/dashboard/adminList/index'));
const MobileAdminList = lazy(() => import('src/pages/dashboard/mobileAdmin/index'));
const QrCodeViewPage = lazy(() => import('src/pages/dashboard/qrCode'));
const AppInfoViewPage = lazy(() => import('src/pages/dashboard/appInfo'));
const GamesViewPage = lazy(() => import('src/pages/dashboard/game'));
const GameResultViewPage = lazy(() => import('src/pages/dashboard/gameResult'));
const GamesDetailPage = lazy(() => import('src/sections/game/view/game-details-view'));
const HowtoplayViewPage = lazy(() => import('src/pages/dashboard/howtoplay'));
const CompanyViewPage = lazy(() => import('src/pages/dashboard/company'));
const TransactionViewPage = lazy(() => import('src/pages/dashboard/transaction'));
const GameRuleViewPage = lazy(() => import('src/pages/dashboard/gameRule'));
const BettingGameViewPage = lazy(() => import('src/pages/dashboard/bettingGame'));
const BtGamesDetailPage = lazy(() => import('src/sections/bettingGame/view/btGame-details-view'));
const WithdrawViewPage = lazy(() => import('src/pages/dashboard/withdraw'));
const BannerPage = lazy(() => import('src/pages/dashboard/banner'));
const ProfilePage = lazy(() => import('src/pages/dashboard/profile'));
const LeadboardPage = lazy(() => import('src/pages/dashboard/leadboard'));
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));

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
  { path: 'banner', element: <BannerPage />, permission: 'BANNER' },
  {
    path: 'user-management',
    children: [
      { element: <UsersList />, index: true },
      { path: 'adminList', element: <AdminList /> },
      { path: 'mobileAdmin', element: <MobileAdminList /> },
    ],
    permission: 'USERMANAGER',
  },
  {
    path: 'qrCode',
    children: [{ element: <QrCodeViewPage />, index: true }],
    permission: 'QR',
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
    path: 'state',
    children: [
      { element: <StateList />, index: true },
      { path: ':id', element: <CityList /> },
    ],
    permission: 'STATE',
  },
  {
    path: 'appInfo',
    children: [{ element: <AppInfoViewPage />, index: true }],
    permission: 'APPINFO',
  },
  {
    path: 'games',
    children: [
      { element: <GamesViewPage />, index: true },
      { path: ':id', element: <GamesDetailPage /> },
    ],
    permission: 'GAME',
  },
  {
    path: 'bettingGame',
    children: [
      { element: <BettingGameViewPage />, index: true },
      { path: ':id', element: <BtGamesDetailPage /> },
    ],
    permission: 'BTGAME',
  },
  {
    path: 'gameRules',
    children: [{ element: <GameRuleViewPage />, index: true }],
    permission: 'GAMERULE',
  },
  {
    path: 'gameResult',
    children: [{ element: <GameResultViewPage />, index: true }],
    permission: 'GAMERESULT',
  },
  {
    path: 'transaction',
    children: [{ element: <TransactionViewPage />, index: true }],
    permission: 'TRANSACTION',
  },
  {
    path: 'withdraw',
    children: [{ element: <WithdrawViewPage />, index: true }],
    permission: 'WITHDRAW',
  },
  {
    path: 'howtoplay',
    children: [{ element: <HowtoplayViewPage />, index: true }],
    permission: 'HOWTOPLAY',
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
  {
    path: 'leadboard',
    children: [{ element: <LeadboardPage />, index: true }],
    permission: 'LEADBOARD',
  },
  {
    path: 'chat',
    children: [{ element: <ChatPage />, index: true }],
    permission: 'CHAT',
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
