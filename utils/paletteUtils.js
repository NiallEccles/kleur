export function hexStringSanitizer(colour){
    console.log(colour);
    return colour?.charAt(0) !== "#" ? `#${colour}` : colour;
}
