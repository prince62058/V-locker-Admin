import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import ProfilePage from 'src/sections/profile';

// ----------------------------------------------------------------------

const metadata = { title: `Profile - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProfilePage />
    </>
  );
}
