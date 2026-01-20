import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { GuideVideoListView } from 'src/sections/guide-video/view';

// ----------------------------------------------------------------------

const metadata = { title: `Guide Video list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <GuideVideoListView />
    </>
  );
}
