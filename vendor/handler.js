/*
functions for logging and generating objects
*/
function respondToDelivery(orderDetails) {
    console.log('Thank you for your order', orderDetails.customer);
}

function createPickup(storeName, orderDetails) {
    return {
        event: 'pickup',
        time: new Date(),
        payload:
            {
                store: storeName,
                orderId: orderDetails.orderId,
                customer: orderDetails.customer,
                address: orderDetails.address
            }
    }
}

module.exports = {
    createPickup,
    respondToDelivery,
};
