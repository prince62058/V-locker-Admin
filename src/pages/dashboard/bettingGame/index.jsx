import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BtGameListView } from 'src/sections/bettingGame/view';

// ----------------------------------------------------------------------

const metadata = { title: `Transaction - ${CONFIG.site.name}` };

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BtGameListView />
    </>
  );
}
