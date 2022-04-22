import useEventListener from "./useEventListener"
import useTimeout from "./useTimeout"
import useEffectOnce from "./useEffectOnce"
import React from "react";

export default function useLongPress(ref: React.RefObject<any>, onTrigger: () => void, { delay = 250 } = {}) {
    const { reset, clear } = useTimeout(onTrigger, delay);
    useEffectOnce(clear);

    useEventListener("mousedown", reset, ref);
    useEventListener("touchstart", reset, ref);

    useEventListener("mouseup", clear, ref);
    useEventListener("mouseleave", clear, ref);
    useEventListener("touchend", clear, ref);
}