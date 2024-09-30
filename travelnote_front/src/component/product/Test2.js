import {
  Button,
  CircularProgress,
  Rating,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { loginEmailState } from "../../utils/RecoilData";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Review = ({ productNo, open, handleClose, review, parentReviewId }) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);

  const [reviewWriter, setReviewWriter] = useState(loginEmail || "");
  const [reviewScore, setReviewScore] = useState(
    review ? review.reviewScore : 0.5
  );
  const [reviewContent, setReviewContent] = useState(
    review ? review.reviewContent : ""
  );
  const [reviewCommentRef, setReviewCommentRef] = useState(parentReviewId || 0); // 부모 리뷰 ID를 설정

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (review) {
      setReviewScore(review.reviewScore);
      setReviewContent(review.reviewContent);
      // 답글인 경우 부모 리뷰 ID를 설정
      if (review.reviewCommentRef) {
        setReviewCommentRef(review.reviewCommentRef);
      }
    } else {
      setReviewScore(0.5);
      setReviewContent("");
      setReviewCommentRef(parentReviewId || 0); // 부모 리뷰 ID 초기화
    }
  }, [review, parentReviewId]);

  const handleSubmit = () => {
    if (reviewScore > 0 && reviewContent.trim()) {
      setLoading(true);
      const form = new FormData();
      form.append("reviewWriter", reviewWriter);
      form.append("reviewScore", reviewScore);
      form.append("reviewContent", reviewContent);
      form.append("reviewCommentRef", reviewCommentRef); // 부모 리뷰 ID 추가
      form.append("productNo", productNo);

      if (review) {
        form.append("reviewNo", review.reviewNo);
      }

      const request = review
        ? axios.patch(
            `${backServer}/product/${productNo}/updateReview/${review.reviewNo}`,
            form,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          )
        : axios.post(`${backServer}/product/${productNo}/insertReview`, form, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      request
        .then((res) => {
          if (res.data) {
            Swal.fire({
              title: review
                ? "리뷰가 수정되었습니다."
                : "리뷰가 등록되었습니다.",
              icon: "success",
            });
            handleClose();
            navigate(`/product/view/${productNo}`);
          } else {
            Swal.fire({
              title: "리뷰 등록/수정에 실패하였습니다.",
              icon: "warning",
            });
          }
        })
        .catch((err) => {
          console.error(err);
          Swal.fire({
            title: "서버와의 통신 중 오류가 발생하였습니다.",
            text: err.response?.data?.message || "문제가 발생했습니다.",
            icon: "error",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      Swal.fire({
        title: "점수와 내용을 입력해주세요.",
        text: "리뷰 점수는 0점 이상 입력해야 합니다.",
        icon: "warning",
      });
    }
  };

  return (
    <Stack spacing={2}>
      <Rating
        name="half-rating"
        value={reviewScore}
        precision={0.5}
        onChange={(event, newValue) => {
          setReviewScore(newValue);
        }}
      />
      <TextField
        label="리뷰를 남겨주세요"
        multiline
        rows={4}
        value={reviewContent}
        onChange={(e) => setReviewContent(e.target.value)}
        variant="outlined"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading || reviewScore <= 0 || reviewContent.trim() === ""}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : review ? (
          "리뷰 수정"
        ) : (
          "리뷰 작성"
        )}
      </Button>
    </Stack>
  );
};

export default Review;
