import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="p-10">
    <Button className="bg-primary text-white hover:bg-primary/90">
      Get Started
    </Button>
</div>
    </div>
  );
}
