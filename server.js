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

// built-in connection event -> telling the server to wait for client(socket) connections

capsServer.on('connection', function(socket){
   console.log('Client connected')
   
// try putting listeners here that way they run before room joins if it doesn't work under the join


   // Put Vendor in their store room, and Driver in driver room
   socket.on('join', (data) => {
    if (data.clientType === 'vendor') {
        socket.join(data.storeName);

        //possibly do emit here to let them know they've been put in their store room
        console.log(`Client type: ${data.clientType} joined room: ${data.storeName}`);

        // listen for pickups from Vendor/Store channel, do emit to Driver(s)
        //curryPickup((socket) => (payload) => {})
        socket.on('pickup', (data) => {
         console.log('EVENT: \nPickup:\n', data);
         capsServer.to('driver').emit('pickup', data);
         //.to(data.storeName)
        })
    }
    if (data.clientType === 'driver') {
        socket.join('driver'); // driver should always join first so they can listen for pickups

        //possibly do emit here to let them know they've been put in their store room
        console.log(`${data.clientType} joined driver room.`);

        // listen for in-transit
        socket.on('in-transit', (data) => {
            console.log('EVENT: \nIn-Transit:\n', data);
        })

        // listen for delivery, emit to appropriate Vendor/Store
        socket.on('delivered', (data) => {
            console.log('EVENT: \nDelivered:\n', data);
            socket.to(data.storeName).emit('delivered', { customer: data.customer });
        })
    }

   })


   

   //capsServer.on()

})
