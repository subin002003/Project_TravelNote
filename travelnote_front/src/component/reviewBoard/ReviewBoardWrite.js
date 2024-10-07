import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";
import { userNickState } from "../utils/RecoilData";
import ReviewBoardFrm from "./ReviewBoardFrm";
import ReviewBoardToastEditor from "../utils/ReviewBoardToastEditor";

const ReviewBoardWrite = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  //글 작성 시 전송할 데이터 선언
  const [userNick, setUserNick] = useRecoilState(userNickState); // 로그인한 회원 닉네임(입력할게 아니기때문에 state 사용 x , 변수로만 사용);
  const [reviewBoardTitle, setReviewBoardTitle] = useState(""); //사용자가 입력할 제목
  const [reviewBoardCategory, setReviewBoardCategory] = useState(""); // 사용자가 입력할 카테고리
  const [reviewBoardContent, setReviewBoardContent] = useState(""); //사용자가 입력할 내용
  const [reviewBoardFile, setReviewBoardFile] = useState([]); //첨부파일(여러개일수 있으므로 배열로 처리)
  const [thumbnail, setThumbnail] = useState(null); //썸네일은 첨부파일로 처리 //썸네일은 첨부파일로 처리
  const [reviewBoardSubContent, setReviewBoardSubContent] = useState(""); // 썸네일 옆 내용
  const inputTitle = (e) => {
    setReviewBoardTitle(e.target.value);
  };
  const inputCategory = (e) => {
    setReviewBoardCategory(e.target.value);
  };

  const writeReviewBoard = () => {
    Swal.fire({
      title: "등록하시겠습니까?",
      icon: "warning",
      showCancelButton: true, // 취소 버튼 표시
      cancelButtonColor: "#3085d6",
      confirmButtonText: "등록",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        // 사용자가 '등록'를 클릭했을 경우
        if (reviewBoardTitle !== "" && reviewBoardContent !== "") {
          const form = new FormData();
          form.append("reviewBoardTitle", reviewBoardTitle);
          form.append("reviewBoardCategory", reviewBoardCategory);
          form.append("reviewBoardContent", reviewBoardContent);
          form.append("reviewBoardWriter", userNick);
          form.append("reviewBoardSubContent", reviewBoardSubContent);

          // 썸네일이 첨부된 경우에만 추가
          if (thumbnail !== null) {
            form.append("thumbnail", thumbnail);
          }
          //첨부파일도 추가한 경우에만 등록(첨부파일은 여러개가 같은 name으로 전송)
          for (let i = 0; i < reviewBoardFile.length; i++) {
            form.append("reviewBoardFile", reviewBoardFile[i]);
          }
          axios
            .post(`${backServer}/reviewBoard`, form, {
              headers: {
                contentType: "multipart/form-data",
                processData: false,
              },
            })
            .then((res) => {
              console.log(res);
              if (res.data) {
                navigate("/reviewBoard/list");
              } else {
                Swal.fire({
                  title: "에러가 발생했습니다",
                  text: "원인을 찾으세요",
                  icon: "error",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    });
  };

  return (
    <section className="review-board-wrap">
      <div
        className="review-board-title"
        style={{ marginBottom: "40px", fontWeight: "bold" }}
      >
        여행 후기 작성
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault(); // 기본 폼 제출 방지
          writeReviewBoard(); // 리뷰 게시글 작성 함수 호출
        }}
      >
        <ReviewBoardFrm
          userNick={userNick}
          reviewBoardTitle={reviewBoardTitle}
          setReviewBoardTitle={inputTitle}
          reviewBoardCategory={reviewBoardCategory}
          setReviewBoardCategory={inputCategory}
          reviewBoardFile={reviewBoardFile}
          setReviewBoardFile={setReviewBoardFile}
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
          reviewBoardSubContent={reviewBoardSubContent}
          setReviewBoardSubContent={setReviewBoardSubContent}
        />
        <div>
          <ReviewBoardToastEditor
            reviewBoardContent={reviewBoardContent}
            setReviewBoardContent={setReviewBoardContent}
            type={0}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <button type="submit" className="board-button-link-regist">
            등록
          </button>
        </div>
      </form>
    </section>
  );
};

export default ReviewBoardWrite;
