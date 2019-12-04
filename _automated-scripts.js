const Mocha = require('mocha'),
      fs = require('fs'),
      path = require('path');

const mocha = new Mocha();
const testDir = 'test'

// Add each .js file to the mocha instance
fs.readdirSync(testDir).filter(function(file) {    
  return file.substr(-3) === '.js';
}).forEach(function(file) {
  mocha.addFile(
      path.join(testDir, file)
  );
});

// Run the tests.
mocha.run(function(failures) {
  process.exitCode = failures ? 1 : 0;  // exit with non-zero status if there were failures
});