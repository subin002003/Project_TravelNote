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
import Review from "./review/Review";
import Swal from "sweetalert2";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoginState,
  loginEmailState,
  userTypeState,
} from "../utils/RecoilData";
import ChannelTalk from "./ChannelTalk";
// mui-select
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import GoogleMap from "./GoogleMap";
import PageNavi from "../utils/PagiNavi";

const sortOptions = [
  { label: "좋아요순", value: "mostLiked" },
  { label: "최신순", value: "newest" },
  { label: "별점순", value: "score" },
];

const ProductView = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  // 로그인 회원 정보
  const isLogin = useRecoilValue(isLoginState);
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const [userType, setUserType] = useRecoilState(userTypeState);

  const params = useParams();
  const productNo = params.productNo;
  // const [product, setProduct] = useState({ fileList: [], reviews: [] });
  const [product, setProduct] = useState({
    productFileList: [],
    productReviewList: [],
  });
  const [productFileList, setProductFileList] = useState([]);
  // 리뷰 리스트
  const [productReviewList, setProductReviewList] = useState([]);
  // 리뷰 답글 리스트
  const [productReviewReCommentList, setProductReviewReCommentList] = useState(
    []
  );
  // const [newProductReviewList, setNewProductReviewList] = useState([]);

  const [reviewList, setReviewList] = useState(productReviewList); // 리뷰 리스트 상태
  const [reviewReCommentList, setReviewReCommentList] = useState(
    productReviewReCommentList
  ); // 리뷰 리스트 상태

  const [reqPage, setReqPage] = useState(1);
  const [pi, setPi] = useState({});

  const navigate = useNavigate();
  const [people, setPeople] = useState(1); // 초기 수량을 1로 설정
  const [dateRange, setDateRange] = useState("여행 날짜를 선택하세요."); // 선택된 날짜 범위를 상태로 관리
  const [openReviewDialog, setOpenReviewDialog] = useState(false); // 다이얼로그 상태

  useEffect(() => {
    if (!productNo || !loginEmail) {
      // console.error("productNo 또는 loginEmail 유효하지 않습니다.");
      return;
    }

    const request = loginEmail
      ? axios.get(
          `${backServer}/product/productNo/${productNo}/${encodeURIComponent(
            loginEmail
          )}/${reqPage}`
        )
      : axios.get(`${backServer}/product/productNo/${productNo}/${reqPage}`);

    request
      .then((res) => {
        // console.log(res.data);
        setProduct(res.data.product);
        setProductFileList(res.data.productFileList); // 첨부파일 관리
        setProductReviewList(res.data.productReviewList); // 리뷰 관리
        setProductReviewReCommentList(res.data.productReviewReCommentList);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log("Error:", err.response ? err.response.data : err.message);
        Swal.fire({
          title: "상품 정보를 불러오는 데 실패했습니다.",
          text: "다시 시도하세요.",
          icon: "error",
        });
      });
  }, [productNo, loginEmail, reqPage]);

  // 각 정렬 옵션에 따른 클릭 이벤트 처리
  const handleSortClick = (sortOption) => {
    // console.log(sortOption);

    axios
      .get(
        `${backServer}/product/productNo/${productNo}/review/${loginEmail}/${sortOption}`
      )
      .then((res) => {
        // console.log(res.data); // 응답 데이터 로그

        // 새로운 리뷰 리스트를 가져옵니다.
        const newProductReviewList = res.data.productReviewList;
        const newProductReviewReCommentList =
          res.data.productReviewReCommentList;

        // 기존 리뷰 리스트를 새로운 리뷰 리스트로 업데이트
        setProductReviewList(newProductReviewList);
        setProductReviewReCommentList(newProductReviewReCommentList);
      })
      .catch((err) => {
        console.error("Axios error:", err);
        console.error(
          "Error response data:",
          err.response ? err.response.data : "No response data"
        );
      });
  };

  useEffect(() => {
    // console.log(
    //   "리뷰 리스트가 업데이트되었습니다:",
    //   productReviewList,
    //   productReviewReCommentList
    // );
  }, [productReviewList, productReviewReCommentList]); // productReviewList가 변경될 때마다 콜백이 실행

  // 날짜 범위 상태
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // DatePicker로 선택된 날짜 처리
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
      const endFormatted = new Date(endDate).toLocaleDateString(
        "ko-KR",
        options
      );

      setDateRange(`선택된 날짜: ${startFormatted} ~ ${endFormatted}`);
      setStartDate(startDate); // startDate 상태 업데이트
      setEndDate(endDate); // endDate 상태 업데이트
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

  const handleDeleteReview = (deletedReviewNo) => {
    // 리뷰가 삭제된 후 필터링하여 삭제된 리뷰를 목록에서 제거
    // setReviews(reviews.filter((review) => review.reviewNo !== deletedReviewNo));
    setProductReviewList((prevReviews) =>
      prevReviews.filter((review) => review.reviewNo !== deletedReviewNo)
    );
    setProductReviewReCommentList((prevReviews) =>
      prevReviews.filter((review) => review.reviewNo !== deletedReviewNo)
    );
  };

  {
    /*
    const request = loginEmail
      ? axios.get(
          `${backServer}/product/productNo/${productNo}/${loginEmail}/${reqPage}`
        )
      : axios.get(`${backServer}/product/productNo/${productNo}/${reqPage}`);
    */
  }

  // 리뷰 목록 갱신 함수
  const fetchProductReviewList = () => {
    axios
      .get(
        `${backServer}/product/productNo/${productNo}/${loginEmail}/${reqPage}`
      )
      .then((res) => {
        setProductReviewList(res.data.productReviewList); // 리뷰 리스트 갱신
        setProductReviewReCommentList(res.data.productReviewReCommentList);
      })
      .catch((err) => {
        console.error("리뷰 목록 불러오기 중 오류 발생:", err);
      });
  };

  // 리뷰 답글 목록 갱신 함수
  // const fetchProductReviewReCommentList = () => {
  //   axios
  //     .get(`${backServer}/product/productNo/${productNo}/${loginEmail}`)
  //     .then((res) => {
  //       setProductReviewReCommentList(res.data.productReviewReCommentList); // 리뷰 리스트 갱신
  //     })
  //     .catch((err) => {
  //       console.error("리뷰 답글 목록 불러오기 중 오류 발생:", err);
  //     });
  // };

  const minus = () => {
    if (people === 1) {
      Swal.fire({
        title: "최소 구매 수량은 1개 입니다.",
        icon: "warning",
      });
    } else {
      setPeople((prevCount) => prevCount - 1); // 이전 값을 기반으로 상태 업데이트
    }
  };

  const plus = () => {
    if (people === 10) {
      Swal.fire({
        title: "최대 구매 수량은 10개 입니다.",
        icon: "warning",
      });
    } else {
      setPeople((prevCount) => prevCount + 1); // 이전 값을 기반으로 상태 업데이트
    }
  };

  // 리뷰 작성 팝업 열기
  const handleOpenReviewDialog = () => {
    if (!isLogin) {
      Swal.fire({
        title: "로그인이 필요합니다.",
        text: "리뷰를 작성하려면 로그인이 필요합니다. 로그인하시겠습니까?",
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
    } else {
      setOpenReviewDialog(true); // 로그인 상태일 경우에만 다이얼로그를 엶
      fetchProductReviewList(); // 다이얼로그가 닫힐 때 리뷰 목록 갱신
      // fetchProductReviewReCommentList();
    }
  };
  // const handleOpenReviewDialog = () => {
  //   setOpenReviewDialog(true);
  // };

  // 리뷰 작성 팝업 닫기
  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    fetchProductReviewList(); // 다이얼로그가 닫힐 때 리뷰 목록 갱신
    // fetchProductReviewReCommentList();
  };

  return (
    <section className="section sec product-view-wrap">
      <div className="product-view-content">
        <div className="product-view-info">
          <div className="product-thumbnail-swiper">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              slidesPerView={1}
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
              {productFileList && productFileList.length > 0 ? (
                productFileList.map((file, i) => (
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
              id="people"
              value={people}
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

          <div>
            <Link
              to="/travelReservation"
              onClick={() => {
                localStorage.setItem("productNo", product.productNo);
                localStorage.setItem("productName", product.productName);
                localStorage.setItem("startDate", startDate);
                localStorage.setItem("endDate", endDate);
                localStorage.setItem("people", people);
                localStorage.setItem("productPrice", product.productPrice);
              }}
              style={{ padding: "23.5px 0", width: "100%", display: "block" }}
              className="btn-primary lg"
            >
              여행 예약하기
            </Link>
          </div>
        </div>

        <div className="line"></div>

        <div className="sec product-content">
          <h3 className="section-title">여행지 소개</h3>
          <div>
            {product.productInfo ? (
              <Viewer initialValue={product.productInfo} />
            ) : (
              <p style={{ textAlign: "center", color: "gray" }}>
                여행지 정보가 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="clear"></div>
      <div className="line"></div>
      <div className="clear"></div>

      <div id="map" className="sec product-google-map">
        <h3 className="section-title">지도</h3>
        {product.productLatitude && product.productLongitude ? (
          <GoogleMap
            latitude={product.productLatitude}
            longitude={product.productLongitude}
          />
        ) : (
          <p style={{ textAlign: "center", color: "gray" }}>
            위치 정보가 없습니다.
          </p>
        )}
      </div>

      <div className="clear"></div>
      <div className="line"></div>

      <div className="sec review">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0px",
          }}
          className="section-title"
        >
          <span style={{ fontSize: "20px" }}>
            <strong>리뷰({productReviewList.length}개)</strong>
            {/* <strong>리뷰({reviews.length}개)</strong> */}
          </span>
          <div style={{ display: "flex", alignItems: "center" }}>
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
        </div>

        <div className="line" style={{ margin: "30px 0" }}></div>

        {/* 리뷰 출력 */}
        <div className="commentBox">
          {/* 부모 리뷰에 해당하는 자식 리뷰가 하위에 오도록 출력 */}
          {/* 부모 리뷰 출력 */}
          <div className="posting-review-wrap">
            <ul>
              {productReviewList.length > 0 ? (
                productReviewList.map((review) => (
                  <li className="posting-item" key={review.reviewNo}>
                    <ReviewItem
                      product={product}
                      review={review}
                      parentReviewNo={review.reviewNo} // 부모 리뷰 ID 전달
                      onDeleteReview={handleDeleteReview} // 삭제 핸들러 전달
                      fetchProductReviewList={fetchProductReviewList} // 여기서 전달
                    />
                    {/* 해당 부모 리뷰의 자식 리뷰 출력 */}
                    <ul>
                      {productReviewReCommentList
                        .filter(
                          (reComment) =>
                            reComment.reviewCommentRef === review.reviewNo
                        ) // 부모 리뷰 ID와 일치하는 자식 리뷰 필터링
                        .map((reComment) => (
                          <li className="posting-item" key={reComment.reviewNo}>
                            <ReviewReCommentItem
                              product={product}
                              review={reComment}
                              parentReviewNo={reComment.reviewNo} // 부모 리뷰 ID 전달
                              onDeleteReview={handleDeleteReview} // 삭제 핸들러 전달
                              fetchProductReviewList={fetchProductReviewList} // 여기서 전달
                              // fetchProductReviewReCommentList={
                              //   fetchProductReviewReCommentList
                              // } // 여기서 전달
                            />
                          </li>
                        ))}
                    </ul>
                  </li>
                ))
              ) : (
                <li
                  style={{
                    margin: "150px auto",
                    textAlign: "center",
                    color: "gray",
                  }}
                >
                  등록된 리뷰가 없습니다.
                </li>
              )}
            </ul>
          </div>
          <div className="review-paging-wrap">
            <PageNavi pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
          </div>
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
              fetchProductReviewList={fetchProductReviewList} // 리뷰 리스트 갱신 함수 전달
              // fetchProductReviewReCommentList={fetchProductReviewReCommentList} // 리뷰 답글 리스트 갱신 함수 전달
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
        <div className="buttonBox">
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

const ReviewItem = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const product = props.product;
  const productNo = product.productNo;
  const review = props.review;
  const navigate = useNavigate();

  const { fetchProductReviewList } = props;

  const parentReviewNo = props.reviewCommentRef;

  // 로그인 회원 정보
  const isLogin = useRecoilValue(isLoginState);
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);

  // 리뷰의 좋아요 상태와 좋아요 수
  const [reviewLike, setReviewLike] = useState(review.reviewLike === 1); // 좋아요 상태 (1: 좋아요, 0: 비활성화)
  const [reviewLikeCount, setReviewLikeCount] = useState(
    review.reviewLikeCount
  ); // 좋아요 수

  const newLikeState = reviewLike ? 0 : 1; // 좋아요 상태를 토글
  const newCount = reviewLike ? reviewLikeCount - 1 : reviewLikeCount + 1; // 좋아요 수 업데이트

  // 리뷰 작성 다이얼로그
  const [openReviewDialog, setOpenReviewDialog] = useState(false); // 다이얼로그 상태
  const [dialogType, setDialogType] = useState("");

  // 리뷰 작성 팝업 열기
  const handleOpenReviewDialog = (type) => {
    if (!isLogin && type === "update") {
      Swal.fire({
        title: "로그인이 필요합니다.",
        text: "리뷰를 수정하려면 로그인이 필요합니다. 로그인하시겠습니까?",
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
    } else if (!isLogin) {
      Swal.fire({
        title: "로그인이 필요합니다.",
        text: "리뷰를 작성하려면 로그인이 필요합니다. 로그인하시겠습니까?",
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
    } else {
      setOpenReviewDialog(true); // 로그인 상태일 경우에만 다이얼로그를 엶
      setDialogType(type); // 'register', 'update', 'reply' 타입 설정
      // 여기에 parentReviewId를 사용하는 로직 추가
      // console.log("Parent Review ID:", parentReviewNo);
    }
  };

  // 리뷰 작성 팝업 닫기
  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
  };

  // 리뷰 삭제
  const deleteReview = () => {
    if (!isLogin) {
      Swal.fire({
        title: "로그인이 필요합니다.",
        text: "리뷰를 삭제하려면 로그인이 필요합니다. 로그인하시겠습니까?",
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
    } else {
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
              // console.log(res);
              if (res.data === 1) {
                Swal.fire({
                  title: "리뷰가 삭제되었습니다.",
                  icon: "success",
                });
                props.onDeleteReview(review.reviewNo); // 삭제된 리뷰 번호를 상위 컴포넌트에 전달
                // navigate(`/product/view/${productNo}`);
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
    }
  };

  const handleLikeToggle = () => {
    if (!isLogin) {
      Swal.fire({
        title: "로그인이 필요합니다.",
        text: "리뷰에 '좋아요'를 하려면 로그인이 필요합니다. 로그인하시겠습니까?",
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

    if (isLogin) {
      const newLikeStatus = !reviewLike; // 좋아요 상태 토글
      const request = newLikeStatus
        ? axios.post(
            // 리뷰 좋아요
            `${backServer}/product/${review.reviewNo}/insertReviewLike/${loginEmail}`,
            { reviewLike: 1 }
          )
        : axios.delete(
            // 리뷰 좋아요 취소
            `${backServer}/product/${review.reviewNo}/deleteReviewLike/${loginEmail}?reviewLike=1`
          );

      request
        .then((res) => {
          // console.log(res.data);
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
    <>
      <div className="posting-review">
        <div className="posting-review-info">
          <div className="review-info-left">
            <span style={{ display: "none" }}>{review.reviewNo}</span>
            <span className="reviewWriter">{review.reviewWriter}</span>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <span className="reviewDate">{review.reviewDate}</span>
          </div>
          <div className="review-info-right">
            <button
              className="btn-secondary sm review-update-btn"
              onClick={() => handleOpenReviewDialog("update")}
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
        <Rating
          name={`rating-${review.reviewId}`}
          value={review.reviewScore} // 리뷰 점수
          precision={0.1} // 소수점 이하 1자리까지 표시
          readOnly // 읽기 전용
        />
        <div
          className="posting-review-content"
          style={{
            whiteSpace: "pre-wrap", // 줄바꿈과 공백을 그대로 렌더링
            wordWrap: "break-word", // 단어가 너무 길 경우 줄바꿈 처리
          }}
        >
          {review.reviewContent}
        </div>
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
            {/* 답글 버튼 */}
            <button
              style={{
                margin: "0 0 0 4px",
                padding: "0",
                border: "none",
                outline: "none",
                borderRadius: "10px",
                background: "transparent",
                color: "var(--gray2)",
                fontSize: "16px",
              }}
              className="btn-secondary sm"
              onClick={() => handleOpenReviewDialog("reply")} // 답글 처리
            >
              답글
            </button>
            <span className="reviewReCommentCount">
              {review.reviewReplyCount}
            </span>
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
          <DialogTitle>
            {dialogType === "update"
              ? "리뷰 수정"
              : dialogType === "reply"
              ? "답글 작성"
              : "리뷰 작성"}
          </DialogTitle>
          <DialogContent
            sx={{
              paddingTop: dialogType === "reply" ? "20px !important" : "0px", // dialogType이 reply일 때만 padding-top 20px 적용
            }}
          >
            <Review
              productNo={productNo}
              review={dialogType === "update" ? review : null} // 리뷰 수정인 경우에만 review 전달
              parentReviewNo={dialogType === "reply" ? review.reviewNo : null} // 답글인 경우 parentReviewNo 전달
              handleClose={handleCloseReviewDialog}
              fetchProductReviewList={fetchProductReviewList} // 여기서 다시 전달
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReviewDialog} color="primary">
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

const ReviewReCommentItem = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const product = props.product;
  const productNo = product.productNo;
  const review = props.review;
  const navigate = useNavigate();

  const { fetchProductReviewList } = props;

  const parentReviewNo = props.reviewCommentRef;

  // 로그인 회원 정보
  const isLogin = useRecoilValue(isLoginState);
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);

  // 리뷰의 좋아요 상태와 좋아요 수
  const [reviewLike, setReviewLike] = useState(review.reviewLike === 1); // 좋아요 상태 (1: 좋아요, 0: 비활성화)
  const [reviewLikeCount, setReviewLikeCount] = useState(
    review.reviewLikeCount
  ); // 좋아요 수

  const newLikeState = reviewLike ? 0 : 1; // 좋아요 상태를 토글
  const newCount = reviewLike ? reviewLikeCount - 1 : reviewLikeCount + 1; // 좋아요 수 업데이트

  // 리뷰 작성 다이얼로그
  const [openReviewDialog, setOpenReviewDialog] = useState(false); // 다이얼로그 상태
  const [dialogType, setDialogType] = useState("");

  // 리뷰 작성 팝업 열기
  const handleOpenReviewDialog = (type) => {
    if (!isLogin && type === "update") {
      Swal.fire({
        title: "로그인이 필요합니다.",
        text: "답글을 수정하려면 로그인이 필요합니다. 로그인하시겠습니까?",
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
    } else if (!isLogin) {
      Swal.fire({
        title: "로그인이 필요합니다.",
        text: "답글을 작성하려면 로그인이 필요합니다. 로그인하시겠습니까?",
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
    } else {
      setOpenReviewDialog(true); // 로그인 상태일 경우에만 다이얼로그를 엶
      setDialogType(type); // 'register', 'update', 'reply' 타입 설정
      // 여기에 parentReviewId를 사용하는 로직 추가
      // console.log("Parent Review ID:", parentReviewNo);
    }
  };

  // 리뷰 작성 팝업 닫기
  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
  };

  // 리뷰 삭제
  const deleteReview = () => {
    if (!isLogin) {
      Swal.fire({
        title: "로그인이 필요합니다.",
        text: "답글을 삭제하려면 로그인이 필요합니다. 로그인하시겠습니까?",
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
    } else {
      Swal.fire({
        title: "답글을 삭제하시겠습니까?",
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
              // console.log(res);
              if (res.data === 1) {
                Swal.fire({
                  title: "답글이 삭제되었습니다.",
                  icon: "success",
                });
                props.onDeleteReview(review.reviewNo); // 삭제된 리뷰 번호를 상위 컴포넌트에 전달
                // navigate(`/product/view/${productNo}`);
              }
            })
            .catch((err) => {
              // console.log(err);
              Swal.fire({
                title: "서버와의 통신 중 오류가 발생하였습니다.",
                text: err.message,
                icon: "error",
              });
            });
        }
      });
    }
  };

  const handleLikeToggle = () => {
    if (!isLogin) {
      Swal.fire({
        title: "로그인이 필요합니다.",
        text: "답글에 '좋아요'를 하려면 로그인이 필요합니다. 로그인하시겠습니까?",
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

    if (isLogin) {
      const newLikeStatus = !reviewLike; // 좋아요 상태 토글
      const request = newLikeStatus
        ? axios.post(
            // 리뷰 좋아요
            `${backServer}/product/${review.reviewNo}/insertReviewLike/${loginEmail}`,
            { reviewLike: 1 }
          )
        : axios.delete(
            // 리뷰 좋아요 취소
            `${backServer}/product/${review.reviewNo}/deleteReviewLike/${loginEmail}?reviewLike=1`
          );

      request
        .then((res) => {
          // console.log(res.data);
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
    <>
      <div className="posting-review">
        <div className="posting-review-info">
          <div className="review-info-left">
            <span style={{ display: "none" }}>{review.reviewNo}</span>
            <span className="reviewWriter">{review.reviewWriter}</span>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <span className="reviewDate">{review.reviewDate}</span>
          </div>
          <div className="review-info-right">
            <button
              className="btn-secondary sm review-update-btn"
              onClick={() => handleOpenReviewDialog("update")}
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
        <div className="posting-review-content">
          <span>
            <i
              style={{ margin: "0 10px", transform: "rotate(90deg)" }}
              className="fa-solid fa-arrow-turn-up"
            ></i>
          </span>
          {review.reviewContent}
        </div>
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
          <span style={{ display: "none" }} className="reviewReComment-btn">
            <i className="fa-solid fa-comment-dots"></i>
            {/* 답글 버튼 */}
            <button
              style={{
                margin: "0 0 0 4px",
                padding: "0",
                border: "none",
                outline: "none",
                borderRadius: "10px",
                background: "transparent",
                color: "var(--gray2)",
                fontSize: "16px",
              }}
              className="btn-secondary sm"
              onClick={() => handleOpenReviewDialog("reply")} // 답글 처리
            >
              답글
            </button>
            <span className="reviewReCommentCount">
              {review.reviewReplyCount}
            </span>
          </span>
        </div>
      </div>

      <div style={{ margin: "30px 0" }} className="line"></div>

      {/* 리뷰 답글 작성 다이얼로그 */}
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
          <DialogTitle>
            {dialogType === "update"
              ? "리뷰 수정"
              : dialogType === "reply"
              ? "답글 작성"
              : "리뷰 작성"}
          </DialogTitle>
          <DialogContent
            sx={{
              paddingTop: dialogType === "reply" ? "20px !important" : "0px", // dialogType이 reply일 때만 padding-top 20px 적용
            }}
          >
            <Review
              productNo={productNo}
              review={dialogType === "update" ? review : null} // 리뷰 수정인 경우에만 review 전달
              parentReviewNo={dialogType === "reply" ? review.reviewNo : null} // 답글인 경우 parentReviewNo 전달
              handleClose={handleCloseReviewDialog}
              fetchProductReviewList={fetchProductReviewList} // 여기서 다시 전달
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReviewDialog} color="primary">
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default ProductView;
