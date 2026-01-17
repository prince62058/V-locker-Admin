import { Helmet } from 'react-helmet-async';

import { MobileAdminListView } from 'src/sections/mobileAdmin/view';

// ----------------------------------------------------------------------

export default function MobileAdminListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Shop Employee List</title>
      </Helmet>

      <MobileAdminListView />
    </>
  );
}
