const robot = require('./index.js');

console.log('Testing getVersion function');
console.log('===========================');

// Test the getVersion function
const version = robot.getVersion();
console.log(`RobotJS version: ${version}`);

// Verify it's a string
console.log(`Type: ${typeof version}`);

// Check if it matches package.json version
const packageJson = require('./package.json');
console.log(`Package.json version: ${packageJson.version}`);
console.log(`Match: ${version === packageJson.version}`);

// Test that it's not undefined/null
if (version && typeof version === 'string') {
    console.log('✅ getVersion function works correctly');
} else {
    console.log('❌ getVersion function failed');
} 