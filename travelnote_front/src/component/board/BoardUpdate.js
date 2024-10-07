import axios from "axios";
import { useEffect, useState } from "react";
import { loginEmailState } from "../utils/RecoilData";
import { useRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import BoardToastEditor from "../utils/BoardToastEditor";
import BoardFrm from "./BoardFrm";
import Swal from "sweetalert2";

const BoardUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();
  const boardNo = params.boardNo;
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [boardTitle, setBoardTitle] = useState("");
  const [boardCategory, setBoardCategory] = useState("");
  const [boardContent, setBoardContent] = useState("");
  //첨부파일을 새로 전송하기 위한 state
  const [boardFile, setBoardFile] = useState([]);
  //조회해 온 파일목록을 화면에 보여주기 위한 state
  const [fileList, setFileList] = useState([]);
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  //기존 첨부파일을 삭제하면 삭제한 파일번호를 저장할 배열
  const [delBoardFileNo, setDelBoardFileNo] = useState([]);
  const inputTitle = (e) => {
    setBoardTitle(e.target.value);
  };
  const inputCategory = (e) => {
    setBoardCategory(e.target.value);
  };
  useEffect(() => {
    axios
      .get(`${backServer}/board/boardNo/${boardNo}`)
      .then((res) => {
        console.log(res);
        setBoardTitle(res.data.boardTitle);
        setBoardCategory(res.data.boardCategory);
        setBoardContent(res.data.boardContent);
        setFileList(res.data.fileList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const updateBoard = () => {
    Swal.fire({
      title: "수정하시겠습니까?",
      icon: "warning",
      showCancelButton: true, // 취소 버튼 표시
      cancelButtonColor: "#3085d6",
      confirmButtonText: "수정",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        // 사용자가 '등록'를 클릭했을 경우
        if (boardTitle !== "" && boardContent !== "") {
          const form = new FormData();
          form.append("boardTitle", boardTitle);
          form.append("boardCategory", boardCategory);
          form.append("boardContent", boardContent);
          form.append("boardNo", boardNo);

          for (let i = 0; i < boardFile.length; i++) {
            form.append("boardFile", boardFile[i]);
          }
          for (let i = 0; i < delBoardFileNo.length; i++) {
            form.append("delBoardFileNo", delBoardFileNo[i]);
          }
          for (let key of form.keys()) {
            console.log(`${key}: ${form.get(key)}`);
          }
          console.log(delBoardFileNo);
          axios
            .patch(`${backServer}/board`, form, {
              headers: {
                contentType: "multipart/form-data",
                processData: false,
              },
            })
            .then((res) => {
              console.log(res);
              if (res.data === true) {
                navigate(`/board/view/${boardNo}`);
              } else {
                //실패시 로직
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
    <section className="board-wrap">
      <h1 className="board-title" style={{ marginBottom: "40px" }}>
        자유게시판 수정
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <BoardFrm
          loginEmail={loginEmail}
          boardTitle={boardTitle}
          setBoardTitle={inputTitle}
          boardCategory={boardCategory}
          setBoardCategory={inputCategory}
          boardFile={boardFile}
          setBoardFile={setBoardFile}
          fileList={fileList}
          setFileList={setFileList}
          delBoardFileNo={delBoardFileNo}
          setDelBoardFileNo={setDelBoardFileNo}
        />
      </form>
      <div>
        <BoardToastEditor
          boardContent={boardContent}
          setBoardContent={setBoardContent}
          type={1}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <button onClick={updateBoard} className="board-button-link-update">
          수정
        </button>
      </div>
    </section>
  );
};
export default BoardUpdate;
