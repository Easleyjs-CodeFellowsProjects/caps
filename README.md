# Event-Driven Server

Socket.IO and Event-driven "Package Delivery Service" Server with order queue

## Install instructions:

npm install

## Usage
node server.js to test server/queue. node client.js to test driver and vendor.

## Dependencies

jest socket.io socket.io-client

## Render.com URL:
https://caps-ywvq.onrender.com/

## Assignment instructions

# Phase 3 Requirements
In Phase 3, we are building a set of features to help manage deliveries made by CAPS Drivers. This will simulate a delivery driver receiving a list of orders from a Queue and “scanning” package codes on delivery. Retailers will be able to see in their dashboard or log, a list of all packages delivered in real time. Should a delivery driver deliver any packages while the retailer is not connected to the dashboard, the vendor client should be guaranteed to receive “delivery” notifications from the Queue system.

Here are the high level stories related to this new set of requirements.

As a vendor, I want to “subscribe” to “delivered” notifications so that I know when my packages are delivered.
As a vendor, I want to “catch up” on any “delivered” notifications that I might have missed so that I can see a complete log.
As a driver, I want to “subscribe” to “pickup” notifications so that I know what packages to deliver.
As a driver, I want to “catch up” on any “pickup” notifications I may have missed so that I can deliver everything.
As a driver, I want a way to “scan” a delivery so that the vendors know when a package has been delivered.

And as developers, here are some of the development stories that are newly relevant to the above.

As a developer, I want to create a system of tracking who is subscribing to each event.
As a developer, I want to place all inbound messages into a “queue” so that my application knows what events are to be delivered.
As a developer, I want to create a system for communicating when events have been delivered and received by subscribers.
As a developer, I want to delete messages from the queue after they’ve been received by a subscriber, so that I don’t re-send them.
As a developer, I want to create a system for allowing subscribers to retrieve all undelivered messages in their queue.

## Overview
We are adding a new module to the CAPS Application Server to guarantee that payloads from events are delivered to any Client Module that is listening for specific events. This lab will refactor the Server and Client Modules to persist payloads on the Server side and remove them once received by clients.

Our Server is going to have the same overall functionality, but we want to incorporate a few improvements to existing features:
We want a feature to keep a log of payloads that reach our system, organized by vendor and event type.
Payloads are “published” to the appropriate Clients for the appropriate events.
Client Vendor Applications used by retailers, should subscribe to appropriate Vendor Queues so that they can be alerted when a delivery was made.
The Client can ask for all undelivered messages from a particular Server Queue.
When a Client receives a message, it will need to let the hub server know that it was received.

----------------
### Server
#### Create a Message Queue that can store payloads for specific Clients.
Each payload that is read by the pickup event should be added to a Queue for Driver clients.
Each payload that is read by the delivered event should be added to a Queue for Vendor clients.

#### Add a received event to the Global Event Pool.
When this event is heard on the server, assume it’s a Client Module telling you a payload was successfully read.
The payload should include the client id, event name, and message id, so that you can delete it from the Queue.

#### Add a getAll event to the Global Event Pool.
The payload should include the client id and event name.
When this event is heard on the server, find each of the messages in the queue for the client, for the event specified.
Go through each of the entries for the client/event in the queue (if any) and broadcast them to the client.

#### Refactor the delivered, pickup, and in-transit events in the Global Event Pool.
We need to be able to add payloads to the appropriate Queue for specific Clients.
When these events are triggered, add the payload immediately to the appropriate Queue.
Broadcast the same event, with the following payload to all subscribers.
Note: The payload event value should correspond to either pickup or delivered; whichever is being emitted from the corresponding vendor or driver client(s).

 // payload example
 let newPayload = {
   event: 'appropriate-event-name', // either pickup or delivered
   messageId: order.orderId,  // unique id from the original payload
   clientId: `store-name`,  // either acme-widgets or 1-800-flowers
   order: payload,
 };

# Vendor Client Application(s)
Create 2 separate “stores” that use the Vendor Client module.
Create one store called acme-widgets and 1-800-flowers.
Connect to the CAPS Application Server using the caps namespace.
Both stores should “subscribe” to different Queues, since they are separate stores.
On startup, your client applications should trigger a getAll event that fetches all messages from the server that are in that Vendor’s Queue (events/messages they’ve not yet received).
Trigger the received event with the correct payload to the server.
Subscribe to the delivered Queue.
Each client should be able to receive payloads “published” to the delivered Queue.
We still want to log a confirmation with the “order-id” and payload.

