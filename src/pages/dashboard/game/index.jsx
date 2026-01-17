import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { GameListView } from 'src/sections/game/view/game-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Game list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <GameListView />
    </>
  );
}
