import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { _roles } from 'src/_mock';
import { varAlpha } from 'src/theme/styles';
import { useGetAllLoanQuery } from 'src/redux/rtk/api';
import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { SplashScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { KeysTableRow } from '../keys-table-row';
import { KeysTableToolbar } from '../keys-table-toolbar';
import { KeysQuickEditForm } from '../keys-quick-edit-form';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
];

const TABLE_HEAD = [
  { id: 'sno', label: 'S No.', width: 50 },
  { id: 'user', label: 'User Details', width: 80 },
  { id: 'transaction', label: 'Request Key', width: 80 },
  { id: 'amount', label: 'Reason', width: 350 },
  { id: 'status', label: 'Status', width: 50 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function KeysListView() {
  const table = useTable();

  const router = useRouter();
  const quickEdit = useBoolean();

  const [isUpdate, setIsUpdate] = useState(false);

  const confirm = useBoolean();
  const filters = useSetState({ name: '', role: [], status: '' });

  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePage = useCallback((event, newPage) => {
    setCurrentPage(newPage);
  }, []);

  const { data, isLoading } = useGetAllLoanQuery({
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

  const canReset =
    !!filters.state.name || filters.state.role.length > 0 || filters.state.status !== 'all';

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  return isLoading && !data ? (
    <SplashScreen />
  ) : (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Loan Request List"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Loan Request' }]}
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

          <KeysTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: _roles }}
          />

          <Box sx={{ position: 'relative' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered?.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                />

                <TableBody>
                  {dataFiltered?.map((row, i) => (
                    <KeysTableRow
                      key={row._id}
                      row={row}
                      index={i}
                      currentPage={currentPage}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
      <KeysQuickEditForm update={isUpdate} open={quickEdit.value} onClose={quickEdit.onFalse} />
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;

  if (!inputData) return [];

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.role));
  }

  return inputData;
}
