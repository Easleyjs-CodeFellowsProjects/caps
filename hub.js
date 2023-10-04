'use strict';

const { 
        listenForPickup, 
        listenForInTransit, 
        listenForDelivery 
      } = require('./eventPool.js');
const { Vendor } = require('./vendor/index.js');
const { Driver } = require('./driver/index.js');

// Hub Listeners
listenForPickup();
listenForInTransit();
listenForDelivery();

const myDriver = new Driver("Arnold Plummer");
myDriver.listenForPickup();

const myVendor = new Vendor("JB's Deluxe Swag");
myVendor.listenForDelivery();

const testOrder = {
    time: '12:00:00 AM',
    orderId: 'A122346B52',
    customer: 'Kevin Taylor',
    address: '8825 Hacienda Rd, Austin, TX'
};

myVendor.emitPickup(testOrder);

myDriver.emitDelivered(testOrder);
