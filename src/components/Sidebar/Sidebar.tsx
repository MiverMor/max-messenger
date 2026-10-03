import type { Chat } from '../../types/chat';
import { ChatItem } from './ChatItem';

type SidebarProps = {
  chats: Chat[];
  activeChat: Chat | null;
  search: string;
  onSearchChange: (value: string) => void;
  onChatSelect: (chat: Chat) => void;
  onLogout: () => void;
  onAddChat: () => void;
};

export function Sidebar({
  chats,
  activeChat,
  search,
  onSearchChange,
  onChatSelect,
  onLogout,
  onAddChat,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <header className="sidebar__header">
        <h1>Чаты</h1>

        <div className="sidebar__actions">
          <button className="logout-button" onClick={onLogout}>
            Выйти
          </button>

          <button
            className="add-chat-button"
            onClick={onAddChat}
            aria-label="Новый чат"
          >
            +
          </button>
        </div>
      </header>

      <div className="search">
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Найти"
        />
      </div>

      <div className="chat-list">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={activeChat?.id === chat.id}
              onClick={() => onChatSelect(chat)}
            />
          ))
        ) : (
          <div className="empty-list">
            <p>Чатов не найдено</p>
          </div>
        )}
      </div>
    </aside>
  );
}
