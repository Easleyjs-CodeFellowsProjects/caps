# Event-Driven Server

Event-driven "Package Delivery Service" Server

## Install instructions:

npm install

## Dependencies

jest

## Render.com URL:


## Assignment instructions

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
