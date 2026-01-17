import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import QrCodePage from 'src/sections/qrCode';

// ----------------------------------------------------------------------

const metadata = { title: `QR Code - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <QrCodePage />
    </>
  );
}
