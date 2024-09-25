import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoginState, userTypeState } from "../utils/RecoilData";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DateRangePickerComponent from "./DatePickerComponent";
import Review from "./review/ReviewWrite";

const ProductView = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const isLogin = useRecoilValue(isLoginState);
  const [userType] = useRecoilState(userTypeState);
  const params = useParams();
  const productNo = params.productNo;
  const [product, setProduct] = useState({ fileList: [], reviews: [] });
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);

  useEffect(() => {
    axios
      .get(`${backServer}/product/productNo/${productNo}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        Swal.fire({
          title: "상품 정보를 불러오는 데 실패했습니다.",
          icon: "error",
        });
      });
  }, [backServer, productNo]);

  // 리뷰 작성 다이얼로그 열기
  const handleOpenReviewDialog = () => {
    setIsEdit(false); // 작성 모드로 설정
    setCurrentReview(null); // 빈 리뷰 데이터
    setOpenReviewDialog(true);
  };

  // 리뷰 수정 다이얼로그 열기
  const handleEditReviewDialog = (review) => {
    setIsEdit(true); // 수정 모드로 설정
    setCurrentReview(review); // 수정할 리뷰 데이터 설정
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
  };

  return (
    <section className="section product-view-wrap">
      <div className="product-view-content">
        {/* 상품 정보 출력, Swiper 슬라이드 생략 */}
        <div className="sec comment">
          <div className="section-title">
            <span>
              <strong>리뷰({product.reviews.length}개)</strong>
            </span>
            <button
              className="btn-secondary lg"
              onClick={handleOpenReviewDialog}
            >
              리뷰 작성
            </button>
          </div>

          <div className="line"></div>

          <div className="commentBox">
            <ul>
              {product.reviews.map((review, i) => (
                <ReviewItem
                  key={"review-" + i}
                  review={review}
                  onEdit={() => handleEditReviewDialog(review)}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* 리뷰 작성/수정 다이얼로그 */}
        <Dialog
          open={openReviewDialog}
          onClose={handleCloseReviewDialog}
          fullWidth
        >
          <DialogTitle>{isEdit ? "리뷰 수정" : "리뷰 작성"}</DialogTitle>
          <DialogContent>
            <Review
              productNo={productNo}
              isEdit={isEdit}
              review={currentReview}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReviewDialog}>닫기</Button>
          </DialogActions>
        </Dialog>
      </div>
    </section>
  );
};

const ReviewItem = ({ review, onEdit }) => {
  return (
    <li className="posting-item">
      <div className="posting-review">
        <div className="posting-review-info">
          <div className="review-info-left">
            <span>{review.reviewWriter}</span>
            <span>{review.reviewDate}</span>
          </div>
          <div className="review-info-right">
            <button className="btn-secondary sm" onClick={onEdit}>
              수정
            </button>
          </div>
        </div>
        <Rating value={review.reviewScore} readOnly />
        <div className="posting-review-content">{review.reviewContent}</div>
      </div>
      <div className="line"></div>
    </li>
  );
};

export default ProductView;
