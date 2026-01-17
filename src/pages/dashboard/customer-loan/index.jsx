import { Helmet } from 'react-helmet-async';

import { CustomerLoanListView } from 'src/sections/customer-loan/view';

// ----------------------------------------------------------------------

export default function CustomerLoanListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Customer Loans</title>
      </Helmet>

      <CustomerLoanListView />
    </>
  );
}
