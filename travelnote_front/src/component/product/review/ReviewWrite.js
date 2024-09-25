import { Rating, Stack, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { loginEmailState } from "../../utils/RecoilData";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Review = ({ open, handleClose }) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const { productNo } = useParams();

  const [reviewWriter, setReviewWriter] = useState("");
  const [reviewScore, setReviewScore] = useState(0.5);
  const [reviewContent, setReviewContent] = useState("");

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로그인 이메일로 리뷰 작성자 설정
    if (loginEmail) {
      setReviewWriter(loginEmail);
    }
  }, [loginEmail]);

  const writeReview = () => {
    if (reviewScore > 0 && reviewContent !== "") {
      const form = new FormData();
      form.append("reviewWriter", reviewWriter);
      form.append("reviewScore", reviewScore);
      form.append("reviewContent", reviewContent);
      form.append("productNo", productNo);

      axios
        .post(`${backServer}/product/insertReview`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data) {
            Swal.fire({
              title: "리뷰가 등록되었습니다.",
              icon: "success",
            });
            handleClose(); // 다이얼로그 닫기
            navigate(`/product/view/${productNo}`);
            // 입력 필드 초기화
            setReviewScore(0.5);
            setReviewContent("");
          } else {
            Swal.fire({
              title: "리뷰 등록에 실패하였습니다.",
              icon: "warning",
            });
          }
        })
        .catch((err) => {
          console.error(err);
          Swal.fire({
            title: "서버와의 통신 중 오류가 발생하였습니다.",
            icon: "error",
          });
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
