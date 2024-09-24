import { Rating, Stack, TextField, Button } from "@mui/material";
import { useState } from "react";
import CustomButton from "./CustomButton";
import { useRecoilState } from "recoil";
import { loginEmailState } from "../../utils/RecoilData";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Review = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);

  const params = useParams();
  const product = params.product;

  // const [reviewNo, setReviewNo] = useState(0);
  // const [productNo, setProductNo] = useState(0);
  // const [reviewWriter, setReviewWriter] = useState("");
  const [reviewScore, setReviewScore] = useState(0.5);
  const [reviewContent, setReviewContent] = useState("");
  // const [reviewDate, setReviewDate] = useState("");
  // const [reviewRef, setReviewRef] = useState(0);

  const writeReview = () => {
    if (reviewScore !== 0.5 && reviewContent !== "") {
      const form = new FormData();
      form.append("reviewScore", reviewScore);
      form.append("reviewContent", reviewContent);
      axios
        .post(`${backServer}/product/insertReview`, form, {
          headers: {
            getContentType: "multipart/form-data",
            processData: false,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data) {
            navigate(`/product/view/:productNo`);
          } else {
            Swal.fire({
              title: "리뷰 등록에 실패하였습니다.",
              icon: "warning",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // 입력 필드 초기화
    setReviewScore(2.5);
    setReviewContent("");
    console.log("ReviewScore:", reviewScore, "ReviewContent:", reviewContent);
  };

  // console.log(reviewScore);
  // console.log(reviewContent);

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
        onClick={writeReview}
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
        리뷰 작성
      </Button>
    </Stack>
  );
};

export default Review;
