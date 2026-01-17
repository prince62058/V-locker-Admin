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
import { useGetAppInfoQuery, useUpdateAppInfoMutation } from 'src/redux/rtk/api';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { SplashScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export const AppInfoQuickEditSchema = zod.object({
  title: zod.string().optional(),
  downloadLink: zod.string().optional(),
  contactNumber: zod.number().optional(),
  whatsaapContact: zod.number().optional(),
  description: zod.string().optional(),
});

const AppInfoPage = () => {
  const { data: appInfoData, isLoading } = useGetAppInfoQuery();
  const [updateAppInfo] = useUpdateAppInfoMutation();

  const defaultValues = useMemo(
    () => ({
      title: appInfoData?.data?.title || '',
      downloadLink: appInfoData?.data?.downloadLink || '',
      contactNumber: Number(appInfoData?.data?.contactNumber) || '',
      whatsaapContact: Number(appInfoData?.data?.whatsaapContact) || '',
      description: appInfoData?.data?.description || '',
    }),
    [appInfoData]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(AppInfoQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (appInfoData) {
      reset(defaultValues);
    }
  }, [appInfoData, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateAppInfo({
        data: {
          title: data.title,
          contactNumber: data.contactNumber,
          whatsaapContact: data.whatsaapContact,
          downloadLink: data.downloadLink,
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
        heading="AppInfo Details"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'AppInnfo' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2 }}>
              <Field.Text name="title" label="Title" />
            </Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Update
              </LoadingButton>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field.Text name="contactNumber" label="Contact Number" type="number" />
            </Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Update
              </LoadingButton>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field.Text name="whatsaapContact" label="whatsaap Contact Number" type="number" />
            </Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Update
              </LoadingButton>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field.Text name="downloadLink" label="Download lInk" />
            </Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Update
              </LoadingButton>
            </Box>
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

export default AppInfoPage;
