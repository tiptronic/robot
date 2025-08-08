const robot = require('./index.js');

const result = robot.getMouseColor();
console.log('getMouseColor result:', result);
console.log('hex property:', result.hex);
console.log('hex format valid:', /^#[0-9A-F]{6}$/i.test(result.hex)); 