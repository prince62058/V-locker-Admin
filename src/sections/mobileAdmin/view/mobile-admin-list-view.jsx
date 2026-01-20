import { useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetMobileAdminsQuery } from 'src/redux/rtk/api';

import { Iconify } from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { Scrollbar } from 'src/components/scrollbar/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import MobileAdminTableRow from '../mobile-admin-table-row';
import MobileAdminQuickCreateForm from '../mobile-admin-quick-create-form';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'role', label: 'Role', width: 180 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export default function MobileAdminListView() {
  const table = useTable();

  const settings = useSettingsContext();

  const quickCreate = useBoolean();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data: users, isLoading } = useGetMobileAdminsQuery({
    page,
    search,
  });

  const dataFiltered = users?.data || [];

  const denseHeight = table.dense ? 52 : 72;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Shop Employee List"
        links={[
          { name: 'Dashboard', href: '/' },
          { name: 'Shop Employee', href: '/dashboard/mobileAdmin' },
          { name: 'List' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={quickCreate.onTrue}
          >
            New Shop Employee
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {dataFiltered.map((row) => (
                  <MobileAdminTableRow
                    key={row._id}
                    row={row}
                    selected={table.selected.includes(row._id)}
                    onSelectRow={() => table.onSelectRow(row._id)}
                    onDeleteRow={() => console.log('DELETE', row._id)}
                  />
                ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                <TableNoData notFound={!dataFiltered.length} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={users?.pagination?.totalPages || 1}
          page={page} // MUI uses 0-based index
          rowsPerPage={20} // Fixed limit as per API
          onPageChange={(e, newPage) => setPage(newPage + 1)}
          // onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <MobileAdminQuickCreateForm open={quickCreate.value} onClose={quickCreate.onFalse} />
    </Container>
  );
}
