// scripts/build-prebuilds.js
const { execSync } = require('child_process');

const targets = [
  { platform: 'darwin', arch: 'x64' },
  { platform: 'darwin', arch: 'arm64' },
  { platform: 'win32', arch: 'x64' }
];

for (const { platform, arch } of targets) {
  const cmd = `npx prebuild --backend=node-gyp --platform=${platform} --arch=${arch} --strip`;
  console.log(`\nBuilding for ${platform}-${arch}...`);
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    console.error(`❌ Failed to build for ${platform}-${arch}:`, err.message);
  }
}