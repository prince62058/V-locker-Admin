import { toast } from 'sonner';

import Box from '@mui/material/Box';
import { Chip } from '@mui/material';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import {
  useLockDeviceMutation,
  useUnlockDeviceMutation,
  useUpdateCustomerLoanMutation,
  useUpdateDevicePolicyMutation,
} from 'src/redux/rtk/api';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function CustomerLoanTableRow({ row, index, currentPage }) {
  const popover = usePopover();
  const [updateCustomerLoan] = useUpdateCustomerLoanMutation();
  const [lockDevice] = useLockDeviceMutation();
  const [unlockDevice] = useUnlockDeviceMutation();
  const [updateDevicePolicy] = useUpdateDevicePolicyMutation();

  const handlePolicyChange = async (type, value) => {
    try {
      const currentPolicy = row.devicePolicy || {
        isResetAllowed: false,
        isUninstallAllowed: false,
      };
      const newPolicy = { ...currentPolicy };

      if (type === 'RESET') newPolicy.isResetAllowed = value;
      if (type === 'UNINSTALL') newPolicy.isUninstallAllowed = value;
      if (type === 'DEV_OPTIONS') newPolicy.isDeveloperOptionsBlocked = value;

      const res = await updateDevicePolicy({
        loanId: row._id,
        data: newPolicy,
      });

      if (res?.data?.success) {
        toast.success('Device policy updated');
        popover.onClose();
      } else {
        toast.error(res?.error?.data?.message || 'Failed to update policy');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleStatus = async (status) => {
    try {
      const res = await updateCustomerLoan({
        loanId: row._id,
        data: { loanStatus: status },
      });
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        popover.onClose();
      } else {
        toast.error(res?.error?.data?.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleLockUnlock = async (action) => {
    try {
      let res;
      if (action === 'LOCK') {
        res = await lockDevice(row._id);
      } else {
        res = await unlockDevice(row._id);
      }

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        popover.onClose();
      } else {
        toast.error(res?.error?.data?.message || 'Failed to update device status');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell sx={{ pl: 3.5 }}> {(currentPage - 1) * 20 + index + 1}</TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar
              alt={row?.customerId?.customerName}
              src={
                row?.customerId?.profileUrl
                  ? `${import.meta.env.VITE_APP_BASE_URL}/${row?.customerId?.profileUrl}`
                  : ''
              }
            >
              {row?.customerId?.customerName?.charAt(0).toUpperCase()}
            </Avatar>
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                {row?.customerId?.customerName || 'Unknown'}
              </Box>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row?.customerId?.customerMobileNumber || '-'}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {fCurrency(row.loanAmount, { currency: 'INR' })}
        </TableCell>

        <TableCell>
          <Stack>
            <Box component="span">EMI: {fCurrency(row.emiAmount, { currency: 'INR' })}</Box>
            <Box component="span" sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>
              {row.numberOfEMIs} Months
            </Box>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Chip
            label={row.loanStatus}
            color={
              (row.loanStatus === 'APPROVED' && 'success') ||
              (row.loanStatus === 'PENDING' && 'warning') ||
              (row.loanStatus === 'REJECTED' && 'error') ||
              (row.loanStatus === 'CLOSED' && 'info') ||
              'default'
            }
            size="small"
            variant="soft"
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Chip
            label={row.deviceUnlockStatus || 'UNKNOWN'}
            color={
              (row.deviceUnlockStatus === 'UNLOCKED' && 'success') ||
              (row.deviceUnlockStatus === 'LOCKED' && 'error') ||
              'default'
            }
            size="small"
            variant="outlined"
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.createdAt)}</TableCell>

        <TableCell>
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
        <MenuList>
          <MenuItem
            disabled={row.loanStatus !== 'PENDING'}
            onClick={() => handleStatus('APPROVED')}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="eva:checkmark-circle-2-fill" />
            Approve
          </MenuItem>

          <MenuItem
            disabled={row.loanStatus === 'REJECTED' || row.loanStatus === 'CLOSED'}
            onClick={() => handleStatus('REJECTED')}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="eva:close-circle-fill" />
            Reject
          </MenuItem>

          {row.loanStatus === 'APPROVED' && row.deviceUnlockStatus === 'UNLOCKED' && (
            <MenuItem onClick={() => handleLockUnlock('LOCK')} sx={{ color: 'error.main' }}>
              <Iconify icon="eva:lock-fill" />
              Lock Device
            </MenuItem>
          )}

          {row.loanStatus === 'APPROVED' && row.deviceUnlockStatus === 'LOCKED' && (
            <MenuItem onClick={() => handleLockUnlock('UNLOCK')} sx={{ color: 'success.main' }}>
              <Iconify icon="eva:unlock-fill" />
              Unlock Device
            </MenuItem>
          )}

          {/* Device Policy Controls */}
          {row.loanStatus === 'APPROVED' && (
            <>
              <MenuItem
                onClick={() => handlePolicyChange('RESET', !row.devicePolicy?.isResetAllowed)}
                sx={{ color: row.devicePolicy?.isResetAllowed ? 'error.main' : 'success.main' }}
              >
                <Iconify
                  icon={row.devicePolicy?.isResetAllowed ? 'eva:slash-fill' : 'eva:refresh-fill'}
                />
                {row.devicePolicy?.isResetAllowed ? 'Disable Reset' : 'Enable Reset'}
              </MenuItem>

              <MenuItem
                onClick={() =>
                  handlePolicyChange('UNINSTALL', !row.devicePolicy?.isUninstallAllowed)
                }
                sx={{ color: row.devicePolicy?.isUninstallAllowed ? 'error.main' : 'success.main' }}
              >
                <Iconify
                  icon={
                    row.devicePolicy?.isUninstallAllowed ? 'eva:slash-fill' : 'eva:trash-2-fill'
                  }
                />
                {row.devicePolicy?.isUninstallAllowed ? 'Disable Uninstall' : 'Enable Uninstall'}
              </MenuItem>

              <MenuItem
                onClick={() =>
                  handlePolicyChange(
                    'DEV_OPTIONS',
                    // If currently blocked (true), we want to set to false (allow).
                    // If currently allowed (false), we want to set to true (block).
                    !(row.devicePolicy?.isDeveloperOptionsBlocked ?? true)
                  )
                }
                sx={{
                  color:
                    row.devicePolicy?.isDeveloperOptionsBlocked ?? true
                      ? 'success.main'
                      : 'error.main',
                }}
              >
                <Iconify
                  icon={
                    row.devicePolicy?.isDeveloperOptionsBlocked ?? true
                      ? 'eva:checkmark-circle-2-fill'
                      : 'eva:slash-fill'
                  }
                />
                {row.devicePolicy?.isDeveloperOptionsBlocked ?? true
                  ? 'Enable Version Click'
                  : 'Disable Version Click'}
              </MenuItem>
            </>
          )}
        </MenuList>
      </CustomPopover>
    </>
  );
}
