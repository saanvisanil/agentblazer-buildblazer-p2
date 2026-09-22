const Module = require('module');
const path = require('path');

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function(request, parent, isMain, options) {
  if (request.startsWith('@/')) {
    request = request.replace(/^@\//, `${process.cwd()}/`);
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};
