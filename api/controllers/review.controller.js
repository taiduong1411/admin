import createError from "../utils/createError.js"
import Review from "../models/review.model.js";
import Gig from "../models/gig.model.js";
import Users from "../models/user.model.js";
import { jwtDecode } from "jwt-decode";

export const createReview = async (req, res, next) => {
    const token = req.headers['authorization'];
    const token_decode = jwtDecode(token)
    const user = await Users.findOne({ _id: token_decode.id })
    if (user.isSeller)
        return next(createError(403, "Người bán không thể bình luận!"));
    const newReview = new Review({
        userId: user._id,
        gigId: req.body.gigId,
        desc: req.body.desc,
        star: req.body.star,
    });
    try {
        const review = await Review.findOne({
            gigId: newReview.gigId,
            userId: user._id,
        });
        // console.log(newReview);
        if (review)
            return next(
                createError(403, "Bạn đã bình luận cho sản phẩm này rồi!")
            );

        const savedReview = await Review(newReview).save();
        await Gig.findByIdAndUpdate(req.body.gigId, {
            $inc: { totalStars: req.body.star, starNumber: 1 }
        });
        return res.status(201).send(savedReview);
    } catch (err) {
        // next(err);
        console.log(err);
    }
};


export const getReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ gigId: req.params.gigId });
        res.status(200).send(reviews);
    } catch (err) {
        next(err);
    }
};
export const deleteReview = async (req, res, next) => {
    try {
    } catch (err) {
        next(err);
    }
};