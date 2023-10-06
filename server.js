/*
-- The Socket Server will create a namespace of caps that will receive all CAPS event traffic.
- Each Vendor and Driver Client will connect to the caps namespace.
- The server will emit specific events to each socket that is listening for their designated events from the Global Event Pool defined in the Server.

- Each Vendor will only emit and listen for specific events based on their Vendor ID. This will be managed by rooms within Socket.io.
- Each Driver will “pick up” a package when the vendor notifies the Server that an “order” is ready and simulate “in-transit” and “delivered” events.

**Ensure that client sockets are connecting to their appropriate room if specified.**

**Configure a Global Event Pool that every client socket should listen for:**
- **pickup** - this will be broadcast to all sockets except the sender.
- **in-transit** - this will be emitted only to Vendors that have joined the appropriate room.
- **delivered** - this will be be emitted only to Vendors that have joined the appropriate room.
NOTE: You may need to create an extra event here that allows clients to join rooms.
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

// For testing. Adding some Pickup events to the Driver queue to verify that join/getAll works correctly.
const testOrder = {
    customer: 'Roy Thomas',
    address: '1234 Main St., Omaha, NE 92630'
}
myVendorQueue.createStoreQueue('1-206-flowers');
myDriverQueue.createStoreQueue('1-206-flowers');
myDriverQueue.enqueue('1-206-flowers', testOrder);

// built-in connection event -> telling the server to wait for client(socket) connections

capsServer.on('connection', function(socket){
   console.log('Client connected')
   
   // Put Vendor in their store room, and Driver in driver room
   socket.on('join', async (data) => {
    if (data.clientType === 'vendor') {
        socket.join(data.storeName);

        //possibly do emit here to let them know they've been put in their store room
        console.log(`Client type: ${data.clientType} joined room: ${data.storeName}`);

        // Set up their Pickup and Delivery queues, if they don't already exist.
        if (!myVendorQueue.hasQueue(data.storeName)) {
            myVendorQueue.createStoreQueue(data.storeName);
        }
        if (!myDriverQueue.hasQueue(data.storeName)) {
            myDriverQueue.createStoreQueue(data.storeName);
        }    

        // *New* send the Vendor their current (delivered) orders in queue
        socket.on('getAllPickup', (data) => {
            const currDeliveredOrders = myVendorQueue.getAll(data.storeName);
            socket.to(data.storeName).emit('getAllDelivered', currDeliveredOrders);
        })

        // Listen for new pickups from Vendor/Store channel, do emit to Driver(s)
        //curryPickup((socket) => (payload) => {})
        // *New* adds pickup order to Driver queue
        socket.on('pickup', (data) => {
         
         console.log('EVENT: \nPickup:\n', data);
        
         // Adds metadata to original payload, stores in Driver queue
         const newPickup = myDriverQueue.enqueue(data.storeName, data);

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
            //console.log(currPickupOrders)
            socket.emit('getAllPickupResponse', currPickupOrders);
        })


        console.log(`${data.clientType} joined driver room.`);


        // Server listens for in-transit
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


   

   //capsServer.on()

})
