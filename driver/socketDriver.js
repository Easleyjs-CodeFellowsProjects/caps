'use strict';

const io = require('socket.io-client');
const { 
        respondToSocketPickup,
      } = require('./handler')

class Driver {
    constructor( connectString ) {
        this.clientType = 'driver',
        this.socket = io.connect( connectString )
    }

    connect() {
        // Check for existing pickups
        this.socket.on('getAllPickupResponse', respondToSocketPickup( this.socket ));

        this.socket.emit('join', { 
            clientType: this.clientType,
        }
        );

        // listen for getAllPickup. If there are pickups, delivery them immediately
        this.socket.emit('getAllPickup', {});
    }

    // List for pickup, emit "in-transit" and "delivered" events
    listenForPickup() {
        this.socket.on('pickup', respondToSocketPickup( this.socket ))
    }

}

module.exports = Driver;
