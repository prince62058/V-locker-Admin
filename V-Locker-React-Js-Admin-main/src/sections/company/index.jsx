import { z as zod } from 'zod';
import React, { useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { fData } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetCompanyQuery, useUpdateCompanyMutation } from 'src/redux/rtk/api';

import { toast } from 'src/components/snackbar';
import { SplashScreen } from 'src/components/loading-screen';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export const CompanyQuickEditSchema = zod.object({
  logo: schemaHelper.file().optional(),
  favIcon: schemaHelper.file().optional(),
  companyName: zod.string().optional(),
  supportEmail: zod.string().optional(),
  website: zod.string().optional(),
  // timings: zod.number().optional(),
  whatsappNumber: zod.number().optional(),
  address: zod.string().optional(),
  contactNumber: zod.number().optional(),
  termsAndCondition: zod.string().optional(),
  privacyPolicy: zod.string().optional(),
  aboutUs: zod.string().optional(),
  helpAndSupport: zod.string().optional(),
});

const CompanyPage = () => {
  const { data: companyData, isLoading } = useGetCompanyQuery();
  const [updateCompany] = useUpdateCompanyMutation();

  const defaultValues = useMemo(
    () => ({
      logo: companyData?.data?.logo?.includes(`${import.meta.env.VITE_APP_BASE_URL}`)
        ? companyData?.data?.logo
        : `${import.meta.env.VITE_APP_BASE_URL}/${companyData?.data?.icon}` || '',
      favIcon: companyData?.data?.favIcon?.includes(`${import.meta.env.VITE_APP_BASE_URL}`)
        ? companyData?.data?.favIcon
        : `${import.meta.env.VITE_APP_BASE_URL}/${companyData?.data?.favIcon}` || '',
      companyName: companyData?.data?.companyName || '',
      supportEmail: companyData?.data?.supportEmail || '',
      website: companyData?.data?.website || '',
      // timings: Number(companyData?.data?.timings) || '',
      whatsappNumber: Number(companyData?.data?.whatsappNumber) || '',
      address: companyData?.data?.address || '',
      contactNumber: Number(companyData?.data?.contactNumber) || '',
      termsAndCondition: companyData?.data?.termsAndCondition || '',
      privacyPolicy: companyData?.data?.privacyPolicy || '',
      aboutUs: companyData?.data?.aboutUs || '',
      helpAndSupport: companyData?.data?.helpAndSupport || '',
    }),
    [companyData]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(CompanyQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (companyData) {
      reset(defaultValues);
    }
  }, [companyData, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === 'logo' && value instanceof File) {
          formData.append(key, value);
        } else if (key === 'favIcon' && value instanceof File) {
          formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const res = await updateCompany({
        data: formData,
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
        heading="Company Details"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Company' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
              <Box
                sx={{
                  mb: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Controller
                  name="logo"
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
                          Allowed icon 150 X 150 only
                          <br /> max size of {fData(3145728)}
                        </Typography>
                      }
                    />
                  )}
                />
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Update
                  </LoadingButton>
                </Box>
              </Box>
              <Box
                sx={{
                  mb: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Controller
                  name="favIcon"
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
                          Allowed favicon 150 X 150 only
                          <br /> max size of {fData(3145728)}
                        </Typography>
                      }
                    />
                  )}
                />
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Update
                  </LoadingButton>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field.Text name="website" label="Website" />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field.Text name="companyName" label="Company Name" />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field.Text name="supportEmail" label="Support Email" />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field.Text name="address" label="Address" />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field.Text name="contactNumber" label="Contact Number" type="number" />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Field.Text name="whatsappNumber" label="Whatsapp Number" type="number" />
            </Box>
            {/* <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Update
              </LoadingButton>
            </Box> */}
            {/* <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Update
              </LoadingButton>
            </Box> */}
            {/* <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Update
              </LoadingButton>
            </Box> */}
            {/* <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Update
              </LoadingButton>
            </Box> */}
            {/* <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Update
              </LoadingButton>
            </Box> */}
            <Stack spacing={1.5} m={2}>
              <Typography variant="subtitle2">Terms And Conditions</Typography>
              <Field.Editor name="termsAndCondition" sx={{ maxHeight: 480 }} />
            </Stack>
            {/* <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Update
              </LoadingButton>
            </Box> */}
            <Stack spacing={1.5} m={2}>
              <Typography variant="subtitle2">Privacy Policy</Typography>
              <Field.Editor name="privacyPolicy" sx={{ maxHeight: 480 }} />
            </Stack>
            <Stack spacing={1.5} m={2}>
              <Typography variant="subtitle2">About Us</Typography>
              <Field.Editor name="aboutUs" sx={{ maxHeight: 480 }} />
            </Stack>
            {/* <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Update
              </LoadingButton>
            </Box> */}
            <Stack spacing={1.5} m={2}>
              <Typography variant="subtitle2">Help And Support</Typography>
              <Field.Editor name="helpAndSupport" sx={{ maxHeight: 480 }} />
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

export default CompanyPage;
