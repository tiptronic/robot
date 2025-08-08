const robot = require('./index.js');

console.log('Testing getPixelColor with new RGB parameter');
console.log('============================================');

// Test coordinates (center of screen)
const screenSize = robot.getScreenSize();
const x = Math.floor(screenSize.width / 2);
const y = Math.floor(screenSize.height / 2);

console.log(`Testing at coordinates: (${x}, ${y})`);
console.log('');

// Test original hex format (2 parameters)
console.log('1. Hex format (original behavior):');
const hexColor = robot.getPixelColor(x, y);
console.log(`   Result: "${hexColor}"`);
console.log(`   Type: ${typeof hexColor}`);
console.log('');

// Test new RGB format (3 parameters, third = true)
console.log('2. RGB format (new behavior):');
const rgbColor = robot.getPixelColor(x, y, true);
console.log(`   Result:`, rgbColor);
console.log(`   Type: ${typeof rgbColor}`);
console.log(`   R: ${rgbColor.r}, G: ${rgbColor.g}, B: ${rgbColor.b}`);
console.log('');

// Test hex format explicitly (3 parameters, third = false)
console.log('3. Hex format (explicit false):');
const hexColor2 = robot.getPixelColor(x, y, false);
console.log(`   Result: "${hexColor2}"`);
console.log(`   Type: ${typeof hexColor2}`);
console.log('');

// Verify both formats return the same color
console.log('4. Verification:');
console.log(`   Hex: ${hexColor}`);
console.log(`   RGB: rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`);
console.log(`   Hex from RGB: #${rgbColor.r.toString(16).padStart(2, '0')}${rgbColor.g.toString(16).padStart(2, '0')}${rgbColor.b.toString(16).padStart(2, '0')}`);
console.log(`   Match: ${hexColor === `#${rgbColor.r.toString(16).padStart(2, '0')}${rgbColor.g.toString(16).padStart(2, '0')}${rgbColor.b.toString(16).padStart(2, '0')}`}`); 