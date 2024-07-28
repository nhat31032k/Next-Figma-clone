
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
        <div className="pointer-events-none absolute top-0 left-0">
            Cursor
        </div>
    )
}

export default Cursor