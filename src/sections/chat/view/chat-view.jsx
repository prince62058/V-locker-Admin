import { io } from 'socket.io-client';
import { useState, useEffect, useCallback } from 'react';

import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetAllThreadQuery, useGetAllMessageQuery } from 'src/redux/rtk/api';
import { useGetContacts, useGetConversation, useGetConversations } from 'src/actions/chat';

import { EmptyContent } from 'src/components/empty-content';

import { useMockedUser } from 'src/auth/hooks';

import { Layout } from '../layout';
import { ChatNav } from '../chat-nav';
// import { ChatRoom } from '../chat-room';
import { ChatMessageList } from '../chat-message-list';
import { ChatMessageInput } from '../chat-message-input';
import { ChatHeaderDetail } from '../chat-header-detail';
// import { ChatHeaderCompose } from '../chat-header-compose';
import { useCollapseNav } from '../hooks/use-collapse-nav';

// ----------------------------------------------------------------------

export function ChatView() {
  const socket = io(`${import.meta.env.VITE_APP_BASE_SOCKET}`);
  const router = useRouter();

  const { user } = useMockedUser();

  const { contacts } = useGetContacts();
  const [selectThread, setSelectThread] = useState(null);
  const [totalMessage, setTotalMessage] = useState([]);
  const [searchContacts, setSearchContacts] = useState('');
  const { data: allThreads } = useGetAllThreadQuery({ search: searchContacts, page: 1 });
  const {
    data: allMessage,
    isLoading,
    refetch,
  } = useGetAllMessageQuery({
    threadId: selectThread ? selectThread?._id : allThreads?.data?.at(0)?._id,
    page: 1,
  });

  useEffect(() => {
    // Listen for messages from the server
    socket.on('connect', () => console.log('Socket Connected'));
    socket.emit('joinThread', selectThread ? selectThread?._id : allThreads?.data?.at(0)?._id);
    socket.on('receiveMessage', (data) => {
      // console.log('Message received:', data?.data);
      // setTotalMessage((prev) => Array.from(new Set([...prev, data?.data])));
      if (data?.data) {
        refetch();
      }
    });
    socket.on('disconnect', () => console.log('Socket Disconnected'));
    socket.on('error', (error) => console.error('Socket.IO Error:', error));

    return () => {
      socket.off('message'); // Cleanup on unmount
    };
  }, [allThreads?.data, selectThread, socket, refetch]);

  const sendSocketIOMessage = (data) => {
    if (socket) {
      socket.emit('sendMessage', data);
      refetch();
    } else {
      console.error('Socket.IO is not connected');
    }
  };

  const handleSelectThread = useCallback((selected) => {
    setSelectThread(selected);
  }, []);

  useEffect(() => {
    setSelectThread(allThreads?.data?.at(0));
  }, [allThreads]);

  useEffect(() => {
    if (allMessage?.data?.length > 0) {
      setTotalMessage(allMessage?.data);
    }
  }, [allMessage]);

  // useEffect(() => {
  //   if (allMessage?.data?.length > 0) {
  //     setTotalMessage((prev) => {
  //       const newPrevious = new Set([...prev, ...(allMessage?.data ?? [])]);
  //       return [...newPrevious];
  //     });
  //   }
  //   refetch();
  // }, [allMessage?.data, messages, refetch]);

  const searchParams = useSearchParams();

  const selectedConversationId = searchParams.get('id') || '';

  const [recipients, setRecipients] = useState([]);

  const { conversations, conversationsLoading } = useGetConversations();

  const { conversation, conversationError, conversationLoading } = useGetConversation(
    `${selectedConversationId}`
  );

  const roomNav = useCollapseNav();

  const conversationsNav = useCollapseNav();

  const participants = conversation
    ? conversation.participants.filter((participant) => participant.id !== `${user?.id}`)
    : [];

  useEffect(() => {
    if (conversationError || !selectedConversationId) {
      router.push(paths.dashboard.chat);
    }
  }, [conversationError, router, selectedConversationId]);

  const handleAddRecipients = useCallback((selected) => {
    setRecipients(selected);
  }, []);

  return (
    <DashboardContent
      maxWidth={false}
      sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
    >
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Chat
      </Typography>

      <Layout
        sx={{
          minHeight: 0,
          flex: '1 1 0',
          borderRadius: 2,
          position: 'relative',
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.customShadows.card,
        }}
        slots={{
          header: (
            <ChatHeaderDetail
              collapseNav={roomNav}
              participants={participants}
              loading={conversationLoading}
              selectThread={selectThread}
            />
          ),
          nav: (
            <ChatNav
              contacts={allThreads?.data ?? []}
              conversations={conversations}
              loading={conversationsLoading}
              selectedConversationId={selectedConversationId}
              collapseNav={conversationsNav}
              searchContacts={searchContacts}
              setSearchContacts={setSearchContacts}
              handleSelectThread={handleSelectThread}
            />
          ),
          main: (
            <>
              {allMessage?.data?.length > 0 ? (
                <ChatMessageList
                  messages={totalMessage ?? []}
                  selectThread={selectThread}
                  participants={participants}
                  loading={conversationLoading}
                />
              ) : (
                <EmptyContent
                  imgUrl={`${CONFIG.site.basePath}/assets/icons/empty/ic-chat-active.svg`}
                  title="Good morning!"
                  description="Write something awesome..."
                />
              )}

              <ChatMessageInput
                recipients={recipients}
                onAddRecipients={handleAddRecipients}
                selectedConversationId={selectedConversationId}
                disabled={!recipients.length && !selectedConversationId}
                selectThread={selectThread}
                sendMessage={sendSocketIOMessage}
              />
            </>
          ),
          // details: selectedConversationId && (
          //   <ChatRoom
          //     collapseNav={roomNav}
          //     participants={participants}
          //     loading={conversationLoading}
          //     messages={conversation?.messages ?? []}
          //   />
          // ),
        }}
      />
    </DashboardContent>
  );
}
