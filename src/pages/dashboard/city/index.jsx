import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CityListView } from 'src/sections/city/view/city-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `City list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CityListView />
    </>
  );
}
