import { useState } from 'react';
import { useNavigate } from 'react-router';

// import { Switch } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
// import Tooltip from '@mui/material/Tooltip';
import { Box, Avatar } from '@mui/material';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
// import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

// import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { LeaderboardQuickEditForm } from './view/leadboard-quick-edit-form';
// ----------------------------------------------------------------------

export function LeadboardTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, index }) {
  const [adsdetails, setAdsDetails] = useState(row);
  const confirm = useBoolean();
  const navigate = useNavigate();
  const popover = usePopover();
  const quickEdit = useBoolean();
  const [isUpdate, setIsUpdate] = useState(false);

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell sx={{ pl: 3.5 }}>{index + 1}</TableCell>
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar
              alt={row?.userId?.userName}
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
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row?.points ?? '-'}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        {/* <TableCell>
          <Stack direction="row" alignItems="center">
            <Tooltip title="Quick View" placement="top" arrow>
              <IconButton
                color={quickEdit.value ? 'inherit' : 'default'}
                onClick={() => {
                  navigate(`${row?._id}`, {
                    state: { adsdetails },
                  });
                }}
              >
                <Iconify icon="solar:eye-bold" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Quick Edit" placement="top" arrow>
              <IconButton
                color={quickEdit.value ? 'inherit' : 'default'}
                onClick={quickEdit.onTrue}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell> */}
      </TableRow>

      <LeaderboardQuickEditForm
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
          {/* <MenuItem
            onClick={() => {
              const id = row?._id;
              navigate(`${id}/details`);
            }}
          >
            <Iconify icon="solar:eye-bold" />
            view
          </MenuItem> */}
          {/* <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            disabled
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem> */}

          <MenuItem
            onClick={() => {
              setIsUpdate(true);
              quickEdit.onTrue();
              popover.onClose();
              // onEditRow();
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
