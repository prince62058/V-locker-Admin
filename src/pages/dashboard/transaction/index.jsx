import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TransactionListView } from 'src/sections/transaction/view';

// ----------------------------------------------------------------------

const metadata = { title: `Transaction - ${CONFIG.site.name}` };

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TransactionListView />
    </>
  );
}
