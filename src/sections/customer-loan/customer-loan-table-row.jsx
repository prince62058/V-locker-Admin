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
import Checkbox from '@mui/material/Checkbox';

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

import { useState } from 'react';

export function CustomerLoanTableRow({ row, index, currentPage, selected, onSelectRow }) {
  const popover = usePopover();
  const [updateCustomerLoan] = useUpdateCustomerLoanMutation();
  const [lockDevice] = useLockDeviceMutation();
  const [unlockDevice] = useUnlockDeviceMutation();
  const [updateDevicePolicy] = useUpdateDevicePolicyMutation();
  const [wallpaperDialogOpen, setWallpaperDialogOpen] = useState(false);
  const [uploadingWallpaper, setUploadingWallpaper] = useState(false);

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
      if (type === 'WHATSAPP') newPolicy.isWhatsAppBlocked = value;
      if (type === 'INSTAGRAM') newPolicy.isInstagramBlocked = value;
      if (type === 'SNAPCHAT') newPolicy.isSnapchatBlocked = value;
      if (type === 'YOUTUBE') newPolicy.isYouTubeBlocked = value;
      if (type === 'FACEBOOK') newPolicy.isFacebookBlocked = value;
      if (type === 'DIALER') newPolicy.isDialerBlocked = value;
      if (type === 'MESSAGES') newPolicy.isMessagesBlocked = value;
      if (type === 'PLAYSTORE') newPolicy.isPlayStoreBlocked = value;
      if (type === 'CHROME') newPolicy.isChromeBlocked = value;

      console.log('🔧 Updating Device Policy:', {
        type,
        value,
        loanId: row._id,
        newPolicy,
      });

      const res = await updateDevicePolicy({
        loanId: row._id,
        data: newPolicy,
      });

      console.log('📡 API Response:', res);

      if (res?.data?.success) {
        toast.success(`Device policy updated: ${type}`);
        popover.onClose();
      } else {
        console.error('❌ API Error:', res?.error);
        toast.error(res?.error?.data?.message || 'Failed to update policy');
      }
    } catch (error) {
      console.error('❌ Exception:', error);
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

  const handleWallpaperUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setUploadingWallpaper(true);

      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      console.log('Upload status:', uploadRes.status);
      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        console.error('Upload failed details:', errorText);
        throw new Error(`Upload failed with status ${uploadRes.status}`);
      }

      const uploadData = await uploadRes.json();
      const imageUrl = `${import.meta.env.VITE_APP_BASE_URL}/${uploadData.filePath}`;

      const currentPolicy = row.devicePolicy || {};
      const newPolicy = {
        ...currentPolicy,
        isWallpaperEnabled: true,
        wallpaperUrl: imageUrl,
      };

      const res = await updateDevicePolicy({
        loanId: row._id,
        data: newPolicy,
      });

      if (res?.data?.success) {
        toast.success('Wallpaper uploaded and enabled!');
        popover.onClose();
      } else {
        toast.error(res?.error?.data?.message || 'Failed to update wallpaper');
      }
    } catch (error) {
      console.error('Wallpaper upload error:', error);
      toast.error('Failed to upload wallpaper');
    } finally {
      setUploadingWallpaper(false);
    }
  };

  const handleWallpaperToggle = async () => {
    try {
      const currentPolicy = row.devicePolicy || {};
      const newPolicy = {
        ...currentPolicy,
        isWallpaperEnabled: !currentPolicy.isWallpaperEnabled,
      };

      const res = await updateDevicePolicy({
        loanId: row._id,
        data: newPolicy,
      });

      if (res?.data?.success) {
        toast.success(`Wallpaper ${newPolicy.isWallpaperEnabled ? 'enabled' : 'disabled'}!`);
        popover.onClose();
      } else {
        toast.error(res?.error?.data?.message || 'Failed to toggle wallpaper');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

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
            <MenuItem
              onClick={() => handlePolicyChange('RESET', !row.devicePolicy?.isResetAllowed)}
              sx={{ color: row.devicePolicy?.isResetAllowed ? 'error.main' : 'success.main' }}
            >
              <Iconify
                icon={row.devicePolicy?.isResetAllowed ? 'eva:slash-fill' : 'eva:refresh-fill'}
              />
              {row.devicePolicy?.isResetAllowed ? 'Disable Reset' : 'Enable Reset'}
            </MenuItem>
          )}

          {row.loanStatus === 'APPROVED' && (
            <MenuItem
              onClick={() => handlePolicyChange('UNINSTALL', !row.devicePolicy?.isUninstallAllowed)}
              sx={{ color: row.devicePolicy?.isUninstallAllowed ? 'error.main' : 'success.main' }}
            >
              <Iconify
                icon={row.devicePolicy?.isUninstallAllowed ? 'eva:slash-fill' : 'eva:trash-2-fill'}
              />
              {row.devicePolicy?.isUninstallAllowed ? 'Disable Uninstall' : 'Enable Uninstall'}
            </MenuItem>
          )}

          {row.loanStatus === 'APPROVED' && (
            <MenuItem
              onClick={() =>
                handlePolicyChange(
                  'DEV_OPTIONS',
                  !(row.devicePolicy?.isDeveloperOptionsBlocked ?? false)
                )
              }
              sx={{
                color:
                  row.devicePolicy?.isDeveloperOptionsBlocked ?? false
                    ? 'success.main'
                    : 'error.main',
              }}
            >
              <Iconify
                icon={
                  row.devicePolicy?.isDeveloperOptionsBlocked ?? false
                    ? 'eva:checkmark-circle-2-fill'
                    : 'eva:slash-fill'
                }
              />
              {row.devicePolicy?.isDeveloperOptionsBlocked ?? false
                ? 'Enable Developer Mode'
                : 'Disable Developer Mode'}
            </MenuItem>
          )}

          {row.loanStatus === 'APPROVED' && (
            <MenuItem
              onClick={() => {
                document.getElementById(`wallpaper-upload-${row._id}`).click();
              }}
              sx={{ color: 'primary.main' }}
              disabled={uploadingWallpaper}
            >
              <Iconify icon="eva:image-fill" />
              {uploadingWallpaper ? 'Uploading...' : 'Upload Wallpaper'}
            </MenuItem>
          )}

          {row.loanStatus === 'APPROVED' && (
            <input
              id={`wallpaper-upload-${row._id}`}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleWallpaperUpload}
            />
          )}

          {row.loanStatus === 'APPROVED' && (
            <MenuItem
              onClick={handleWallpaperToggle}
              sx={{
                color: row.devicePolicy?.isWallpaperEnabled ? 'error.main' : 'success.main',
              }}
            >
              <Iconify
                icon={row.devicePolicy?.isWallpaperEnabled ? 'eva:eye-off-fill' : 'eva:eye-fill'}
              />
              {row.devicePolicy?.isWallpaperEnabled ? 'Disable Wallpaper' : 'Enable Wallpaper'}
            </MenuItem>
          )}

          <Box sx={{ my: 1, borderTop: (theme) => `dashed 1px ${theme.palette.divider}` }} />

          {/* Social & System App Blocks */}
          {[
            {
              id: 'WHATSAPP',
              label: 'WhatsApp',
              key: 'isWhatsAppBlocked',
              icon: 'logos:whatsapp-icon',
            },
            {
              id: 'INSTAGRAM',
              label: 'Instagram',
              key: 'isInstagramBlocked',
              icon: 'skill-icons:instagram',
            },
            {
              id: 'SNAPCHAT',
              label: 'Snapchat',
              key: 'isSnapchatBlocked',
              icon: 'logos:snapchat-icon',
            },
            {
              id: 'YOUTUBE',
              label: 'YouTube',
              key: 'isYouTubeBlocked',
              icon: 'logos:youtube-icon',
            },
            { id: 'FACEBOOK', label: 'Facebook', key: 'isFacebookBlocked', icon: 'logos:facebook' },
            { id: 'DIALER', label: 'Dialer', key: 'isDialerBlocked', icon: 'eva:phone-fill' },
            {
              id: 'MESSAGES',
              label: 'Messages',
              key: 'isMessagesBlocked',
              icon: 'eva:message-square-fill',
            },
            {
              id: 'PLAYSTORE',
              label: 'Play Store',
              key: 'isPlayStoreBlocked',
              icon: 'logos:google-play-icon',
            },
            { id: 'CHROME', label: 'Chrome', key: 'isChromeBlocked', icon: 'logos:chrome' },
          ].map((app) => (
            <MenuItem
              key={app.id}
              onClick={() => handlePolicyChange(app.id, !(row.devicePolicy?.[app.key] ?? false))}
              sx={{ color: row.devicePolicy?.[app.key] ? 'success.main' : 'error.main' }}
            >
              <Iconify icon={app.icon} />
              {row.devicePolicy?.[app.key] ? `Unhide ${app.label}` : `Hide ${app.label}`}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
