const Queue = require('./Queue');

const myQueue = new Queue();
const storeName = "JB's Custom Swag";
const testOrder = {
    customer: 'Scott Free',
    address: '825 Main St, Placerville, CA 92110'
};
const testOrderTwo = {
    customer: 'Katrina Bowlby',
    address: '4554 Pasquale Shores Rd., Lake Havasu, AZ 72341'
}

describe('Queue should be able to be instantiated', () => {

    test('myQueue should exist', () => {
        //const myQueue = new Queue();
        expect(myQueue).toBeTruthy();
    })

    test('Queue should be able to create individual store queues', () => {
        myQueue.createStoreQueue(storeName);

        expect(myQueue.queue[storeName].orders).toStrictEqual([]);
    })

    test('Queue should be able to verify existence of individual store queues', () => {
        expect(myQueue.hasQueue(storeName)).toBeTruthy();
        expect(myQueue.hasQueue("Some Other Store")).toBeFalsy();
    });

    test('Queue should be able to enqueue new orders to a given store queue', () => {
        const results = myQueue.enqueue(storeName, testOrder);

        expect(results).toBeTruthy();
        expect(results[0].customerId).toBe(storeName);
        expect(results[0].order).toBe(testOrder);
    });

    test('Queue should be able to remove orders in a given store queue', () => {
        const orderIdToRemove = myQueue.queue[storeName].orders[0].orderId;

        myQueue.remove(storeName, orderIdToRemove);

        expect(myQueue.queue[storeName].orders).toStrictEqual([]);
    });

    test('Queue should be able to retrieve all orders in a given store queue', () => {
        const firstResults = myQueue.enqueue(storeName, testOrder);
        const moreResults = myQueue.enqueue(storeName, testOrderTwo);

        const allResults = myQueue.getAll(storeName);

        expect(allResults[0].customerId).toBe(storeName);
        expect(allResults[0].order.customer).toBe(testOrder.customer);
        expect(allResults[0].orderId).toBe(firstResults[0].orderId);

        expect(allResults[1].customerId).toBe(storeName);
        expect(allResults[1].order.customer).toBe(testOrderTwo.customer);
        expect(allResults[1].orderId).toBe(moreResults[0].orderId);
    });
})

