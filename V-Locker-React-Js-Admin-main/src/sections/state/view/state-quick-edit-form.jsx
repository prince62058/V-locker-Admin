import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
// import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
// import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// import { USER_STATUS_OPTIONS } from 'src/_mock';

import {
  useCreateStateMutation,
  useUpdateStateMutation,
} from 'src/redux/rtk/api';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const StateQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
});

// ----------------------------------------------------------------------

export function StateQuickEditForm({ currentUser, open, onClose, update }) {
  const defaultValues = useMemo(
    () => ({
      name: currentUser?.stateName || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(StateQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [createState] = useCreateStateMutation();
  const [updateState] = useUpdateStateMutation();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (update) {
        const res = await updateState({
          data: {
            stateName: data?.name,
          },
          stateId: currentUser?._id,
        });
        reset();
        onClose();
        if (res?.data?.success) {
          toast.success(res?.data?.message);
        } else {
          toast.error(res?.error?.data?.message);
        }
      } else {
        const res = await createState({
          data: {
            stateName: data?.name,
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
          {/* <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Account is waiting for confirmation
          </Alert> */}

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
            mt={2}
          >
            <Field.Text name="name" label="Name" />
            {/* <Field.Text name="gameOpenTime" label="Open Time" type="time" />
            <Field.Text name="gameClosingTime" label="Close Time" type="time" />
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Description</Typography>
              <Field.Editor name="description" sx={{ maxHeight: 480 }} />
            </Stack> */}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Quick {update ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
