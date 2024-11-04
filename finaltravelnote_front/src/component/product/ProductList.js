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
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Rating } from "@mui/material";
import "./product.css";
import "./common2.css";

const sortOptions = [
  { label: "좋아요순", value: "mostLiked" },
  { label: "최신순", value: "newest" },
];

const ProductList = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [productList, setProductList] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [pi, setPi] = useState({});

  // 상품 검색
  const [keyword, setKeyword] = useState("");

  // 로그인 회원 정보
  const isLogin = useRecoilValue(isLoginState);
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const [userType, setUserType] = useRecoilState(userTypeState);

  // 상품 리스트 조회
  useEffect(() => {
    const request =
      isLogin && loginEmail
        ? axios.get(`${backServer}/product/list/${reqPage}/${loginEmail}`)
        : axios.get(`${backServer}/product/list/${reqPage}`);

    request
      .then((res) => {
        // console.log(res.data);
        setProductList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [loginEmail, reqPage]);

  // 각 정렬 옵션에 따른 클릭 이벤트 처리
  const handleSortClick = (sortOption) => {
    // console.log(sortOption);
    setReqPage(1); // 페이지를 1로 리셋

    axios
      .get(`${backServer}/product/list/${reqPage}/${loginEmail}/${sortOption}`)
      .then((res) => {
        // console.log(res.data);
        setProductList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearchChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearchClick = () => {
    // setReqPage(1); // 검색 시 페이지를 초기화

    axios
      .get(`${backServer}/product/list?query=${keyword}`, {
        params: { keyword }, // keyword를 params로 전달
      })
      .then((res) => {
        // console.log(res.data);
        setProductList(res.data.list);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section style={{ margin: "50px auto" }} className="section product-list">
      <div className="container">
        {/* 검색창 */}
        <div className="product-search-box">
          <input
            id="product-search"
            type="text"
            value={keyword}
            onChange={handleSearchChange}
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.keyCode === 13) {
                handleSearchClick();
              }
            }}
            autoComplete="off"
            placeholder="상품명 검색"
          />
          <button id="product-search-button" onClick={handleSearchClick}>
            검색
          </button>
        </div>

        {isLogin === true && userType === 2 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link to="/product/write" className="btn-primary writeBtn">
              상품 등록
            </Link>
            {/* 정렬을 위한 Select 대신 직접적인 클릭 이벤트 처리 */}
            <FormControl sx={{ m: 1, width: "150px" }}>
              <Select
                displayEmpty
                input={<OutlinedInput />}
                defaultValue="" // 기본값 설정
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1363df", // 여기에 원하는 색상을 지정
                    borderRadius: "12px", // border-radius 값 변경
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1363df", // hover 시 색상을 변경하고 싶을 때
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1363df", // 포커스 시 색상을 변경하고 싶을 때
                  },
                }}
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
        ) : (
          ""
        )}

        {/* 상품 리스트 */}
        {/* <div className="product-list-wrap">
        <ul className="posting-wrap">
          {productList.length > 0 ? (
            {
              productList.map((product, i) => {
                return <ProductItem key={"product-" + i} product={product} />;
              })
            }
          ) : <li>검색한 상품이 없습니다.</li>}
        </ul>
      </div> */}

        <div className="product-list-wrap">
          <ul className="posting-wrap">
            {productList.length > 0 ? (
              productList.map((product, i) => (
                <ProductItem key={product.productNo} product={product} />
              ))
            ) : (
              <li className="no-posting-item">
                <p>검색어 : [{keyword}]</p>
                검색된 상품이 없습니다.
              </li>
            )}
          </ul>
        </div>
        <div className="product-paging-wrap">
          <PageNavi
            pi={pi}
            reqPage={reqPage}
            setReqPage={setReqPage}
            keyword={keyword}
          />
        </div>
        <ChannelTalk />
        {isLogin ? (
          <button className="channelTalkBtn">
            <img src="/image/logo2.png"></img>
          </button>
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

const ProductItem = ({ product }) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  // 로그인 회원 정보
  const isLogin = useRecoilValue(isLoginState);
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  // const product = props.product;
  const productNo = product.productNo;
  const navigate = useNavigate();

  // 상품의 좋아요 상태와 좋아요 수
  const [productLike, setProductLike] = useState(product.productLike === 1); // 좋아요 상태 (1: 좋아요, 0: 비활성화)
  const [productLikeCount, setProductLikeCount] = useState(
    product.productLikeCount
  ); // 좋아요 수

  // product 변경 시 상태 업데이트
  useEffect(() => {
    setProductLike(product.productLike === 1);
    setProductLikeCount(product.productLikeCount);
  }, [product]);

  // const newLikeState = productLike ? 0 : 1; // 좋아요 상태를 토글
  // const newCount = productLike ? productLikeCount - 1 : productLikeCount + 1; // 좋아요 수 업데이트

  const handleLikeToggle = () => {
    if (!isLogin) {
      Swal.fire({
        title: "로그인이 필요합니다.",
        text: "상품을 '찜'하려면 로그인이 필요합니다. 로그인하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "로그인",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login"); // 로그인 페이지로 이동
        }
      });
    }

    if (isLogin === true) {
      const newLikeStatus = !productLike; // 좋아요 상태 토글
      const request = newLikeStatus
        ? axios.post(
          // 리뷰 좋아요
          `${backServer}/product/${productNo}/insertWishLike/${loginEmail}`,
          { productLike: 1 }
        )
        : axios.delete(
          // 리뷰 좋아요 취소
          `${backServer}/product/${productNo}/deleteWishLike/${loginEmail}?productLike=1`
        );

      request
        .then((res) => {
          // console.log(res.data);
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
    <li className="posting-list-item">
      <div
        className="posting-info-left"
        onClick={() => {
          navigate(`/product/view/${product.productNo}`);
        }}
      >
        <div style={{ width: "95%" }} className="posting-title">
          <h3 style={{ marginBottom: "0" }}>{product.productName}</h3>
        </div>
        <div className="posting-title">
          <p style={{ color: "#a1a1a1" }}>{product.productSubName}</p>
        </div>
        {/* 상품 리뷰 별점 평균 점수, 좋아요 합계 */}

        <div
          style={{ display: "flex", alignItems: "center" }}
          className="avg-score product-like-count"
        >
          <Rating
            name={`rating-${product.productNo}`}
            value={product.avgReviewScore} // 상품 리뷰 별점 평균
            precision={0.1} // 소수점 이하 2자리까지 표시
            readOnly // 읽기 전용
          />
          <span style={{ color: "#a1a1a1" }}>
            ({Number((product.avgReviewScore || 0).toFixed(1))})
          </span>
          <span>&nbsp;&nbsp;&nbsp;</span>
          <span>
            <i style={{ color: "#ff1a51" }} className="fa-solid fa-heart"></i>
          </span>
          <span style={{ color: "#a1a1a1" }} className="product-like-count">
            &nbsp;({productLikeCount})
          </span>
        </div>
      </div>
      <div className="posting-info-right">
        <div className="posting-img">
          <img
            src={
              product.productThumb
                ? `${backServer}/product/thumb/${product.productThumb}`
                : "/image/default_img.png"
            }
          />
        </div>
        <div className="like-icon-box">
          <span
            className={
              productLike ? "product-like-checked" : "product-like-unchecked"
            }
            onClick={handleLikeToggle}
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
