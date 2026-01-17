import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { StateListView } from 'src/sections/state/view/state-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `State list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StateListView />
    </>
  );
}
