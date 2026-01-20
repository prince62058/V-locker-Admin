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
    icon: ICONS.job,
    permission: 'BRAND',
  },
  {
    title: 'Models',
    path: paths.dashboard.model.list,
    icon: ICONS.external,
    permission: 'MODEL',
  },
  {
    title: 'States',
    path: paths.dashboard.state.list,
    icon: ICONS.booking,
    permission: 'STATE',
  },
  {
    title: 'Feedback',
    path: paths.dashboard.feedback.list,
    icon: ICONS.parameter,
    permission: 'FEEDBACK',
  },
  {
    title: 'Guide Videos',
    path: paths.dashboard.guideVideo.list,
    icon: ICONS.file,
    permission: 'GUIDEVIDEOS',
  },
  {
    title: 'Company',
    path: paths.dashboard.company.list,
    icon: ICONS.tour,
    permission: 'COMPANY',
  },
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
