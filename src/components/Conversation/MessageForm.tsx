type MessageFormProps = {
  message: string;
  onMessageChange: (value: string) => void;
  onSubmit: () => void;
};

export function MessageForm({
  message,
  onMessageChange,
  onSubmit,
}: MessageFormProps) {
  return (
    <form
      className="message-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        value={message}
        onChange={(event) => onMessageChange(event.target.value)}
        placeholder="Сообщение"
      />

      <button type="submit" disabled={!message.trim()} aria-label="Отправить">
        ↑
      </button>
    </form>
  );
}
