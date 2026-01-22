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
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetAllInstallationVideoQuery } from 'src/redux/rtk/api';

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

import { GuideVideoTableRow } from '../guide-video-table-row';
import { GuideVideoTableToolbar } from '../guide-video-table-toolbar';
import { GuideVideoQuickEditForm } from '../guide-video-quick-edit-form';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  // { value: 'false', label: 'Active' },
  // { value: 'true', label: 'Disable' },
];

const TABLE_HEAD = [
  { id: 'sno', label: 'S No.', width: 100 },
  { id: 'name', label: 'Title', width: 180 },
  { id: 'channel', label: 'Channel', width: 180 },
  { id: 'description', label: 'Description', width: 180 },
  // { id: 'status', label: 'Disable', width: 100 },
  { id: 'action', label: 'Action', width: 88 },
];

// ----------------------------------------------------------------------

export function GuideVideoListView() {
  const table = useTable();

  const router = useRouter();
  const quickEdit = useBoolean();

  const [isUpdate, setIsUpdate] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingXlsx, setLoadingXlsx] = useState(false);

  const confirm = useBoolean();
  const filters = useSetState({ name: '', role: [], status: '' });

  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePage = useCallback((event, newPage) => {
    setCurrentPage(newPage);
  }, []);

  const { data, isLoading } = useGetAllInstallationVideoQuery({
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
          heading="Guide Video List"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Guide Video' }]}
          action={
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {/* <LoadingButton
                variant="contained"
                loading={loadingXlsx}
                onClick={() => {
                  generateUserExcelData({
                    url: `${import.meta.env.VITE_APP_API}/admin/getAllUsers?userType=USER&search=&disable=false`,
                    totalPages: data?.page,
                    loading: setLoadingXlsx,
                  });
                }}
              >
                Export CSV
              </LoadingButton>
              <LoadingButton
                variant="contained"
                loading={loadingPdf}
                // startIcon={<NotificationAddIcon icon="mingcute:add-line" />}
                onClick={() => {
                  generateUserPdfData({
                    url: `${import.meta.env.VITE_APP_API}/admin/getAllUsers?userType=USER&search=&disable=false`,
                    totalPages: data?.page,
                    loading: setLoadingPdf,
                  });
                }}
              >
                Export PDF
              </LoadingButton> */}
              <Button
                variant="contained"
                // startIcon={<NotificationAddIcon icon="mingcute:add-line" />}
                onClick={() => {
                  setIsUpdate(false);
                  quickEdit.onTrue();
                }}
              >
                New Guide Video
              </Button>
            </Box>
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
              <Tab key={tab.value} iconPosition="end" value={tab.value} label={tab.label} />
            ))}
          </Tabs>

          <GuideVideoTableToolbar
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
                    <GuideVideoTableRow
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
      <GuideVideoQuickEditForm
        update={isUpdate}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;

  if (role.length) {
    inputData = inputData?.filter((user) => role.includes(user.role));
  }

  return inputData;
}
