import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import React, { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetAllGamesRulesQuery, useUpdateGameRulesMutation } from 'src/redux/rtk/api';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { SplashScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export const GameRuleQuickEditSchema = zod.object({
  minAmount: zod.number().optional(),
  maxAmount: zod.number().optional(),
  jodiPercent: zod.number().optional(),
  crossingPercent: zod.number().optional(),
  harufPercent: zod.number().optional(),
});

const GameRulePage = () => {
  const { data: gameRuleData, isLoading } = useGetAllGamesRulesQuery();
  const [updateGameRule] = useUpdateGameRulesMutation();

  const defaultValues = useMemo(
    () => ({
      minAmount: gameRuleData?.data?.minAmount || '',
      maxAmount: gameRuleData?.data?.maxAmount || '',
      jodiPercent: gameRuleData?.data?.jodiPercent || '',
      crossingPercent: gameRuleData?.data?.crossingPercent || '',
      harufPercent: gameRuleData?.data?.harufPercent || '',
    }),
    [gameRuleData]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(GameRuleQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (gameRuleData) {
      reset(defaultValues);
    }
  }, [gameRuleData, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateGameRule({
        data: {
          minAmount: data?.minAmount,
          maxAmount: data?.maxAmount,
          jodiPercent: data?.jodiPercent,
          crossingPercent: data?.crossingPercent,
          harufPercent: data?.harufPercent,
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
        heading="Game Rules Details"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Game Rules' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2 }}>
              <Field.Text name="minAmount" label="Min Amount" type="number" />
            </Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Update
              </LoadingButton>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2 }}>
              <Field.Text name="maxAmount" label="Max Amount" type="number" />
            </Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Update
              </LoadingButton>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2 }}>
              <Field.Text name="jodiPercent" label="Jodi Percent" type="number" />
            </Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Update
              </LoadingButton>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2 }}>
              <Field.Text name="crossingPercent" label="Crossing Percent" type="number" />
            </Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Update
              </LoadingButton>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2 }}>
              <Field.Text name="harufPercent" label="Haruf Percent" type="number" />
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

export default GameRulePage;
