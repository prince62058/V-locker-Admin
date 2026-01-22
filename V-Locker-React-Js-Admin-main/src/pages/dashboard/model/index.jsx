import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ModelListView } from 'src/sections/model/view/model-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Model list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ModelListView />
    </>
  );
}
