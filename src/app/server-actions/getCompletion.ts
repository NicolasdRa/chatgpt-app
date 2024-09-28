"use server"

import OpenAI, { ClientOptions } from "openai"

const OpenAi = new OpenAI(process.env.OPENAI_API_KEY as unknown as ClientOptions)

export async function getCompletion(
  messageHistory: {
    role: "user" | "assistant",
    content: string
  }[],
) {
  const response = await OpenAi.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messageHistory
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

  return { messages }
}


