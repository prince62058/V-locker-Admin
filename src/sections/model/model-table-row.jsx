import { toast } from 'sonner';
import { useState } from 'react';
import { useNavigate } from 'react-router';

// import Avatar from '@mui/material/Avatar';
import { Box } from '@mui/material';
// import { Switch } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { useDeleteModelMutation } from 'src/redux/rtk/api';

// import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { ModelQuickEditForm } from './view/model-quick-edit-form';
// ----------------------------------------------------------------------

export function ModelTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  index,
  currentPage,
}) {
  const [adsdetails, setAdsDetails] = useState(row);
  const confirm = useBoolean();
  const navigate = useNavigate();
  const popover = usePopover();
  const quickEdit = useBoolean();
  const [isUpdate, setIsUpdate] = useState(false);

  const [deleteModel] = useDeleteModelMutation();

  const handleDelete = async (id) => {
    const res = await deleteModel({
      modelId: id,
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
        <TableCell sx={{ pl: 3.5 }}> {(currentPage - 1) * 20 + index + 1}</TableCell>
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row?.modelName ?? '-'}
              </Box>
            </Stack>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row?.brandName ?? '-'}
              </Box>
            </Stack>
          </Stack>
        </TableCell>
        {/* <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box
                component="span"
                sx={{ color: 'text.disabled' }}
                dangerouslySetInnerHTML={{ __html: row?.description ?? '-' }}
              >
      
              </Box>
            </Stack>
          </Stack>
        </TableCell> */}
        {/* <TableCell>
          <Stack spacing={2} direction="column" alignItems="flex-start">
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                Open Time : {row?.gameOpenTime ?? '-'}
              </Box>
            </Stack>
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                Close Time : {row?.gameClosingTime ?? '-'}
              </Box>
            </Stack>
          </Stack>
        </TableCell> */}
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
        <TableCell>
          <Stack direction="row" alignItems="center">
            {/* <Tooltip title="Quick View" placement="top" arrow>
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
            </Tooltip> */}
            {/* <Tooltip title="Quick Edit" placement="top" arrow>
              <IconButton
                color={quickEdit.value ? 'inherit' : 'default'}
                onClick={quickEdit.onTrue}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip> */}

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      <ModelQuickEditForm
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
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            // disabled
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={() => handleDelete(row?._id)}>
            Delete
          </Button>
        }
      />
    </>
  );
}
