const fs = require('fs');
const path = require('path');

function searchAllFilesNoFilter(dir) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (file === 'node_modules' || file === 'dist' || file === '.git' || file === '.next' || file === 'proc' || file === 'sys' || file === 'dev' || file === 'usr' || file === 'lib' || file === 'lib64' || file === 'bin' || file === 'sbin') continue;
          searchAllFilesNoFilter(fullPath);
        } else if (stat.isFile()) {
          // Check if file size is small enough to read
          if (stat.size < 5 * 1024 * 1024) {
            const content = fs.readFileSync(fullPath);
            if (content.includes('文中的“我”')) {
              console.log('CONTENT FOUND IN:', fullPath);
            }
          }
        }
      } catch (e) {}
    }
  } catch (e) {}
}

console.log('Searching all files for matching content...');
searchAllFilesNoFilter('/');
console.log('Done.');
