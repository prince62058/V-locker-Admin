import { z as zod } from 'zod';
import React, { useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { fData } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetQrCodeQuery, useUpdateQrCodeMutation } from 'src/redux/rtk/api';

import { toast } from 'src/components/snackbar';
import { SplashScreen } from 'src/components/loading-screen';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export const QrCodeQuickEditSchema = zod.object({
  qrCode: schemaHelper.file().optional(),
  upiId: zod.string().optional(),
});

const QrCodePage = () => {
  const { data: qrCodeData, isLoading } = useGetQrCodeQuery();
  const [updateQrCode] = useUpdateQrCodeMutation();

  const defaultValues = useMemo(
    () => ({
      qrCode:
        qrCodeData?.data?.qrCode &&
        qrCodeData?.data?.qrCode.includes(`${import.meta.env.VITE_APP_BASE_URL}`)
          ? qrCodeData?.data?.qrCode
          : `${import.meta.env.VITE_APP_BASE_URL}/${qrCodeData?.data?.qrCode || ''}`,
      upiId: qrCodeData?.data?.upiId || '',
    }),
    [qrCodeData]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(QrCodeQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (qrCodeData) {
      reset(defaultValues);
    }
  }, [qrCodeData, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      if (typeof data.qrCode === 'object') {
        formData.append('qrCode', data.qrCode);
      }
      if (data.upiId) {
        formData.append('upiId', data.upiId);
      }

      const res = await updateQrCode({
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
        heading="QR Code Details"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'QR Code' }]}
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
                  name="qrCode"
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
                          Allowed QR Code image only
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
              <Field.Text name="upiId" label="UPI ID" />
            </Box>
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

export default QrCodePage;
