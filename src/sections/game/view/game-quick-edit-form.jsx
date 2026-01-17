import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
// import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// import { USER_STATUS_OPTIONS } from 'src/_mock';

import { Stack, Typography } from '@mui/material';

import { useCreateGameMutation, useUpdateGameMutation } from 'src/redux/rtk/api';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const GameQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  gameOpenTime: zod.string().min(1, { message: 'Open time is required!' }),
  gameClosingTime: zod.string().min(1, { message: 'Close time is required!' }),
});

// ----------------------------------------------------------------------

export function GameQuickEditForm({ currentUser, open, onClose, update }) {
  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      description: currentUser?.description || '',
      gameOpenTime: currentUser?.gameOpenTime || '',
      gameClosingTime: currentUser?.gameClosingTime || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(GameQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [createGame] = useCreateGameMutation();
  const [updateGame] = useUpdateGameMutation();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (update) {
        const res = await updateGame({
          data: {
            name: data?.name,
            description: data?.description,
            gameOpenTime: data?.gameOpenTime,
            gameClosingTime: data?.gameClosingTime,
          },
          gameId: currentUser?._id,
        });
        reset();
        onClose();
        if (res?.data?.success) {
          toast.success(res?.data?.message);
        } else {
          toast.error(res?.error?.data?.message);
        }
      } else {
        const res = await createGame({
          data: {
            name: data?.name,
            description: data?.description,
            gameOpenTime: data?.gameOpenTime,
            gameClosingTime: data?.gameClosingTime,
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
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
          >
            <Field.Text name="name" label="Name" />
            <Field.Text name="gameOpenTime" label="Open Time" type="time" />
            <Field.Text name="gameClosingTime" label="Close Time" type="time" />
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Description</Typography>
              <Field.Editor name="description" sx={{ maxHeight: 480 }} />
            </Stack>
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
