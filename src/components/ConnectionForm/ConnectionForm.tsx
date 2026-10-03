type ConnectionFormProps = {
  idInstance: string;
  apiTokenInstance: string;
  connectionError: string;
  isConnecting: boolean;
  onIdInstanceChange: (value: string) => void;
  onApiTokenInstanceChange: (value: string) => void;
  onConnect: () => void;
};

export function ConnectionForm({
  idInstance,
  apiTokenInstance,
  connectionError,
  isConnecting,
  onIdInstanceChange,
  onApiTokenInstanceChange,
  onConnect,
}: ConnectionFormProps) {
  return (
    <main className="connection">
      <div className="connection__card">
        <h1>Подключение</h1>

        <p>Введите данные GREEN-API для подключения WhatsApp</p>

        <label htmlFor="idInstance">ID Instance</label>

        <input
          id="idInstance"
          value={idInstance}
          onChange={(event) => onIdInstanceChange(event.target.value)}
          placeholder="Введите ID Instance"
        />

        <label htmlFor="apiTokenInstance">API Token Instance</label>

        <input
          id="apiTokenInstance"
          type="password"
          value={apiTokenInstance}
          onChange={(event) => onApiTokenInstanceChange(event.target.value)}
          placeholder="Введите API Token Instance"
        />

        {connectionError && (
          <p className="connection__error">{connectionError}</p>
        )}

        <button
          onClick={onConnect}
          disabled={!idInstance || !apiTokenInstance || isConnecting}
        >
          {isConnecting ? 'Подключение...' : 'Подключиться'}
        </button>
      </div>
    </main>
  );
}
