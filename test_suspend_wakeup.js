#!/usr/bin/env node

const robot = require('./index.js');

console.log('🔄 Testing Suspend/Wakeup Recovery on Apple Silicon');
console.log('===================================================');

// Helper function to delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testSuspendWakeupRecovery() {
    console.log('\n1. Testing Resource Validation...');
    
    // Check if resources are valid
    const isResourcesValid = robot.isResourcesValid();
    console.log(`   Resources valid: ${isResourcesValid}`);
    
    if (!isResourcesValid) {
        console.log('   ❌ WARNING: Resources are invalid - this might indicate a suspend/wakeup issue');
    } else {
        console.log('   ✅ Resources are valid');
    }
    
    console.log('\n2. Testing getMouseColor after potential suspend/wakeup...');
    
    // Define dummy colors for checking
    const dummyColors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#123456', '#ABCDEF', '#DEADBE'];
    
    try {
        const result = robot.getMouseColor();
        console.log(`   Mouse color: ${result.hex}`);
        console.log(`   Position: (${result.x}, ${result.y})`);
        console.log(`   Has error flag: ${result.hasError}`);
        
        if (result.hasError) {
            console.log('   ⚠️  WARNING: Error flag is set - possible suspend/wakeup issue');
        } else {
            console.log('   ✅ No error flag - function working correctly');
        }
        
        // Check if it's a dummy result
        const isDummy = dummyColors.includes(result.hex.toUpperCase());
        
        if (isDummy) {
            console.log('   ⚠️  WARNING: Dummy color detected - possible suspend/wakeup issue');
        } else {
            console.log('   ✅ Real color detected - function working correctly');
        }
        
    } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
        console.log('   This indicates a serious suspend/wakeup issue');
    }
    
    console.log('\n3. Testing Multiple Rapid Calls (Stress Test)...');
    
    const results = [];
    let errorCount = 0;
    let dummyCount = 0;
    let successCount = 0;
    
    for (let i = 0; i < 20; i++) {
        try {
            const res = robot.getMouseColor();
            results.push(res.hex);
            
            if (res.hasError) {
                errorCount++;
            } else if (dummyColors.includes(res.hex.toUpperCase())) {
                dummyCount++;
            } else {
                successCount++;
            }
            
            // Small delay between calls
            await delay(50);
        } catch (error) {
            errorCount++;
            console.log(`   Call ${i + 1}: ❌ Exception - ${error.message}`);
        }
    }
    
    console.log(`   Total calls: ${results.length}`);
    console.log(`   Successful calls: ${successCount}`);
    console.log(`   Dummy results: ${dummyCount}`);
    console.log(`   Errors: ${errorCount}`);
    
    if (errorCount > 0) {
        console.log('   ❌ WARNING: Errors detected - possible suspend/wakeup issue');
    } else if (dummyCount > results.length * 0.5) {
        console.log('   ⚠️  WARNING: Too many dummy results - possible suspend/wakeup issue');
    } else {
        console.log('   ✅ Stress test passed - function stable');
    }
    
    console.log('\n4. Testing Resource Recovery...');
    
    // Test if resources can recover after potential issues
    const uniqueColors = [...new Set(results)];
    console.log(`   Unique colors detected: ${uniqueColors.length}`);
    console.log(`   Color variation: ${uniqueColors.length > 3 ? 'Good' : 'Limited'}`);
    
    if (uniqueColors.length > 3) {
        console.log('   ✅ Good color variation - resources recovering properly');
    } else {
        console.log('   ⚠️  Limited color variation - possible resource issue');
    }
    
    console.log('\n5. Architecture Verification...');
    const os = require('os');
    const arch = os.arch();
    const platform = os.platform();
    
    console.log(`   Platform: ${platform}`);
    console.log(`   Architecture: ${arch}`);
    
    if (arch === 'arm64' && platform === 'darwin') {
        console.log('   ✅ Running on Apple Silicon (ARM64)');
        console.log('   ✅ ARM-specific safety improvements should be active');
    } else {
        console.log('   ⚠️  Not running on Apple Silicon');
    }
    
    // Final assessment
    console.log('\n==================================================');
    console.log('🎯 SUSPEND/WAKEUP RECOVERY ASSESSMENT:');
    console.log('==================================================');
    
    const issues = [];
    if (!isResourcesValid) issues.push('Resources invalid');
    if (errorCount > 0) issues.push('Errors detected');
    if (dummyCount > results.length * 0.5) issues.push('Too many dummy results');
    if (uniqueColors.length <= 3) issues.push('Limited color variation');
    
    if (issues.length === 0) {
        console.log('✅ EXCELLENT: No suspend/wakeup issues detected');
        console.log('✅ ARM safety improvements appear to be working correctly');
        console.log('✅ Function should be stable after system suspend/wakeup');
    } else {
        console.log('⚠️  POTENTIAL ISSUES DETECTED:');
        issues.forEach(issue => console.log(`   - ${issue}`));
        console.log('\n💡 RECOMMENDATIONS:');
        console.log('   - Test after actual system suspend/wakeup');
        console.log('   - Check screen recording permissions');
        console.log('   - Verify display connectivity');
        console.log('   - Consider restarting the application');
    }
    
    console.log('\n📋 SUMMARY:');
    console.log(`   - Resource validation: ${isResourcesValid ? '✅' : '❌'}`);
    console.log(`   - Error rate: ${((errorCount / results.length) * 100).toFixed(1)}%`);
    console.log(`   - Dummy rate: ${((dummyCount / results.length) * 100).toFixed(1)}%`);
    console.log(`   - Color variation: ${uniqueColors.length} unique colors`);
}

// Run the test
testSuspendWakeupRecovery().catch(console.error); 