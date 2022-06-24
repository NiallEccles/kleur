export function colourStringSanitizer(colour){
    return colour?.charAt(0) !== "#" ? `#${colour}` : colour;
}
