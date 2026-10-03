import { useEffect, useState } from 'react';
import {
  getStateInstance,
  sendMessage as sendGreenApiMessage,
  receiveNotification,
  deleteNotification,
} from './api/greenApi';
import type { Chat, Message } from './types/chat';
import { ConnectionForm } from './components/ConnectionForm/ConnectionForm';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Conversation } from './components/Conversation/Conversation';
import { NewChatModal } from './components/NewChatModal/NewChatModal';
import './App.css';

function App() {
  const [idInstance, setIdInstance] = useState(
    () => localStorage.getItem('greenApiIdInstance') || '',
  );

  const [apiTokenInstance, setApiTokenInstance] = useState(
    () => localStorage.getItem('greenApiApiTokenInstance') || '',
  );

  const [isConnected, setIsConnected] = useState(() =>
    Boolean(
      localStorage.getItem('greenApiIdInstance') &&
      localStorage.getItem('greenApiApiTokenInstance'),
    ),
  );

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  const [search, setSearch] = useState('');
  const [phone, setPhone] = useState('');

  const [showNewChat, setShowNewChat] = useState(false);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  const [message, setMessage] = useState('');

  const [chats, setChats] = useState<Chat[]>(() => {
    const savedChats = localStorage.getItem('greenApiChats');

    return savedChats ? JSON.parse(savedChats) : [];
  });

  
  const [messagesByChat, setMessagesByChat] = useState<
    Record<string, Message[]>
  >(() => {
    const savedMessages = localStorage.getItem('greenApiMessages');

    return savedMessages ? JSON.parse(savedMessages) : {};
  });

  const logout = () => {
    localStorage.removeItem('greenApiIdInstance');
    localStorage.removeItem('greenApiApiTokenInstance');

    setIdInstance('');
    setApiTokenInstance('');
    setIsConnected(false);
    setActiveChat(null);
  };

  const connect = async () => {
    if (!idInstance || !apiTokenInstance) {
      return;
    }

    setIsConnecting(true);
    setConnectionError('');

    try {
      const result = await getStateInstance(idInstance, apiTokenInstance);

      if (result.stateInstance === 'authorized') {
        localStorage.setItem('greenApiIdInstance', idInstance);

        localStorage.setItem('greenApiApiTokenInstance', apiTokenInstance);

        setIsConnected(true);
        return;
      }

      if (result.stateInstance === 'notAuthorized') {
        setConnectionError('Инстанс не авторизован в WhatsApp.');
        return;
      }

      setConnectionError(`Текущий статус инстанса: ${result.stateInstance}`);
    } catch {
      setConnectionError(
        'Не удалось подключиться. Проверьте ID Instance и API Token.',
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const createChat = () => {
    const normalizedPhone = phone.replace(/\D/g, '');

    if (normalizedPhone.length !== 11 || !normalizedPhone.startsWith('7')) {
      return;
    }


    const formattedPhone = `+${normalizedPhone}`;

    const existingChat = chats.find(
      (chat) => chat.phone.replace(/\D/g, '') === normalizedPhone,
    );

    if (existingChat) {
      setActiveChat(existingChat);
      setShowNewChat(false);
      setPhone('');
      return;
    }

    const newChat: Chat = {
      id: Date.now().toString(),
      name: formattedPhone,
      phone: formattedPhone,
      lastMessage: '',
    };

    setChats((previous) => [newChat, ...previous]);
    setActiveChat(newChat);

    setShowNewChat(false);
    setPhone('');
  };

  const sendMessage = async () => {
    const text = message.trim();

    if (!text || !activeChat) return;

    try {
      const chatId = `${activeChat.phone.replace(/\D/g, '')}@c.us`;

      console.log('Отправляем в:', chatId);
      console.log('Текст:', text);

      const result = await sendGreenApiMessage(
        idInstance,
        apiTokenInstance,
        chatId,
        text,
      );

      console.log('Сообщение отправлено:', result);

      const newMessage: Message = {
        id: Date.now(),
        text,
        time: new Date().toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        outgoing: true,
      };

      setMessagesByChat((previous) => ({
        ...previous,
        [chatId]: [...(previous[chatId] || []), newMessage],
      }));

      setChats((previous) =>
        previous.map((chat) =>
          chat.id === activeChat.id
            ? {
                ...chat,
                lastMessage: text,
              }
            : chat,
        ),
      );

      setMessage('');
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    }
  };

  const filteredChats = chats.filter((chat) => {
    const query = search.toLowerCase();

    return (
      chat.name.toLowerCase().includes(query) ||
      chat.phone.includes(query) ||
      chat.lastMessage.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    localStorage.setItem('greenApiMessages', JSON.stringify(messagesByChat));
  }, [messagesByChat]);

  const activeChatId = activeChat
    ? `${activeChat.phone.replace(/\D/g, '')}@c.us`
    : null;

  const messages = activeChatId ? messagesByChat[activeChatId] || [] : [];

  useEffect(() => {
    localStorage.setItem('greenApiChats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (!isConnected) return;

    let isRunning = true;

    const receiveMessages = async () => {
      while (isRunning) {
        try {
          console.log('Проверяем новые сообщения...');

          const notification = await receiveNotification(
            idInstance,
            apiTokenInstance,
          );

          console.log('Ответ GREEN-API:', notification);

          if (!notification) {
            console.log('Новых сообщений нет');
            continue;
          }

          console.log('Получено уведомление:', notification);

          const body = notification.body;

          if (
            body.typeWebhook === 'incomingMessageReceived' &&
            body.messageData?.typeMessage === 'textMessage'
          ) {
            const senderData = body.senderData;
            const messageData = body.messageData;

            const incomingText = messageData.textMessageData?.textMessage;

            if (incomingText) {
              const incomingChatId = senderData.chatId;

              console.log('Входящее сообщение:', incomingText);
              console.log('От кого:', incomingChatId);

              console.log('ACTIVE CHAT:', activeChat);
              console.log(
                'ACTIVE CHAT ID:',
                activeChat
                  ? `${activeChat.phone.replace(/\D/g, '')}@c.us`
                  : null,
              );
              console.log('INCOMING CHAT ID:', incomingChatId);

              const incomingMessage: Message = {
                id: Date.now(),
                text: incomingText,
                time: new Date().toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                outgoing: false,
              };

              setMessagesByChat((previous) => ({
                ...previous,
                [incomingChatId]: [
                  ...(previous[incomingChatId] || []),
                  incomingMessage,
                ],
              }));

              setChats((previous) => {
                const existingChat = previous.find(
                  (chat) =>
                    `${chat.phone.replace(/\D/g, '')}@c.us` === incomingChatId,
                );

                if (existingChat) {
                  return previous.map((chat) =>
                    chat.id === existingChat.id
                      ? {
                          ...chat,
                          lastMessage: incomingText,
                        }
                      : chat,
                  );
                }

                return previous;
              });
            }
          }

          await deleteNotification(
            idInstance,
            apiTokenInstance,
            notification.receiptId,
          );

          console.log('Уведомление удалено:', notification.receiptId);
        } catch (error) {
          console.error('Ошибка получения уведомления:', error);

          await new Promise((resolve) => {
            setTimeout(resolve, 2000);
          });
        }
      }
    };

    receiveMessages();

    return () => {
      isRunning = false;
    };
  }, [isConnected, idInstance, apiTokenInstance]);

  if (!isConnected) {
    return (
      <ConnectionForm
        idInstance={idInstance}
        apiTokenInstance={apiTokenInstance}
        connectionError={connectionError}
        isConnecting={isConnecting}
        onIdInstanceChange={setIdInstance}
        onApiTokenInstanceChange={setApiTokenInstance}
        onConnect={connect}
      />
    );
  }

  return (
    <main className="messenger">
      <Sidebar
        chats={filteredChats}
        activeChat={activeChat}
        search={search}
        onSearchChange={setSearch}
        onChatSelect={setActiveChat}
        onLogout={logout}
        onAddChat={() => setShowNewChat(true)}
      />

      <Conversation
        activeChat={activeChat}
        messages={messages}
        message={message}
        onBack={() => setActiveChat(null)}
        onMessageChange={setMessage}
        onSendMessage={sendMessage}
      />

      {showNewChat && (
        <NewChatModal
          phone={phone}
          onPhoneChange={setPhone}
          onSubmit={createChat}
          onClose={() => setShowNewChat(false)}
        />
      )}
    </main>
  );
}

export default App;
