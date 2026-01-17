import { useRef, useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

// import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

// import { uuidv4 } from 'src/utils/uuidv4';
// import { fSub, today } from 'src/utils/format-time';

// import { createConversation } from 'src/actions/chat';

import { Iconify } from 'src/components/iconify';

import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function ChatMessageInput({
  disabled,
  recipients,
  onAddRecipients,
  selectedConversationId,
  selectThread,
  sendMessage,
}) {
  const router = useRouter();

  const { user } = useMockedUser();

  const fileRef = useRef(null);

  const [input, setInput] = useState('');

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleChangeMessage = useCallback((event) => {
    setInput(event.target.value);
  }, []);

  const handleSendMessage = (event) => {
    if (event.key === 'Enter' && input.trim() !== '') {
      sendMessage({
        threadId: selectThread?._id,
        adminId: selectThread?.adminId?._id,
        userId: selectThread?.userId?._id,
        message: input,
        type: selectThread?.adminId?.userType,
      });
      setInput('');
    }
  };

  return (
    <>
      <InputBase
        name="chat-message"
        id="chat-message-input"
        value={input}
        onKeyDown={handleSendMessage}
        onChange={handleChangeMessage}
        placeholder="Type a message"
        // disabled={disabled}
        // startAdornment={
        //   <IconButton>
        //     <Iconify icon="eva:smiling-face-fill" />
        //   </IconButton>
        // }
        endAdornment={
          <Stack direction="row" sx={{ flexShrink: 0 }}>
            <IconButton onClick={handleAttach}>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>
            {/* <IconButton onClick={handleAttach}>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>
            <IconButton>
              <Iconify icon="solar:microphone-bold" />
            </IconButton> */}
          </Stack>
        }
        sx={{
          px: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      />

      <input type="file" ref={fileRef} style={{ display: 'none' }} />
    </>
  );
}
