import React from 'react';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Grid, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetBettingGameDetailsQuery } from 'src/redux/rtk/api';

import { SplashScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const GameDetailsPage = () => {
  const { id } = useParams(); // get id from the route
  const location = useLocation();
  const { data: gamedetails, isLoading } = useGetBettingGameDetailsQuery({ gameId: id }); // get the data from the API

  return isLoading && !gamedetails ? (
    <SplashScreen />
  ) : (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Betting Game Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Betting Game list', href: paths.dashboard.bettingGame.list },
          { name: 'Betting Game Details' },
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
                    Game Type:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {gamedetails?.data?.type ?? '-'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Game Name:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {gamedetails?.data?.battingGameID?.name ?? '-'}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    mb: 2,
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 2, mb: 2 }}>
                    {gamedetails?.data?.type ?? '-'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2, width: '100%' }}>
                    {gamedetails?.data?.jodi &&
                      gamedetails?.data?.jodi?.length > 0 &&
                      gamedetails?.data?.jodi?.map((ele, i) => (
                        <Box
                          sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}
                          key={i}
                        >
                          <Typography variant="body1" color="text.secondary">
                            Jodi no. :- {ele?.jodiNum}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Price :- {ele?.price}
                          </Typography>
                          <Typography
                            variant="body1"
                            color={
                              (ele?.status === 'PENDING' && 'blue') ||
                              (ele?.status === 'LOST' && 'red') ||
                              (ele?.status === 'WON' && 'green')
                            }
                          >
                            {ele?.status === 'PENDING' ? null : `${ele?.status} =`}
                            {ele?.status === 'PENDING'
                              ? 'No Result'
                              : ele?.status === 'LOST'
                                ? `- ${ele?.price}`
                                : `+ ${ele?.winnigAmount}`}
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2, width: '100%' }}>
                    {gamedetails?.data?.Crossing &&
                      gamedetails?.data?.Crossing?.length > 0 &&
                      gamedetails?.data?.Crossing?.map((ele, i) => (
                        <Box
                          sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}
                          key={i}
                        >
                          <Typography variant="body1" color="text.secondary">
                            Crossing no. :- {ele?.crossingNum}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Amount :- {ele?.crossingAmount}
                          </Typography>
                          <Typography
                            variant="body1"
                            color={
                              (ele?.status === 'PENDING' && 'blue') ||
                              (ele?.status === 'LOST' && 'red') ||
                              (ele?.status === 'WON' && 'green')
                            }
                          >
                            {ele?.status === 'PENDING' ? null : `${ele?.status} =`}
                            {ele?.status === 'PENDING'
                              ? 'No Result'
                              : ele?.status === 'LOST'
                                ? `- ${ele?.crossingAmount}`
                                : `+ ${ele?.winnigAmount}`}
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                  {gamedetails?.data?.type === 'HARUF' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2, width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography>Andar Game</Typography>

                          {gamedetails?.data?.haruf &&
                            gamedetails?.data?.haruf?.length > 0 &&
                            gamedetails?.data?.haruf?.at(0)?.andarGame.map((ele, i) => (
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-evenly',
                                  width: '100%',
                                }}
                                key={i}
                              >
                                <Typography variant="body1" color="text.secondary">
                                  Game :- {ele?.game}, Amount :- {ele?.harufAmount},{' '}
                                  <span
                                    style={{
                                      color:
                                        (ele?.status === 'PENDING' && 'blue') ||
                                        (ele?.status === 'LOST' && 'red') ||
                                        (ele?.status === 'WON' && 'green'),
                                    }}
                                  >
                                    {ele?.status === 'PENDING' ? null : `${ele?.status} =`}
                                    {ele?.status === 'PENDING'
                                      ? 'No Result'
                                      : ele?.status === 'LOST'
                                        ? `- ${ele?.harufAmount}`
                                        : `+ ${ele?.winnigAmount}`}
                                  </span>
                                </Typography>
                              </Box>
                            ))}
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography>Bahar Game</Typography>
                          {gamedetails?.data?.haruf &&
                            gamedetails?.data?.haruf?.length > 0 &&
                            gamedetails?.data?.haruf?.at(0)?.baharGame.map((ele, i) => (
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-evenly',
                                  width: '100%',
                                }}
                                key={i}
                              >
                                <Typography variant="body1" color="text.secondary">
                                  Game :- {ele?.game}, Amount :- {ele?.harufAmount},{' '}
                                  <span
                                    style={{
                                      color:
                                        (ele?.status === 'PENDING' && 'blue') ||
                                        (ele?.status === 'LOST' && 'red') ||
                                        (ele?.status === 'WON' && 'green'),
                                    }}
                                  >
                                    {ele?.status === 'PENDING' ? null : `${ele?.status} =`} {}
                                    {ele?.status === 'PENDING'
                                      ? 'No Result'
                                      : ele?.status === 'LOST'
                                        ? `- ${ele?.harufAmount}`
                                        : `+ ${ele?.winnigAmount}`}
                                  </span>
                                </Typography>
                              </Box>
                            ))}
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </DashboardContent>
  );
};

export default GameDetailsPage;
