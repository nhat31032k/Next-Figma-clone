import { LiveCursorProps } from "@/types/type";
import Cursor from "./Cursor";
import { COLORS } from "@/constants";

const LiveCursors = ({ others }: LiveCursorProps) => {
    console.log("others", others)
    return others.map(({ connectionId, presence }) => {
        if (!presence?.cursor) return null;
        return (
            <Cursor
                key={connectionId}
                color={COLORS[Number(connectionId) % COLORS.length]}
                X={presence.cursor.x}
                Y={presence.cursor.y}
                message={presence.message}
            />
        )
    })
}

export default LiveCursors