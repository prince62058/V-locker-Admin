import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// import { USER_STATUS_OPTIONS } from 'src/_mock';

import { useCreateSubAdminMutation, useUpdateSubAdminMutation } from 'src/redux/rtk/api';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const AdminQuickEditSchema = zod.object({
  userName: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  // phone: zod
  //   .string()
  //   .length(10, { message: 'Phone Number must be exactly 10 digits!' })
  //   .regex(/^\d+$/, { message: 'Phone Number must contain only numbers!' }),
  password: zod.string().min(1, { message: 'Password is required!' }),
  permission: zod.array(zod.string()).min(1, 'Select at least one permission'),
  // Not required
  gender: zod.string(),
});

// ----------------------------------------------------------------------

export function AdminQuickEditForm({ currentUser, open, onClose, update }) {
  const roleOption = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
  ];
  const permissionOption = [
    { value: 'BANNER', label: 'Banner' },
    { value: 'USERMANAGER', label: 'User Manager' },
    { value: 'PROFILE', label: 'Dashoard Profile' },
    { value: 'GAME', label: 'Game' },
    { value: 'BTGAME', label: 'Betting Game' },
    { value: 'LEADBOARD', label: 'Leadboard' },
    { value: 'GAMERULE', label: 'Game Rule' },
    { value: 'GAMERESULT', label: 'Game Result' },
    { value: 'QR', label: 'QR Code' },
    { value: 'APPINFO', label: 'AppInfo' },
    { value: 'TRANSACTION', label: 'Transaction' },
    { value: 'WITHDRAW', label: 'Widthdraw' },
    { value: 'HOWTOPLAY', label: 'How to play' },
    { value: 'COMPANY', label: 'Company' },
    { value: 'CHAT', label: 'Chat' },
  ];

  const defaultValues = useMemo(
    () => ({
      userName: currentUser?.userName || '',
      email: currentUser?.email || '',
      password: '',
      gender: currentUser?.gender || '',
      permission: currentUser?.permission || [],
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(AdminQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [createSubAdmin] = useCreateSubAdminMutation();
  const [updateSubAdmin] = useUpdateSubAdminMutation();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (update) {
        const res = await updateSubAdmin({
          data: {
            userId: currentUser?._id,
            password: data?.password,
            permission: data?.permission,
          },
        });
        reset();
        onClose();
        if (res?.data?.success) {
          toast.success(res?.data?.message);
        } else {
          toast.error(res?.error?.data?.message);
        }
      } else {
        const res = await createSubAdmin({
          data: {
            userName: data?.userName,
            email: data?.email,
            password: data?.password,
            gender: data?.gender,
          },
        });
        reset();
        onClose();
        if (res?.data?.success) {
          toast.success(res?.data?.message);
        } else {
          toast.error(res?.error?.data?.message);
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick {update ? 'Update' : 'Create'}</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Account is waiting for confirmation
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            {/* <Box sx={{ display: { xs: 'none', sm: 'block' } }} /> */}

            <Field.Text name="userName" label="Name" disabled={!!update} />
            <Field.Text name="email" label="Email address" disabled={!!update} />
            <Field.Select name="gender" label="Gender" disabled={!!update}>
              {roleOption?.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
            <Field.Text name="password" label="Password" />
            <Field.MultiSelect
              name="permission"
              label="Permissions"
              options={permissionOption}
              chip
              checkbox
              placeholder="Select permission"
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {update ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
