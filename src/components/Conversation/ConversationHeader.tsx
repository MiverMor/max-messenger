import type { Chat } from '../../types/chat';

type ConversationHeaderProps = {
  chat: Chat;
  onBack: () => void;
};

export function ConversationHeader({ chat, onBack }: ConversationHeaderProps) {
  return (
    <header className="conversation__header">
      <button
        className="back-button"
        onClick={onBack}
        aria-label="Назад к чатам"
      >
        <span>←</span>
      </button>

      <div className="avatar">{chat.name.charAt(0).toUpperCase()}</div>

      <div className="conversation__user">
        <strong>{chat.name}</strong>
        <span>{chat.phone}</span>
      </div>
    </header>
  );
}
