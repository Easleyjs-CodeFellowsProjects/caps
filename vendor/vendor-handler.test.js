/*
As a vendor, I want to alert the system when I have a package to be picked up.
As a vendor, I want to be notified when my package has been delivered.
*/

const { Vendor } = require('./index.js');
const { eventEmitter } = require('../eventPool');
const { createPickup, respondToDelivery } = require('./handler');

jest.mock('../eventPool');

describe('Vendor should be able to initiate Pickup events', () => {
    test('Should call .emit to initiate Pickup event with store name, order, and customer info', () => {
        const createPickupMock = jest.fn((storeName, orderDetails) => {
            return { storeName, orderDetails }
        })
        const myVendor = new Vendor("JB's Deluxe Swag");

        const orderDetails = {
            store: "JB's Deluxe Swag",
            orderId: 'AB123345',
            customer: 'Roy Jackson',
            address: 'Kansas City, MO',
        }

        eventEmitter.emit = jest.fn();

        myVendor.emitPickup(orderDetails);

        expect(eventEmitter.emit).toHaveBeenCalledWith('pickup', createPickup(myVendor.storeName, orderDetails))
    })
})

describe('Vendor should be able to listen for Delivered events from the Hub', () => {
    test('Should recieve a delivered event, and return a thank you message to the console', () => {
        const myVendor = new Vendor("JB's Deluxe Swag");

        const orderDetails = {
            store: myVendor.storeName,
            orderId: 'AB123345',
            customer: 'Roy Jackson',
            address: 'Kansas City, MO',
        }

        eventEmitter.on = jest.fn();

        myVendor.listenForDelivery(orderDetails);

        expect(eventEmitter.on).toHaveBeenCalledWith('delivered', expect.any(Function));
    })
})