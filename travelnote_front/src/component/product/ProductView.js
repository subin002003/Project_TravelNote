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

// import Swiper core and required modules
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
  // 로그인 회원 정보
  const isLogin = useRecoilValue(isLoginState);
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const userEmail = loginEmail;
  const [userType, setUserType] = useRecoilState(userTypeState);
  const params = useParams();
  const productNo = params.productNo;
  const [product, setProduct] = useState({ fileList: [], reviews: [] });
  const navigate = useNavigate();
  const [count, setCount] = useState(1); // 초기 수량을 1로 설정
  const [dateRange, setDateRange] = useState("여행 날짜를 선택하세요."); // 선택된 날짜 범위를 상태로 관리
  const [openReviewDialog, setOpenReviewDialog] = useState(false); // 다이얼로그 상태

  useEffect(() => {
    if (!productNo || !userEmail) {
      console.error("productNo 또는 userEmail이 유효하지 않습니다.");
      return;
    }

    axios
      .get(`${backServer}/product/productNo/${productNo}/${userEmail}`)
      .then((res) => {
        // console.log(res.data);
        setProduct(res.data);
      })
      .catch((err) => {
        console.log("Error:", err.response ? err.response.data : err.message);
        Swal.fire({
          title: "상품 정보를 불러오는 데 실패했습니다.",
          text: "다시 시도하세요.",
          icon: "error",
        });
      });
  }, [backServer, productNo, userEmail, product.reviews]);

  const handleDateRangeChange = (startDate, endDate) => {
    if (startDate && endDate) {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const startFormatted = new Date(startDate).toLocaleDateString(
        "ko-KR",
        options
      );
      const endFormatted = new Date(startDate).toLocaleDateString(
        "ko-KR",
        options
      );

      setDateRange(`선택된 날짜: ${startFormatted} ~ ${endFormatted}`);
    }
  };

  // 패키지 상품 삭제
  const deleteProduct = () => {
    Swal.fire({
      title: "상품을 삭제하시겠습니까?",
      text: "삭제 후 복구할 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) {
        // 사용자가 삭제를 확인했을 경우에만 Axios 요청 실행
        axios
          .delete(`${backServer}/product/${product.productNo}`)
          .then((res) => {
            // 응답 처리
            if (res.data === 1) {
              Swal.fire({
                title: "상품이 삭제되었습니다.",
                icon: "success",
              });
              navigate("/product/list");
            } else {
              Swal.fire({
                title: "상품 삭제에 실패했습니다.",
                text: "다시 시도해 주세요.",
                icon: "error",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              title: "오류 발생",
              text: "상품 삭제 중 오류가 발생했습니다.",
              icon: "error",
            });
          });
      }
    });
  };

  const minus = () => {
    if (count === 1) {
      alert("최소 구매 수량은 1개 입니다.");
    } else {
      setCount((prevCount) => prevCount - 1); // 이전 값을 기반으로 상태 업데이트
    }
  };

  const plus = () => {
    if (count === 10) {
      alert("최대 구매 수량은 10개 입니다.");
    } else {
      setCount((prevCount) => prevCount + 1); // 이전 값을 기반으로 상태 업데이트
    }
  };

  // 리뷰 작성 팝업 열기
  const handleOpenReviewDialog = () => {
    setOpenReviewDialog(true);
  };

  // 리뷰 작성 팝업 닫기
  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
  };

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
              {product.fileList && product.fileList.length > 0 ? (
                product.fileList.map((file, i) => (
                  <SwiperSlide key={"file-" + i}>
                    <img
                      src={`${backServer}/product/${file.filepath}`}
                      alt={`Slide ${i}`}
                      style={{
                        height: "780px",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <img src="/image/default_img.png" alt="기본 이미지" />
                </SwiperSlide>
              )}

              {/* Navigation 버튼 추가 */}
              <div className="swiper-button-next"></div>
              <div className="swiper-button-prev"></div>
              {/* Pagination 추가 */}
              <div className="swiper-pagination"></div>
            </Swiper>
          </div>
          <div className="product-view-preview">
            {/* 상품 정보 출력 */}
            <h2>{product.productName}</h2>
            <p>{product.productSubName}</p>
            {/* <p>찜 갯수: {product.wishCount}</p>
            <p>리뷰 별점: {product.reviewRating}</p> */}
          </div>
        </div>

        <div className="line"></div>

        <div className="sec product-view-reservation">
          <h3 className="section-title">여행 예약</h3>

          <DateRangePickerComponent onDateRangeChange={handleDateRangeChange} />

          <div className="people">
            <button className="btn-primary sm" onClick={minus}>
              -
            </button>
            <input
              type="number"
              id="count"
              value={count}
              style={{
                margin: "0 7px",
                // width: "29px",
                height: "28px",
                textAlign: "center",
                border: "none",
                backgroundColor: "transparent",
              }}
              readOnly
            />
            <button className="btn-primary sm" onClick={plus}>
              +
            </button>
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

          <div style={{ padding: "23.5px 0" }} className="btn-primary lg">
            여행 예약하기
          </div>
        </div>

        <div className="line"></div>

        <div className="sec product-content">
          <h3 className="section-title">여행지 소개</h3>
          <div>
            {product.productInfo ? (
              <Viewer initialValue={product.productInfo} />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      <div className="clear"></div>
      <div className="line"></div>

      <div className="sec review">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0px",
          }}
          className="section-title"
        >
          <span style={{ fontSize: "20px" }}>
            <strong>리뷰({product.reviews.length}개)</strong>
            {/* <strong>리뷰({reviews.length}개)</strong> */}
          </span>
          <button
            style={{
              borderRadius: "10px",
              color: "var(--gray2)",
              fontSize: "16px",
            }}
            className="btn-secondary lg"
            onClick={handleOpenReviewDialog} // 다이얼로그 열기
          >
            <span style={{ marginRight: "5px" }}>
              <i className="fa-solid fa-pen-to-square"></i>
            </span>
            리뷰 작성
          </button>
        </div>

        <div className="line" style={{ margin: "30px 0" }}></div>

        {/* 리뷰 출력 */}
        <div className="commentBox">
          <div className="posting-review-wrap">
            <ul>
              {/* {product.reviews.map((review, i) => {
                return (
                  <ReviewItem
                    key={"review-" + i}
                    product={product}
                    review={review}
                  />
                );
              })} */}

              {product.reviews.length > 0 ? (
                product.reviews.map((review, i) => (
                  <ReviewItem
                    key={`review-${i}`}
                    product={product}
                    review={review}
                    parentReviewNo={review.reviewNo} // 부모 리뷰 ID 전달
                  />
                ))
              ) : (
                <li style={{ textAlign: "center", color: "gray" }}>
                  등록된 리뷰가 없습니다.
                </li>
              )}
            </ul>
          </div>
          {/* 리뷰 전체보기 */}
        </div>
      </div>

      <div className="clear"></div>

      {/* 리뷰 작성 다이얼로그 */}
      <div className="input-review-popup">
        <Dialog
          open={openReviewDialog}
          onClose={handleCloseReviewDialog}
          PaperProps={{
            style: { width: "800px", zIndex: "10" }, // 다이얼로그의 가로 크기를 800px로 설정
          }}
          maxWidth={false} // maxWidth 기본값을 사용하지 않도록 설정
          fullWidth={true} // 다이얼로그가 지정된 너비를 채우도록 설정
        >
          <DialogTitle>리뷰 작성</DialogTitle>
          <DialogContent>
            <Review
              productNo={productNo}
              open={openReviewDialog}
              handleClose={handleCloseReviewDialog}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReviewDialog} color="primary">
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {isLogin && userType === 2 ? (
        <div className="button-box">
          <Link
            className="btn-primary lg"
            to={`/product/update/${product.productNo}`}
          >
            수정
          </Link>
          <button
            type="button"
            className="btn-secondary lg"
            onClick={deleteProduct}
          >
            삭제
          </button>
        </div>
      ) : (
        ""
      )}
    </section>
  );
};

const ReviewItem = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const product = props.product;
  const productNo = product.productNo;
  const review = props.review;
  // console.log(review);
  const parentReviewNo = props.reviewCommentRef;

  // 로그인 회원 정보
  const isLogin = useRecoilValue(isLoginState);
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const userEmail = loginEmail;

  // 리뷰의 좋아요 상태와 좋아요 수
  const [reviewLike, setReviewLike] = useState(review.reviewLike === 1); // 좋아요 상태 (1: 좋아요, 0: 비활성화)
  const [reviewLikeCount, setReviewLikeCount] = useState(
    review.reviewLikeCount
  ); // 좋아요 수

  const newLikeState = reviewLike ? 0 : 1; // 좋아요 상태를 토글
  const newCount = reviewLike ? reviewLikeCount - 1 : reviewLikeCount + 1; // 좋아요 수 업데이트

  // 리뷰 작성 다이얼로그
  const [openReviewDialog, setOpenReviewDialog] = useState(false); // 다이얼로그 상태

  // 리뷰 작성 팝업 열기
  const handleOpenReviewDialog = () => {
    setOpenReviewDialog(true);
    // 여기에 parentReviewId를 사용하는 로직 추가
    console.log("Parent Review ID:", parentReviewNo);
  };

  // 리뷰 작성 팝업 닫기
  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
  };

  // 리뷰 수정
  // const updateReview = () => {
  //   setOpenReviewDialog(true);

  //   axios
  //     .patch(`${backServer}/product/updateReview/${review.reviewNo}`)
  //     .then((res) => {
  //       console.log(res);
  //       if (res.data === 1) {
  //         Swal.fire({
  //           title: "리뷰가 수정되었습니다.",
  //           icon: "success",
  //         });
  //         navigate(`/product/view/${product.productNo}`);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // 리뷰 삭제
  const deleteReview = () => {
    Swal.fire({
      title: "리뷰를 삭제하시겠습니까?",
      text: "삭제 후 복구할 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${backServer}/product/deleteReview/${review.reviewNo}`)
          .then((res) => {
            console.log(res);
            if (res.data === 1) {
              Swal.fire({
                title: "리뷰가 삭제되었습니다.",
                icon: "success",
              });
              navigate(`/product/view/${productNo}`);
            }
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              title: "서버와의 통신 중 오류가 발생하였습니다.",
              text: err.message,
              icon: "error",
            });
          });
      }
    });
  };

  // 리뷰 좋아요 상태가 변경될 때 리뷰 좋아요 수 다시 조회 함수
  // useEffect(() => {
  //   axios
  //     .get(`${backServer}/product/${review.reviewNo}/likeCount`)
  //     .then((res) => {
  //       setReviewLikeCount(res.data.likeCount); // 최신 좋아요 수로 업데이트
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       Swal.fire({
  //         title: "좋아요 수를 가져오는 데 실패했습니다.",
  //         text: err.message,
  //         icon: "error",
  //       });
  //     });
  // }, [reviewLike]);

  const handleLikeToggle = () => {
    if (!isLogin) {
      Swal.fire({
        title: "로그인 후 이용이 가능합니다.",
        icon: "info",
      });
      return;
    }

    if (isLogin) {
      const newLikeStatus = !reviewLike; // 좋아요 상태 토글
      const request = newLikeStatus
        ? axios.post(
            // 리뷰 좋아요
            `${backServer}/product/${review.reviewNo}/insertReviewLike/${userEmail}`,
            { reviewLike: 1 }
          )
        : axios.delete(
            // 리뷰 좋아요 취소
            `${backServer}/product/${review.reviewNo}/deleteReviewLike/${userEmail}?reviewLike=1`
          );

      request
        .then((res) => {
          console.log(res.data);
          setReviewLike(newLikeStatus); // 좋아요 상태 업데이트
          setReviewLikeCount((prevCount) =>
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
    <li className="posting-item">
      <div className="posting-review">
        <div className="posting-review-info">
          <div className="review-info-left">
            <span style={{ display: "none" }}>{review.reviewNo}</span>
            <span className="reviewWriter">{review.reviewWriter}</span>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <span className="reviewDate">{review.reviewDate}</span>
          </div>
          <div className="review-info-right">
            {/* <Link className="btn-secondary sm" to={`/product/updateReview`}>
              수정
            </Link> */}
            <button
              className="btn-secondary sm review-update-btn"
              onClick={handleOpenReviewDialog}
            >
              수정
            </button>
            <button
              className="btn-secondary sm review-delete-btn"
              onClick={deleteReview}
            >
              삭제
            </button>
          </div>
        </div>
        {/* <div>{review.reviewScore}</div> */}
        <Rating
          name={`rating-${review.reviewId}`}
          value={review.reviewScore} // 리뷰 점수
          readOnly // 읽기 전용
        />
        <div className="posting-review-content">{review.reviewContent}</div>
        <div className="review-link-box">
          <span
            className={
              reviewLike && review.reviewWriter === loginEmail
                ? "review-like-checked"
                : "review-like-unchecked"
            }
            onClick={handleLikeToggle}
          >
            <i
              className={
                reviewLike && review.reviewWriter === loginEmail
                  ? "fa-solid fa-thumbs-up"
                  : "fa-regular fa-thumbs-up"
              }
            ></i>
            <span
              style={{ width: "12px", display: "inline-block" }}
              className="reviewLikeCount"
            >
              {reviewLikeCount}
            </span>
          </span>
          <span className="reviewReComment-btn">
            <i className="fa-solid fa-comment-dots"></i>
            <Link className="recShow">답글</Link>
            <span className="reviewReCommentCount">0</span>
          </span>
        </div>
      </div>
      <div style={{ margin: "30px 0" }} className="line"></div>
      {/* 리뷰 작성 다이얼로그 */}
      <div className="inputCommentBox">
        <Dialog
          open={openReviewDialog}
          onClose={handleCloseReviewDialog}
          PaperProps={{
            style: { width: "800px", zIndex: "10" }, // 다이얼로그의 가로 크기를 800px로 설정
          }}
          maxWidth={false} // maxWidth 기본값을 사용하지 않도록 설정
          fullWidth={true} // 다이얼로그가 지정된 너비를 채우도록 설정
        >
          <DialogTitle>리뷰 수정</DialogTitle>
          <DialogContent>
            <Review
              productNo={productNo}
              open={openReviewDialog}
              handleClose={handleCloseReviewDialog}
              review={review}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReviewDialog} color="primary">
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </li>
  );
};

export default ProductView;
