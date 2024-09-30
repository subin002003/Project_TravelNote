import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Viewer } from "@toast-ui/react-editor";
import "react-day-picker/dist/style.css";
import axios from "axios";
import "./product.css";

// Import MUI components
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
} from "@mui/material";

// Import Swiper components
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./swiper.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import DateRangePickerComponent from "./DatePickerComponent ";
import Review from "./review/ReviewWrite";
import Swal from "sweetalert2";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoginState,
  loginEmailState,
  userTypeState,
} from "../utils/RecoilData";

const ProductView = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const isLogin = useRecoilValue(isLoginState);
  const [loginEmail] = useRecoilState(loginEmailState);
  const [userType] = useRecoilState(userTypeState);
  const params = useParams();
  const productNo = params.productNo;
  const [product, setProduct] = useState({ fileList: [], reviews: [] });
  const navigate = useNavigate();
  const [count, setCount] = useState(1);
  const [dateRange, setDateRange] = useState("여행 날짜를 선택하세요.");
  const [openReviewDialog, setOpenReviewDialog] = useState(false);

  useEffect(() => {
    if (!productNo || !loginEmail) return;

    axios
      .get(`${backServer}/product/productNo/${productNo}/${loginEmail}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error("Error:", err.response ? err.response.data : err.message);
        Swal.fire({
          title: "상품 정보를 불러오는 데 실패했습니다.",
          text: "다시 시도하세요.",
          icon: "error",
        });
      });
  }, [backServer, productNo, loginEmail]);

  const handleDateRangeChange = (startDate, endDate) => {
    if (startDate && endDate) {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const startFormatted = new Date(startDate).toLocaleDateString("ko-KR", options);
      const endFormatted = new Date(endDate).toLocaleDateString("ko-KR", options);
      setDateRange(`선택된 날짜: ${startFormatted} ~ ${endFormatted}`);
    }
  };

  const deleteProduct = () => {
    axios
      .delete(`${backServer}/product/${product.productNo}`)
      .then((res) => {
        if (res.data === 1) {
          Swal.fire({
            title: "상품이 삭제되었습니다.",
            icon: "success",
          });
          navigate("/product/list");
        }
      })
      .catch((err) => console.error(err));
  };

  const adjustCount = (adjustment) => {
    setCount((prevCount) => {
      const newCount = prevCount + adjustment;
      return newCount < 1 ? 1 : newCount > 10 ? 10 : newCount;
    });
  };

  const handleOpenReviewDialog = () => setOpenReviewDialog(true);
  const handleCloseReviewDialog = () => setOpenReviewDialog(false);

  return (
    <section className="section product-view-wrap">
      <div className="product-view-content">
        <div className="product-view-info">
          <div className="product-thumbnail-swiper">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              pagination={{
                el: ".swiper-pagination",
                type: "fraction",
                clickable: true,
              }}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              autoplay={{ delay: 2500 }}
            >
              {product.fileList.length > 0 ? (
                product.fileList.map((file, i) => (
                  <SwiperSlide key={`file-${i}`}>
                    <img
                      src={`${backServer}/product/${file.filepath}`}
                      alt={`Slide ${i}`}
                      style={{ height: "780px", width: "100%", objectFit: "cover" }}
                    />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <img src="/image/default_img.png" alt="기본 이미지" />
                </SwiperSlide>
              )}
              <div className="swiper-button-next"></div>
              <div className="swiper-button-prev"></div>
              <div className="swiper-pagination"></div>
            </Swiper>
          </div>
          <div className="product-view-preview">
            <h2>{product.productName}</h2>
            <p>{product.productSubName}</p>
          </div>
        </div>

        <div className="line"></div>

        <div className="sec product-view-reservation">
          <h3 className="section-title">여행 예약</h3>
          <DateRangePickerComponent onDateRangeChange={handleDateRangeChange} />

          <div className="people">
            <button className="btn-primary sm" onClick={() => adjustCount(-1)}>-</button>
            <input
              type="number"
              id="count"
              value={count}
              style={{
                margin: "0 7px",
                height: "28px",
                textAlign: "center",
                border: "none",
                backgroundColor: "transparent",
              }}
              readOnly
            />
            <button className="btn-primary sm" onClick={() => adjustCount(1)}>+</button>
          </div>

          <div style={{ margin: "50px 0" }}>
            <p>{product.productName}</p>
            <p>{dateRange}</p>
            <p className="price">
              {typeof product.productPrice === "number"
                ? `${product.productPrice.toLocaleString()}원`
                : "가격 정보 없음"}
            </p>
          </div>

          <div className="btn-primary lg" style={{ padding: "23.5px 0" }}>
            여행 예약하기
          </div>
        </div>

        <div className="line"></div>

        <div className="sec product-content">
          <h3 className="section-title">여행지 소개</h3>
          {product.productInfo && <Viewer initialValue={product.productInfo} />}
        </div>
      </div>

      <div className="clear"></div>
      <div className="line"></div>

      <div className="sec review">
        <div className="section-title" style={{ display: "flex", justifyContent: "space-between", marginBottom: "0px" }}>
          <strong style={{ fontSize: "20px" }}>리뷰({product.reviews.length}개)</strong>
          <button className="btn-secondary lg" onClick={handleOpenReviewDialog}>
            <span style={{ marginRight: "5px" }}>
              <i className="fa-solid fa-pen-to-square"></i>
            </span>
            리뷰 작성
          </button>
        </div>

        <div className="line" style={{ margin: "30px 0" }}></div>

        <div className="commentBox">
          <div className="posting-review-wrap">
            <ul>
              {product.reviews.map((review, i) => (
                <ReviewItem key={`review-${i}`} product={product} review={review} />
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="clear"></div>

      <Dialog
        open={openReviewDialog}
        onClose={handleCloseReviewDialog}
        PaperProps={{ style: { width: "800px", zIndex: "10" } }}
        maxWidth={false}
        fullWidth={true}
      >
        <DialogTitle>리뷰 작성</DialogTitle>
        <DialogContent>
          <Review productNo={productNo} open={openReviewDialog} handleClose={handleCloseReviewDialog} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog} color="primary">닫기</Button>
        </DialogActions>
      </Dialog>

      {isLogin && userType === 2 && (
        <div className="button-box">
          <Link className="btn-primary lg" to={`/product/update/${product.productNo}`}>수정</Link>
          <button type="button" className="btn-secondary lg" onClick={deleteProduct}>삭제</button>
        </div>
      )}
    </section>
  );
};

const ReviewItem = ({ product, review }) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const isLogin = useRecoilValue(isLoginState);
  const [loginEmail] = useRecoilState(loginEmailState);

  const handleLikeToggle = (review) => {
    if (!isLogin) {
      Swal.fire({
        title: "로그인이 필요합니다.",
        icon: "warning",
      });
      return;
    }

    const url = review.reviewLike ?
      `${backServer}/review/dislike/${review.reviewNo}` :
      `${backServer}/review/like/${review.reviewNo}`;

    axios
      .patch(url, { userEmail: loginEmail })
      .then(() => {
        Swal.fire({
          title: `리뷰가 ${review.reviewLike ? "좋아요" : "좋아요 취소"}되었습니다.`,
          icon: "success",
        });
        navigate(0); // Refresh page
      })
      .catch((err) => console.error(err));
  };

  return (
    <li>
      <div className="review-item">
        <div className="review-header">
          <Rating name="read-only" value={review.reviewScore} readOnly />
          <span>{review.userNick}</span>
          <span>{new Date(review.createdDate).toLocaleString()}</span>
        </div>
        <div className="review-body">
          <p>{review.reviewContent}</p>
          <div className="review-footer">
            <button className="like-button" onClick={() => handleLikeToggle(review)}>
              {review.reviewLike ? "좋아요 취소" : "좋아요"}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ProductView;
