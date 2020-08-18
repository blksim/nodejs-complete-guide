const sum = (a, b) => {
  if (a && b) {
    return a + b;
  }
  return new Error('Invalid arguments');
};

try {
  console.log(sum(1));
} catch (error) {
  console.log('Error occurred')
}

console.log(sum(1));
console.log('This works!');