import { toast } from 'sonner';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { Chip, Tooltip } from '@mui/material';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import NoPreview from 'src/assets/NoPreview.jpg';
import { useUpdateLoanStatusMutation } from 'src/redux/rtk/api';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { KeysQuickEditForm } from './keys-quick-edit-form';

// ----------------------------------------------------------------------

export function KeysTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  index,
  currentPage,
}) {
  const confirm = useBoolean();
  const confirmReason = useBoolean();

  const popover = usePopover();

  const quickEdit = useBoolean();
  const [isUpdate, setIsUpdate] = useState(false);

  const [updateStatus] = useUpdateLoanStatusMutation();

  const handleStatus = async (id, statuss) => {
    const res = await updateStatus({
      loanId: id,
      data: { status: statuss },
    });
    if (res?.data?.status) {
      toast.success(res?.data?.message);
    } else {
      toast.error(res?.error?.data?.message);
    }
  };

  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitRejection = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason.');
      return;
    }
    try {
      setSubmitting(true);
      const res = await updateStatus({
        loanId: row?._id,
        data: { status: 'Rejected', reason: reason.trim() },
      });
      if (res?.data?.status) {
        toast.success(res?.data?.message);
        confirmReason.onFalse();
        setReason('');
      } else {
        toast.error(res?.error?.data?.message || 'Failed to reject request');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell sx={{ pl: 3.5 }}> {(currentPage - 1) * 20 + index + 1}</TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row?.userId?.name} src={row?.userId?.profileUrl || NoPreview} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row?.userId?.name || '-'}
              </Box>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row?.userId?.phone || '-'}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.requestKeys}</TableCell>
        <TableCell sx={{ whiteSpace: 'wrap' }}>{row.reason || 'N/A'}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Chip
            key={row?._id}
            label={row?.status}
            variant="outlined"
            color={
              (row?.status === 'Approved' && 'primary') ||
              (row?.status === 'Pending' && 'secondary') ||
              (row?.status === 'Rejected' && 'error') ||
              undefined
            }
          />
        </TableCell>

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

      <KeysQuickEditForm
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
              handleStatus(row?._id, 'Approved');
              popover.onClose();
            }}
            sx={{ color: 'success.main' }}
          >
            Approved
          </MenuItem>
          <MenuItem
            disabled={row?.status === 'Rejected'}
            onClick={() => {
              popover.onClose();
              confirmReason.onTrue();
            }}
            sx={{ color: 'error.main' }}
          >
            Rejected
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirmReason.value}
        onClose={() => {
          confirmReason.onFalse();
          setReason('');
        }}
        title="Reject Request"
        content={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box component="label" sx={{ typography: 'subtitle2' }}>
              Reason
            </Box>
            <Box
              component="textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a reason for rejecting this request..."
              sx={{
                width: '100%',
                minHeight: 120,
                p: 1,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                resize: 'vertical',
              }}
            />
          </Box>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={submitRejection}
            disabled={submitting || !reason.trim()}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        }
      />
    </>
  );
}
