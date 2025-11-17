const fs = require('fs');
const path = require('path');

// Path to html-webpack-plugin
const pluginPath = path.join(
  __dirname,
  'node_modules',
  'html-webpack-plugin',
  'index.js'
);

if (fs.existsSync(pluginPath)) {
  let content = fs.readFileSync(pluginPath, 'utf8');
  
  // Check if already patched
  if (!content.includes('// PATCHED FOR NODE 25')) {
    // Add polyfill at the top of the file
    const patch = `
// PATCHED FOR NODE 25
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {}
  };
}
`;
    content = patch + content;
    fs.writeFileSync(pluginPath, content, 'utf8');
    console.log('✅ Successfully patched html-webpack-plugin for Node 25');
  } else {
    console.log('✅ html-webpack-plugin already patched');
  }
} else {
  console.log('⚠️ html-webpack-plugin not found');
}
