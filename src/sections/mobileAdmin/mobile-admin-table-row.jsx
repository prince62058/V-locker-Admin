import { toast } from 'sonner';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { useDeleteMobileAdminMutation } from 'src/redux/rtk/api';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label/label';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function MobileAdminTableRow({ row, selected, onSelectRow, onDeleteRow }) {
  const confirm = useBoolean();
  const popover = usePopover();
  const [deleteMobileAdmin] = useDeleteMobileAdminMutation();

  if (!row) return null;

  const { name, email, role, status, _id } = row;

  const handleDelete = async () => {
    try {
      const res = await deleteMobileAdmin(_id);
      if (res?.data?.success) {
        toast.success('Shop Employee deleted successfully');
        confirm.onFalse();
        popover.onClose();
      } else {
        toast.error(res?.error?.data?.message || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={name}
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{role}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'active' && 'success') || (status === 'banned' && 'error') || 'default'
            }
          >
            active
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
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
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure you want to delete ${name}?`}
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}

MobileAdminTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  // onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    status: PropTypes.string,
  }),
  selected: PropTypes.bool,
};
