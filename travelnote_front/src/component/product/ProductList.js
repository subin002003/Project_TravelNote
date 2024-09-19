import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageNavi from "../utils/PagiNavi";

const ProductList = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [productList, setProductList] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [pi, setPi] = useState({});

  useEffect(() => {
    axios
      .get(`${backServer}/product/list/${reqPage}`)
      .then((res) => {
        console.log(res);
        setProductList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);

  return (
    <section className="section product-list">
      <div className="product-list-wrap">
        <ul className="posting-wrap">
          {productList.map((product, i) => {
            return <ProductItem key={"product-" + i} product={product} />;
          })}
        </ul>
      </div>
      <div className="product-paging-wrap">
        <PageNavi pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
      </div>
    </section>
  );
};

const ProductItem = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const product = props.product;
  const navigate = useNavigate();

  return (
    <li
      className="posting-item"
      onClick={() => {
        navigate(`/product/view/${product.productNo}`);
      }}
    >
      <div className="posting-info-left">
        <div className="posting-title">{product.productName}</div>
        <div className="posting-sub-info"></div>
      </div>
      <div className="posting-info-right">
        <div className="posting-img">
          <img
            src={
              product.productThumb
                ? `${backServer}/product/thumb/${product.productList}`
                : "/image/default_img.png"
            }
          />
        </div>
        <div className="like-icon">
          <span className="like-checked">
            <i className="fa-heart fa-regular"></i>
          </span>
        </div>
        <span>{product.productPrice}</span>
      </div>
    </li>
  );
};

export default ProductList;
