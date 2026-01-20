import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { FeedbackListView } from 'src/sections/feedback/view';

// ----------------------------------------------------------------------

const metadata = { title: `Feedback list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FeedbackListView />
    </>
  );
}
