import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageNavi from "../utils/PagiNavi";
import {
  isLoginState,
  loginEmailState,
  userTypeState,
} from "../utils/RecoilData";
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
      {isLogin === true && userType === 2 ? (
        <Link to="/product/write" className="btn-primary writeBtn">
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
  // 로그인 회원 정보
  const isLogin = useRecoilValue(isLoginState);
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const product = props.product;
  const productNo = product.productNo;
  const userEmail = loginEmail;
  const navigate = useNavigate();
  const [isLike, setIsLike] = useState(product.isLike === 1); // 좋아요 상태 (1: 좋아요, 0: 비활성화)
  const [likeCount, setLikeCount] = useState(product.likeCount); // 좋아요 수

  // console.log(isLogin);
  // console.log(loginEmail);

  const handleLikeToggle = () => {
    if (isLogin === true) {
      const newLikeStatus = !isLike;
      setIsLike(newLikeStatus); // 좋아요 상태 토글
      setLikeCount(likeCount + (newLikeStatus ? 1 : -1)); // 좋아요 수 증가/감소

      // 서버에 좋아요/취소 요청
      axios
        .post(`${backServer}/product/${productNo}/like/${userEmail}`, {
          like: newLikeStatus ? 1 : 0,
        })
        .then((res) => {
          if (res.data) {
            // 서버 응답에 따라 UI 상태 업데이트
            setIsLike(newLikeStatus);
            setLikeCount(likeCount + (newLikeStatus ? 1 : -1));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  // console.log(product.productNo, isLike);

  return (
    <li style={{ marginBottom: "20px" }} className="posting-item">
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
        <div className="like-icon" onClick={handleLikeToggle}>
          <span className={isLike ? "like-checked" : "like-unchecked"}>
            <i
              className={isLike ? "fa-solid fa-heart" : "fa-regular fa-heart"}
            ></i>
          </span>
          {/* 좋아요 수 출력 */}
          {/* <span className="like-count">{likeCount}</span> */}
        </div>
        <span className="price">
          {product.productPrice.toLocaleString()} 원
        </span>
      </div>
      <div className="clear"></div>
    </li>
  );
};

export default ProductList;
