import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import HowtoplayPage from 'src/sections/howtoplay';

// ----------------------------------------------------------------------

const metadata = { title: `How to play - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <HowtoplayPage />
    </>
  );
}
