import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

// import { Label } from 'src/components/label';
// import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

const userData = JSON.parse(sessionStorage.getItem('jwt_access_token'));

const filter = [];

const routes = [
  // {
  //   title: 'Banner',
  //   path: paths.dashboard.banner.list,
  //   icon: ICONS.menuItem,
  //   permission: 'BANNER',
  // },
  {
    title: 'User Management',
    path: paths.dashboard.userManagement.root,
    icon: ICONS.user,
    permission: 'USERMANAGER',
    children: [
      { title: 'Users', path: paths.dashboard.userManagement.root },
      { title: 'Shop Employee', path: '/dashboard/user-management/mobileAdmin' },
      // { title: 'SubAdmin', path: paths.dashboard.userManagement.adminList },
    ],
  },
  {
    title: 'Loan Request',
    path: paths.dashboard.loan.list,
    icon: ICONS.blank,
    permission: 'LOAN',
  },
  {
    title: 'Customer Loans',
    path: paths.dashboard.customerLoan.list,
    icon: ICONS.order,
    permission: 'LOAN',
  },
  {
    title: 'Brands',
    path: paths.dashboard.brand.list,
    icon: ICONS.blank,
    permission: 'BRAND',
  },
  {
    title: 'Models',
    path: paths.dashboard.model.list,
    icon: ICONS.blank,
    permission: 'MODEL',
  },
  {
    title: 'States',
    path: paths.dashboard.state.list,
    icon: ICONS.blank,
    permission: 'STATE',
  },
  {
    title: 'Company',
    path: paths.dashboard.company.list,
    icon: ICONS.tour,
    permission: 'COMPANY',
  },
  // {
  //   title: 'Games',
  //   path: paths.dashboard.games.list,
  //   icon: ICONS.blank,
  //   permission: 'GAME',
  // },
  // {
  //   title: 'Betting Games',
  //   path: paths.dashboard.bettingGame.list,
  //   icon: ICONS.calendar,
  //   permission: 'BTGAME',
  // },
  // {
  //   title: 'Leadboard',
  //   path: paths.dashboard.leadboard.list,
  //   icon: ICONS.product,
  //   permission: 'LEADBOARD',
  // },
  // {
  //   title: 'Game Rules',
  //   path: paths.dashboard.gameRules.list,
  //   icon: ICONS.kanban,
  //   permission: 'GAMERULE',
  // },
  // {
  //   title: 'Game Result',
  //   path: paths.dashboard.gameResult.list,
  //   icon: ICONS.dashboard,
  //   permission: 'GAMERESULT',
  // },
  // {
  //   title: 'QR Code',
  //   path: paths.dashboard.qrCode.list,
  //   icon: ICONS.lock,
  //   permission: 'QR',
  // },
  // {
  //   title: 'App Info',
  //   path: paths.dashboard.appInfo.list,
  //   icon: ICONS.blog,
  //   permission: 'APPINFO',
  // },
  // {
  //   title: 'Transaction',
  //   path: paths.dashboard.transaction.list,
  //   icon: ICONS.banking,
  //   permission: 'TRANSACTION',
  // },
  // {
  //   title: 'Withdraw',
  //   path: paths.dashboard.withdraw.list,
  //   icon: ICONS.invoice,
  //   permission: 'WITHDRAW',
  // },
  // {
  //   title: 'How To Play',
  //   path: paths.dashboard.howtoplay.list,
  //   icon: ICONS.external,
  //   permission: 'HOWTOPLAY',
  // },
  // {
  //   title: 'Chat',
  //   path: paths.dashboard.chat.list,
  //   icon: ICONS.chat,
  //   permission: 'CHAT',
  // },
];

routes.forEach((route) => {
  if (userData?.userType === 'SUBADMIN' && userData?.permission?.includes(route?.permission)) {
    filter.push(route);
  }
});

// ----------------------------------------------------------------------

export const navData = [
  // V-Locker overview
  {
    subheader: 'V-Locker Overview',
    items: [
      { title: 'Analytics', path: paths.dashboard.overviewDashboard.graphs, icon: ICONS.analytics },
    ],
  },

  // V-Locker
  {
    subheader: 'V-Locker Management',
    items: userData?.userType === 'SUBADMIN' ? [...filter] : [...routes],
  },
];
