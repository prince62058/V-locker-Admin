import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
// import { Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// import { fData } from 'src/utils/format-number';

import {
  useCreateNotificationForAllUserMutation,
  useCreateNotificationForSingleUserMutation,
} from 'src/redux/rtk/api';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const WithdrawQuickEditSchema = zod.object({
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

export function WithdrawQuickEditForm({ currentUser, open, onClose, update }) {
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
    resolver: zodResolver(WithdrawQuickEditSchema),
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
        <DialogTitle>Send notification for {update ? 'single user' : 'all users'}</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Account is waiting for confirmation
          </Alert>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* <Box sx={{ mb: 2 }}>
              <Controller
                name="icon"
                control={methods.control}
                render={({ field }) => (
                  <Field.UploadAvatar
                    {...field}
                    maxSize={3145728}
                    helperText={
                      <Typography
                        variant="caption"
                        sx={{
                          my: 2,
                          mx: 'auto',
                          display: 'block',
                          textAlign: 'center',
                          color: 'text.disabled',
                        }}
                      >
                        Allowed Image 150 X 150 only
                        <br /> max size of {fData(3145728)}
                      </Typography>
                    }
                  />
                )}
              />
            </Box> */}
            <Box sx={{ px: '5rem' }}>
              <Field.Text name="title" label="Title" />
            </Box>
            <Box mt={3} sx={{ px: '5rem' }}>
              <Field.Text name="description" label="Description" multiline rows={3} />
            </Box>
            {/* <Box
              mt={3}
              rowGap={3}
              columnGap={2}
              sx={{ px: '5rem' }}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Select
                native
                name="userType"
                label="User Type"
                InputLabelProps={{ shrink: true }}
              >
                {typeOption?.map((ele) => (
                  <option key={ele?.name} label={ele?.name} value={ele?.type}>
                    {ele?.name}
                  </option>
                ))}
              </Field.Select>
            </Box> */}
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
