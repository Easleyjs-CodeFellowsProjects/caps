'use strict';

const eventEmitter = require('./eventPool.js');
const { Vendor } = require('./vendor/index.js');

const myVendor = new Vendor("JB's Deluxe Swag");
myVendor.listenForDelivery();

eventEmitter.on('pickup', (payload) => { console.log(payload) }); // this will go in driver index..

const testOrder = {
    time: '12:00:00 AM',
    orderId: 'A122346B52',
    customer: 'Kevin Taylor',
    address: '8825 Hacienda Rd, Austin, TX'
};
myVendor.emitPickup(testOrder);

eventEmitter.emit('delivered', 'Joe Schmoe'); // this will go in driver index too..
