import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import AdminRoute from "./routers/adminRouter";
import Product from "./pages/product/Products";
import Orders from "./pages/order/Orders";
// import AddProduct from "./pages/product/AddForm";
function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route exact path="/" element={<AdminRoute />}>
            <Route index element={<Home />} />
            <Route path="users">
              <Route index element={<List />} />
              <Route path=":userId" element={<Single />} />
              <Route
                path="new"
                element={<New inputs={userInputs} title="Add New User" />}
              />
            </Route>
            <Route path="products" element={<Product />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
