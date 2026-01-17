import { z as zod } from 'zod';
import React, { useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';
import { useUserProfileQuery, useUpdateProfileMutation } from 'src/redux/rtk/api';

import { toast } from 'src/components/snackbar';
import { SplashScreen } from 'src/components/loading-screen';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';

export const ProfileQuickEditSchema = zod.object({
  name: zod.string().optional(),
  profileUrl: schemaHelper.file().optional(),
  dateOfBirth: zod.string().optional(),
});

const ProfilePage = () => {
  const router = useRouter();
  const { checkUserSession } = useAuthContext();
  const { data: userData, isLoading } = useUserProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();

  const defaultProfileValues = useMemo(
    () => ({
      profileUrl: userData?.data?.profileUrl?.includes(`${import.meta.env.VITE_APP_BASE_URL}`)
        ? userData?.data?.profileUrl
        : `${import.meta.env.VITE_APP_BASE_URL}/${userData?.data?.profileUrl}` || '',
      name: userData?.data?.name || '',
      email: userData?.data?.email || '',
      role: userData?.data?.role || '',
      dateOfBirth: userData?.data?.dateOfBirth || '',
    }),
    [userData]
  );

  const methodsProfile = useForm({
    mode: 'all',
    resolver: zodResolver(ProfileQuickEditSchema),
    defaultProfileValues,
  });

  const {
    reset: resets,
    handleSubmit: handleSubmitProfile,
    formState: { isSubmitting: isSubmit },
  } = methodsProfile;

  useEffect(() => {
    if (userData) {
      resets(defaultProfileValues);
    }
  }, [userData, resets, defaultProfileValues]);

  const onSubmitProfile = handleSubmitProfile(async (data) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === 'profileUrl' && value instanceof File) {
          formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const res = await updateProfile({
        data: formData,
      });
      if (res?.data?.success) {
        // sessionStorage.setItem('jwt_access_token', JSON.stringify(res?.data?.data));
        await checkUserSession?.();
        resets();
        toast.success(res?.data?.message);
        // window.location.reload();
        router.refresh();
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
        heading="Admin Profile Details"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Profile Section' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Form methods={methodsProfile} onSubmit={onSubmitProfile}>
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
                  name="profileUrl"
                  control={methodsProfile.control}
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
                          Allowed User image only
                          <br /> max size of {fData(3145728)}
                        </Typography>
                      }
                    />
                  )}
                />
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmit}>
                    Update
                  </LoadingButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </Form>

        <Form methods={methodsProfile} onSubmit={onSubmitProfile}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2 }}>
              <Field.Text name="name" label="Name" />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2 }}>
              <Field.Text name="email" label="Email" disabled />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2 }}>
              <Field.Text name="role" label="Role" disabled />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2 }}>
              <Field.Text
                name="dateOfBirth"
                label="D.O.B"
                type="date"
                inputProps={{ 
                  max: new Date().toISOString().slice(0, 10),
                  value: userData?.data?.dateOfBirth ? new Date(userData.data.dateOfBirth).toISOString().slice(0, 10) : ''
                }}
              />
            </Box>
          </Box>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmit}>
              Update
            </LoadingButton>
          </Box>
        </Form>
      </Box>
    </DashboardContent>
  );
};

export default ProfilePage;
