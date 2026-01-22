import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import CompanyPage from 'src/sections/company';

// ----------------------------------------------------------------------

const metadata = { title: `Company - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CompanyPage />
    </>
  );
}
