const fs = require('fs');
const path = require('path');

function searchAllFiles(dir) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (file === 'node_modules' || file === 'dist' || file === '.git' || file === '.next' || file === 'proc' || file === 'sys' || file === 'dev') continue;
          searchAllFiles(fullPath);
        } else if (stat.isFile()) {
          const lowerName = file.toLowerCase();
          if (lowerName.includes('transcript') || lowerName.includes('log') || lowerName.endsWith('.jsonl') || lowerName.includes('history')) {
            console.log('MATCHED FILE:', fullPath);
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              if (content.includes('文中的')) {
                console.log('-> CONTAINS 文中的 !!');
              }
            } catch (e) {}
          }
        }
      } catch (e) {}
    }
  } catch (e) {}
}

console.log('Scanning for logs...');
searchAllFiles('/');
console.log('Done.');
