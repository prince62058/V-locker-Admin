import { z as zod } from 'zod';
import { useMemo, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { fData } from 'src/utils/format-number';

import {
  useUpdateInstallatioVideoMutation,
  useCreateInstallationVideoMutation,
} from 'src/redux/rtk/api';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const GuideVideoQuickEditSchema = zod.object({
  thumbnail: schemaHelper.file({
    message: { required_error: 'Thumbnail is required!' },
  }),
  channelImage: schemaHelper.file({
    message: { required_error: 'Channel Image is required!' },
  }),
  video: schemaHelper.file({
    message: { required_error: 'Video is required!' },
  }),
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  channelName: zod.string().min(1, { message: 'Channel Name is required!' }),
  youtubeLink: zod.string().min(1, { message: 'Youtube Link is required!' }),
});

// ----------------------------------------------------------------------

export function GuideVideoQuickEditForm({ currentUser, open, onClose, update }) {
  const [videoPreview, setVideoPreview] = useState(null);
  const [createGuide] = useCreateInstallationVideoMutation();
  const [updateGuide] = useUpdateInstallatioVideoMutation();

  const defaultValues = useMemo(
    () => ({
      thumbnail: currentUser?.thumbnail || '',
      channelImage: currentUser?.channelImage || '',
      video: currentUser?.videoPath || '',
      title: currentUser?.title || '',
      description: currentUser?.description || '',
      channelName: currentUser?.channelName || '',
      youtubeLink: currentUser?.youtubeLink || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(GuideVideoQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      Object.entries(data || {}).forEach(([key, value]) => {
        if (key === 'thumbnail' && value instanceof File) {
          formData.append(key, value);
        } else if (key === 'channelImage' && value instanceof File) {
          formData.append(key, value);
        } else if (key === 'video' && value instanceof File) {
          formData.append(key, value);
        } else if (
          value !== null &&
          value !== undefined &&
          key === 'thumbnail' &&
          key === 'channelImage' &&
          key === 'video'
        ) {
          formData.append(key, value);
        }
      });

      if (update) {
        const res = await updateGuide({
          data: formData,
          videoId: currentUser._id,
        });
        reset();
        onClose();
        if (res?.data?.success) {
          toast.success(res?.data?.message);
        } else {
          toast.error(res?.error?.data?.message);
        }
      } else {
        const res = await createGuide({
          data: formData,
        });
        reset();
        onClose();
        if (res?.data?.success) {
          toast.success(res?.data?.message);
        } else {
          toast.error(res?.error?.data?.message);
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  // extract watched video value so the dependency array is a simple variable
  const videoFile = watch('video');

  useEffect(() => {
    const file = videoFile;

    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setVideoPreview(url);

      return () => URL.revokeObjectURL(url); // cleanup
    }

    setVideoPreview(null);
    return undefined;
  }, [videoFile]);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{update ? 'Update ' : 'New '}Guide Video</DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2 }}>
              <Controller
                name="thumbnail"
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
                        Allowed thumbnail 150 X 150 only
                        <br /> max size of {fData(3145728)}
                      </Typography>
                    }
                  />
                )}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Controller
                name="channelImage"
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
                        Allowed channel image 150 X 150 only
                        <br /> max size of {fData(3145728)}
                      </Typography>
                    }
                  />
                )}
              />
            </Box>

            {/* Video upload UI */}
            <Box sx={{ mb: 2 }}>
              <Controller
                name="video"
                control={methods.control}
                render={({ field }) => {
                  const file = field.value || null;

                  return (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, mx: 'auto', textAlign: 'center' }}
                      >
                        Upload Video
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          width: '100%',
                          flexDirection: 'column',

                          mx: 'auto',
                          textAlign: 'center',
                        }}
                      >
                        <label
                          htmlFor="video-upload-input"
                          style={{
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                        >
                          <input
                            id="video-upload-input"
                            type="file"
                            accept="video/*"
                            aria-label="Upload video file"
                            style={{
                              position: 'absolute',
                              width: 1,
                              height: 1,
                              padding: 0,
                              margin: -1,
                              overflow: 'hidden',
                              clip: 'rect(0, 0, 0, 0)',
                              whiteSpace: 'nowrap',
                              border: 0,
                            }}
                            onChange={(e) => {
                              const f = e.target.files?.[0] ?? null;
                              field.onChange(f);
                            }}
                          />
                          <Button variant="outlined" component="span">
                            Choose Video
                          </Button>
                        </label>

                        {file && (
                          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                            {file.name} — {fData(file.size)}
                          </Typography>
                        )}

                        {/* {file && (
                          <Button variant="text" color="error" onClick={() => field.onChange(null)}>
                            Remove
                          </Button>
                        )} */}
                      </Box>

                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          color: 'text.disabled',
                          mt: 1,
                          mx: 'auto',
                          textAlign: 'center',
                        }}
                      >
                        Accepts video files only.
                      </Typography>

                      {videoPreview && (
                        <Box mt={2} sx={{ borderRadius: 1, overflow: 'hidden' }}>
                          <video key={videoPreview} controls width="100%" src={videoPreview}>
                            <track kind="captions" srcLang="en" label="English captions" src="" />
                          </video>
                        </Box>
                      )}
                    </Box>
                  );
                }}
              />
            </Box>

            <Box sx={{ px: '5rem' }}>
              <Field.Text name="title" label="Title" />
            </Box>

            <Box mt={3} sx={{ px: '5rem' }}>
              <Field.Text name="description" label="Description" multiline rows={3} />
            </Box>
            <Box mt={3} sx={{ px: '5rem' }}>
              <Field.Text name="channelName" label="Channel Name" />
            </Box>
            <Box mt={3} sx={{ px: '5rem' }}>
              <Field.Text name="youtubeLink" label="Youtube Link" />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Send
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
