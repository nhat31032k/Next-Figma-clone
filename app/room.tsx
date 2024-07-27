"use client";

import { ReactNode } from "react";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";

export function Room({ children }: { children: ReactNode }) {
    return (
        <LiveblocksProvider publicApiKey={"pk_dev_lun90-1PzWKuthoV2jVJZAGt-dvWS-bmXF1-3N_i5IBS2fuhp3MPS9ErJ_1ijjyT"}>
            <RoomProvider id="my-room">
                <ClientSideSuspense fallback={<div>Loading…</div>}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}