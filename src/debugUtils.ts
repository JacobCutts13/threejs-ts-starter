import { Object3D } from "three";

export function dumpObjectToConsoleAsString(root: Object3D) {
    console.log(dumpObjectToTextLines(root).join("\n"))
}

function dumpObjectToTextLines(obj: Object3D, lines = [], isLast = true, prefix = '') {
    if (!obj || !obj.children) {
        return lines;
    }
    const localPrefix = isLast ? '└─' : '├─';
    //@ts-ignore
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
        const isLast = ndx === lastNdx;
        dumpObjectToTextLines(child, lines, isLast, newPrefix);
    });
    return lines;
}