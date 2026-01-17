import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import GameRulePage from 'src/sections/gameRule';

// ----------------------------------------------------------------------

const metadata = { title: `Game Rules - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <GameRulePage />
    </>
  );
}
