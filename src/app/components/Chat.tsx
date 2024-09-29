'use client'

import { FC, useRef, useState } from 'react';
import { useRouter } from 'next/navigation'
import { getCompletion } from '../server-actions/getCompletion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Message } from '@/types/types';

interface ChatProps {
  id?: number | null;
  messages?: Message[];
}

export const Chat: FC<ChatProps> = ({
  id = null,
  messages: initialMessages = [] }
) => {
  const router = useRouter()

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [message, setMessage] = useState("");

  const chatIdRef = useRef<number | null>(id);

  const onClick = async () => {
    const completions = await getCompletion(chatIdRef.current, [
      ...messages,
      {
        role: "user",
        content: message,
      },
    ]);

    if (!chatIdRef.current) {
      router.push(`/chats/${completions.id}`);
      router.refresh();
    }

    chatIdRef.current = completions.id;

    setMessage("");
    setMessages(completions.messages);
  };

  return (
    <div className="flex flex-col">
      {messages.map((message, i) => (
        <div
          key={i}
          className={`mb-5 flex flex-col ${message.role === "user" ? "items-end" : "items-start"
            }`}
        >
          <div
            className={`${message.role === "user" ? "bg-blue-500" : "bg-gray-500 text-black"
              } rounded-md py-2 px-8`}
          >
            {message.content}
          </div>
        </div>
      ))}
      <div className="flex border-t-2 border-t-gray-500 pt-3 mt-3">
        <Input
          className="flex-grow text-xl"
          placeholder="Question"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              onClick();
            }
          }}
        />
        <Button onClick={onClick} className="ml-3 text-xl">
          Send
        </Button>
      </div>
    </div>
  );
}

