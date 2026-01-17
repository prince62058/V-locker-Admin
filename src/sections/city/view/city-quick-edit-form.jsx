import { z as zod } from 'zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import {
  useGetAllBrandQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
} from 'src/redux/rtk/api';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const CityQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'Model Name is required!' }),
});

// ----------------------------------------------------------------------

export function CityQuickEditForm({ currentUser, open, onClose, update, stateId }) {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const { data: brandData } = useGetAllBrandQuery({
    status: false,
    page,
    search: '',
  });

  // 🔹 Compute default values correctly even when brandName is just a string
  const defaultValues = useMemo(
    () => ({
      name: currentUser?.cityName || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(CityQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const [createCity] = useCreateCityMutation();
  const [updateCity] = useUpdateCityMutation();

  const onSubmit = handleSubmit(async (data) => {
    try {
      let res;
      if (update) {
        res = await updateCity({
          data: { cityName: data?.name, stateId },
          cityId: currentUser?._id,
        });
      } else {
        res = await createCity({ data: { cityName: data?.name, stateId } });
      }

      reset();
      onClose();

      if (res?.data?.success) {
        toast.success(res?.data?.message);
      } else {
        toast.error(res?.error?.data?.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred');
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
            {/* Model Name */}
            <Field.Text name="name" label="City Name" />

            {/* Brand Select */}
            {/* <FormControl fullWidth>
              <Controller
                name="brandName"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                      displayEmpty
                      renderValue={(selected) =>
                        selected ? selected.brandName || selected || 'Select Brand' : 'Select Brand'
                      }
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 200 },
                          onScroll: (event) => {
                            const bottom =
                              event.target.scrollHeight - event.target.scrollTop <=
                              event.target.clientHeight + 5;
                            if (bottom) loadMorePages();
                          },
                        },
                      }}
                    >
                      {alBrandData?.map((ele) => (
                        <MenuItem key={ele?._id} value={ele}>
                          {ele?.brandName || '-'}
                        </MenuItem>
                      ))}
                      {loading && (
                        <MenuItem disabled>
                          <CircularProgress size={20} />
                        </MenuItem>
                      )}
                    </Select>
                    {fieldState?.error && (
                      <Box sx={{ color: 'error.main', mt: 1, fontSize: 13 }}>
                        {fieldState.error.message}
                      </Box>
                    )}
                  </>
                )}
              />
            </FormControl> */}
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
