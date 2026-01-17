import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// import Avatar from '@mui/material/Avatar';
// import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';

// import { Iconify } from 'src/components/iconify';

import { useMockedUser } from 'src/auth/hooks';

import { useMessage } from './hooks/use-message';

// ----------------------------------------------------------------------

export function ChatMessageItem({ message, participants, onOpenLightbox, selectThread }) {
  const { user } = useMockedUser();
  // console.log(message, 'message');

  const { me, senderDetails, hasImage } = useMessage({
    message,
    participants,
    currentUserId: `${user?.id}`,
  });

  const { firstName, avatarUrl } = senderDetails;

  const { message: body, createdAt } = message;

  const renderInfo = (
    <Typography
      noWrap
      variant="caption"
      sx={{ mb: 1, color: 'text.disabled', ...(!me && { mr: 'auto' }) }}
    >
      {/* {message?.type === 'USER' && `${selectThread?.userId?.userName}, `} */}

      {fToNow(createdAt)}
    </Typography>
  );

  const renderBody = (
    <Stack
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 1,
        typography: 'body2',
        bgcolor: 'background.neutral',
        ...(message?.type !== 'USER'
          ? { color: 'black', bgcolor: 'grey.200' }
          : { color: 'black', bgcolor: 'primary.light' }),
        ...(hasImage && { p: 0, bgcolor: 'transparent' }),
      }}
    >
      {hasImage ? (
        <Box
          component="img"
          alt="attachment"
          src={body}
          onClick={() => onOpenLightbox(body)}
          sx={{
            width: 400,
            height: 'auto',
            borderRadius: 1.5,
            cursor: 'pointer',
            objectFit: 'cover',
            aspectRatio: '16/11',
            '&:hover': { opacity: 0.9 },
          }}
        />
      ) : (
        body
      )}
    </Stack>
  );

  // const renderActions = (
  //   <Stack
  //     direction="row"
  //     className="message-actions"
  //     sx={{
  //       pt: 0.5,
  //       left: 0,
  //       opacity: 0,
  //       top: '100%',
  //       position: 'absolute',
  //       transition: (theme) =>
  //         theme.transitions.create(['opacity'], { duration: theme.transitions.duration.shorter }),
  //       ...(me && { right: 0, left: 'unset' }),
  //     }}
  //   >
  //     <IconButton size="small">
  //       <Iconify icon="solar:reply-bold" width={16} />
  //     </IconButton>

  //     <IconButton size="small">
  //       <Iconify icon="eva:smiling-face-fill" width={16} />
  //     </IconButton>

  //     <IconButton size="small">
  //       <Iconify icon="solar:trash-bin-trash-bold" width={16} />
  //     </IconButton>
  //   </Stack>
  // );

  return (
    <Stack
      direction="row"
      justifyContent={message?.type !== 'USER' ? 'flex-end' : 'unset'}
      sx={{ mb: 5 }}
    >
      {/* {message?.type === 'USER' && (
        <Avatar
          alt={selectThread?.userId?.userName}
          src={`${import.meta.env.VITE_APP_BASE_URL}/${selectThread?.userId?.image}`}
          sx={{ width: 32, height: 32, mr: 2 }}
        />
      )} */}

      <Stack alignItems={message?.type === 'USER' ? 'flex-start' : 'flex-end'}>
        {/* {renderInfo} */}

        <Stack
          direction="row"
          alignItems="center"
          sx={{ position: 'relative', '&:hover': { '& .message-actions': { opacity: 1 } } }}
        >
          {renderBody}
          {/* {renderActions} */}
        </Stack>
        {renderInfo}
      </Stack>
    </Stack>
  );
}
