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
import Swal from "sweetalert2";

const ProductList = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [productList, setProductList] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [pi, setPi] = useState({});
  // 로그인 회원 정보
  const isLogin = useRecoilValue(isLoginState);
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const userEmail = loginEmail;
  const [userType, setUserType] = useRecoilState(userTypeState);

  useEffect(() => {
    const request =
      isLogin && userEmail
        ? axios.get(`${backServer}/product/list/${reqPage}/${userEmail}`)
        : axios.get(`${backServer}/product/list/${reqPage}`);

    request
      .then((res) => {
        console.log(res.data);
        setProductList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userEmail, reqPage]);

  // useEffect(() => {
  //   if (userEmail) {
  //     // userEmail이 존재하는 경우에만 요청
  //     axios
  //       .get(`${backServer}/product/list/${reqPage}/${userEmail}`)
  //       .then((res) => {
  //         console.log(res.data);
  //         setProductList(res.data.list);
  //         setPi(res.data.pi);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }, [userEmail, reqPage]);

  // console.log(`${backServer}/product/list/${reqPage}/${userEmail}`);

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

  // 상품의 좋아요 상태와 좋아요 수
  const [productLike, setProductLike] = useState(product.productLike === 1); // 좋아요 상태 (1: 좋아요, 0: 비활성화)
  const [productLikeCount, setProductLikeCount] = useState(
    product.productLikeCount
  ); // 좋아요 수
  const newLikeState = productLike ? 0 : 1; // 좋아요 상태를 토글
  const newCount = productLike ? productLikeCount - 1 : productLikeCount + 1; // 좋아요 수 업데이트

  // console.log(isLogin);
  // console.log(loginEmail);

  const handleLikeToggle = () => {
    if (!isLogin) {
      Swal.fire({
        title: "로그인 후 이용이 가능합니다.",
        icon: "info",
      });
      // navigate(`/login`);
      return;
    }

    if (isLogin === true) {
      const newLikeStatus = !productLike; // 좋아요 상태 토글
      const request = newLikeStatus
        ? axios.post(
            // 리뷰 좋아요
            `${backServer}/product/${productNo}/insertWishLike/${userEmail}`,
            { productLike: 1 }
          )
        : axios.delete(
            // 리뷰 좋아요 취소
            `${backServer}/product/${productNo}/deleteWishLike/${userEmail}?productLike=1`
          );

      request
        .then((res) => {
          console.log(res.data);
          setProductLike(newLikeStatus); // 좋아요 상태 업데이트
          setProductLikeCount((prevCount) =>
            newLikeStatus ? prevCount + 1 : prevCount - 1
          ); // 좋아요 수 업데이트
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            title: newLikeStatus
              ? "좋아요 추가에 실패했습니다."
              : "좋아요 취소에 실패했습니다.",
            text: err.message,
            icon: "error",
          });
        });
    }
  };

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
        <div className="like-icon-box" onClick={handleLikeToggle}>
          <span
            className={
              productLike ? "product-like-checked" : "product-like-unchecked"
            }
          >
            <i
              className={
                productLike ? "fa-solid fa-heart" : "fa-regular fa-heart"
              }
            ></i>
          </span>
          {/* 좋아요 수 출력 */}
          {/* <span className="productLikeCount">{productLikeCount}</span> */}
        </div>
        <span className="price">{product.productPrice.toLocaleString()}원</span>
      </div>
      <div className="clear"></div>
    </li>
  );
};

export default ProductList;
