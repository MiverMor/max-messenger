import axios from 'axios';

const API_URL = 'https://api.green-api.com';

type InstanceStateResponse = {
  stateInstance: string;
};

type SendMessageResponse = {
  idMessage: string;
};

export async function getStateInstance(
  idInstance: string,
  apiTokenInstance: string,
) {
  const response = await axios.get<InstanceStateResponse>(
    `${API_URL}/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`,
  );

  return response.data;
}

export async function sendMessage(
  idInstance: string,
  apiTokenInstance: string,
  chatId: string,
  message: string,
) {
  const response = await axios.post<SendMessageResponse>(
    `${API_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
    {
      chatId,
      message,
    },
  );

  return response.data;
}

type ReceiveNotificationResponse = {
  receiptId: number;
  body: {
    typeWebhook: string;
    idMessage: string;
    timestamp: number;

    instanceData: {
      idInstance: number;
      wid: string;
      typeInstance: string;
    };

    senderData: {
      chatId: string;
      sender: string;
      senderName: string;
      senderContactName: string;
      chatName: string;
    };

    messageData: {
      typeMessage: string;
      textMessageData?: {
        textMessage?: string;
      };
    };
  };
};

type DeleteNotificationResponse = {
  result: boolean;
};

export async function receiveNotification(
  idInstance: string,
  apiTokenInstance: string,
) {
  const response = await axios.get<ReceiveNotificationResponse>(
    `${API_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=5`,
  );

  return response.data;
}

export async function deleteNotification(
  idInstance: string,
  apiTokenInstance: string,
  receiptId: number,
) {
  const response = await axios.delete<DeleteNotificationResponse>(
    `${API_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
  );

  return response.data;
}