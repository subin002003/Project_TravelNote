import { Route, Routes } from "react-router-dom";
import ProductList from "./ProductList";
import "./product.css";

const ProductMain = () => {
  return (
    <Routes>
      <Route path="list" element={<ProductList />} />
    </Routes>
  );
};

export default ProductMain;
