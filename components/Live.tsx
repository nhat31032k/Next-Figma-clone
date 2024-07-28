import { useOthers } from "@liveblocks/react/suspense";
import LiveCursors from "./cursor/LiveCursors";

const Live = () => {
    const other = useOthers();
    return (
        <div>
            <LiveCursors others={other} />
        </div>
    )
}

export default Live