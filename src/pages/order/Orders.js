import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar";
import OrderData from "../../components/order-data/OrderData";
const Orders = () => {
    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <OrderData />
            </div>
        </div>
    )
}
export default Orders;