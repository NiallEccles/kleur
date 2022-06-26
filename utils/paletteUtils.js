export function hexStringSanitizer(colour){
    return colour?.charAt(0) !== "#" ? `#${colour}` : colour;
}
