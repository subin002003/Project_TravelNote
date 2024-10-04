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
import ChannelTalk from "./ChannelTalk";
// mui-select
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const sortOptions = [
  { label: '상품 찜이 많은 순', value: 'mostLiked' },
  { label: '등록 최신 순', value: 'newest' },
];

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

  // 상품 리스트 조회
  const fetchProductList = (sortOption) => {
    const requestUrl = `${backServer}/product/list/${reqPage}?sort=${sortOption}`; // 정렬 조건에 따른 URL 설정
    axios.get(requestUrl)
      .then((res) => {
        setProductList(res.data.list); // 상품 목록 업데이트
        setPi(res.data.pi); // 페이지 정보 업데이트
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 상품 리스트 조회
  useEffect(() => {
    fetchProductList('newest'); // 처음에 '등록 최신 순'으로 데이터 요청

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
  }, [userEmail, reqPage, sortOptions]); // sortOption이나 reqPage가 변경될 때마다 실행

  // 각 정렬 옵션에 따른 클릭 이벤트 처리
  const handleSortClick = (sortOption) => {
    console.log(sortOption);

    if (sortOption === "mostLiked") {
      axios.get(`${backServer}/product/list/${reqPage}/${userEmail}/${sortOption}`)
        .then((res) => {
          console.log(res.data);
          setProductList(res.data.list);
          setPi(res.data.pi);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {

    }
    fetchProductList(sortOption); // 해당 정렬 조건으로 상품 목록 요청
  };

  return (
    <section style={{ margin: "50px auto" }} className="section product-list">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {isLogin === true && userType === 2 ? (
          <Link to="/product/write" className="btn-primary writeBtn">
            상품 등록
          </Link>
        ) : (
          ""
        )}
        {/* 정렬을 위한 Select 대신 직접적인 클릭 이벤트 처리 */}
        <FormControl sx={{ m: 1, width: '150px' }}>
          <Select
            displayEmpty
            input={<OutlinedInput />}
            defaultValue="" // 기본값 설정
            renderValue={() => <em>정렬 기준 선택</em>}
          >
            {sortOptions.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                onClick={() => handleSortClick(option.value)} // onClick으로 axios 요청
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* 상품 리스트 */}
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
      <ChannelTalk />
      {isLogin ? (
        <button className="channelTalkBtn">
          <img src="/image/logo2.png"></img>
        </button>
      ) : (
        ""
      )}
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
