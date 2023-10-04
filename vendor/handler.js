/*
functions for logging and generating objects
*/
function respondToDelivery(orderDetails) {
    console.log('Thank you for your order', orderDetails.customer);
}

function createPickup(orderDetails) {
    return {
                store: orderDetails.storeName,
                orderId: orderDetails.orderId,
                customer: orderDetails.customer,
                address: orderDetails.address
           }
}

module.exports = {
    createPickup,
    respondToDelivery,
};
