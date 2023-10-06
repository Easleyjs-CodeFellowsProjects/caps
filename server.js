/*
-- The Socket Server will create a namespace of caps that will receive all CAPS event traffic.
- Each Vendor and Driver Client will connect to the caps namespace.
- The server will emit specific events to each socket that is listening for their designated events from the Global Event Pool defined in the Server.

*/

const { Server } = require('socket.io');

const PORT = process.env.PORT || 3002;

// generic server, no namespace
let server = new Server(PORT); // as soon as this line runs, we have something to connect to.

// namespace server
let capsServer = server.of('/caps');
console.log('CAPS Server Started');

// Queues
const Queue = require('./queue/Queue');
const myVendorQueue = new Queue();
const myDriverQueue = new Queue();

// built-in connection event -> telling the server to wait for client(socket) connections

capsServer.on('connection', function(socket){
   console.log('Client connected')

   // Put Vendor in their store room, and Driver in driver room
   socket.on('join', (data) => {
       if (data.clientType === 'vendor') {
                      
           socket.join(data.storeName);
           
           // *New* send the Vendor their current (delivered) orders in queue
           socket.on('getAllDelivered', (data) => {        
               const currDeliveredOrders = myVendorQueue.getAll(data.storeName);
               console.log('Sending delivered queue to Vendor');
               socket.emit('getAllDeliveredResponse', currDeliveredOrders);
           })

        console.log(`Client type: ${data.clientType} joined room: ${data.storeName}`);

        // Set up their Pickup and Delivery queues, if they don't already exist.
        if (!myVendorQueue.hasQueue(data.storeName)) {
            myVendorQueue.createStoreQueue(data.storeName);
        }
        if (!myDriverQueue.hasQueue(data.storeName)) {
            myDriverQueue.createStoreQueue(data.storeName);
        }    

        // Listen for new pickups from Vendor/Store channel, do emit to Driver(s)
        //curryPickup((socket) => (payload) => {})
        // *New* adds pickup order to Driver queue
        socket.on('pickup', (data) => {
         
            
            // Adds metadata to original payload, stores in Driver queue
            const newPickup = myDriverQueue.enqueue(data.storeName, data.order);
            
            console.log('EVENT: \nPickup:\n', newPickup);

            // Then sends updated payload object to Driver
            capsServer.to('driver').emit('pickup', newPickup);
        })

        // Acknowledge Delivery (completed), remove from Vendor queue
        socket.on('deliveryAck', (data) => {
            myVendorQueue.remove(data.customerId, data.orderId);
        });
    }
    if (data.clientType === 'driver') {

        socket.join('driver');

        // *New* send the Driver their queued pickup orders
        socket.on('getAllPickup', () => {
            const currPickupOrders = myDriverQueue.getAll();
            console.log('Sending pickup queue to Driver');
            socket.emit('getAllPickupResponse', currPickupOrders);
        })

        console.log(`${data.clientType} joined driver room.`);

        // listen for in-transit
        socket.on('in-transit', (data) => {
            console.log('EVENT: \nIn-Transit:\n', data);
        })

        // listen for delivery, emit to appropriate Vendor/Store
        socket.on('delivered', (data) => {
            console.log('EVENT: \nDelivered:\n', data);

            // Remove from Driver queue (of pickups)
            myDriverQueue.remove(data.customerId, data.orderId);

            // Add to Vendor "Delivered" queue
            const newDelivery = myVendorQueue.enqueue(data.customerId, data);

            socket.to(data.storeName).emit('delivered', newDelivery);
        })
    }
   })
})
