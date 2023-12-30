import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";

export const createGig = async (req, res, next) => { //chức năng tạo gig mới chỉ dành riêng cho ng bán
  // if (!req.isSeller) return next(createError(403, "Chỉ có người bán mới có thể tạo sản phẩm!"));//kiểm tra xem có phải ng bán hay ko, nếu ko thì sẽ trả về lỗi 403 và dongf chữ
  const newGig = new Gig({
    userId: req.userId, //xác định người dùng tạo sản phẩm bằng req.userId. Thông thường, req.userId sẽ là một ID hoặc thông tin xác định người dùng hiện tại.
    ...req.body,  //đảm bảo rằng tất cả thông tin về sản phẩm hoặc dự án mới được sao chép vào newGig.
  });
  try {
    const saveGig = await newGig.save();
    return res.status(201).json(saveGig);
  } catch (err) {
    next(err);
  }
};
export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id); //tìm xem sản phẩm đó có phải trong database của mình ko

    if (gig.userId !== req.userId)
      return next(createError(403, "Bạn chỉ có thể xóa sản phẩm của bạn!")); //nếu ko phải thì nó sẽ trả về

    await Gig.findByIdAndDelete(req.params.id) //nếu đúng thì nó sẽ tìm ra và xóa và trả về dòng dưới đây
    res.status(200).send("Sản phẩm đã được xóa!");
  } catch (err) {
    next(err)
  }
};
export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) next(createError(404, "Không tìm thấy sản phẩm!"));
    res.status(200).send(gig)
  } catch (err) {
    next(err)
  }
};
export const getGigs = async (req, res, next) => {
  const q = req.query;

  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: { ...(q.min && { $gte: q.min }), ...(q.max && { $lte: q.max }) },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };

  try {
    let sortOption = { [q.sort]: -1 };

    if (q.sort === "price-asc") {
      sortOption = { price: 1 };
    } else if (q.sort === "price-desc") {
      sortOption = { price: -1 };
    }

    const gigs = await Gig.find(filters).sort(sortOption);
    res.status(200).send(gigs);
  } catch (err) {
    next(err);
  }
};
