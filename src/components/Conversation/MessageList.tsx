import type { Message } from '../../types/chat';

type MessageListProps = {
  messages: Message[];
};

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="messages">
        <div className="empty-chat">
          <p>Начните общение</p>
        </div>
      </div>
    );
  }

  return (
    <div className="messages">
      {messages.map((item) => (
        <div
          key={item.id}
          className={`message ${
            item.outgoing ? 'message--outgoing' : 'message--incoming'
          }`}
        >
          <p>{item.text}</p>
          <time>{item.time}</time>
        </div>
      ))}
    </div>
  );
}
