"use server"

import OpenAI, { ClientOptions } from "openai"
import { getServerSession } from "next-auth"
import { createChat, updateChat } from "@/db"


const OpenAi = new OpenAI(process.env.OPENAI_API_KEY as unknown as ClientOptions)

export async function getCompletion(
  id: number | null,
  messageHistory: {
    role: "user" | "assistant",
    content: string
  }[],
) {
  const response = await OpenAi.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messageHistory.map((message) => ({
      role: message.role,
      content: message.content
    })),
  },
  )

  // Extract the message correctly as an object, not an array
  const newMessage = response.choices[0].message as {
    role: "user" | "assistant";
    content: string;
  };

  const messages = [
    ...messageHistory,
    newMessage
  ]

  const session = await getServerSession()

  let chatId = id
  if (!chatId) {
    chatId = await createChat(session?.user?.email ?? "", messageHistory[0].content, messages)
  } else {
    await updateChat(chatId, messages)
  }

  return { messages, id: chatId }
}


