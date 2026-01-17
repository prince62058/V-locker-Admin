// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// import required modules
import { Navigation } from 'swiper/modules';
import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

import Box from '@mui/material/Box';
import { Modal, Button } from '@mui/material';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetBannerQuery, useUpdateBannerMutation } from 'src/redux/rtk/api';

import { toast } from 'src/components/snackbar';
import { SplashScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const BannerPage = () => {
  const { data: bannerData, isLoading } = useGetBannerQuery();
  const [updateBanner] = useUpdateBannerMutation();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [image, setImage] = useState(null);
  const [banner, setBanner] = useState(null);
  const [bannerTwo, setBannerTwo] = useState(null);
  const [index, setIndex] = useState(0);
  const [addBanner, setAddBanner] = useState(false);
  const [removeBanner, setRemoveBanner] = useState(false);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click
    }
  };

  const handleButtonClickTwo = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBanner(file); // Update banner state with selected file
    }
  };

  const handleFileChangeTwo = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBannerTwo(file); // Update banner state with selected file
    }
  };

  const handleButtonImageClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click(); // Trigger the file input click
    }
  };

  const handleFileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // Update banner state with selected file
    }
  };

  const onSubmit = async () => {
    try {
      const formData = new FormData();
      if (banner) {
        formData.append('gameBanner', banner);
      }
      if (bannerTwo) {
        formData.append('game2Banner', bannerTwo);
      }
      if (image) {
        formData.append('banner', image);
      }
      if (image && addBanner === false) {
        formData.append('index', index);
      }
      if (!image && addBanner === false && !banner && !bannerTwo) {
        formData.append('remove', 'remove');
        formData.append('index', index);
      }

      const res = await updateBanner({
        data: formData,
      });
      if (res?.data?.success) {
        toast.success(res?.data?.message);
      } else {
        toast.error(res?.error?.data?.message);
      }
    } catch (error) {
      console.error(error);
    }
    setImage(null);
    setBanner(null);
    setBannerTwo(null);
    setRemoveBanner(false);
    setAddBanner(false);
    handleClose();
  };

  return isLoading ? (
    <SplashScreen />
  ) : (
    <DashboardContent>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '100%', md: '50%' },
            bgcolor: 'background.paper',
            border: '1px solid #000',
            boxShadow: 24,
            borderRadius: 2,
            py: '2rem',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              width: '100%',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
              <Box
                sx={{
                  mb: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={imageInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileImageChange}
                />
                {removeBanner ? null : (
                  <Button variant="contained" onClick={handleButtonImageClick}>
                    Select Image
                  </Button>
                )}
                {image ? (
                  <Box
                    sx={{
                      width: '5rem',
                      height: '5rem',
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Select Banner"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: '5rem',
                      height: '5rem',
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={`${import.meta.env.VITE_APP_BASE_URL}/${bannerData?.data?.banner?.at(index)}`}
                      alt="Select Banner"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </Box>
                )}
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" variant="contained" onClick={onSubmit}>
                    {removeBanner ? 'Remove' : addBanner ? 'Add' : 'Update'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
      <CustomBreadcrumbs
        heading="Banner Section Details"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Banner Section' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box sx={{ mb: 5 }}>
        <Swiper
          navigation
          modules={[Navigation]}
          style={{ width: '100%', height: '25rem', position: 'relative' }}
        >
          {bannerData?.data?.banner?.map((ele, i) => (
            <SwiperSlide
              key={i}
              style={{
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '1rem',
                overflow: 'hidden',
                width: '100%',
                height: '100%',
              }}
            >
              <img
                src={`${import.meta.env.VITE_APP_BASE_URL}/${ele}`}
                alt="images pic"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  height: '5rem',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  width: '100%',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}
              >
                <Button
                  sx={{ color: 'primary' }}
                  variant="contained"
                  onClick={() => {
                    setRemoveBanner(true);
                    setAddBanner(false);
                    setImage(null);
                    setIndex(i);
                    handleOpen();
                  }}
                >
                  Remove Banner
                </Button>
                <Button
                  sx={{ color: 'primary' }}
                  variant="contained"
                  onClick={() => {
                    setRemoveBanner(false);
                    setIndex(i);
                    handleOpen();
                  }}
                >
                  Change Banner
                </Button>
                <Button
                  sx={{ color: 'primary' }}
                  variant="contained"
                  onClick={() => {
                    setRemoveBanner(false);
                    setAddBanner(true);
                    handleOpen();
                  }}
                >
                  Add Banner
                </Button>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      <Box sx={{ mb: 5, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Game Banner
        </Typography>
        <Box sx={{ width: '100%', height: '25rem', borderRadius: '1rem', overflow: 'hidden' }}>
          <img
            src={
              banner
                ? URL.createObjectURL(banner)
                : `${import.meta.env.VITE_APP_BASE_URL}/${bannerData?.data?.gameBanner}`
            }
            alt="banner pic"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Button variant="contained" onClick={handleButtonClick}>
                Select Game Banner
              </Button>
              {banner && (
                <Box
                  sx={{ width: '5rem', height: '5rem', borderRadius: '0.5rem', overflow: 'hidden' }}
                >
                  <img
                    src={URL.createObjectURL(banner)}
                    alt="banner"
                    style={{ width: '100%', height: '100%' }}
                  />
                </Box>
              )}
              {banner && (
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" variant="contained" onClick={onSubmit}>
                    Update
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: 5, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Game Banner Two
        </Typography>
        <Box sx={{ width: '100%', height: '25rem', borderRadius: '1rem', overflow: 'hidden' }}>
          <img
            src={
              bannerTwo
                ? URL.createObjectURL(bannerTwo)
                : `${import.meta.env.VITE_APP_BASE_URL}/${bannerData?.data?.game2Banner}`
            }
            alt="banner pic"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChangeTwo}
              />
              <Button variant="contained" onClick={handleButtonClickTwo}>
                Select Game Banner Two
              </Button>
              {bannerTwo && (
                <Box
                  sx={{ width: '5rem', height: '5rem', borderRadius: '0.5rem', overflow: 'hidden' }}
                >
                  <img
                    src={URL.createObjectURL(bannerTwo)}
                    alt="banner"
                    style={{ width: '100%', height: '100%' }}
                  />
                </Box>
              )}
              {bannerTwo && (
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" variant="contained" onClick={onSubmit}>
                    Update
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </DashboardContent>
  );
};

export default BannerPage;
