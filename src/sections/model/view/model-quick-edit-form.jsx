import { z as zod } from 'zod';
import { useMemo, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
// import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Select, MenuItem, FormControl, CircularProgress } from '@mui/material';

import {
  useGetAllBrandQuery,
  useCreateModelMutation,
  useUpdateModelMutation,
} from 'src/redux/rtk/api';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const ModelQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'Model Name is required!' }),
  brandName: zod.any().refine((val) => val && (val._id || val.brandName), {
    message: 'Brand selection is required!',
  }),
});

// ----------------------------------------------------------------------

export function ModelQuickEditForm({ currentUser, open, onClose, update }) {
  const [alBrandData, setBrandData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const { data: brandData } = useGetAllBrandQuery({
    status: false,
    page,
    search: '',
  });

  // 🔹 Compute default values correctly even when brandName is just a string
  const defaultValues = useMemo(() => {
    let selectedBrand = '';

    // If currentUser.brandName is a full object
    if (currentUser?.brandName && typeof currentUser.brandName === 'object') {
      selectedBrand = currentUser.brandName;
    }
    // If currentUser.brandName is only the brand name string
    else if (typeof currentUser?.brandName === 'string') {
      const match = brandData?.data?.find(
        (b) => b.brandName?.toLowerCase() === currentUser.brandName?.toLowerCase()
      );
      selectedBrand = match || { brandName: currentUser.brandName };
    }

    return {
      name: currentUser?.modelName || '',
      brandName: selectedBrand,
    };
  }, [currentUser, brandData]);

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ModelQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  // 🔹 Load brands from query
  useEffect(() => {
    if (brandData?.data) {
      setBrandData((prev) =>
        page === 1 ? brandData?.data ?? [] : [...prev, ...(brandData?.data ?? [])]
      );
    }
  }, [brandData, page]);

  // 🔹 Load more brands on scroll
  const loadMorePages = () => {
    if (loading || (brandData && brandData?.currentPage >= brandData?.page)) return;
    setLoading(true);
    setPage((prev) => prev + 1);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const [createModel] = useCreateModelMutation();
  const [updateModel] = useUpdateModelMutation();

  const onSubmit = handleSubmit(async (data) => {
    try {
      // safely extract brandId if available
      const payload = {
        modelName: data?.name,
        brandId:
          typeof data.brandName === 'object' && data.brandName?._id
            ? data.brandName._id
            : undefined,
      };

      let res;
      if (update) {
        res = await updateModel({
          data: payload,
          modelId: currentUser?._id,
        });
      } else {
        res = await createModel({ data: payload });
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
            {/* Model Name */}
            <Field.Text name="name" label="Model Name" />

            {/* Brand Select */}
            <FormControl fullWidth>
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
                        selected
                          ? selected.brandName || selected || 'Select Brand'
                          : 'Select Brand'
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
            </FormControl>
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
