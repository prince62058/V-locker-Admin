import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import BannerPage from 'src/sections/banner';

// ----------------------------------------------------------------------

const metadata = { title: `Home Section - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BannerPage />
    </>
  );
}
