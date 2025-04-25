import { Button } from "@mui/material";

const CustomButton = () => {
  // handleSubmit 함수 추가
  const writeReview = () => {
    // console.log("리뷰 작성 버튼 클릭됨");
  };
  return (
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
  );
};

export default CustomButton;
