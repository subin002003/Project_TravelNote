import { useState } from "react";
import ToastEditor from "../utils/ToastEditor";
import Swal from "sweetalert2";
import ProductFrm from "./ProductFrm";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductWrite = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [productNo, setProductNo] = useState(0);
  const [productName, setProductName] = useState("");
  const [productSubName, setProductSubName] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [productPrice, setProductPrice] = useState(0);
  const [productInfo, setProductInfo] = useState("");
  const [productLatitude, setProductLatitude] = useState("");
  const [productLongitude, setProductLongitude] = useState("");
  const [productStatus, setProductStatus] = useState(1);
  const [productFile, setProductFile] = useState([]);
  const navigate = useNavigate();

  const writeProduct = () => {
    if (productName !== "" && productSubName !== "" && productInfo !== "") {
      const form = new FormData();
      form.append("productName", productName);
      form.append("productSubName", productSubName);
      // 썸네일 있는 경우에만 추가
      if (thumbnail !== null) {
        form.append("thumbnail", thumbnail);
      }
      // 첨부파일도 있는 경우에만 추가
      for (let i = 0; i < productFile.length; i++) {
        form.append("productFile", productFile[i]);
      }
      axios
        .post(`${backServer}/product`, form, {
          headers: {
            contentType: "multipart/form-data",
            processData: false,
          },
        })
        .then((res) => {
          if (res.data) {
            navigate("/product/list");
          } else {
            Swal.fire({
              title: "상품 등록중 에러가 발생했습니다.",
              text: "입력값을 확인하세요.",
              icon: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <section className="section product-content-wrap">
      <div style={{ textAlign: "center" }} className="section-title">
        상품 등록
      </div>
      <form
        className="product-write-frm"
        onSubmit={(e) => {
          e.preventDefault();
          writeProduct();
        }}
      >
        <ProductFrm
          productNo={productNo}
          setProductNo={setProductNo}
          productName={productName}
          setProductName={setProductName}
          productSubName={productSubName}
          setProductSubName={setProductSubName}
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
          productPrice={productPrice}
          setProductPrice={setProductPrice}
          productLatitude={productLatitude}
          setProductLatitude={setProductLatitude}
          productLongitude={productLongitude}
          setProductLongitude={setProductLongitude}
          productStatus={productStatus}
          setProductStatus={setProductStatus}
          productFile={productFile}
          setProductFile={setProductFile}
        />

        <div className="product-info-wrap">
          <ToastEditor
            productInfo={productInfo}
            setProductInfo={setProductInfo}
            type={0}
          />
        </div>
        <div className="button-box">
          <button type="submit" className="btn-primary lg">
            등록
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProductWrite;
