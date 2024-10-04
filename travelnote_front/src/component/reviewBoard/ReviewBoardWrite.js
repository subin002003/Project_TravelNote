import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";
import { userNickState } from "../utils/RecoilData";
import ReviewBoardFrm from "./ReviewBoardFrm";
import BoardToastEditor from "../utils/BoardToastEditor";

const ReviewBoardWrite = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  //글 작성 시 전송할 데이터 선언
  const [userNick, setUserNick] = useRecoilState(userNickState); // 로그인한 회원 이메일 값(입력할게 아니기때문에 state 사용 x , 변수로만 사용);
  const [boardTitle, setBoardTitle] = useState(""); //사용자가 입력할 제목
  const [boardCategory, setBoardCategory] = useState(""); // 사용자가 입력할 카테고리
  const [boardContent, setBoardContent] = useState(""); //사용자가 입력할 내용
  const [boardFile, setBoardFile] = useState([]); //첨부파일(여러개일수 있으므로 배열로 처리)
  const inputTitle = (e) => {
    setBoardTitle(e.target.value);
  };
  const inputCategory = (e) => {
    setBoardCategory(e.target.value);
  };

  const writeBoard = () => {
    if (boardTitle !== "" && boardContent !== "") {
      const form = new FormData();
      form.append("boardTitle", boardTitle);
      form.append("boardCategory", boardCategory);
      form.append("boardContent", boardContent);
      form.append("boardWriter", userNick);
      //첨부파일도 추가한 경우에만 등록(첨부파일은 여러개가 같은 name으로 전송)
      for (let i = 0; i < boardFile.length; i++) {
        form.append("boardFile", boardFile[i]);
      }
      axios
        .post(`${backServer}/board`, form, {
          headers: {
            contentType: "multipart/form-data",
            processData: false,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data) {
            navigate("/board/list");
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
  };

  return (
    <section className="board-wrap">
      <div
        className="board-title"
        style={{ marginBottom: "40px", fontWeight: "bold" }}
      >
        후기게시판 작성
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          writeBoard();
        }}
      >
        <ReviewBoardFrm
          userNick={userNick}
          boardTitle={boardTitle}
          setBoardTitle={inputTitle}
          boardCategory={boardCategory}
          setBoardCategory={inputCategory}
          boardFile={boardFile}
          setBoardFile={setBoardFile}
        />
        <div>
          <BoardToastEditor
            boardContent={boardContent}
            setBoardContent={setBoardContent}
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
