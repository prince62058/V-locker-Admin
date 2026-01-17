import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { GameResultListView } from 'src/sections/gameResult/view/gameResult-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Game Result list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <GameResultListView />
    </>
  );
}
