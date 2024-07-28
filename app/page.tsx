// import { ThreadData } from "@liveblocks/client";
//  type OverlayThreadProps = {
//   thread: ThreadData<Liveblocks["ThreadMetadata"]>;
//   maxZIndex: number;
// };
"use client";

import Live from "@/components/Live";

export default function Page() {

  return (
    <div className="h-[100vh] w-full flex justify-center items-center text-center">
      <h1 className="text-2xl text-white"> Hello</h1>
      <Live />
    </div>
  );
}