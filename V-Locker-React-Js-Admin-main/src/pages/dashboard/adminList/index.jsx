import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AdminListView } from 'src/sections/adminList/view';

// ----------------------------------------------------------------------

const metadata = { title: `Admin list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AdminListView />
    </>
  );
}
