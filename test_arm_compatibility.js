const robot = require('./index.js');

console.log('🧪 Testing ARM-specific improvements...\n');

// Test 1: Check architecture
console.log('1. Architecture detection...');
console.log('   - Platform:', process.platform);
console.log('   - Architecture:', process.arch);
console.log('   - Node version:', process.version);

// Test 2: Check resource validity
console.log('\n2. Resource validity...');
try {
    const isValid = robot.isResourcesValid();
    console.log('✅ isResourcesValid:', isValid);
} catch (error) {
    console.log('❌ isResourcesValid failed:', error.message);
}

// Test 3: Test getMouseColor multiple times
console.log('\n3. Testing getMouseColor consistency...');
let successCount = 0;
let errorCount = 0;

for (let i = 0; i < 10; i++) {
    try {
        const result = robot.getMouseColor();
        if (result.hasError) {
            errorCount++;
            console.log(`   Test ${i + 1}: ❌ Dummy result`);
        } else {
            successCount++;
            console.log(`   Test ${i + 1}: ✅ Real color (${result.hex})`);
        }
    } catch (error) {
        errorCount++;
        console.log(`   Test ${i + 1}: ❌ Exception: ${error.message}`);
    }
}

console.log(`\n📊 Summary: ${successCount} real results, ${errorCount} dummy results`);
console.log(`📈 Success rate: ${(successCount / 10 * 100).toFixed(1)}%`);

// Test 4: Test getPixelColor
console.log('\n4. Testing getPixelColor...');
try {
    const pixelColor = robot.getPixelColor(100, 100);
    console.log('✅ getPixelColor:', pixelColor);
} catch (error) {
    console.log('❌ getPixelColor failed:', error.message);
}

// Test 5: Test error handling
console.log('\n5. Testing error handling...');
try {
    const errorResult = robot.getPixelColor(-1, -1);
    console.log('✅ Error handling:', errorResult);
    console.log('   - Has error:', errorResult.hasError);
} catch (error) {
    console.log('❌ Error handling failed:', error.message);
}

console.log('\n🎉 ARM compatibility test completed!');

// Performance test
console.log('\n6. Performance test...');
const start = process.hrtime.bigint();
robot.getMouseColor();
const end = process.hrtime.bigint();
const duration = Number(end - start) / 1000000;
console.log(`   getMouseColor performance: ${duration.toFixed(2)}ms`); 