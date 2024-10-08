import {
  Rating,
  Stack,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { loginEmailState } from "../../utils/RecoilData";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Review = ({
  productNo,
  open,
  handleClose,
  review,
  parentReviewNo,
  fetchProductReviewList,
}) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  // const { productNo } = useParams();

  const [productReviewList, setProductReviewList] = useState([]);

  const [reviewWriter, setReviewWriter] = useState(loginEmail || "");
  const [reviewScore, setReviewScore] = useState(
    review ? review.reviewScore : 0.5
  );
  const [reviewContent, setReviewContent] = useState(
    review ? review.reviewContent : ""
  );
  const [reviewCommentRef, setReviewCommentRef] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (review) {
      // review가 있을 때 상태를 설정합니다.
      setReviewWriter(review.reviewWriter);
      setReviewScore(review.reviewScore);
      setReviewContent(review.reviewContent);
      setReviewCommentRef(review.reviewCommentRef);
    } else {
      // review가 없을 때 상태를 초기화합니다.
      setReviewWriter(loginEmail || "");
      setReviewScore(0.5);
      setReviewContent("");
      setReviewCommentRef(parentReviewNo || 0);
    }
  }, [review, parentReviewNo, loginEmail]);

  const handleSubmit = () => {
    // 리뷰 답글일 때 리뷰 점수를 0으로 설정
    const scoreToSubmit = reviewCommentRef > 0 ? 0 : reviewScore;

    if (scoreToSubmit >= 0 && reviewContent.trim() && productNo) {
      setLoading(true); // 로딩 시작
      const form = new FormData();
      form.append("productNo", productNo);
      form.append("reviewWriter", reviewWriter);
      form.append("reviewScore", scoreToSubmit);
      form.append("reviewContent", reviewContent);
      form.append("reviewCommentRef", reviewCommentRef);

      // 수정할 리뷰 ID 추가
      // if (review) {
      //   form.append("reviewNo", review.reviewNo);
      // }

      // const requestUrl = review ? `${backServer}/product/updateReview` : `${backServer}/product/insertReview`;

      // 요청 로직
      let request;
      if (review) {
        // 리뷰 수정
        request = axios.patch(
          `${backServer}/product/updateReview/${review.reviewNo}`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else if (reviewCommentRef > 0) {
        // 리뷰 답글 등록
        request = axios.post(
          `${backServer}/product/insertReviewComment`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // 일반 리뷰 등록
        request = axios.post(`${backServer}/product/insertReview`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      request
        .then((res) => {
          console.log(res);
          if (res.data) {
            Swal.fire({
              title: review
                ? "리뷰가 수정되었습니다."
                : reviewCommentRef > 0
                ? "리뷰 답글이 등록되었습니다."
                : "리뷰가 등록되었습니다.",
              icon: "success",
            });

            // 다이얼로그를 닫고 리뷰 리스트를 갱신합니다.
            handleClose(); // 다이얼로그 닫기

            // 리뷰 등록 또는 수정 후 화면에 리뷰를 업데이트
            fetchProductReviewList(); // 리뷰 리스트 갱신
            // fetchProductReviewReCommentList(); // 리뷰 답글 리스트 갱신
          } else {
            Swal.fire({
              title: "리뷰(답글) 등록/수정에 실패하였습니다.",
              icon: "warning",
            });
          }
        })
        .catch((err) => {
          console.error(err);
          const errorMessage =
            err.response?.data?.message ||
            "서버와의 통신 중 오류가 발생하였습니다.";
          Swal.fire({
            title: "오류 발생",
            text: errorMessage,
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

  // 리뷰 리스트를 서버에서 다시 불러오는 함수
  // const fetchReviews = () => {
  //   axios
  //     .get(`${backServer}/product/productNo/${productNo}/${loginEmail}`)
  //     .then((res) => {
  //       setProductReviewList(res.data.productReviewList); // 서버로부터 가져온 리뷰 리스트로 상태를 갱신
  //     })
  //     .catch((err) => {
  //       console.error("리뷰 목록 불러오기 중 오류 발생:", err);
  //     });
  // };

  // console.log(reviewContent);

  return (
    <Stack spacing={2}>
      {/* parentReviewNo가 없는 경우에만 Rating 컴포넌트를 보여줍니다 */}
      {!parentReviewNo && (
        <Rating
          name="half-rating"
          value={reviewScore}
          precision={0.5}
          onChange={(event, newValue) => {
            setReviewScore(newValue);
          }}
        />
      )}
      <TextField
        label={parentReviewNo ? "답글을 남겨주세요" : "리뷰를 남겨주세요"}
        multiline
        rows={4}
        value={reviewContent}
        onChange={(e) => {
          // console.log(setReviewContent);
          setReviewContent(e.target.value); // 상태 업데이트
        }}
        variant="outlined"
        error={reviewContent.trim() === ""}
        helperText={reviewContent.trim() === "" ? "내용을 입력해주세요." : ""}
        sx={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "7px",
          transition: "all 0.35s ease",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#ddd",
            },
            "&:hover fieldset": {
              borderColor: "#ddd",
            },
            "&.Mui-focused fieldset": {
              border: "1px solid #1363df",
              transitionDuration: "0.5s",
            },
          },
        }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={
          loading ||
          (!parentReviewNo && reviewScore <= 0) ||
          reviewContent.trim() === ""
        }
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
        {loading ? (
          <CircularProgress size={24} />
        ) : review ? (
          "리뷰 수정"
        ) : reviewCommentRef > 0 ? (
          "답글 작성"
        ) : (
          "리뷰 작성"
        )}
      </Button>
    </Stack>
  );
};

export default Review;
