const Queue = require('./Queue');
const myQueue = new Queue();
const storeName = 'JB\'s Super Socks';
const storeName2 = 'Insane Sockery';

const testOrder = {
    orderId: '12345678',
    customer: 'Roy Thomas',
}
const testOrder2 = {
    orderId: '654321',
    customer: 'Cold Feet James'
}
const testOrder3 = {
    orderId: 'ASBSB315151513',
    customer: 'Bigfoot'
}
const testOrder4 = {
    orderId: 'JA89q3513511',
    customer: 'Mark Trainor'
}


//Add "store 1" queue
// Check for queue, if it doesn't exist, create one
if (!myQueue.hasQueue(storeName)) {
    myQueue.createStoreQueue(storeName);
}

//Add "store 2" queue
// Check for queue, if it doesn't exist, create one
if (!myQueue.hasQueue(storeName2)) {
    myQueue.createStoreQueue(storeName2);
}

// Add 2 orders to the queue
console.log(myQueue.enqueue(storeName, testOrder));
console.log(myQueue.enqueue(storeName, testOrder2));

// Add 2 more to other store's queue
console.log(myQueue.enqueue(storeName2, testOrder3));
console.log(myQueue.enqueue(storeName2, testOrder4));

// Get all so far.
//console.log('get all:', myQueue.getAll(storeName2))
//console.log('get all:', myQueue.getAll())
myQueue.getAll();

// Show queue contents so far.
console.log('Queue contents:', myQueue.queue) // [storeName].orders.length)

// Dequeue
console.log(myQueue.enqueue(storeName, testOrder));
console.log(myQueue.dequeue(storeName));
