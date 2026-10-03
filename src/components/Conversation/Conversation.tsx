import type { Chat, Message } from '../../types/chat';
import { ConversationHeader } from './ConversationHeader';
import { MessageList } from './MessageList';
import { MessageForm } from './MessageForm';

type ConversationProps = {
  activeChat: Chat | null;
  messages: Message[];
  message: string;
  onBack: () => void;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
};

export function Conversation({
  activeChat,
  messages,
  message,
  onBack,
  onMessageChange,
  onSendMessage,
}: ConversationProps) {
  if (!activeChat) {
    return (
      <section className="conversation">
        <div className="welcome">
          
        </div>
      </section>
    );
  }

  return (
    <section className="conversation">
      <ConversationHeader chat={activeChat} onBack={onBack} />

      <MessageList messages={messages} />

      <MessageForm
        message={message}
        onMessageChange={onMessageChange}
        onSubmit={onSendMessage}
      />
    </section>
  );
}
