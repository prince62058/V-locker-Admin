import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { KeysListView } from 'src/sections/keys/view';

// ----------------------------------------------------------------------

const metadata = { title: `Keys - ${CONFIG.site.name}` };

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <KeysListView />
    </>
  );
}
