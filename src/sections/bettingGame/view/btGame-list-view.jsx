import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
// import { Label } from 'src/components/label';

// import NotificationAddIcon from '@mui/icons-material/NotificationAdd';

import dayjs from 'dayjs';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { _roles } from 'src/_mock';
import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetAllBettingGamesQuery } from 'src/redux/rtk/api';

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

import { BtGameTableRow } from '../btGame-table-row';
import { BtGameTableToolbar } from '../btGame-table-toolbar';
import { BtGameQuickEditForm } from '../btGame-quick-edit-form';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'JODI', label: 'Jodi' },
  { value: 'CROSSING', label: 'Crossing' },
  { value: 'HARUF', label: 'Haruf' },
];

const TABLE_HEAD = [
  { id: 'sno', label: 'S No.', width: 100 },
  { id: 'user', label: 'User Details', width: 180 },
  { id: 'game', label: 'Betting Game', width: 180 },
  { id: 'amount', label: 'Total Amount', width: 180 },
  { id: 'date', label: 'Date/Time', width: 180 },
  // { id: 'transaction', label: 'Transaction ID', width: 180 },
  // { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function BtGameListView() {
  const table = useTable();

  const router = useRouter();
  const quickEdit = useBoolean();

  const [isUpdate, setIsUpdate] = useState(false);

  const confirm = useBoolean();
  const filters = useSetState({ name: '', role: [], status: 'JODI' });

  const [date, setDate] = useState({
    fDate: dayjs(new Date()),
  });

  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePage = useCallback((event, newPage) => {
    setCurrentPage(newPage);
  }, []);

  const { data, isLoading } = useGetAllBettingGamesQuery({
    gameType: filters.state.status,
    status: 'manual',
    sDate: new Date(date?.fDate).toISOString().split('T')[0] || '',
    page: currentPage,
  });

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
          heading="Betting Game List"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Betting Game' }]}
          // action={
          //   <Button
          //     variant="contained"
          //     startIcon={<NotificationAddIcon icon="mingcute:add-line" />}
          //     onClick={() => {
          //       setIsUpdate(false);
          //       quickEdit.onTrue();
          //     }}
          //   >
          //     Send Notification
          //   </Button>
          // }
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
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                // icon={
                //   <Label
                //     variant={(tab.value === filters.state.status && 'filled') || 'soft'}
                //     color={
                //       (tab.value === 'false' && 'success') ||
                //       (tab.value === 'true' && 'warning') ||
                //       'default'
                //     }
                //   >
                //     {['active', 'pending', 'banned', 'rejected'].includes(tab.value)
                //       ? data?.data?.filter((user) => user.disable === tab.value).length
                //       : data?.data?.length}
                //   </Label>
                // }
              />
            ))}
          </Tabs>

          <BtGameTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: _roles }}
            date={date}
            setDate={setDate}
          />

          {/* {canReset && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

          <Box sx={{ position: 'relative' }}>
            {/* <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            /> */}

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  // order={table.order}
                  // orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered?.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  // onSelectAllRows={(checked) =>
                  //   table.onSelectAllRows(
                  //     checked,
                  //     dataFiltered.map((row) => row.id)
                  //   )
                  // }
                />

                <TableBody>
                  {dataFiltered?.map((row, i) => (
                    <BtGameTableRow
                      key={row._id}
                      row={row}
                      index={i}
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
            count={data?.page}
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
      <BtGameQuickEditForm update={isUpdate} open={quickEdit.value} onClose={quickEdit.onFalse} />
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;

  // const stabilizedThis = inputData?.map((el, index) => [el, index]);

  // stabilizedThis?.sort((a, b) => {
  //   const order = comparator(a[0], b[0]);
  //   if (order !== 0) return order;
  //   return a[1] - b[1];
  // });

  // inputData = stabilizedThis?.map((el) => el[0]);

  // if (name) {
  //   inputData = inputData?.filter(
  //     (user) => user?.name?.toLowerCase()?.indexOf(name.toLowerCase()) !== -1
  //   );
  // }

  // if (status !== 'all') {
  //   inputData = inputData?.filter((user) => user.status === status);
  // }

  if (role.length) {
    inputData = inputData?.filter((user) => role.includes(user.role));
  }

  return inputData;
}
