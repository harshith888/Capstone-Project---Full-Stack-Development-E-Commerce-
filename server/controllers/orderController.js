import prisma from '../configs/prismaClient.js'
import Razorpay from 'razorpay'
import crypto from 'crypto'

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res)=>{
    try {
        const { userId, items, address } = req.body;
        if(!address || items.length === 0){
            return res.json({success: false, message: "Invalid data"})
        }
        // Fetch products in one query
        const productIds = items.map(i => i.product)
        const products = await prisma.product.findMany({ where: { id: { in: productIds } } })

        // Calculate Amount Using Items
        let amount = items.reduce((acc, item) => {
            const product = products.find(p => p.id === item.product)
            return acc + (product ? product.offerPrice : 0) * item.quantity
        }, 0)

        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        // Create order with nested order items
        await prisma.order.create({
            data: {
                userId,
                amount,
                addressId: address,
                paymentType: "COD",
                items: {
                    create: items.map(i => ({ quantity: i.quantity, product: { connect: { id: i.product } } }))
                }
            }
        })

        return res.json({success: true, message: "Order Placed Successfully" })
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Place Order Razorpay : /api/order/razorpay
export const placeOrderRazorpay = async (req, res)=>{
    try {
        const { userId, items, address } = req.body;
        const {origin} = req.headers;

        if(!address || items.length === 0){
            return res.json({success: false, message: "Invalid data"})
        }

        // Fetch products
        const productIds = items.map(i => i.product)
        const products = await prisma.product.findMany({ where: { id: { in: productIds } } })

        const productData = items.map(i => {
            const p = products.find(x => x.id === i.product)
            return { name: p?.name || 'Product', price: p?.offerPrice || 0, quantity: i.quantity }
        })

        // Calculate Amount Using Items
        let amount = productData.reduce((acc, item) => acc + item.price * item.quantity, 0)

        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

       const order =  await prisma.order.create({
            data: {
                userId,
                amount,
                addressId: address,
                paymentType: "Online",
                items: { create: items.map(i => ({ quantity: i.quantity, product: { connect: { id: i.product } } })) }
            }
        });
    // Razorpay Gateway Initialize
    const razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Razorpay needs amount in smallest currency unit (e.g., paise for INR)
    const razorpayAmount = amount * 100; // assuming amount is in INR

    const options = {
        amount: razorpayAmount,
        currency: process.env.RAZORPAY_CURRENCY || 'INR',
        receipt: order.id,
        payment_capture: 1,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    // Return necessary info to client to complete payment on frontend
    return res.json({
        success: true,
        order: {
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
        },
        key: process.env.RAZORPAY_KEY_ID,
    });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}
// Razorpay Webhooks to Verify Payments Action : /razorpay/webhook
export const razorpayWebhooks = async (request, response)=>{
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = request.headers['x-razorpay-signature'];
    const payload = request.body;

    // request.body is raw buffer because server registers this route with express.raw
    const expectedSignature = crypto.createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');

    if(signature !== expectedSignature){
        return response.status(400).send('Invalid signature');
    }

    const event = JSON.parse(payload.toString());

    // Handle the event types we care about
    switch (event.event) {
        case 'payment.captured': {
            const payment = event.payload.payment.entity;
            // receipt is the order _id we passed as receipt
            const orderId = payment.order_id ? null : null;
            // Razorpay doesn't return our DB order id directly here; we used receipt on order creation
            // Instead, look up using the receipt if available in the payload
            // The 'entity' for order would have 'receipt'
            // For payment.captured, we can fetch order using payment.order_id
            try {
                const razorpayInstance = new Razorpay({
                    key_id: process.env.RAZORPAY_KEY_ID,
                    key_secret: process.env.RAZORPAY_KEY_SECRET,
                });

                // Fetch order to get receipt (our DB order id)
                const razorpayOrder = await razorpayInstance.orders.fetch(payment.order_id);
                const receipt = razorpayOrder.receipt;
                if(receipt){
                    await prisma.order.update({ where: { id: receipt }, data: { isPaid: true } });
                    // Clear user cart if userId is present in order record
                    const orderRecord = await prisma.order.findUnique({ where: { id: receipt } });
                    if(orderRecord){
                        await prisma.user.update({ where: { id: orderRecord.userId }, data: { cartItems: {} } });
                    }
                }
            } catch (err) {
                console.error('Error processing payment.captured webhook', err.message);
            }
            break;
        }
        case 'payment.failed': {
            const payment = event.payload.payment.entity;
            try{
                const razorpayInstance = new Razorpay({
                    key_id: process.env.RAZORPAY_KEY_ID,
                    key_secret: process.env.RAZORPAY_KEY_SECRET,
                });
                const razorpayOrder = await razorpayInstance.orders.fetch(payment.order_id);
                const receipt = razorpayOrder.receipt;
                if(receipt){
                    await prisma.order.delete({ where: { id: receipt } });
                }
            } catch(err){
                console.error('Error processing payment.failed webhook', err.message);
            }
            break;
        }
        default:
            console.log('Unhandled razorpay event:', event.event);
            break;
    }

    response.json({received: true});
}


// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res)=>{
    try {
        const { userId } = req.body;
        const orders = await prisma.order.findMany({
            where: { userId, OR: [{ paymentType: 'COD' }, { isPaid: true }] },
            include: { items: { include: { product: true } }, address: true },
            orderBy: { createdAt: 'desc' }
        })
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// Get All Orders ( for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res)=>{
    try {
        const orders = await prisma.order.findMany({
            where: { OR: [{ paymentType: 'COD' }, { isPaid: true }] },
            include: { items: { include: { product: true } }, address: true },
            orderBy: { createdAt: 'desc' }
        })
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update Order Status (seller only)
export const updateOrderStatus = async (req, res) =>{
    try {
        const { id } = req.params;
        const { status } = req.body;

        if(!id) return res.json({ success: false, message: 'Order id missing' });

        // Define allowed statuses - keep human readable to match existing defaults
        const allowedStatuses = [
            'Order Placed',
            'Accepted',
            'Out For Delivery',
            'Delivered',
            'Returned'
        ];

        if(!status || !allowedStatuses.includes(status)){
            return res.json({ success: false, message: 'Invalid status value' });
        }

        const order = await prisma.order.update({ where: { id }, data: { status } });

        return res.json({ success: true, message: 'Order status updated', order });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}