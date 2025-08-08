// Simple test to verify the RobotJS module loads and works
const robot = require('./index.js');
const os = require('os');

console.log('OS:', os.platform(), os.arch());

console.log('Testing RobotJS build...');

try {
    // Test basic functionality
    console.log('✓ Module loaded successfully');
    
    // Test screen size function
    const screenSize = robot.getScreenSize();
    console.log('✓ Screen size:', screenSize);
    
    // Test mouse position
    const mousePos = robot.getMousePos();
    console.log('✓ Mouse position:', mousePos);
    
    // Test screen count
    const screens = robot.getScreens();
    console.log('✓ Number of screens:', screens.length);

    screens.forEach((screen, index) => {
        console.log(`Screen ${index}: x=${screen.x}, y=${screen.y}, width=${screen.width}, height=${screen.height}`);
    });
    
    console.log('\n🎉 All tests passed! RobotJS built successfully.');
    
} catch (error) {
    console.error('❌ Error testing RobotJS:', error.message);
    process.exit(1);
}
