// Comprehensive test for mouse color DPI scaling fix
const robot = require('./index.js');

console.log('=== Comprehensive Mouse Color DPI Test ===');
console.log('RobotJS Version:', robot.getVersion());

// Test multiple positions to ensure consistency
const testPositions = [
    { x: 100, y: 100 },
    { x: 500, y: 300 },
    { x: 1000, y: 500 },
    { x: 1500, y: 700 },
];

console.log('\nTesting color consistency at various positions...');

let allTestsPassed = true;

for (let i = 0; i < testPositions.length; i++) {
    const pos = testPositions[i];
    
    // Move mouse to test position
    robot.moveMouse(pos.x, pos.y);
    
    // Small delay to ensure mouse position is updated
    setTimeout(() => {}, 10);
    
    // Get mouse color and pixel color
    const mouseColor = robot.getMouseColor();
    const pixelColor = robot.getPixelColor(pos.x, pos.y);
    const pixelColorRGB = robot.getPixelColor(pos.x, pos.y, true);
    
    console.log(`\nTest ${i + 1}: Position (${pos.x}, ${pos.y})`);
    console.log(`  Mouse position: (${mouseColor.x}, ${mouseColor.y})`);
    console.log(`  Mouse color: ${mouseColor.hex} RGB(${mouseColor.r}, ${mouseColor.g}, ${mouseColor.b})`);
    console.log(`  Pixel color: ${pixelColor} RGB(${pixelColorRGB.r}, ${pixelColorRGB.g}, ${pixelColorRGB.b})`);
    
    // Check if colors match
    const rDiff = Math.abs(mouseColor.r - pixelColorRGB.r);
    const gDiff = Math.abs(mouseColor.g - pixelColorRGB.g);
    const bDiff = Math.abs(mouseColor.b - pixelColorRGB.b);
    const maxDiff = Math.max(rDiff, gDiff, bDiff);
    
    if (mouseColor.hex === pixelColor && maxDiff === 0) {
        console.log('  ✅ PERFECT MATCH');
    } else if (maxDiff <= 3) {
        console.log(`  ✅ ACCEPTABLE (max diff: ${maxDiff})`);
    } else {
        console.log(`  ❌ ISSUE (max diff: ${maxDiff})`);
        allTestsPassed = false;
    }
    
    // Check position accuracy
    if (mouseColor.x === pos.x && mouseColor.y === pos.y) {
        console.log('  ✅ Position accurate');
    } else {
        console.log(`  ⚠️  Position offset: expected (${pos.x}, ${pos.y}), got (${mouseColor.x}, ${mouseColor.y})`);
    }
}

console.log('\n=== Test Summary ===');
if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED! DPI scaling fix is working correctly.');
} else {
    console.log('⚠️  Some tests failed. There may still be DPI scaling issues.');
}

console.log('\n=== Additional Info ===');
console.log('Screen size:', robot.getScreenSize());
console.log('Resources valid:', robot.isResourcesValid());

// Test error handling with hasError flag
console.log('\nTesting enhanced error handling...');
const testColor = robot.getMouseColor();
console.log('Has error flag:', testColor.hasError);
console.log('Error code:', testColor.errorCode);
