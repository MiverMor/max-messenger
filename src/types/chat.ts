export type Message = {
  id: number;
  text: string;
  time: string;
  outgoing: boolean;
};

export type Chat = {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
};
