import React from "react";
import { Link } from "react-router-dom";
import "./Messages.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { ApiClient } from "../../utils/axios";
import moment from "moment"; //đoạn nào có moment sẽ update ngày cập nhật
const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () =>
      await ApiClient()
        .get(
          `/conversations`
        )
        .then((res) => {
          // console.log(res);
          return res.data;
        }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      // console.log(id);
      return ApiClient().put(`/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  const handleRead = (id) => {
    mutation.mutate(id);
  };

  return (
    <div className="messages">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Tin nhắn</h1>
          </div>
          <table>
            <tr>
              <th>{currentUser.isSeller ? "Buyer" : "Seller"}</th>
              <th>Tin nhắn mới nhất</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
            </tr>
            {data.map(c => (
              <tr className={
                ((currentUser.isSeller && !c.readBySeller) ||  //điều kiện này y như button ở dưới
                  (!currentUser.isSeller && !c.readByBuyer)) &&
                "active"
              }
                key={c.id}>
                <td>{currentUser.isSeller ? c.buyerId : c.sellerId}</td>
                <td>
                  <Link to={`/message/${c.id}`} className="link">
                    {c?.lastMessage?.substring(0, 100)}...
                  </Link>
                </td>
                <td>{moment(c.updatedAt).fromNow()}</td>
                <td>
                  {((currentUser.isSeller && !c.readBySeller) ||  //nếu mà là ng bán gửi thì sẽ ko cần thấy button
                    (!currentUser.isSeller && !c.readByBuyer)) && (  //nếu là ng mua thì sẽ thấy và khi bấm
                      <button onClick={() => handleRead(c.id)}>Đánh dấu đã đọc</button> //khi bấm vào thì nó sẽ tự đọc là đã đọc và mất button
                    )}
                </td>
              </tr>
            ))}
          </table>
        </div>)}
    </div>
  );
};

export default Messages;