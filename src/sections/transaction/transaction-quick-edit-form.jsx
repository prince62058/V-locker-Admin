import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
// import { Typography } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// import { fData } from 'src/utils/format-number';

import {
  useCreateNotificationForAllUserMutation,
  useCreateNotificationForSingleUserMutation,
} from 'src/redux/rtk/api';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const TransactionQuickEditSchema = zod.object({
  // icon: schemaHelper.file({
  //   message: { required_error: 'Icon is required!' },
  // }),
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  // userType: schemaHelper.objectOrNull({
  //   message: { required_error: 'User Type is required!' },
  // }),
});

// ----------------------------------------------------------------------

export function TransactionQuickEditForm({ currentUser, open, onClose, update }) {
  const [sendNotification] = useCreateNotificationForAllUserMutation();
  const [sendSingleNotification] = useCreateNotificationForSingleUserMutation();

  const defaultValues = useMemo(
    () => ({
      title: '',
      // icon: '',
      description: '',
      // userType: '',
    }),
    []
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(TransactionQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (update) {
        const res = await sendSingleNotification({
          data: {
            userId: currentUser?._id,
            title: data.title,
            description: data.description,
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
        const res = await sendNotification({
          data: {
            title: data.title,
            description: data.description,
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

  // const typeOption = [
  //   { name: 'Business Users', type: 'businessUsers' },
  //   { name: 'Non Business Users', type: 'nonBusinessUsers' },
  // ];

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>View Transaction Image</DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <img
            style={{width:"100%",height:"100%",objectFit:"contain"}}
              src={`${import.meta.env.VITE_APP_BASE_URL}/${currentUser?.ss}`}
              alt="Transaction Pic"
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
