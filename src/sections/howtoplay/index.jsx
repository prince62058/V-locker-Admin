import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import React, { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetHowtoplayQuery, useUpdateHowroplayMutation } from 'src/redux/rtk/api';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { SplashScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export const HowToPlayQuickEditSchema = zod.object({
  description: zod.string().optional(),
});

const HowtoplayPage = () => {
  const { data: howToPlayData, isLoading } = useGetHowtoplayQuery();
  const [updateHowtoplay] = useUpdateHowroplayMutation();

  const defaultValues = useMemo(
    () => ({
      description: howToPlayData?.data?.description || '',
    }),
    [howToPlayData]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(HowToPlayQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (howToPlayData) {
      reset(defaultValues);
    }
  }, [howToPlayData, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateHowtoplay({
        data: {
          description: data.description,
        },
      });
      if (res?.data?.success) {
        reset();
        toast.success(res?.data?.message);
      } else {
        toast.error(res?.error?.data?.message);
      }
    } catch (error) {
      console.error(error);
    }
  });

  return isLoading ? (
    <SplashScreen />
  ) : (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="How To Play Details"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'How to play' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Stack spacing={1.5} m={2}>
              <Typography variant="subtitle2">Description</Typography>
              <Field.Editor name="description" sx={{ maxHeight: 480 }} />
            </Stack>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Update
              </LoadingButton>
            </Box>
          </Box>
        </Form>
      </Box>
    </DashboardContent>
  );
};

export default HowtoplayPage;