# Driver Client Application
Refactor event logic to use Queues.
Make sure your Driver Client is subscribing to the appropriate Vendor Queues.
Upon connection, Driver Client can fetch any messages added to their subscribed Queues.

# Testing
Write unit tests for each event handler function (not event triggers themselves).
Use jest spies and/or mock functionality to assert that your handlers were called and ran as expected.
For our use case, was console.log() and .emit() called with the expected arguments?



## Phase 3
### Overview
The goal of this lab is to create a namespaced Socket.io event server, and to configure Vendor and Driver Client Modules.
The expected output of the 3 running applications is the same as it was in Phase 2.

### Event Hub (Server)
- The Socket Server will create a namespace of caps that will receive all CAPS event traffic.
- Each Vendor and Driver Client will connect to the caps namespace.
- The server will emit specific events to each socket that is listening for their designated events from the Global Event Pool defined in the Server.
- Each Vendor will only emit and listen for specific events based on their Vendor ID. This will be managed by rooms within Socket.io.
- Each Driver will “pick up” a package when the vendor notifies the Server that an “order” is ready and simulate “in-transit” and “delivered” events.

**Use the socket.io npm package to configure an event Server that can be started at a designated port using node.**
**Accept connections on a namespace called caps, and configure socket objects from clients.**
**Ensure that client sockets are connecting to their appropriate room if specified.**

**Configure a Global Event Pool that every client socket should listen for:**
- **pickup** - this will be broadcast to all sockets except the sender.
- **in-transit** - this will be emitted only to Vendors that have joined the appropriate room.
- **delivered** - this will be be emitted only to Vendors that have joined the appropriate room.
NOTE: You may need to create an extra event here that allows clients to join rooms.

### Vendor (Client)
- Connects to the CAPS Application Server using socket.io-client:
- Make sure your module connects to the caps namespace.

- Use the store name **1-206-flowers** to simulate a single vendor
- Upon connection, use the store name as a vendor id to join a room.
- Upon connection, simulate new customer orders:

- Create a payload object with your store name, order id, customer name, and address.
- Emit that message to the CAPS server with an event called pickup.
- Emit in a setInterval() to simulate multiple orders and observe system functionality.

- Listen for the delivered event coming in from the CAPS server.
- Console log: **Thank you for your order <customer-name>.**
- Optionally, you can exit the application using process.exit() or clearInterval(<interval-id>) within a setTimeout() to simulate multiple orders and then stop.

### Driver (Client)
- Connects to the CAPS Application Server using socket.io-client:
- Make sure this module connects to the caps namespace.

- Once connected, the Driver client module should listen for any appropriate events from the Server:
- When a pickup is emitted from the Server, simulate all specified Driver behaviors.

**Simulate the following events and emit payloads to the CAPS Application Server upon receiving a “pickup” event:**
in-transit
- Log “picking up payload.id” to the console.
- emit an in-transit event to the CAPS server with the payload.
delivered
- emit a delivered event to the CAPS server with the payload.

When running, the vendor and driver consoles should show their own logs. Additionally, the CAPS server should be logging everything.
**Server should be started first, then Driver, then Vendor.**

## Phase 2
### Event Hub (Server)
- Implement a Module for a Global Event Pool.
- Export a single EventEmitter from the Node JS module.
- Should be imported by any module that needs to notify or be alerted by other modules of an event.
- Implement a Module for Managing Global Package Events.
- Listens to ALL events in the Event Pool.
- Logs a timestamp and the payload of every event.

### Vendors
- Implement a Module for Managing Vendor Events.
- Your implementation should use a store name as a parameter.
- When triggered, the vendor module simulates a pickup event for the given store name to the Global Event Pool:
- emits pickup to the global event pool.
- sends a vendor order payload:
- Listens for a delivered event and responds by thanking the customer with the console log: Thank you for your order <customer-name>

### Drivers
- Implement a Module for Managing Driver Events.
- Listens for a pickup event from the Global Event Pool and responds with the following:
- Log a message to the console: DRIVER: picked up <ORDER_ID>.
- Emit an in-transit event to the Global Event Pool with the order payload.
- Log a confirmation message to the console: DRIVER: delivered <ORDER_ID>.
- Emit a delivered event to the Global Event Pool with the order payload.


## Whiteboard
![](whiteboard.jpg)

#### Tests
**Vendor**
- Should recieve a delivered event, and return a thank you message to the console
- Should call .emit to initiate Pickup event with store name, order, and customer info

**Driver**
- Should listen for Pickup events
- Should emit an in-transit event to the Hub with order payload
- Should emit Delivered event to Hub
