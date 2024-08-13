const { execSync } = require('child_process');

const args = process.argv.slice(2);
const [package] = args.reverse();
const command = process.env.npm_lifecycle_event;

if (!command || !package) {
  process.exit(1);
}

try {
  execSync(`yarn workspace @modules/${package} ${command}`, { stdio: 'inherit' });
} catch (error) {
  console.error(`Failed to run script ${command} in module ${package}`);
  process.exit(1);
}
