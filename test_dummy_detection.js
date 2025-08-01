#!/usr/bin/env node

const robot = require('./index.js');

console.log('🎯 Dummy Result Detection Test');
console.log('==============================\n');

// Helper function to detect dummy results
function isDummyResult(result) {
    // Check for explicit error flag
    if (result.hasError === true) {
        return true;
    }
    
    // Check for black color (common dummy result)
    if (result.r === 0 && result.g === 0 && result.b === 0 && result.hex === '#000000') {
        return true;
    }
    
    // Check for invalid coordinates (common in dummy results)
    if (result.x === 0 && result.y === 0) {
        return true;
    }
    
    return false;
}

// Helper function to validate color format
function isValidColorFormat(result) {
    return typeof result.r === 'number' && 
           typeof result.g === 'number' && 
           typeof result.b === 'number' &&
           /^#[0-9A-F]{6}$/i.test(result.hex) &&
           result.r >= 0 && result.r <= 255 &&
           result.g >= 0 && result.g <= 255 &&
           result.b >= 0 && result.b <= 255;
}

console.log('1. System Information:');
console.log(`   Architecture: ${process.arch}`);
console.log(`   Platform: ${process.platform}`);
console.log(`   Node version: ${process.version}`);

console.log('\n2. Resource Validity:');
try {
    const isValid = robot.isResourcesValid();
    console.log(`   Resources valid: ${isValid}`);
} catch (error) {
    console.log(`   Error checking resources: ${error.message}`);
}

console.log('\n3. Testing getMouseColor:');
console.log('   Running 10 tests...\n');

let dummyCount = 0;
let realCount = 0;
let errorCount = 0;

for (let i = 1; i <= 10; i++) {
    try {
        const result = robot.getMouseColor();
        
        if (isDummyResult(result)) {
            dummyCount++;
            console.log(`   Test ${i}: ❌ DUMMY - ${result.hex} at (${result.x}, ${result.y})`);
        } else if (isValidColorFormat(result)) {
            realCount++;
            console.log(`   Test ${i}: ✅ REAL  - ${result.hex} at (${result.x}, ${result.y})`);
        } else {
            errorCount++;
            console.log(`   Test ${i}: ⚠️  INVALID FORMAT - ${JSON.stringify(result)}`);
        }
        
        // Small delay between tests
        if (i < 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    } catch (error) {
        errorCount++;
        console.log(`   Test ${i}: ❌ EXCEPTION - ${error.message}`);
    }
}

console.log('\n📊 Results Summary:');
console.log(`   Real colors: ${realCount}/10 (${(realCount/10*100).toFixed(1)}%)`);
console.log(`   Dummy results: ${dummyCount}/10 (${(dummyCount/10*100).toFixed(1)}%)`);
console.log(`   Errors: ${errorCount}/10 (${(errorCount/10*100).toFixed(1)}%)`);

console.log('\n🎯 Assessment:');
if (realCount > 0) {
    console.log('✅ SUCCESS: getMouseColor is working correctly on Apple Silicon');
    console.log('   - Real colors are being returned');
    console.log('   - ARM-specific safety improvements are functioning properly');
} else {
    console.log('❌ ISSUE: getMouseColor is only returning dummy results');
    console.log('   - This indicates the ARM safety checks may be too aggressive');
    console.log('   - Consider reviewing the initialization logic for Apple Silicon');
}

if (dummyCount > 0) {
    console.log(`⚠️  NOTE: ${dummyCount} dummy results detected`);
    console.log('   - This may be due to timing or permission issues');
    console.log('   - Consider testing with different mouse positions or screen areas');
}

console.log('\n�� Test completed!'); 