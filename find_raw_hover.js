const fs = require('fs');
const path = require('path');
const glob = require('glob');

// We use glob from current directory since we don't have it installed in a script.
// Wait, I can just use fs and path to traverse recursively.
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.css')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('src/styles');

let totalRawHovers = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  
  let inMedia = false;
  let inRawHover = false;
  let braces = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('@media') && (line.includes('hover: hover') || line.includes('pointer: fine'))) {
       inMedia = true;
       // Count braces to know when we exit
       // Wait, regex counting is better. 
    }
    
    // A simpler regex to find unwrapped hovers:
    // This is tricky. Let's just find lines with :hover that don't have @media nearby?
  }
}
