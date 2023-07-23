import { useRef, useEffect, useState } from "react"

const useDraw = (onDraw: ({ctx, currentPoint, prevPoint}: Draw) => void) => {
    const [mouseDown, setMouseDown] = useState<boolean>(false)
    const [turn, setTurn] = useState<boolean>(false)
    
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const prevPoint = useRef<Point | null>(null)

    const onMouseDown = () => setMouseDown(true)

    const clearPicker = () => {
        const canvas = canvasRef.current

        if (!canvas) return;

        const ctx = canvas.getContext('2d')
        if (!ctx) return 

        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    const handleTurnOffOrTurnOn = () => setTurn(!turn)

    useEffect(() => {

        const handler = (event: MouseEvent) => {
            if (!mouseDown) return;
             
            const currentPoint = computePointInCanvas(event)

            const ctx = canvasRef?.current?.getContext('2d')

            if (!ctx || !currentPoint) return;

            onDraw({ctx, currentPoint, prevPoint: prevPoint.current})

            prevPoint.current = currentPoint
        }

        const computePointInCanvas = (e: MouseEvent) => {
            const canvas = canvasRef.current

            if (!canvas) return;

            const rect = canvas.getBoundingClientRect()

            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            return {
                x,
                y
            }
        } 

        const mouseMoveChoosePalette = (e: MouseEvent) => {
            console.log(e)
        }

        const mouseUpHandler = () => {
            setMouseDown(false)

            prevPoint.current = null
        }
    
        // Add events methods

        if (canvasRef?.current) {
            canvasRef?.current?.addEventListener('mousemove', handler)
            window.addEventListener('mouseup', mouseUpHandler)
        }

        if (turn) {
            window.addEventListener('mousemove', mouseMoveChoosePalette)
        }

        // Remove events methods

        return () => {
            canvasRef?.current?.removeEventListener('mousemove', handler)
            window.removeEventListener('mouseup', mouseUpHandler)
            window.removeEventListener('mousemove', mouseMoveChoosePalette)
        }
    }, [onDraw])

    return {
        canvasRef,
        onMouseDown,
        clearPicker,
        handleTurnOffOrTurnOn,
        turn
    }
}

export default useDraw