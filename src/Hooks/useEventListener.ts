import React, { useEffect, useRef } from "react"

export default function useEventListener(
    eventType: string,
    callback: any,
    elementRef: React.RefObject<any>
) {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback])

    useEffect(() => {
        const element = elementRef.current;
        if (element == null) return;
        const handler = (e: any) => callbackRef.current(e);
        element.addEventListener(eventType, handler);

        return () => element.removeEventListener(eventType, handler);
    }, [eventType, elementRef.current])
}