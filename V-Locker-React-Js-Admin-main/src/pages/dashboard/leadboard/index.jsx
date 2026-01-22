import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { LeadboardListView } from 'src/sections/leadboard/view/leadboard-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Leadboard | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LeadboardListView />
    </>
  );
}
