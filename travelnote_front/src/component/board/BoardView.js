import { Viewer } from "@toast-ui/react-editor";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loginEmailState, userNickState } from "../utils/RecoilData";
import Swal from "sweetalert2";

const BoardView = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const params = useParams();
  const boardNo = params.boardNo;
  const [board, setBoard] = useState({});
  const [userNick, setUserNick] = useRecoilState(userNickState);
  useEffect(() => {
    axios
      .get(`${backServer}/board/boardNo/${boardNo}`)
      .then((res) => {
        console.log(res);
        setBoard(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const deleteBoard = () => {
    axios
      .delete(`${backServer}/board/${board.boardNo}`)
      .then((res) => {
        console.log(res);
        if (res.data === 1) {
          Swal.fire({
            title: "삭제완료",
            icon: "success",
          }).then(() => {
            navigate("/board/list");
          });
        } else {
          Swal.fire({
            title: "삭제 실패",
            icon: "error",
            text: "작업 중 오류가발생했습니다.",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <section>
      <div>게시글</div>
      <div>
        <div>
          <div>
            <table>
              <tbody>
                <tr>
                  <td>{board.boardTitle}</td>
                </tr>
                <tr>
                  <th>조회수</th>
                  <td>{board.boardReadCount}</td>
                  <th>작성일</th>
                  <td>{board.boardDate}</td>
                  <th>작성자</th>
                  <td>{board.boardWriter}</td>
                </tr>
              </tbody>
            </table>
            <p>첨부파일</p>
            <div>
              {board.fileList
                ? board.fileList.map((file, i) => {
                    return <FileItem key={"file-" + i} file={file} />;
                  })
                : ""}
            </div>
          </div>
        </div>
        <div>
          {board.boardContent ? (
            <Viewer initialValue={board.boardContent} /> //토스트 editor에서 기본적으로 제공하는 viewer
          ) : (
            ""
          )}
        </div>
        {userNick === board.boardWriter ? (
          <div>
            <Link to={`/board/update/${board.boardNo}`}>수정</Link>
            <button type="button" onClick={deleteBoard}>
              삭제
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

const FileItem = (props) => {
  const file = props.file;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const filedown = () => {
    axios
      .get(`${backServer}/board/file/${file.boardFileNo}`, {
        //axios 는 기본적으로 응답을 json으로 처리
        //현재 요청은 일반적인 json타입의 응답을 받을게 아니라 파일을 받아야함
        //일반적인 json으로 처리 불가능 -> 파일로 결과를 받는 설정
        responseType: "blob",
      })
      .then((res) => {
        console.log(res);
        //서버에서 받은 데이터를 javascript 의 Blob 객체로 변환
        const blob = new Blob([res.data]);
        //blob데이터를 이용해서 데이터 객체 url생성(다운로드할수있는 링크)
        const fileObjectUrl = window.URL.createObjectURL(blob);

        //데이터를 다운로드할 링크 생성
        const link = document.createElement("a");
        link.href = fileObjectUrl;
        link.style.display = "none";
        //다운로드할 파일명 지정
        link.download = file.filename;
        //파일이랑 연결한 a태그를 문서에 포함
        document.body.appendChild(link);
        link.click(); //추가한 a태그를 클릭해서 다운로드
        link.remove(); //다운로드 후 a태그 삭제
        window.URL.revokeObjectURL(fileObjectUrl); // 파일링크 삭제
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="board-file">
      <span className="material-icons file-icon" onClick={filedown}>
        file_download
      </span>
      <span className="file-name">{file.filename}</span>
    </div>
  );
};
export default BoardView;
