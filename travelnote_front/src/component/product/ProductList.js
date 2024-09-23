import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageNavi from "../utils/PagiNavi";
import { isLoginState, userTypeState } from "../utils/RecoilData";
import { useRecoilState, useRecoilValue } from "recoil";

const ProductList = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [productList, setProductList] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [pi, setPi] = useState({});
  // 로그인 회원 정보
  const isLogin = useRecoilValue(isLoginState);
  const [userType, setUserType] = useRecoilState(userTypeState);

  useEffect(() => {
    axios
      .get(`${backServer}/product/list/${reqPage}`)
      .then((res) => {
        console.log(res.data);
        setProductList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);

  return (
    <section className="section product-list">
      {isLogin && userType === 2 ? (
        <Link to="/product/write" className="btn-primary">
          상품 등록
        </Link>
      ) : (
        ""
      )}

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
    <li className="posting-item">
      <div
        className="posting-info-left"
        onClick={() => {
          navigate(`/product/view/${product.productNo}`);
        }}
      >
        <div className="posting-title">
          <p>{product.productName}</p>
        </div>
        <div className="posting-title">
          <p>{product.productSubName}</p>
        </div>
      </div>
      <div className="posting-info-right">
        <div className="posting-img">
          <img
            style={{ width: "150px" }}
            src={
              product.productThumb
                ? `${backServer}/product/thumb/${product.productThumb}`
                : "/image/default_img.png"
            }
          />
        </div>
        <div className="like-icon">
          <span className="like-checked">
            <i className="fa-heart fa-regular"></i>
          </span>
        </div>
        <span className="price">{product.productPrice}</span>
      </div>
    </li>
  );
};

export default ProductList;
