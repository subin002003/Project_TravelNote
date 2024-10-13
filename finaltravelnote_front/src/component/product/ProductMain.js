import "./product.css";
import { Route, Routes } from "react-router-dom";
import ProductList from "./ProductList";
import ProductView from "./ProductView";
import ProductWrite from "./ProductWrite";
import ProductUpdate from "./ProductUpdate";

const ProductMain = () => {
  return (
    <Routes>
      <Route path="list" element={<ProductList />} />
      <Route path="view/:productNo" element={<ProductView />} />
      <Route path="write" element={<ProductWrite />} />
      <Route path="update/:productNo" element={<ProductUpdate />} />
    </Routes>
  );
};

export default ProductMain;
