import React from 'react';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Grid, Chip, Stack } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetGameDetailsQuery } from 'src/redux/rtk/api';

import { SplashScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const CityDetailsPage = () => {
  const { id } = useParams(); // get id from the route
  const location = useLocation();
  const { data: gamedetails, isLoading } = useGetGameDetailsQuery({ gameId: id }); // get the data from the API

  return isLoading && !gamedetails ? (
    <SplashScreen />
  ) : (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Game Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Game list', href: paths.dashboard.games.list },
          { name: 'Game Details' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box>
        <Stack sx={{ typography: 'body2' }}>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={8}>
              <Card elevation={4} sx={{ p: 4, borderRadius: 2, bgcolor: '#f9f9f9' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Name:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {gamedetails?.data?.name ?? '-'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 2 }}>
                    Description:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {gamedetails?.data?.description ?? '-'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 2 }}>
                    Opening Time:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {gamedetails?.data?.gameOpenTime ?? '-'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 2 }}>
                    Closing Time:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {gamedetails?.data?.gameClosingTime ?? '-'}
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Disable:
                    </Typography>
                    {gamedetails?.isInstaAdEnabled ? (
                      <Chip label="True" variant="outlined" color="primary" />
                    ) : (
                      <Chip label="False" variant="outlined" color="error" />
                    )}
                    {/* color={adsdetails?.isInstaAdEnabled ? 'success' : 'error'}
                    variant="outlined"
                  /> */}
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </DashboardContent>
  );
};

export default CityDetailsPage;
