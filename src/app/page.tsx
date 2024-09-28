
import { getServerSession } from "next-auth";
import { Separator } from "@/components/ui/separator";
import { Chat } from "./components/Chat";

export default async function Home() {
  const session = await getServerSession();
  console.log("🚀 ~ Home ~ session:", session)

  return (
    <main>
      <h1 className="text-4xl font-bold">Welcome to GPT Chat</h1>
      {!session?.user?.name && <div>You need to log in to use this</div>}
      {session?.user?.name && (
        <>
          <Separator className="my-5" />
          <Chat />
        </>
      )}
    </main>
  );
}
