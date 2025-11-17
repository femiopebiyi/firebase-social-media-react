const fs = require('fs');
const path = require('path');

// Polyfill localStorage globally before any modules load
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null
  };
}

console.log('✅ localStorage polyfill loaded');
