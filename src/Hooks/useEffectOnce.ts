import { useEffect } from "react"

export default function useEffectOnce(cb: any) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(cb, []);
}