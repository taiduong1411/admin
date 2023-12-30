import React from 'react'
import "./Orders.scss"
import { useNavigate } from 'react-router-dom'
import { useQuery } from "@tanstack/react-query";
// import newRequest from "../../utils/newRequest";
import { ApiClient } from '../../utils/axios';
const Orders = () => {

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      ApiClient()
        .get(
          `/orders`
        )
        .then((res) => {
          // console.log(res.data);
          return res.data;
        }),
  });

  const handleContact = async (order) => { //xử lý việc tìm kiếm hoặc tạo một cuộc trò chuyện giữa người mua và người bán dựa trên thông tin từ đơn hàng được truyền vào.
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId
    // console.log(sellerId, buyerId);
    // console.log(id);
    await ApiClient().get(`/conversations/single/${id}`).then(async res => {
      // console.log(res.data.conversation);
      if (res.status == 200) {
        return navigate(`/message/${res.data.conversation.id}`);
      } else {
        // console.log('123');
        const res = await ApiClient().post(`/conversations/`, {
          to: currentUser.isSeller ? buyerId : sellerId,
        });
        console.log(res);
        return navigate(`/message/${res.data.savedConversation.id}`);
      }
    })
  };

  return (
    <div className='orders'>
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Đơn bán</h1>
          </div>
          <table>
            <tr>
              <th>Hình ảnh</th>
              <th>Tiêu đề</th>
              <th>Giá</th>
              <th>Liên hệ</th>
            </tr>
            {data.orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <img className='img' src={order.img} alt="" />
                </td>
                <td>{order.title}</td>
                <td>{order.price}</td>
                <td>
                  <img className='message' src="\images\message.png" alt="" onClick={() => handleContact(order)} />
                </td>
              </tr>
            ))}
          </table>
        </div>)}
    </div>
  );
};

export default Orders