// Test script to verify the mouse color fix for DPI scaling issues
const robot = require('./index.js');

console.log('Testing mouse color fix...');
console.log('RobotJS Version:', robot.getVersion());

// Get current mouse position
const mousePos = robot.getMousePos();
console.log('Current mouse position:', mousePos);

// Get mouse color with enhanced fix
const mouseColor = robot.getMouseColor();
console.log('Mouse color result:', mouseColor);

// For comparison, also test getPixelColor at the same position
const pixelColor = robot.getPixelColor(mousePos.x, mousePos.y);
console.log('Pixel color at same position:', pixelColor);

// Test if colors match (they should be the same or very close)
if (mouseColor.hex === pixelColor) {
    console.log('✅ SUCCESS: Mouse color matches pixel color!');
} else {
    console.log('⚠️  WARNING: Colors don\'t match exactly:');
    console.log('  Mouse color:', mouseColor.hex);
    console.log('  Pixel color:', pixelColor);
    
    // Check if RGB values are close (within tolerance for DPI scaling)
    const pixelColorRGB = robot.getPixelColor(mousePos.x, mousePos.y, true);
    const rDiff = Math.abs(mouseColor.r - pixelColorRGB.r);
    const gDiff = Math.abs(mouseColor.g - pixelColorRGB.g);
    const bDiff = Math.abs(mouseColor.b - pixelColorRGB.b);
    const maxDiff = Math.max(rDiff, gDiff, bDiff);
    
    console.log(`  RGB differences: R=${rDiff}, G=${gDiff}, B=${bDiff}, Max=${maxDiff}`);
    
    if (maxDiff <= 5) {
        console.log('✅ ACCEPTABLE: Colors are close enough (within tolerance)');
    } else {
        console.log('❌ ISSUE: Colors are too different, may indicate DPI scaling problem');
    }
}

// Test error handling
console.log('\nTesting error handling...');
console.log('Resources valid:', robot.isResourcesValid());

console.log('\nTest completed!');
