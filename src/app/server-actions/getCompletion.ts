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

  const messages = [
    ...messageHistory,
    response.choices[0].message as unknown as {
      role: "user" | "assistant",
      content: string
    }[]
  ]

  return { messages }
}


