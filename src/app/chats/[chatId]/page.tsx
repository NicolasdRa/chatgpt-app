

import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation"
import { Chat } from "@/app/components/Chat";
import { getChat } from "@/db";

export const dynamic = "force-dynamic";

export default async function ChatDetail({ params: { chatId } }:
  { params: { chatId: string } }
) {
  const chat = await getChat(+chatId);

  // If the chat doesn't exist, return a 404
  if (!chat) {
    return notFound()
  }

  // chat is not the users chat, redirect to the chat list
  const session = await getServerSession();

  if (!session) {
    return redirect("/");
  }

  return (
    <main className="pt-5">
      <Chat id={+chatId} messages={chat?.messages} key={chatId} />
    </main>
  );
}
