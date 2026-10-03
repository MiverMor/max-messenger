import type { Chat } from '../../types/chat';

type ChatItemProps = {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
};

export function ChatItem({ chat, isActive, onClick }: ChatItemProps) {
  return (
    <button
      className={`chat-item ${isActive ? 'chat-item--active' : ''}`}
      onClick={onClick}
    >
      <div className="avatar">{chat.name.charAt(0).toUpperCase()}</div>

      <div className="chat-item__content">
        <div className="chat-item__top">
          <strong>{chat.name}</strong>
          <span>14:32</span>
        </div>

        <p>{chat.lastMessage || chat.phone}</p>
      </div>
    </button>
  );
}
