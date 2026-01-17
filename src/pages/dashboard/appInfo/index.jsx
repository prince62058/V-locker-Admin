import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import AppInfoPage from 'src/sections/appInfo';

// ----------------------------------------------------------------------

const metadata = { title: `AppInfo - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AppInfoPage />
    </>
  );
}
