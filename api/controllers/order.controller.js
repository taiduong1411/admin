import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import Users from "../models/user.model.js";
import Stripe from "stripe";
import { jwtDecode } from 'jwt-decode';
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
  const token = req.headers['authorization'];
  const token_decode = jwtDecode(token);
  const user = await Users.findOne({ _id: token_decode.id })
  try {
    const orders = await Order.find({
      ...(user.isSeller ? { sellerId: user_id } : { buyerId: user._id }),
      isCompleted: true,
    });
    return res.status(200).json({ orders: orders });
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