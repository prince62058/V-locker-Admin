import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BrandListView } from 'src/sections/brand/view/brand-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Brand list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BrandListView />
    </>
  );
}
