import { useState } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PhonelinkLockIcon from '@mui/icons-material/PhonelinkLock';
import PhonelinkEraseIcon from '@mui/icons-material/PhonelinkErase';
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetDashboardGraphsQuery } from 'src/redux/rtk/api';

import { SplashScreen } from 'src/components/loading-screen';

import { EcommerceYearlySales } from '../ecommerce-yearly-sales';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [select, setSelect] = useState(`${currentYear}`);

  const { data: Graphs, isLoading } = useGetDashboardGraphsQuery({ year: select });
  const values = Graphs ? Graphs?.data?.monthlyUserRegistrations : [];

  return isLoading && !Graphs ? (
    <SplashScreen />
  ) : (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back in V-Locker Panel 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            // style={{ cursor: 'pointer' }}
            title="Total Pending Loans"
            // percent={-0.1}
            total={Graphs?.data?.totalPendingLoans}
            color="primary"
            icon={<ReceiptLongIcon sx={{ fontSize: 40 }} />}
            chart={{
              categories: [],
              series: [],
            }}
            // onClick={() => router.push('/dashboard/transaction')}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            // style={{ cursor: 'pointer' }}
            title="Total Approved Loans"
            // percent={2.6}
            color="secondary"
            total={Graphs?.data?.totalApprovedLoans}
            icon={<ReceiptIcon sx={{ fontSize: 40 }} />}
            chart={{
              categories: [],
              series: [],
            }}
            // onClick={() => router.push('/dashboard/transaction')}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            // style={{ cursor: 'pointer' }}
            title="Total Rejected Loans"
            // percent={2.8}
            total={Graphs?.data?.totalRejectedLoans}
            color="warning"
            icon={<ThumbDownOffAltIcon sx={{ fontSize: 40 }} />}
            chart={{
              categories: [],
              series: [],
            }}
            // onClick={() => router.push('/dashboard/withdraw')}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            // style={{ cursor: 'pointer' }}
            title="Total Locked Devices"
            // percent={3.6}
            total={Graphs?.data?.totalLockedDevices}
            color="error"
            icon={<PhonelinkLockIcon sx={{ fontSize: 40 }} />}
            chart={{
              categories: [],
              series: [],
            }}
            // onClick={() => router.push('/dashboard/withdraw')}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            // style={{ cursor: 'pointer' }}
            title="Total Enrolled Devices"
            // percent={3.6}
            total={Graphs?.data?.totalEnrolledDevices}
            color="error"
            icon={<PhonelinkSetupIcon sx={{ fontSize: 40 }} />}
            chart={{
              categories: [],
              series: [],
            }}
            // onClick={() => router.push('/dashboard/withdraw')}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            // style={{ cursor: 'pointer' }}
            title="Total Deactivated Devices"
            // percent={3.6}
            total={Graphs?.data?.totalDeactivatedDevices}
            color="error"
            icon={<PhonelinkEraseIcon sx={{ fontSize: 40 }} />}
            chart={{
              categories: [],
              series: [],
            }}
            // onClick={() => router.push('/dashboard/withdraw')}
          />
        </Grid>
        <Grid xs={12} md={8} lg={8}>
          <EcommerceYearlySales
            title="Yearly Users"
            // subheader="(+43%) than last year"
            totalLeads={Graphs?.leadCount}
            onEdit={setSelect}
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  name: `${currentYear - 2}`,
                  data: [
                    {
                      name: 'Total Users',
                      data: values,
                    },
                  ],
                },
                {
                  name: `${currentYear - 1}`,
                  data: [
                    {
                      name: 'Total Users',
                      data: values,
                    },
                  ],
                },
                {
                  name: `${currentYear}`,
                  data: [
                    {
                      name: 'Total Users',
                      data: values,
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={4} lg={4}>
          <AnalyticsCurrentVisits
            title="Users Total Count"
            chart={{
              series: [
                { label: 'Total Users', value: Graphs?.data?.totalUsers || 1 },
                { label: 'No. of Disabled', value: Graphs?.data?.totalDisabledUsers || 1 },
                {
                  label: 'No. of Active Users',
                  value: Graphs?.data?.totalActiveUsers || 1,
                },
              ],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
