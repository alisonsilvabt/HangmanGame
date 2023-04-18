function styleString(str) {
    str = str.toLowerCase();
    const arrayStr = str.split('');
    arrayStr[0] = arrayStr[0].toUpperCase();
    const response = arrayStr.join('');
    return response;
}
//console.log(styleString());