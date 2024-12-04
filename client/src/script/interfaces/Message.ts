export interface Message {
  content: string;
  className: string;
  type: string;
}

const HANDLE_MESSAGE_URL = import.meta.env.VITE_API_URL + "/message";

export async function sendMessage(message: Message): Promise<Message[]> {
  const response = await fetch(HANDLE_MESSAGE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  const data = (await response.json()) as Message[];
  return data;
}
