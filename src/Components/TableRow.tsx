import React, {useRef} from "react";
import {useLongPress} from "../Hooks";

export function TableRow<T>({elem, onLongPress, renderElement}: { elem: T, onLongPress: (elem: T) => void, renderElement: (elem: T) => any }) {
    const elementRef = useRef<HTMLTableRowElement>(null);
    useLongPress(elementRef, () => {
        onLongPress(elem)
    }, {delay: 2000});

    return (
        <tr ref={elementRef}>
            {renderElement(elem)}
        </tr>
    )
}