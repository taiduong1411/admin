import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import ProductData from "../../components/product-data/ProductData"

const Product = () => {
    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <ProductData />
            </div>
        </div>
    )
}

export default Product;