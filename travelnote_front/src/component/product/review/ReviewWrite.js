import { Rating, Stack, TextField, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { loginEmailState } from "../../utils/RecoilData";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Review = ({ productNo, open, handleClose, review }) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  // const { productNo } = useParams();

  const [reviewWriter, setReviewWriter] = useState(loginEmail || "");
  const [reviewScore, setReviewScore] = useState(review ? review.reviewScore : 0.5);
  const [reviewContent, setReviewContent] = useState(review ? review.reviewContent : "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (review) {
      setReviewScore(review.reviewScore);
      setReviewContent(review.reviewContent);
    } else {
      setReviewScore(0.5);
      setReviewContent("");
    }
  }, [review]);


  const handleSubmit = () => {
    if (reviewScore > 0 && reviewContent.trim()) {
      setLoading(true); // 로딩 시작
      const form = new FormData();
      form.append("reviewWriter", reviewWriter);
      form.append("reviewScore", reviewScore);
      form.append("reviewContent", reviewContent);
      form.append("productNo", productNo);

      // 수정할 리뷰 ID 추가
      if (review) {
        form.append("reviewNo", review.reviewNo);
      }

      // const requestUrl = review ? `${backServer}/product/updateReview` : `${backServer}/product/insertReview`;

      const request = review
        ? axios.patch(
          `${backServer}/product/updateReview`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        : axios.post(
          `${backServer}/product/insertReview`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

      request
        .then((res) => {
          console.log(res);
          if (res.data) {
            Swal.fire({
              title: review ? "리뷰가 수정되었습니다." : "리뷰가 등록되었습니다.",
              icon: "success",
            });
            handleClose(); // 다이얼로그 닫기
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
          setLoading(false); // 로딩 종료
        });
    } else {
      Swal.fire({
        title: "점수와 내용을 입력해주세요.",
        text: "리뷰 점수는 0점 이상 입력 해야합니다.",
        icon: "warning",
      });
    }
    console.log("ReviewScore:", reviewScore, "ReviewContent:", reviewContent);
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
        sx={{
          width: "100%", // 너비 100%로 설정
          backgroundColor: "#fff", // 배경색
          borderRadius: "7px", // 테두리 둥글게
          transition: "all 0.35s ease", // 트랜지션 효과
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#ddd", // 테두리 색상
            },
            "&:hover fieldset": {
              borderColor: "#ddd", // 호버 시 테두리 색상
            },
            "&.Mui-focused fieldset": {
              border: "1px solid #1363df",
              // transition: "all 0.35s ease", // 트랜지션 효과
              transitionDuration: "0.5s",
            },
          },
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading || reviewScore <= 0 || reviewContent.trim() === ""}
        sx={{
          backgroundColor: "#1363df",
          color: "white",
          fontWeight: "bold",
          padding: "10px 20px",
          borderRadius: "5px",
          "&:hover": {
            backgroundColor: "rgba(19, 99, 223, 0.8)", // 호버 시 배경색
          },
        }}
      >
        {loading ? <CircularProgress size={24} /> : (review ? "리뷰 수정" : "리뷰 작성")}
      </Button>
    </Stack>
  );
};

export default Review;
