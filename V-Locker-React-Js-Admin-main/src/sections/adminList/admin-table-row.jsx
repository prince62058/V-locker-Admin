import { toast } from 'sonner';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
// import Link from '@mui/material/Link';
import { Chip, Switch } from '@mui/material';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { useDisableAdminMutation } from 'src/redux/rtk/api';

// import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { AdminQuickEditForm } from './admin-quick-edit-form';

// ----------------------------------------------------------------------

export function AdminTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, index }) {
  const confirm = useBoolean();

  const popover = usePopover();

  const quickEdit = useBoolean();
  const [isUpdate, setIsUpdate] = useState(false);

  const [disableUser] = useDisableAdminMutation();

  const handleDisable = async (id) => {
    const res = await disableUser({
      userId: id,
    });
    if (res?.data?.success) {
      toast.success(res?.data?.message);
    } else {
      toast.error(res?.error?.data?.message);
    }
  };

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell sx={{ pl: 3.5 }}>
          {index + 1}
          {/* <Checkbox id={row?._id} checked={selected} onClick={onSelectRow} /> */}
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar
              alt={row?.userName}
              src={`${import.meta.env.VITE_APP_BASE_URL}/${row?.image}`}
            />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row?.userName || '-'}
              </Box>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row?.email || '-'}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {' '}
          <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
            <Box component="span" sx={{ color: 'text.disabled' }}>
              {row?.gender || '-'}
            </Box>
            <Box component="span" sx={{ color: 'text.disabled' }}>
              {row?.dob || '-'}
            </Box>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {' '}
          <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
            <Box
              component="span"
              sx={{ color: 'text.disabled', display: 'flex', flexWrap: 'wrap',gap:1 }}
            >
              {row?.permission?.map((ele, i) => (
                <Chip key={i} size="small" variant="soft" label={ele} />
              )) || '-'}
            </Box>
          </Stack>
        </TableCell>

        <TableCell>
          <Switch
            checked={!!row.disable}
            onChange={() => handleDisable(row?._id)}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: 'red',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: 'red',
              },
              '& .MuiSwitch-switchBase': {
                color: 'green',
              },
              '& .MuiSwitch-switchBase + .MuiSwitch-track': {
                backgroundColor: 'green',
              },
            }}
          />
        </TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{row._id}</TableCell> */}

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.role?row.role:'dev'}</TableCell> */}

        {/* <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'active' && 'success') ||
              (row.status === 'pending' && 'warning') ||
              (row.status === 'banned' && 'error') ||
              'default'
            }
          >
            {row.status}
          </Label>
        </TableCell> */}

        <TableCell>
          <Stack direction="row" alignItems="center">
            <Tooltip title="Quick Edit" placement="top" arrow>
              <IconButton
                color={quickEdit.value ? 'inherit' : 'default'}
                onClick={() => {
                  setIsUpdate(true);
                  quickEdit.onTrue();
                }}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>

            {/* <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton> */}
          </Stack>
        </TableCell>
      </TableRow>

      <AdminQuickEditForm
        currentUser={row}
        update={isUpdate}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
      />

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
