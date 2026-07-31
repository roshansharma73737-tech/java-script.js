const { add, verifier, looping, getuser, getproduct } = require('./prac-1');
console.log(add(2, 3));
console.log(verifier(3));
console.log(verifier(20));
console.log(looping(1));
const user = getuser();
console.log(" User detail..!");
console.log(user);

console.log("-----------------");

const product = getproduct();
console.log("product detail..!");
console.log(product);