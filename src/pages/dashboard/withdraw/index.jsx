import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { WithdrawListView } from 'src/sections/withdraw/view';

// ----------------------------------------------------------------------

const metadata = { title: `Withdraw - ${CONFIG.site.name}` };

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <WithdrawListView />
    </>
  );
}
