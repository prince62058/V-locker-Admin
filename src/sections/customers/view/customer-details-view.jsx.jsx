import React from 'react';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Grid, Chip, Stack, Avatar, Divider, Switch } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';

import NoPreview from 'src/assets/NoPreview.jpg';
import { DashboardContent } from 'src/layouts/dashboard';
import { useCustomerDetailQuery, useUpdateDevicePolicyMutation } from 'src/redux/rtk/api';

import { SplashScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const UserDetailsPage = () => {
  const { id } = useParams(); // get id from the route
  const location = useLocation();
  const { data: customerDetails, isLoading } = useCustomerDetailQuery({ customerId: id }); // get the data from the API
  const [updateDevicePolicy] = useUpdateDevicePolicyMutation();

  const handlePolicyChange = async (loanId, currentPolicy, newValue) => {
    try {
      const updatedPolicy = {
        ...currentPolicy,
        isDeveloperOptionsBlocked: newValue,
      };
      await updateDevicePolicy({
        loanId,
        data: updatedPolicy,
      }).unwrap();
      // Optional: Show success toast
    } catch (error) {
      console.error('Failed to update policy:', error);
      // Optional: Show error toast
    }
  };

  return isLoading && !customerDetails ? (
    <SplashScreen />
  ) : (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Customer Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Customer list', href: paths.dashboard.userManagement.customer },
          { name: 'Customer Details' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box>
        <Stack sx={{ typography: 'body2' }}>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={8}>
              <Card elevation={4} sx={{ p: 4, borderRadius: 2, bgcolor: '#f9f9f9' }}>
                <Divider sx={{ my: 2 }}>
                  <Chip label="Basic Section" />
                </Divider>
                <Box
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}
                >
                  <Avatar
                    sx={{ width: 100, height: 100 }}
                    src={customerDetails?.data?.profileUrl || NoPreview}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Name:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {customerDetails?.data?.customerName ?? '-'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 2 }}>
                    Phone:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {customerDetails?.data?.customerMobileNumber ?? '-'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 2 }}>
                    Email:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {customerDetails?.data?.email ?? '-'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 2 }}>
                    Address:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {customerDetails?.data?.address?.customerAddress ?? '-'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 2 }}>
                    State:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {customerDetails?.data?.address?.customerState ?? '-'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 2 }}>
                    City:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {customerDetails?.data?.address?.customerCity ?? '-'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 2 }}>
                    Landmark:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {customerDetails?.data?.address?.landmark ?? '-'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 2 }}>
                    Profession:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {customerDetails?.data?.address?.customerProfession ?? '-'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 2 }}>
                    Salary:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {customerDetails?.data?.address?.customerSalary ?? '-'}
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Verify:
                    </Typography>
                    {customerDetails?.isVerified ? (
                      <Chip label="Yes" variant="outlined" color="primary" />
                    ) : (
                      <Chip label="No" variant="outlined" color="error" />
                    )}
                    {/* color={adsdetails?.isInstaAdEnabled ? 'success' : 'error'}
                    variant="outlined"
                  /> */}
                  </Box>
                </Stack>
                <Divider sx={{ my: 2 }}>
                  {' '}
                  <Chip label="KYC Section" />
                </Divider>
                <Divider sx={{ my: 2 }}>
                  <Chip label="Aadhaar Card" variant="outlined" />
                </Divider>
                <Box
                  component="img"
                  src={customerDetails?.data?.kyc?.aadhaar?.frontPhoto || NoPreview}
                  alt="aadhar"
                  sx={{
                    width: '100%',
                    height: '25rem',
                    borderRadius: 2,
                    objectFit: 'fill',
                    my: 2,
                  }}
                />
                <Box
                  component="img"
                  src={customerDetails?.data?.kyc?.aadhaar?.backPhoto || NoPreview}
                  alt="aadhar"
                  sx={{
                    width: '100%',
                    height: '25rem',
                    borderRadius: 2,
                    objectFit: 'fill',
                    my: 2,
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Aadhaar No.:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {customerDetails?.data?.kyc?.aadhaar?.number || 'N/A'}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }}>
                  <Chip label="PAN Card" variant="outlined" />
                </Divider>
                <Box
                  component="img"
                  src={customerDetails?.data?.kyc?.pan?.photo || NoPreview}
                  alt="pan"
                  sx={{
                    width: '100%',
                    height: '25rem',
                    borderRadius: 2,
                    objectFit: 'fill',
                    my: 2,
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    PAN No.:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {customerDetails?.data?.kyc?.pan?.number || 'N/A'}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }}>
                  <Chip label="Bank Passbook" variant="outlined" />
                </Divider>
                <Box
                  component="img"
                  src={customerDetails?.data?.kyc?.bankPassbook?.photo || NoPreview}
                  alt="passbook"
                  sx={{
                    width: '100%',
                    height: '25rem',
                    borderRadius: 2,
                    objectFit: 'fill',
                    my: 2,
                  }}
                />
                <Divider sx={{ my: 2 }}>
                  {' '}
                  <Chip label="Loan Section" />
                </Divider>
                {customerDetails?.data?.Loan?.length > 0 &&
                  customerDetails?.data?.Loan?.map((loan, index) => (
                    <Box key={index}>
                      <Divider sx={{ my: 2 }}>
                        <Chip label={`Loan ${index + 1}`} variant="outlined" />
                      </Divider>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Loan Amount:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {loan?.loanAmount}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          EMI Amount:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {loan?.emiAmount}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Financer:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {loan?.financer}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Payment Options:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {loan?.paymentOptions}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Auto Unlock:
                        </Typography>
                        {loan?.autoUnlock ? (
                          <Chip label="Yes" variant="outlined" color="error" />
                        ) : (
                          <Chip label="No" variant="outlined" color="primary" />
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Loan Status:
                        </Typography>

                        <Chip label={loan?.loanStatus} variant="outlined" color="primary" />
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Device Unlock Status:
                        </Typography>

                        <Chip label={loan?.deviceUnlockStatus} variant="outlined" color="primary" />
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Block Developer Mode (Version):
                        </Typography>
                        <Switch
                          checked={loan?.devicePolicy?.isDeveloperOptionsBlocked ?? true}
                          onChange={(e) =>
                            handlePolicyChange(loan._id, loan?.devicePolicy, e.target.checked)
                          }
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Amount Paid:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {loan?.amountPaid}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Amount Left:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {loan?.amountLeft}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Installment Paids:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {loan?.installmentsPaid}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Installment Type:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {loan?.installationType}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Mobile Brand:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {loan?.mobileBrand}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Mobile Model:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {loan?.mobileModel}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          IMEI Number 1:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {loan?.imeiNumber1}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          IMEI Number 2:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {loan?.imeiNumber2}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Mobile Prize:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {loan?.mobilePrice}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Processing Fees:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {loan?.processingFees}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Down Payment:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {loan?.downPayment}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Frequency:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {loan?.frequency}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Number Of EMIs:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {loan?.numberOfEMIs}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Interest Rate:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {loan?.interestRate}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          EMI Start Date:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {fDate(loan?.emiStartDate)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          EMI End Date:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {fDate(loan?.emiEndDate)}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 2 }}>
                        <Chip label="Installment Section" />
                      </Divider>

                      {loan?.installments?.length > 0 &&
                        loan?.installments?.map((item, i) => (
                          <Box key={i}>
                            <Divider sx={{ my: 2 }}>
                              <Chip label={`Insatllation ${i + 1}`} variant="outlined" />
                            </Divider>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Installment No.:
                              </Typography>
                              <Typography variant="body1" color="text.secondary">
                                {item?.installmentNumber}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Amount:
                              </Typography>
                              <Typography variant="body1" color="text.secondary">
                                {item?.amount}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Paid Amount:
                              </Typography>
                              <Typography variant="body1" color="text.secondary">
                                {item?.paidAmount}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Paid Date:
                              </Typography>
                              <Typography variant="body1" color="text.secondary">
                                {fDate(item?.paidDate)}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 2,
                              }}
                            >
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Status:
                              </Typography>

                              <Chip label={item?.status} variant="outlined" color="primary" />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Payment Method:
                              </Typography>
                              <Typography variant="body1" color="text.secondary">
                                {item?.paymentMethod}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Late Fee:
                              </Typography>
                              <Typography variant="body1" color="text.secondary">
                                {item?.lateFee}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Remarks:
                              </Typography>
                              <Typography variant="body1" color="text.secondary">
                                {item?.remarks}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                    </Box>
                  ))}
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </DashboardContent>
  );
};

export default UserDetailsPage;
