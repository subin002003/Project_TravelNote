import "./product.css";
import { Route, Routes } from "react-router-dom";
import ProductList from "./ProductList";
import ProductView from "./ProductView";

const ProductMain = () => {
  return (
    <Routes>
      <Route path="list" element={<ProductList />} />
      <Route path="view/:productNo" element={<ProductView />} />
    </Routes>
  );
};

export default ProductMain;
