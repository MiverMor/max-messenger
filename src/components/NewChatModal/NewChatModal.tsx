type NewChatModalProps = {
  phone: string;
  onPhoneChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

function formatPhone(value: string) {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`;
  }

  if (!digits.startsWith('7')) {
    digits = `7${digits}`;
  }

  digits = digits.slice(0, 11);

  let result = '+7';

  if (digits.length > 1) {
    result += ` (${digits.slice(1, 4)}`;
  }

  if (digits.length >= 4) {
    result += ')';
  }

  if (digits.length > 4) {
    result += ` ${digits.slice(4, 7)}`;
  }

  if (digits.length > 7) {
    result += `-${digits.slice(7, 9)}`;
  }

  if (digits.length > 9) {
    result += `-${digits.slice(9, 11)}`;
  }

  return result;
}

export function NewChatModal({
  phone,
  onPhoneChange,
  onSubmit,
  onClose,
}: NewChatModalProps) {
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="new-chat-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="new-chat-modal__header">
          <h2>Новый чат</h2>

          <button onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        <label htmlFor="phone">Номер телефона</label>

        <input
          id="phone"
          value={phone}
          onChange={(event) => onPhoneChange(formatPhone(event.target.value))}
          placeholder="+7 999 999-99-99"
          autoFocus
        />

        <button className="new-chat-modal__submit" onClick={onSubmit}>
          Найти
        </button>
      </div>
    </div>
  );
}
