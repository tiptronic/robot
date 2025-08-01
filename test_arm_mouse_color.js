#!/usr/bin/env node

const robot = require('./index.js');

console.log('🔍 ARM Mouse Color Test - Apple Silicon Compatibility');
console.log('===================================================\n');

// Test configuration
const TEST_ITERATIONS = 20;
const MOUSE_MOVE_DELAY = 100; // ms

// Helper function to check if result is dummy
function isDummyResult(result) {
    return result.hasError === true || 
           (result.r === 0 && result.g === 0 && result.b === 0 && result.hex === '#000000');
}

// Helper function to check if result is valid
function isValidColor(result) {
    return !isDummyResult(result) && 
           typeof result.r === 'number' && 
           typeof result.g === 'number' && 
           typeof result.b === 'number' &&
           /^#[0-9A-F]{6}$/i.test(result.hex) &&
           result.r >= 0 && result.r <= 255 &&
           result.g >= 0 && result.g <= 255 &&
           result.b >= 0 && result.b <= 255;
}

// Test 1: System Information
console.log('1. System Information');
console.log('   - Platform:', process.platform);
console.log('   - Architecture:', process.arch);
console.log('   - Node version:', process.version);
console.log('   - Process ID:', process.pid);

// Test 2: Resource Validity Check
console.log('\n2. Resource Validity Check');
try {
    const isValid = robot.isResourcesValid();
    console.log('   ✅ isResourcesValid:', isValid);
} catch (error) {
    console.log('   ❌ isResourcesValid failed:', error.message);
}

// Test 3: Initial getMouseColor Test
console.log('\n3. Initial getMouseColor Test');
try {
    const initialResult = robot.getMouseColor();
    console.log('   Result:', initialResult);
    console.log('   Is dummy:', isDummyResult(initialResult));
    console.log('   Is valid:', isValidColor(initialResult));
} catch (error) {
    console.log('   ❌ Initial test failed:', error.message);
}

// Test 4: Multiple getMouseColor Tests
console.log('\n4. Multiple getMouseColor Tests');
let realColorCount = 0;
let dummyColorCount = 0;
let errorCount = 0;
const results = [];

for (let i = 0; i < TEST_ITERATIONS; i++) {
    try {
        const result = robot.getMouseColor();
        results.push(result);
        
        if (isDummyResult(result)) {
            dummyColorCount++;
            console.log(`   Test ${i + 1}: ❌ Dummy result (${result.hex})`);
        } else if (isValidColor(result)) {
            realColorCount++;
            console.log(`   Test ${i + 1}: ✅ Real color (${result.hex}) at (${result.x}, ${result.y})`);
        } else {
            errorCount++;
            console.log(`   Test ${i + 1}: ⚠️  Invalid format:`, result);
        }
        
        // Small delay between tests
        if (i < TEST_ITERATIONS - 1) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    } catch (error) {
        errorCount++;
        console.log(`   Test ${i + 1}: ❌ Exception: ${error.message}`);
    }
}

console.log(`\n📊 Test Summary:`);
console.log(`   - Real colors: ${realColorCount}/${TEST_ITERATIONS} (${(realColorCount/TEST_ITERATIONS*100).toFixed(1)}%)`);
console.log(`   - Dummy results: ${dummyColorCount}/${TEST_ITERATIONS} (${(dummyColorCount/TEST_ITERATIONS*100).toFixed(1)}%)`);
console.log(`   - Errors: ${errorCount}/${TEST_ITERATIONS} (${(errorCount/TEST_ITERATIONS*100).toFixed(1)}%)`);

// Test 5: Mouse Movement Test
console.log('\n5. Mouse Movement Test');
console.log('   Moving mouse to different positions...');

const testPositions = [
    { x: 100, y: 100 },
    { x: 200, y: 200 },
    { x: 300, y: 300 },
    { x: 400, y: 400 },
    { x: 500, y: 500 }
];

for (let i = 0; i < testPositions.length; i++) {
    const pos = testPositions[i];
    try {
        // Move mouse to position
        robot.moveMouse(pos.x, pos.y);
        await new Promise(resolve => setTimeout(resolve, MOUSE_MOVE_DELAY));
        
        // Get color at new position
        const result = robot.getMouseColor();
        console.log(`   Position ${i + 1} (${pos.x}, ${pos.y}): ${result.hex} ${isDummyResult(result) ? '(dummy)' : '(real)'}`);
    } catch (error) {
        console.log(`   Position ${i + 1}: ❌ Error: ${error.message}`);
    }
}

// Test 6: getPixelColor Test
console.log('\n6. getPixelColor Test');
try {
    const pixelColor = robot.getPixelColor(100, 100);
    console.log('   getPixelColor at (100, 100):', pixelColor);
} catch (error) {
    console.log('   ❌ getPixelColor failed:', error.message);
}

// Test 7: Performance Test
console.log('\n7. Performance Test');
const performanceResults = [];
for (let i = 0; i < 10; i++) {
    const start = process.hrtime.bigint();
    try {
        robot.getMouseColor();
        const end = process.hrtime.bigint();
        const duration = Number(end - start) / 1000000;
        performanceResults.push(duration);
    } catch (error) {
        performanceResults.push(-1); // Error marker
    }
}

const validPerformanceResults = performanceResults.filter(r => r > 0);
if (validPerformanceResults.length > 0) {
    const avgDuration = validPerformanceResults.reduce((a, b) => a + b, 0) / validPerformanceResults.length;
    const minDuration = Math.min(...validPerformanceResults);
    const maxDuration = Math.max(...validPerformanceResults);
    console.log(`   Average performance: ${avgDuration.toFixed(2)}ms`);
    console.log(`   Min performance: ${minDuration.toFixed(2)}ms`);
    console.log(`   Max performance: ${maxDuration.toFixed(2)}ms`);
} else {
    console.log('   ❌ All performance tests failed');
}

// Test 8: Error Handling Test
console.log('\n8. Error Handling Test');
try {
    const errorResult = robot.getPixelColor(-1, -1);
    console.log('   Error handling result:', errorResult);
    console.log('   Has error flag:', errorResult.hasError);
} catch (error) {
    console.log('   ❌ Error handling failed:', error.message);
}

// Final Assessment
console.log('\n🎯 Final Assessment');
console.log('==================');

if (realColorCount > 0) {
    console.log('✅ SUCCESS: getMouseColor is returning real colors on Apple Silicon');
    console.log(`   - ${realColorCount} real color results out of ${TEST_ITERATIONS} tests`);
    console.log('   - ARM-specific safety improvements are working correctly');
} else {
    console.log('❌ ISSUE: getMouseColor is only returning dummy results');
    console.log('   - This may indicate overly aggressive safety checks');
    console.log('   - Consider reviewing ARM-specific initialization logic');
}

if (dummyColorCount > 0) {
    console.log(`⚠️  NOTE: ${dummyColorCount} dummy results detected`);
    console.log('   - This may be due to timing or permission issues');
    console.log('   - Consider testing with different mouse positions');
}

if (errorCount > 0) {
    console.log(`⚠️  NOTE: ${errorCount} errors occurred during testing`);
    console.log('   - This may indicate stability issues on ARM');
}

console.log('\n📋 Detailed Results:');
results.forEach((result, index) => {
    if (index < 5) { // Show first 5 results
        console.log(`   Test ${index + 1}: ${JSON.stringify(result)}`);
    }
});

console.log('\n�� Test completed!'); 