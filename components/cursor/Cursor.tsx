import CursorSVG from "@/public/assets/CursorSVG"

interface ICursorProps {
    color: string
    X: number
    Y: number
    message: string
}
const Cursor = ({
    color,
    X,
    Y,
    message
}: ICursorProps) => {
    return (
        <div className="pointer-events-none absolute top-0 left-0" style={{
            transform: `translate(${X}px, ${Y}px)`,
        }}>
            <CursorSVG color={color} />
            {/* MESSAGE */}
            {
                message && (
                    <div
                        className="absolute left-2 top-5 rounded-3xl px-4 py-2"
                        style={{
                            backgroundColor: color
                        }}
                    >
                        <p className="text-white whitespace-nowrap text-sm leading-relaxed">
                            {message}
                        </p>
                    </div>
                )
            }
        </div>
    )
}

export default Cursor