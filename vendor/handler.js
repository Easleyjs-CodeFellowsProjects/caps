/*
functions for logging and generating objects
*/
function respondToDelivery(orderDetails) {
    console.log('Thank you for your order', orderDetails.customer);
}

function respondToSocketDelivery (orders) {
    orders.forEach(( order ) => {
        console.log( 'Thank you for your order', order.order.customer )
    })
}

function createPickup(storeName, orderDetails) {
    return {
                storeName,
                order: orderDetails
           }
}

module.exports = {
    createPickup,
    respondToDelivery,
    respondToSocketDelivery,
};
