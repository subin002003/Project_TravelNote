import { Viewer } from "@toast-ui/react-editor";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userNickState } from "../utils/RecoilData";

import Swal from "sweetalert2";

const BoardView = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const params = useParams();
  const boardNo = params.boardNo;
  const [board, setBoard] = useState({});
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const [liked, setLiked] = useState(false); // 좋아요 상태
  const [likeCount, setLikeCount] = useState(0); // 좋아요 개수

  useEffect(() => {
    // 게시물 가져오기
    axios
      .get(`${backServer}/board/boardNo/${boardNo}`)
      .then((res) => {
        setBoard(res.data);
        setLikeCount(res.data.likeCount || 0); // res.data.likeCount 값 존재:그 값을 setLikeCount에 전달 / 존재x or null 등 일 때 : 0을 setLikeCount에 전달
        setLiked(res.data.liked || false); // 초기 좋아요 상태 설정
      })
      .catch((err) => {
        console.log(err);
      });
  }, [boardNo]);
  const toggleLike = () => {
    const action = liked ? "remove" : "add"; // 좋아요 추가 또는 제거

    console.log("userNick : ", userNick);
    console.log("userNo : ", boardNo);
    console.log("action : ", action);

    axios
      .post(`${backServer}/board/like/${boardNo}`, {
        userNick: userNick,

        action: action,
      })
      .then((res) => {
        if (res.data.success) {
          setLiked(!liked); // 상태 반전
          setLikeCount((prev) => (liked ? prev - 1 : prev + 1)); // 카운트 업데이트
        } else {
          Swal.fire({
            title: "실패",
            text: res.data.message,
            icon: "error",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
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
    <section className="board-wrap">
      <h1
        className="board-title"
        style={{ textAlign: "center", margin: "30px" }}
      >
        {board.boardTitle}
      </h1>
      <div>
        <div className="board-horizontal-between-space">
          {userNick === board.boardWriter ? (
            <div style={{ marginTop: "50px" }}>
              <Link
                to={`/board/update/${board.boardNo}`}
                className="board-button-link-view-update"
              >
                수정
              </Link>
              <button
                type="button"
                onClick={deleteBoard}
                className="board-button-link-view-delete"
              >
                삭제
              </button>
            </div>
          ) : (
            ""
          )}

          <table
            className="board-table-bordor-none"
            style={{ marginLeft: "auto" }}
          >
            <tbody>
              <tr>
                <th>조회수</th>
                <td>{board.boardReadCount}</td>
              </tr>
              <tr>
                <th>작성일자</th>
                <td>{board.boardDate}</td>
              </tr>
              <tr>
                <th>작성자</th>
                <td>{board.boardWriter}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          style={{
            borderTop: "1px solid black",
            // 상단, 우측, 하단, 좌측 여백
            margin: "20px 0px 40px 0px",
            width: "100%",
          }}
        ></div>
        <div className="board-horizontal-between-space">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                fontWeight: "bolder",
                paddingRight: "20px",
                cursor: "pointer",
              }}
              onClick={toggleLike}
            >
              {/* 좋아요 */}
              <span className="material-icons">
                {/* 좋아요 상태에 따라 아이콘 변경 */}
                {liked ? "favorite" : "favorite_border"}{" "}
              </span>
              <span style={{ marginLeft: "2px" }}>{likeCount}</span>
            </p>
            <div className="board-center">
              <p style={{ fontSize: "20px", fontWeight: "bolder" }}>카테고리</p>
              <p>{board.boardCategory}</p>
              <div className="board-horizontal-between-space">
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: "bolder",
                    paddingLeft: "20px",
                  }}
                >
                  첨부파일
                </p>
                {board.fileList
                  ? board.fileList.map((file, i) => {
                      return <FileItem key={"file-" + i} file={file} />;
                    })
                  : ""}
              </div>
            </div>
          </div>
          <p
            className="board-button-link-report"
            style={{ marginLeft: "auto" }}
          >
            신고하기
          </p>
        </div>
        <div style={{ marginTop: "50px" }}>
          {board.boardContent ? (
            <Viewer initialValue={board.boardContent} /> //토스트 editor에서 기본적으로 제공하는 viewer
          ) : (
            ""
          )}
        </div>
        <div
          style={{
            borderTop: "1px solid black",
            // 상단, 우측, 하단, 좌측 여백
            margin: "20px 0px 40px 0px",
            width: "100%",
          }}
        ></div>
        <h1 style={{ margin: "0" }}>댓글</h1>
        <div>
          <input
            type="text"
            id="input"
            placeholder="댓글을 작성해주세요."
            style={{
              padding: "20px",
              width: "1000px",
              border: "none",
              outline: "none",
              borderBottom: "1px solid black",
            }}
          ></input>
          <button
            type="button"
            onClick={deleteBoard}
            className="board-button-link-view-delete"
            style={{ margin: "15px", width: "100px" }}
          >
            등록
          </button>
        </div>
        {/* 댓글 추가 등록 시 */}
        <div>
          <div style={{ display: "flex", margin: "20px" }}>
            <p style={{ marginRight: "15px", fontWeight: "bold" }}>닉네임1</p>
            <p>2024-09-30</p>
          </div>
          <div style={{ display: "flex", margin: "20px" }}>
            <input
              type="text"
              id="input"
              placeholder="댓글 내용"
              style={{
                padding: "20px",
                width: "1400px",
                border: "none",
                outline: "none",
              }}
            ></input>
            <p style={{ margin: "20px", fontWeight: "bold" }}>수정</p>
            <p style={{ margin: "20px", fontWeight: "bold" }}>삭제</p>
          </div>

          <div
            style={{
              borderTop: "1px solid black",
              // 상단, 우측, 하단, 좌측 여백
              margin: "20px 0px 40px 0px",
              width: "100%",
            }}
          ></div>
        </div>
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
