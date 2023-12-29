import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import Stripe from "stripe";

export const intent = async (req, res, next) => {
  const stripe = new Stripe(
    process.env.STRIPE
  );

  const gig = await Gig.findById(req.params.id);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig.price * 100,
    currency: "vnd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const newOrder = new Order({
    gigId: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId: req.body.idUser,
    sellerId: gig.userId,
    price: gig.price,
    payment_intent: paymentIntent.id,
  });

  await newOrder.save();

  return res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
};

export const getOrders = async (req, res, next) => {
  const _id = req.headers['authorization'];
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: _id } : { buyerId: _id }),
      isCompleted: true,
    });
    console.log(orders);
    res.status(200).json({ orders: orders });
  } catch (err) {
    next(err)
  }
};
export const confirm = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate({
      payment_intent: req.body.payment_intent,
    },
      {
        $set: {
          isCompleted: true,
        },
      }
    );

    res.status(200).send("Đơn hàng đã được xác thực!");
  } catch (err) {
    next(err)
  }
};