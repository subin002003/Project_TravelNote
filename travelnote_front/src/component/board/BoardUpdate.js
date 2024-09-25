import axios from "axios";
import ToastEditor from "../utils/ToastEditor";
import BoardFrm from "./BoardFrm";
import { useEffect, useState } from "react";
import { loginEmailState } from "../utils/RecoilData";
import { useRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";

const BoardUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();
  const boardNo = params.boardNo;
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [boardTitle, setBoardTitle] = useState("");
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
  useEffect(() => {
    axios
      .get(`${backServer}/board/boardNo/${boardNo}`)
      .then((res) => {
        console.log(res);
        setBoardTitle(res.data.boardTitle);
        setBoardContent(res.data.boardContent);

        setFileList(res.data.fileList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const updateBoard = () => {
    if (boardTitle !== "" && boardContent !== "") {
      const form = new FormData();
      form.append("boardTitle", boardTitle);
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
  };
  return (
    <section>
      <div> 게시글 수정 </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <BoardFrm
          loginEmail={loginEmail}
          boardTitle={boardTitle}
          setBoardTitle={inputTitle}
          boardFile={boardFile}
          setBoardFile={setBoardFile}
          fileList={fileList}
          setFileList={setFileList}
          delBoardFileNo={delBoardFileNo}
          setDelBoardFileNo={setDelBoardFileNo}
        />
      </form>
      <div>
        <ToastEditor
          boardContent={boardContent}
          setBoardContent={setBoardContent}
          type={1}
        />
      </div>
      <div>
        <button onClick={updateBoard}>수정하기</button>
      </div>
    </section>
  );
};
export default BoardUpdate;
