import { toast } from 'sonner';
import { useState } from 'react';

import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { Chip, Tooltip } from '@mui/material';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { useUpdateTransactionStatusMutation } from 'src/redux/rtk/api';

// import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { TransactionQuickEditForm } from './transaction-quick-edit-form';

// ----------------------------------------------------------------------

export function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, index }) {
  const confirm = useBoolean();

  const popover = usePopover();

  const quickEdit = useBoolean();
  const [isUpdate, setIsUpdate] = useState(false);

  const [updateStatus] = useUpdateTransactionStatusMutation();

  const handleStatus = async (id, statuss) => {
    const res = await updateStatus({
      data: {
        transtionId: id,
        status: statuss,
      },
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
              src={`${import.meta.env.VITE_APP_BASE_URL}/${row?.userId?.image}`}
            />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'text.disabled' }}>
              {row?.userId?.userName || '-'}
              </Box>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row?.userId?.phoneNumber || '-'}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {' '}
          <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
            <Box component="span" sx={{ color: 'text.disabled' }}>
              {row?.amount || '-'}
            </Box>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.transactionId || '-'}</TableCell>
        {/* <TableCell>
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
        </TableCell> */}

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {' '}
          <Chip
            key={row?._id}
            label={row?.status}
            variant="outlined"
            color={
              (row?.status === 'Approved' && 'primary') ||
              (row?.status === 'Pending' && 'secondary') ||
              (row?.status === 'Rejected' && 'error')
            }
          />
        </TableCell>

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
            <Tooltip title="View Transaction" placement="top" arrow>
              <IconButton
                color={quickEdit.value ? 'inherit' : 'default'}
                onClick={() => {
                  setIsUpdate(true);
                  quickEdit.onTrue();
                }}
              >
                <Iconify icon="solar:eye-bold" />
              </IconButton>
            </Tooltip>

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      <TransactionQuickEditForm
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
            disabled={row?.status !== 'Pending'}
            onClick={() => {
              // onEditRow();
              handleStatus(row?._id, 'Approved');
              popover.onClose();
            }}
            sx={{ color: 'success.main' }}
          >
            Approved
          </MenuItem>
          <MenuItem
            disabled={row?.status !== 'Pending'}
            onClick={() => {
              // confirm.onTrue();
              handleStatus(row?._id, 'Rejected');
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            Rejected
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
