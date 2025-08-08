#!/usr/bin/env node

const robot = require('./index.js');

// Helper function to delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
    console.log('🧪 Testing getMouseColor on Apple Silicon (ARM64)');
    console.log('==================================================');

    // Test 1: Basic functionality
    console.log('\n1. Testing basic getMouseColor functionality...');
    try {
        const result = robot.getMouseColor();
        console.log(`   Result type: ${typeof result}`);
        console.log(`   Result:`, result);
        
        // Check if it's an object with expected properties
        const hasRequiredProps = result && 
            typeof result === 'object' &&
            typeof result.x === 'number' &&
            typeof result.y === 'number' &&
            typeof result.r === 'number' &&
            typeof result.g === 'number' &&
            typeof result.b === 'number' &&
            typeof result.hex === 'string';
        
        console.log(`   Has required properties: ${hasRequiredProps}`);
        
        if (!hasRequiredProps) {
            console.log('   ❌ ERROR: Result does not have expected object structure!');
            process.exit(1);
        }
        
        // Check if hex is valid
        const isValidHex = /^#[0-9A-F]{6}$/i.test(result.hex);
        console.log(`   Valid hex format: ${isValidHex}`);
        
        if (!isValidHex) {
            console.log('   ❌ ERROR: Hex color is not in valid format!');
            process.exit(1);
        }
        
        console.log('   ✅ Basic functionality test passed');
    } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
        process.exit(1);
    }

    // Test 2: Check for dummy values
    console.log('\n2. Checking for dummy/placeholder values...');
    const dummyPatterns = [
        '#000000', // Pure black
        '#FFFFFF', // Pure white
        '#FF0000', // Pure red
        '#00FF00', // Pure green
        '#0000FF', // Pure blue
        '#123456', // Common dummy value
        '#ABCDEF', // Common dummy value
        '#DEADBE', // Common dummy value
    ];

    const result = robot.getMouseColor();
    const isDummy = dummyPatterns.includes(result.hex.toUpperCase());
    console.log(`   Current color: ${result.hex}`);
    console.log(`   RGB values: (${result.r}, ${result.g}, ${result.b})`);
    console.log(`   Position: (${result.x}, ${result.y})`);
    console.log(`   Is dummy value: ${isDummy}`);

    if (isDummy) {
        console.log('   ⚠️  WARNING: Color appears to be a dummy value');
    } else {
        console.log('   ✅ Color appears to be real (not dummy)');
    }

    // Test 3: Test multiple positions
    console.log('\n3. Testing multiple mouse positions...');
    const testPositions = [
        { x: 100, y: 100, name: 'Top-left area' },
        { x: 500, y: 300, name: 'Center area' },
        { x: 800, y: 600, name: 'Bottom-right area' }
    ];

    let differentColors = 0;
    const colors = [];

    for (const pos of testPositions) {
        try {
            robot.moveMouse(pos.x, pos.y);
            await delay(200); // Give time for mouse to move
            
            const posResult = robot.getMouseColor();
            colors.push(posResult.hex);
            console.log(`   ${pos.name} (${pos.x}, ${pos.y}): ${posResult.hex} RGB(${posResult.r},${posResult.g},${posResult.b})`);
            
            // Check if this color is different from previous ones
            if (colors.filter(c => c === posResult.hex).length === 1) {
                differentColors++;
            }
        } catch (error) {
            console.log(`   ❌ ERROR at ${pos.name}: ${error.message}`);
        }
    }

    console.log(`   Different colors found: ${differentColors}/${testPositions.length}`);
    if (differentColors > 1) {
        console.log('   ✅ Multiple different colors detected - likely real');
    } else {
        console.log('   ⚠️  WARNING: All colors are the same - might be dummy values');
    }

    // Test 4: Test getPixelColor vs getMouseColor
    console.log('\n4. Comparing getMouseColor vs getPixelColor...');
    try {
        const mousePos = robot.getMousePos();
        const mouseResult = robot.getMouseColor();
        const pixelColor = robot.getPixelColor(mousePos.x, mousePos.y);
        
        console.log(`   Mouse position: (${mousePos.x}, ${mousePos.y})`);
        console.log(`   getMouseColor().hex: ${mouseResult.hex}`);
        console.log(`   getPixelColor(): ${pixelColor}`);
        
        if (mouseResult.hex === pixelColor) {
            console.log('   ✅ Colors match - getMouseColor is working correctly');
        } else {
            console.log('   ⚠️  WARNING: Colors don\'t match - possible issue');
        }
    } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
    }

    // Test 5: Performance test
    console.log('\n5. Performance test (multiple rapid calls)...');
    const startTime = Date.now();
    const iterations = 100;

    try {
        for (let i = 0; i < iterations; i++) {
            robot.getMouseColor();
        }
        const endTime = Date.now();
        const duration = endTime - startTime;
        const avgTime = duration / iterations;
        
        console.log(`   ${iterations} calls completed in ${duration}ms`);
        console.log(`   Average time per call: ${avgTime.toFixed(2)}ms`);
        
        if (avgTime < 10) {
            console.log('   ✅ Performance is good');
        } else {
            console.log('   ⚠️  Performance might be slow');
        }
    } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
    }

    // Test 6: Architecture verification
    console.log('\n6. Architecture verification...');
    const os = require('os');
    const arch = os.arch();
    const platform = os.platform();

    console.log(`   Platform: ${platform}`);
    console.log(`   Architecture: ${arch}`);
    console.log(`   Expected for Apple Silicon: arm64`);

    if (arch === 'arm64' && platform === 'darwin') {
        console.log('   ✅ Running on Apple Silicon (ARM64)');
    } else {
        console.log('   ⚠️  Not running on Apple Silicon');
    }

    // Test 7: RGB to Hex conversion verification
    console.log('\n7. RGB to Hex conversion verification...');
    try {
        const testResult = robot.getMouseColor();
        const expectedHex = `#${testResult.r.toString(16).padStart(2, '0')}${testResult.g.toString(16).padStart(2, '0')}${testResult.b.toString(16).padStart(2, '0')}`.toUpperCase();
        
        console.log(`   RGB: (${testResult.r}, ${testResult.g}, ${testResult.b})`);
        console.log(`   Expected hex: ${expectedHex}`);
        console.log(`   Actual hex: ${testResult.hex}`);
        
        if (testResult.hex.toUpperCase() === expectedHex) {
            console.log('   ✅ RGB to Hex conversion is correct');
        } else {
            console.log('   ⚠️  WARNING: RGB to Hex conversion mismatch');
        }
    } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
    }

    // Test 8: Real vs Dummy detection
    console.log('\n8. Enhanced dummy detection...');
    try {
        const results = [];
        for (let i = 0; i < 10; i++) {
            const res = robot.getMouseColor();
            results.push(res.hex);
            await delay(100);
        }
        
        const uniqueColors = [...new Set(results)];
        console.log(`   Colors sampled: ${results.join(', ')}`);
        console.log(`   Unique colors: ${uniqueColors.length}`);
        console.log(`   Total samples: ${results.length}`);
        
        if (uniqueColors.length > 3) {
            console.log('   ✅ Multiple unique colors detected - likely real');
        } else if (uniqueColors.length === 1) {
            console.log('   ⚠️  Only one color detected - might be dummy');
        } else {
            console.log('   ⚠️  Limited color variation - possible dummy');
        }
    } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
    }

    // Final summary
    console.log('\n==================================================');
    console.log('🎯 TEST SUMMARY:');
    console.log('==================================================');

    const allTests = [
        'Basic functionality',
        'Dummy value check',
        'Multiple positions',
        'Color consistency',
        'Performance',
        'Architecture',
        'RGB to Hex conversion',
        'Enhanced dummy detection'
    ];

    console.log('Tests completed:');
    allTests.forEach((test, index) => {
        console.log(`   ${index + 1}. ${test}`);
    });

    console.log('\n✅ ARM-specific safety improvements verification completed!');
    console.log('If all tests passed, getMouseColor is working correctly on Apple Silicon.');
}

// Run the tests
runTests().catch(console.error); 