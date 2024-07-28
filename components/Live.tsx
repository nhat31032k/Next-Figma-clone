import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from "@liveblocks/react/suspense";
import LiveCursors from "./cursor/LiveCursors";
import { PointerEvent, useCallback, useEffect, useState } from "react";
import CursorChat from "./cursor/CursorChat";
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/type";
import ReactionSelector from "./reaction/ReactionButton";
import FlyingReaction from "./reaction/FlyingReaction";
import useInterval from "@/hooks/useInterval";


const Live = () => {
    const other = useOthers();
    const [{ cursor }, updateMyPresence] = useMyPresence() as any;

    const [cursorState, setCursorState] = useState<CursorState>({
        mode: CursorMode.Hidden,
    })
    const [reactions, setReactions] = useState<Reaction[]>([]);
    const broadcast = useBroadcastEvent();
    console.log("🚀 ~ Live ~ reaction:", reactions)
    console.log("🚀 ~ Live ~ cursor:", cursor)
    // // Remove reactions that are not visible anymore (every 1 sec)
    // useInterval(() => {
    //     setReaction((reactions) => reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000));
    // }, 1000);
    // Broadcast the reaction to other users (every 100ms)

    const handlePointerMove = useCallback((e: PointerEvent) => {
        e.preventDefault();
        // setCursorState({ mode: CursorMode.Chat });
        if (cursor === null || cursorState.mode === CursorMode.ReactionSelector) {
            console.log("🚀 ~ handlePointerMove ~ e:", e)
            const x = e.clientX - e.currentTarget.getBoundingClientRect().x;
            const y = e.clientY - e.currentTarget.getBoundingClientRect().y;
            updateMyPresence({ cursor: { x, y } });
        }
    }, [])
    // Hide the cursor when the mouse leaves the canvas
    const handlePointerLeave = useCallback((e: PointerEvent) => {
        setCursorState({ mode: CursorMode.Hidden });
        updateMyPresence({ cursor: null, message: null });
    }, []);
    // Show the cursor when the mouse enters the canvas
    const handlePointerDown = useCallback((e: PointerEvent) => {
        // e.preventDefault();
        // get the cursor position in the canvas
        const x = e.clientX - e.currentTarget.getBoundingClientRect().x;
        const y = e.clientY - e.currentTarget.getBoundingClientRect().y;
        updateMyPresence({ cursor: { x, y } });
        // if cursor is in reaction mode, set isPressed to true
        setCursorState((state: CursorState) =>
            cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state
        );
    }, [cursorState.mode, setCursorState]);
    // hide the cursor when the mouse is up
    const handlePointerUp = useCallback(() => {
        // e.preventDefault();
        // if cursor is in reaction mode, set isPressed to true
        setCursorState((state: CursorState) =>
            cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: false } : state
        );
    }, [cursorState.mode, setCursorState]);
    // set the reaction of the cursor
    const setReaction = useCallback((reaction: string) => {
        setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false });
    }, []);
    useInterval(() => {
        // if (cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor) {
        //     console.log("🚀 cursorState.mode")
        //     // concat all the reactions created on mouse click
        //     setReactions((reactions) =>
        //         reactions.concat([
        //             {
        //                 point: { x: cursor?.x, y: cursor?.y },
        //                 value: cursorState?.reaction,
        //                 timestamp: Date.now(),
        //             },
        //         ])
        //     );

        //     // Broadcast the reaction to other users
        //     broadcast({
        //         x: cursor.x,
        //         y: cursor.y,
        //         value: cursorState.reaction,
        //     });
        // }
        if (cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor) {
            setReactions((reactions) =>
                reactions.concat([
                    {
                        point: { x: cursor?.x, y: cursor?.y },
                        value: cursorState?.reaction,
                        timestamp: Date.now(),
                    },
                ])
            );
            // Broadcast the reaction to other users
            broadcast({
                x: cursor.x,
                y: cursor.y,
                value: cursorState.reaction,
            });
        }

    }, 100);
    useEventListener((eventData) => {
        const event = eventData.event as ReactionEvent;
        setReactions((reactions) =>
            reactions.concat([
                {
                    point: { x: event?.x, y: event?.y },
                    value: event?.value,
                    timestamp: Date.now(),
                },
            ])
        );
    })
    // setInterval(() => {
    //     if (cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor) {
    //         console.log("🚀 cursorState.mode")
    //         // concat all the reactions created on mouse click
    //         setReactions((reactions) =>
    //             reactions.concat([
    //                 {
    //                     point: { x: cursor?.x, y: cursor?.y },
    //                     value: cursorState?.reaction,
    //                     timestamp: Date.now(),
    //                 },
    //             ])
    //         );

    //         // Broadcast the reaction to other users
    //         broadcast({
    //             x: cursor.x,
    //             y: cursor.y,
    //             value: cursorState.reaction,
    //         });
    //     }
    // }, 100)
    useEffect(() => {
        const onKeyUp = (e: KeyboardEvent) => {
            console.log("🚀 ~ onKeyUp ~ e:", e)
            if (e.key === '/') {
                setCursorState({
                    mode: CursorMode.Chat,
                    previousMessage: null,
                    message: ''
                })
            } else if (e.key === 'Escape') {
                updateMyPresence({ message: '' }),
                    setCursorState({ mode: CursorMode.Hidden })
            } else if (e.key === 'e') {
                setCursorState({ mode: CursorMode.ReactionSelector })
            }
        }
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/') {
                e.preventDefault();
            }
        }
        window.addEventListener('keyup', onKeyUp);
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('keydown', onKeyDown);
        }
    }, [updateMyPresence])
    return (
        <div
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            className="h-[100vh] w-full flex justify-center items-center text-center border-2 border-green-500"
        >
            <h1 className="text-2xl text-white">Live figma clone </h1>
            {/* show reaction effect when click */}
            {
                reactions.map((react) => {
                    <FlyingReaction
                        key={react.timestamp.toString()}
                        x={react.point.x}
                        y={react.point.y}
                        timestamp={react.timestamp}
                        value={react.value}
                    />
                })
            }
            {cursor && (
                <CursorChat
                    cursor={cursor}
                    cursorState={cursorState}
                    setCursorState={setCursorState}
                    updateMyPresence={updateMyPresence}
                />
            )}
            {/* If cursor is in reaction selector mode, show the reaction selector */}
            {
                cursorState.mode === CursorMode.ReactionSelector && (
                    <ReactionSelector
                        setReaction={setReaction}
                    />
                )
            }
            <LiveCursors others={other} />
        </div>
    )
}

export default Live