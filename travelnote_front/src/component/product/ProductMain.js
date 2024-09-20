import "./product.css";
import { Route, Routes } from "react-router-dom";
import ProductList from "./ProductList";
import ProductView from "./ProductView";
import ProductWrite from "./ProductWrite";

const ProductMain = () => {
  return (
    <Routes>
      <Route path="list" element={<ProductList />} />
      <Route path="view/:productNo/*" element={<ProductView />} />
      <Route path="write" element={<ProductWrite />} />
    </Routes>
  );
};

export default ProductMain;
