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
  const [searchQuery, setSearchQuery] = useState("");

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
        console.log(res.data);
        setProductList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [loginEmail, reqPage]);

  // 각 정렬 옵션에 따른 클릭 이벤트 처리
  const handleSortClick = (sortOption) => {
    console.log(sortOption);
    setReqPage(1); // 페이지를 1로 리셋

    axios
      .get(`${backServer}/product/list/${reqPage}/${loginEmail}/${sortOption}`)
      .then((res) => {
        console.log(res.data);
        setProductList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    // setReqPage(1); // 검색 시 페이지를 초기화

    axios
      .get(`${backServer}/product/list?query=${searchQuery}`, {
        params: { searchQuery }, // searchQuery를 params로 전달
      })
      .then((res) => {
        console.log(res.data);
        setProductList(res.data.list);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section style={{ margin: "50px auto" }} className="section product-list">
      {/* 검색창 */}
      <div className="product-search-box">
        <input
          id="product-search"
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyUp={(e) => {
            if (e.key === "Enter" || e.keyCode === 13) {
              handleSearchClick();
            }
          }}
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
            <li style={{ margin: "300px", textAlign: "center" }}>검색한 상품이 없습니다.</li>
          )}
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
          `${backServer}/product/${productNo}/insertWishLike/${loginEmail}`,
          { productLike: 1 }
        )
        : axios.delete(
          // 리뷰 좋아요 취소
          `${backServer}/product/${productNo}/deleteWishLike/${loginEmail}?productLike=1`
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
          <span className="productLikeCount">{productLikeCount}</span>
        </div>
        <span className="price">{product.productPrice.toLocaleString()}원</span>
      </div>
      <div className="clear"></div>
    </li>
  );
};

export default ProductList;
