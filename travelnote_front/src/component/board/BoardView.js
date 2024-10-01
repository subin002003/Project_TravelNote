import { Viewer } from "@toast-ui/react-editor";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userNickState, isLoginState } from "../utils/RecoilData";

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
  const [comments, setComments] = useState([]); // 댓글 상태
  const [newComment, setNewComment] = useState(""); // 새 댓글 입력 상태
  const [reset, setReset] = useState(false);
  // ... 기존 상태 정의
  const [editingComment, setEditingComment] = useState(null); // 수정 중인 댓글 상태

  const handleCommentEditChange = (e) => {
    console.log(editingComment.content);
    setEditingComment({ ...editingComment, content: e.target.value });
  };
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

    // 댓글 목록 가져오기
    axios
      .get(`${backServer}/board/${boardNo}`)
      .then((res) => {
        console.log(res.data);
        setComments(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reset]);
  const toggleLike = () => {
    const action = liked ? "remove" : "add"; // 좋아요 추가 또는 제거
    //좋아요
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

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // 댓글 추가
  const addComment = () => {
    if (!isLoginState) {
      Swal.fire({
        title: "로그인 필요",
        text: "댓글 기능을 사용하려면 로그인하세요.",
        icon: "warning",
      });
      return;
    }

    if (!newComment) {
      Swal.fire({
        title: "댓글 내용 필수",
        text: "댓글 내용을 입력해주세요",
        icon: "warning",
      });
      return;
    }
    const commentData = {
      boardCommentWriter: userNick,
      boardCommentContent: newComment,
    };

    axios
      .post(`${backServer}/board/${boardNo}/comments`, commentData) // boardNo에 대한 댓글 추가
      .then((res) => {
        if (res.status === 201) {
          reset ? setReset(false) : setReset(true); // useEffect의 두번째 매개변수 값을 변경해서 다시 작동시킴
          Swal.fire({
            title: "댓글 등록 성공",
            icon: "success",
          });
          setNewComment(""); // 입력 초기화
        } else {
          Swal.fire({
            title: "댓글 등록 실패",
            text: res.data.message,
            icon: "error",
          });
        }
      });
  };

  const deleteComment = (commentNo) => {
    axios
      .delete(`${backServer}/board/${boardNo}/comments/${commentNo}`) // 댓글 삭제 API 경로
      .then((res) => {
        if (res.status === 200) {
          reset ? setReset(false) : setReset(true); // useEffect의 두번째 매개변수 값을 변경해서 다시 작동시킴
          Swal.fire({
            title: "댓글 삭제 성공",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "댓글 삭제 실패",
            text: res.data.message,
            icon: "error",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateComment = (comment) => {
    if (!editingComment) {
      setEditingComment({ ...comment }); // 수정할 댓글 데이터 설정
    } else {
      // 수정된 댓글을 서버로 전송
      const updatedCommentData = {
        ...editingComment,
        boardCommentContent: editingComment.content,
      };

      axios
        .put(
          `${backServer}/board/${boardNo}/comments/${updatedCommentData.boardCommentNo}`,
          updatedCommentData
        )
        .then((res) => {
          if (res.status === 200) {
            setReset((prev) => !prev); // 댓글 목록을 새로고침
            Swal.fire({
              title: "댓글 수정 성공",
              icon: "success",
            });
            setEditingComment(null); // 수정 모드 종료
          } else {
            Swal.fire({
              title: "댓글 수정 실패",
              text: res.data.message,
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

        {/* 댓글 입력 */}
        <h1 style={{ margin: "0" }}>댓글</h1>
        <div>
          <input
            type="text"
            value={newComment}
            onChange={handleCommentChange}
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
            onClick={addComment}
            className="board-button-link-view-delete"
            style={{ margin: "15px", width: "100px" }}
          >
            등록
          </button>
        </div>
        {/* 댓글 추가 등록 시 */}
        <div>
          {comments.map((comment) => (
            <div
              key={comment.boardCommentNo}
              style={{ display: "flex", margin: "20px" }}
            >
              <p style={{ marginRight: "15px", fontWeight: "bold" }}>
                {comment.boardCommentWriter}
              </p>
              <p>{comment.boardCommentDate}</p>

              {editingComment?.boardCommentNo === comment.boardCommentNo ? (
                <>
                  <input
                    type="text"
                    value={editingComment.content || ""}
                    onChange={handleCommentEditChange}
                    style={{ marginLeft: "20px", width: "300px" }}
                  />
                  <button
                    onClick={() => updateComment(comment)}
                    style={{ marginLeft: "10px" }}
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditingComment(null)}
                    style={{ marginLeft: "10px" }}
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <p style={{ marginLeft: "20px" }}>
                    {comment.boardCommentContent}
                  </p>
                  <button
                    onClick={() => updateComment(comment)}
                    style={{ marginLeft: "20px" }}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => deleteComment(comment.boardCommentNo)}
                    style={{ marginLeft: "10px" }}
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* 댓글 추가 등록 시 */}
        {/* <div>
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
            <p
              onClick={deleteComment}
              style={{ margin: "20px", fontWeight: "bold" }}
            >
              삭제
            </p>
          </div>

          <div
            style={{
              borderTop: "1px solid black",
              // 상단, 우측, 하단, 좌측 여백
              margin: "20px 0px 40px 0px",
              width: "100%",
            }}
          ></div>
        </div> */}
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
