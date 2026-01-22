import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useSendNotificationSingleAndAllUserMutation } from 'src/redux/rtk/api';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const CustomerQuickEditSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
});

// ----------------------------------------------------------------------

export function CustomerQuickEditForm({ currentUser, open, onClose, update }) {
  const [sendNotification] = useSendNotificationSingleAndAllUserMutation();

  const defaultValues = useMemo(
    () => ({
      title: '',
      silent: true,
      description: '',
    }),
    []
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(CustomerQuickEditSchema),
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
        const res = await sendNotification({
          data: {
            userId: currentUser?._id,
            title: data.title,
            bodi: data.description,
            silent: true,
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
            bodi: data.description,
            silent: true,
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
        <DialogTitle>Send notification for {update ? 'single customer' : 'all customers'}</DialogTitle>

        <DialogContent>
          {/* <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Account is waiting for confirmation
          </Alert> */}

          <Box sx={{ display: 'flex', flexDirection: 'column' ,mt:2}}>
            <Box sx={{ px: '5rem' }}>
              <Field.Text name="title" label="Title" />
            </Box>
            <Box mt={3} sx={{ px: '5rem' }}>
              <Field.Text name="description" label="Description" multiline rows={3} />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Send
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
