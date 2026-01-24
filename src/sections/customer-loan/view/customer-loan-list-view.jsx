import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import Tooltip from '@mui/material/Tooltip';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';

import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetAllCustomerLoanQuery,
  useLockDeviceBulkMutation,
  useUnlockDeviceBulkMutation,
} from 'src/redux/rtk/api';

import { Scrollbar } from 'src/components/scrollbar';
import { SplashScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { CustomerLoanTableRow } from '../customer-loan-table-row';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'CLOSED', label: 'Closed' },
];

const TABLE_HEAD = [
  { id: 'sno', label: 'S No.', width: 50 },
  { id: 'customer', label: 'Customer', width: 180 },
  { id: 'loanAmount', label: 'Loan Amount', width: 120 },
  { id: 'emi', label: 'EMI / Tenure', width: 150 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'deviceStatus', label: 'Device', width: 100 },
  { id: 'date', label: 'Date', width: 120 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function CustomerLoanListView() {
  const table = useTable();

  const router = useRouter();
  const [lockDeviceBulk] = useLockDeviceBulkMutation();
  const [unlockDeviceBulk] = useUnlockDeviceBulkMutation();

  const filters = useSetState({ name: '', status: '' });

  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePage = useCallback((event, newPage) => {
    setCurrentPage(newPage);
  }, []);

  const { data, isLoading } = useGetAllCustomerLoanQuery({
    status: filters.state.status,
    page: currentPage,
    search: filters.state.name,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.state.name, filters.state.status]);

  const dataFiltered = applyFilter({
    inputData: data?.data,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const notFound = (!dataFiltered?.length && filters.state.name) || !dataFiltered?.length;

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const handleBulkLock = async () => {
    try {
      const res = await lockDeviceBulk(table.selected);
      if (res?.data?.success) {
        table.onSelectAllRows(false, []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBulkUnlock = async () => {
    try {
      const res = await unlockDeviceBulk(table.selected);
      if (res?.data?.success) {
        table.onSelectAllRows(false, []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return isLoading && !data ? (
    <SplashScreen />
  ) : (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Customer Loan List"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Customer Loans' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Tabs
          value={filters.state.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab key={tab.value} iconPosition="end" value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        <Box sx={{ position: 'relative' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered?.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row._id)
                  )
                }
              />

              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={dataFiltered?.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row._id)
                  )
                }
                action={
                  <Stack direction="row">
                    <Tooltip title="Lock">
                      <IconButton color="error" onClick={handleBulkLock}>
                        <Iconify icon="eva:lock-fill" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Unlock">
                      <IconButton color="success" onClick={handleBulkUnlock}>
                        <Iconify icon="eva:unlock-fill" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                }
              />

              <TableBody>
                {dataFiltered?.map((row, i) => (
                  <CustomerLoanTableRow
                    key={row._id}
                    row={row}
                    index={i}
                    currentPage={currentPage}
                    selected={table.selected.includes(row._id)}
                    onSelectRow={() => table.onSelectRow(row._id)}
                  />
                ))}

                <TableEmptyRows
                  height={table.dense ? 56 : 56 + 20}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered?.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          page={currentPage}
          dense={table.dense}
          count={data?.pagination?.totalPages || 1}
          onChange={handleChangePage}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </DashboardContent>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  if (!inputData) return [];
  return inputData;
}
