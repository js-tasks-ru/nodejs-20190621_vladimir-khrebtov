function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Argument not of type Number');
  }
  return a + b;
}

module.exports = sum;
