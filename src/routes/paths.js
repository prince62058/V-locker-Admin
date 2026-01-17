import { paramCase } from 'src/utils/change-case';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma: 'https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id) => `/product/${id}`,
    demo: { details: `/product/${MOCK_ID}` },
  },
  post: {
    root: `/post`,
    details: (title) => `/post/${paramCase(title)}`,
    demo: { details: `/post/${paramCase(MOCK_TITLE)}` },
  },
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  authDemo: {
    split: {
      signIn: `${ROOTS.AUTH_DEMO}/split/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/split/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/split/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/split/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/split/verify`,
    },
    centered: {
      signIn: `${ROOTS.AUTH_DEMO}/centered/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/centered/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/centered/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/centered/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/centered/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: `${ROOTS.DASHBOARD}/analytics`,

    // -------------------------------------------------------- LeadKart Path -----------------------------------------------------
    overviewDashboard: {
      graphs: `${ROOTS.DASHBOARD}/analytics`,
    },
    banner: {
      list: `${ROOTS.DASHBOARD}/banner`,
    },
    userManagement: {
      root: `${ROOTS.DASHBOARD}/user-management`,
      adminList: `${ROOTS.DASHBOARD}/user-management/adminList`,
    },
    qrCode: {
      list: `${ROOTS.DASHBOARD}/qrCode`,
    },
    appInfo: {
      list: `${ROOTS.DASHBOARD}/appInfo`,
    },
    games: {
      list: `${ROOTS.DASHBOARD}/games`,
      details: (id) => `${ROOTS.DASHBOARD}/game-details/${id}`,
    },
    bettingGame: {
      list: `${ROOTS.DASHBOARD}/bettingGame`,
    },
    gameRules: {
      list: `${ROOTS.DASHBOARD}/gameRules`,
    },
    gameResult: {
      list: `${ROOTS.DASHBOARD}/gameResult`,
    },
    transaction: {
      list: `${ROOTS.DASHBOARD}/transaction`,
    },
    withdraw: {
      list: `${ROOTS.DASHBOARD}/withdraw`,
    },
    howtoplay: {
      list: `${ROOTS.DASHBOARD}/howtoplay`,
    },
    company: {
      list: `${ROOTS.DASHBOARD}/company`,
    },
    profile: {
      list: `${ROOTS.DASHBOARD}/profile`,
    },
    leadboard: {
      list: `${ROOTS.DASHBOARD}/leadboard`,
    },
    loan: {
      list: `${ROOTS.DASHBOARD}/loan`,
    },
    customerLoan: {
      list: `${ROOTS.DASHBOARD}/customer-loan`,
    },
    brand: {
      list: `${ROOTS.DASHBOARD}/brand`,
    },
    model: {
      list: `${ROOTS.DASHBOARD}/model`,
    },
    state: {
      list: `${ROOTS.DASHBOARD}/state`,
      details: (id) => `${ROOTS.DASHBOARD}/state/${id}`,
    },
    chat: {
      list: `${ROOTS.DASHBOARD}/chat`,
    },

    // -------------------------------------------------------- LeadKart Path End -----------------------------------------------------
  },
};
