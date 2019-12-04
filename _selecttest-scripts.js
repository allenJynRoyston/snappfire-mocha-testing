const Mocha = require('mocha'),
      fs = require('fs'),
      path = require('path');

const mocha = new Mocha();
const testDir = 'test'
const files = []

files.forEach(file => {
  mocha.addFile(
    path.join('test', `${file}.test.js`)
  );
})

// Run the tests.
mocha.run(function(failures) {
  process.exitCode = failures ? 1 : 0;  // exit with non-zero status if there were failures
});