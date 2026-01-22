import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { _roles } from 'src/_mock';
import { varAlpha } from 'src/theme/styles';
import { useGetAllModelQuery } from 'src/redux/rtk/api';
import { DashboardContent } from 'src/layouts/dashboard';

// import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { SplashScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { ModelTableRow } from '../model-table-row';
import { ModelTableToolbar } from '../model-table-toolbar';
// ----------------------------------------------------------------------
import { ModelQuickEditForm } from './model-quick-edit-form';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  // { value: 'false', label: 'Active' },
  // { value: 'true', label: 'Disable' },
];

const TABLE_HEAD = [
  { id: 'sno', label: 'S No.', width: 10 },
  { id: 'name', label: 'Model Name', width: 120 },
  { id: 'bname', label: 'Brand Name', width: 120 },
  // { id: 'description', label: 'Description', width: 250 },
  // { id: 'time', label: 'Game Time', width: 150 },
  // { id: 'status', label: 'Status', width: 100 },
  { id: 'view', label: 'Action', width: 88 },
  // { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function ModelListView() {
  const table = useTable();

  const router = useRouter();

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const [isUpdate, setIsUpdate] = useState(false);

  // const [tableData, setTableData] = useState(_userList);

  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePage = useCallback((event, newPage) => {
    setCurrentPage(newPage);
  }, []);
  const filters = useSetState({ name: '', role: [], status: '' });

  const {
    data: fetchedData,
    isSuccess,
    isLoading,
  } = useGetAllModelQuery({
    status: filters.state.status,
    page: currentPage,
    search: filters.state.name,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.state.name, filters.state.status]);

  const dataFiltered = applyFilter({
    inputData: fetchedData?.data || [], // Ensure tableData is passed as an array
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state.status,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name || filters.state.role.length > 0 || filters.state.status !== 'all';

  const notFound = (!fetchedData?.data.length && canReset) || !fetchedData?.data.length;

  // const handleDeleteRow = useCallback(
  //   (id) => {
  //     const deleteRow = fetchedData?.data.filter((row) => row.id !== id);

  //     toast.success('Delete success!');

  //     // setTableData(deleteRow);

  //     table.onUpdatePageDeleteRow(dataInPage.length);
  //   },
  //   [dataInPage.length, table, tableData]
  // );

  // const handleDeleteRows = useCallback(() => {
  //   const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

  //   toast.success('Delete success!');

  //   setTableData(deleteRows);

  //   table.onUpdatePageDeleteRows({
  //     totalRowsInPage: dataInPage.length,
  //     totalRowsFiltered: dataFiltered.length,
  //   });
  // }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.plans.details(id));
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

  return isLoading && !fetchedData ? (
    <SplashScreen />
  ) : (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Model List"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Model' }]}
          action={
            <Button
              // component={RouterLink}
              // href={paths.dashboard.user.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => {
                setIsUpdate(false);
                quickEdit.onTrue();
                // onEditRow();
                // popover.onClose();
              }}
            >
              New Model
            </Button>
          }
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
                //     variant={
                //       ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                //       'soft'
                //     }
                //     color={
                //       (tab.value === 'active' && 'success') ||
                //       (tab.value === 'pending' && 'warning') ||
                //       (tab.value === 'banned' && 'error') ||
                //       'default'
                //     }
                //   >
                //     {['active', 'pending', 'banned', 'rejected'].includes(tab.value)
                //       ? tableData.filter((user) => user.status === tab.value).length
                //       : tableData.length}
                //   </Label>
                // }
              />
            ))}
          </Tabs>

          <ModelTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: _roles }}
          />

          {/* {canReset && (
            <PlanTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
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
            />

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
                  //     dataFiltered.map((row) => row?._id)
                  //   )
                  // }
                />

                <TableBody>
                  {fetchedData?.data?.map((row, i) => (
                    <ModelTableRow
                      key={i}
                      row={row}
                      index={i}
                      currentPage={currentPage}
                      selected={table.selected.includes(row?.id)}
                      onSelectRow={() => table.onSelectRow(row?.id)}
                      // onDeleteRow={() => handleDeleteRow(row?.id)}
                      onEditRow={() => handleEditRow(row?.id)}
                    />
                  ))}
                  {/* {tableData
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row,i) => (
                      <AdTableRow
                      key={row?.id}
                      row={row}
                      index={i}
                      selected={table.selected.includes(row?.id)}
                      onSelectRow={() => table.onSelectRow(row?.id)}
                      onDeleteRow={() => handleDeleteRow(row?.id)}
                      onEditRow={() => handleEditRow(row?.id)}
                    />
                    ))} */}

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
            count={fetchedData?.pagination?.totalPages || 1}
            // rowsPerPage={20}
            onChange={handleChangePage}
            onChangeDense={table.onChangeDense}
            // onRowsPerPageChange={table.onChangeRowsPerPage}
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
              // handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
      <ModelQuickEditForm update={isUpdate} open={quickEdit.value} onClose={quickEdit.onFalse} />
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
  //   inputData = inputData.filter(
  //     (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
  //   );
  // }

  if (status !== '') {
    inputData = inputData?.filter((user) => user.status === status);
  }

  if (role?.length) {
    inputData = inputData?.filter((user) => role.includes(user.role));
  }

  return inputData;
}
