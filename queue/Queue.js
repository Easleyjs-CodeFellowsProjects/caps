'use strict';
const Chance = require('chance');
const chance = new Chance();

class Queue {
    constructor() {
        this.queue = {}
    }

    peekQueue() {
        console.log(this.queue);
    }

    createStoreQueue(storeName) {
        this.queue[storeName] = {
            orders: []
        }
    }

    hasQueue(storeName) {
        return Boolean(this.queue[storeName])
    }

    enqueue(storeName, payload) {
        if (!this.hasQueue(storeName)) {
            this.createStoreQueue(storeName)
        }
        const orderId = `${chance.letter()}${chance.letter()}-${chance.integer({ min: 1000000, max: 3000000})}`.toUpperCase();
        const orderRecord = {
            customerId: payload.customerId || storeName,
            orderId: payload.orderId || orderId,
            order: payload
        }
        this.queue[storeName].orders.push(orderRecord);
        return orderRecord
    }

    dequeue(storeName) {
        return this.queue[storeName].orders.shift();
    }

    // Method to remove pickup entries for Drivers
    remove( storeName, orderId ) {
        let existingOrders = this.queue[storeName].orders;
        existingOrders = existingOrders.filter(( order ) => order.orderId !== orderId );
    }

    // storeName parameter there for stores to get only their queue. 
    // Without passing storeName, will get all orders for driver.
    getAll(storeName) {
        if (storeName) {
            const currOrders = [ ...this.queue[storeName].orders ];
            this.queue[storeName].orders = [];
            return currOrders
        }
        else {
            let currOrders = [];
            Object.keys(this.queue).forEach( storeQueue => {
                currOrders.push( ...this.queue[storeQueue].orders )
                this.queue[storeQueue].orders = [];
            })
            return currOrders
        }
    }
}

module.exports = Queue;