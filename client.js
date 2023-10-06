'use strict';

const Driver = require('./driver/socketDriver');
const Vendor = require('./vendor/socketVendor');
const SERVER_URL = process.env.SERVER_URL || 'http://localhost';
const PORT = process.env.PORT || 3002
const CONNECTION_STRING = `${SERVER_URL}:${PORT}/caps`
const STORE_NAME = '1-206-flowers';
const STORE_NAME2 = 'acme-widgets';

const myDriver = new Driver( CONNECTION_STRING );
const myVendor = new Vendor( CONNECTION_STRING, STORE_NAME );

const orderDetails = {
    customer: 'Roy Thomas',
    address: '1234 Main St., Omaha, NE 92630'
}

console.log('Initializing Driver');
myDriver.connect();
myDriver.listenForPickup();

console.log('Initializing Vendor');
myVendor.connect();
myVendor.listenForDelivery();


console.log('Creating Delivery');
myVendor.createPickupEmit(orderDetails);
