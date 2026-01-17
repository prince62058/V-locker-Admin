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

import { MenuItem } from '@mui/material';

import { useCreateGameResultMutation } from 'src/redux/rtk/api';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const GameResultQuickEditSchema = zod.object({
  result: zod
    .number()
    .min(1, { message: 'No. should be more than 0' })
    .max(99, { message: 'No. should be less than 100' }),
  marketName: zod.string(),
});

// ----------------------------------------------------------------------

export function GameResultQuickEditForm({ currentUser, open, onClose, update }) {
  const roleOption = [
    { value: 'WEST_DELHI', label: 'WEST DELHI' },
    { value: 'SOUTH_MUMBAI', label: 'SOUTH MUMBAI' },
  ];

  const defaultValues = useMemo(
    () => ({
      result: currentUser?.result || '',
      marketName: currentUser?.marketName || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(GameResultQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [createGameResult] = useCreateGameResultMutation();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await createGameResult({
        data: {
          result: data?.result,
          marketName: data?.marketName,
        },
      });
      reset();
      onClose();
      if (res?.data?.success) {
        toast.success(res?.data?.message);
      } else {
        toast.error(res?.error?.data?.message);
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
            <Field.Select name="marketName" label="Market Name" disabled={!!update}>
              {roleOption?.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
            <Field.Text name="result" label="Result" type="number" />
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
