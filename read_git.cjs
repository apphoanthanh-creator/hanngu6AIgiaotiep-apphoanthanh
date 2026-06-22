const { execSync } = require('child_process');

try {
  console.log('--- GIT STATUS ---');
  console.log(execSync('git status', { encoding: 'utf8' }));

  console.log('--- GIT COMIT LOG ---');
  console.log(execSync('git log --oneline -n 10', { encoding: 'utf8' }));

  console.log('--- SHOW RECENT MODIFICATIONS TO CHATVIEW ---');
  console.log(execSync('git log -p -n 3 -- components/ChatView.tsx', { encoding: 'utf8' }));
} catch (error) {
  console.error('Git execution failed:', error.message);
}
