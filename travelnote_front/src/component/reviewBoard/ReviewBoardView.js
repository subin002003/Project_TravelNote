import { Viewer } from "@toast-ui/react-editor";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { userNickState, isLoginState } from "../utils/RecoilData";
import Swal from "sweetalert2";

const ReviewBoardView = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const params = useParams();
  const reviewBoardNo = params.reviewBoardNo;
  const [reviewBoard, setReviewBoard] = useState({});
  const [userNick, setUserNick] = useRecoilState(userNickState);

  const isLogin = useRecoilValue(isLoginState); // 로그인 상태 확인
  const [liked, setLiked] = useState(false); // 좋아요 상태
  const [likeCount, setLikeCount] = useState(0); // 좋아요 개수
  const [comments, setComments] = useState([]); // 댓글 상태
  const [newComment, setNewComment] = useState(""); // 새 댓글 입력 상태
  const [reset, setReset] = useState(false);
  const [editingComment, setEditingComment] = useState(null); // 수정 중인 댓글 상태
  const [reported, setReported] = useState(false); // 신고 상태
  const handleCommentEditChange = (e) => {
    console.log(editingComment.content);
    setEditingComment({ ...editingComment, content: e.target.value });
  };
  useEffect(() => {
    // 게시물 가져오기
    axios
      .get(`${backServer}/reviewBoard/reviewBoardNo/${reviewBoardNo}`)
      .then((res) => {
        setReviewBoard(res.data);
        setLikeCount(res.data.likeCount || 0); // 초기 좋아요 수, res.data.likeCount 값 존재:그 값을 setLikeCount에 전달 / 존재x or null 등 일 때 : 0을 setLikeCount에 전달
        setLiked(res.data.liked || false); // 초기 좋아요 상태
      })
      .catch((err) => {
        console.log(err);
      });

    // 댓글 목록 가져오기
    axios
      .get(`${backServer}/reviewBoard/${reviewBoardNo}`)
      .then((res) => {
        console.log(res.data);
        setComments(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reset]);

  const toggleLike = () => {
    // 로그인 유무 확인
    if (!isLogin) {
      Swal.fire({
        title: "로그인 필요",
        text: "좋아요 기능을 사용하려면 로그인하세요.",
        icon: "warning",
      });
      return; // 로그인하지 않은 경우, toggleLike 함수 중단
    }

    const action = liked ? "remove" : "add"; // 좋아요 추가 또는 제거
    //좋아요
    axios
      .post(`${backServer}/reviewBoard/like/${reviewBoardNo}`, {
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

  const deleteReviewBoard = () => {
    axios
      .delete(`${backServer}/reviewBoard/${reviewBoard.reviewBoardNo}`)
      .then((res) => {
        if (res.data === 1) {
          Swal.fire({
            title: "삭제완료",
            icon: "success",
          }).then(() => {
            navigate("/reviewBoard/list");
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
    if (!newComment) {
      Swal.fire({
        title: "댓글 내용 필수",
        text: "댓글 내용을 입력해주세요",
        icon: "warning",
      });
      return;
    }

    // 줄바꿈을 <br />로 변환 (댓글 줄바꿈 후 작성 시, 줄바꿈 처리된 부분이 제대로 조회 되도록 하기 위함)
    const formattedComment = newComment.replace(/\n/g, "<br />");

    const commentData = {
      reviewBoardCommentWriter: userNick,
      reviewBoardCommentContent: formattedComment,
    };

    axios
      .post(`${backServer}/reviewBoard/${reviewBoardNo}/comments`, commentData) // reviewBoardNo에 대한 댓글 추가
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
      .delete(
        `${backServer}/reviewBoard/${reviewBoardNo}/comments/${commentNo}`
      ) // 댓글 삭제 API 경로
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
        reviewBoardCommentContent: editingComment.content,
      };

      axios
        .put(
          `${backServer}/reviewBoard/${reviewBoardNo}/comments/${updatedCommentData.reviewBoardCommentNo}`,
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

  const reviewBoardViewReport = () => {
    axios
      .post(`${backServer}/reviewBoard/report/${reviewBoardNo}`, {
        userNick: userNick,
      })
      .then((res) => {
        console.log(res);
        Swal.fire({
          title: "신고 처리 완료",
          icon: "success",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className="review-board-wrap">
      <h1
        className="review-board-title"
        style={{ textAlign: "center", margin: "30px" }}
      >
        여행 후기
      </h1>
      <div>
        <div className="review-board-horizontal-between-space">
          {userNick === reviewBoard.reviewBoardWriter ? (
            <div style={{ marginTop: "50px" }}>
              <Link
                to={`/reviewBoard/update/${reviewBoard.reviewBoardNo}`}
                className="review-board-button-link-view-update"
              >
                수정
              </Link>
              <button
                type="button"
                onClick={deleteReviewBoard}
                className="review-board-button-link-view-delete"
              >
                삭제
              </button>
            </div>
          ) : (
            ""
          )}

          <table
            className="review-board-table-bordor-none"
            style={{ marginLeft: "auto" }}
          >
            <tbody>
              <tr>
                <th>조회수</th>
                <td>{reviewBoard.reviewBoardReadCount}</td>
              </tr>
              <tr>
                <th>작성일자</th>
                <td>{reviewBoard.reviewBoardDate}</td>
              </tr>
              <tr>
                <th>작성자</th>
                <td>{reviewBoard.reviewBoardWriter}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          className="review-board-thumbnail-and-subcontent"
          style={{ display: "flex" }}
        >
          <div className="review-board-thumbnail">
            <img
              src={
                reviewBoard.reviewBoardThumb
                  ? `${backServer}/reviewBoard/thumb/${reviewBoard.reviewBoardThumb}`
                  : "/image/default_img.png"
              }
            />
          </div>
          <div>
            <h1>여행 제목 : {reviewBoard.reviewBoardTitle}</h1>
            <p>{reviewBoard.reviewBoardSubContent}</p>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid black",
            // 상단, 우측, 하단, 좌측 여백
            margin: "20px 0px 40px 0px",
            width: "100%",
          }}
        ></div>
        <div className="review-board-horizontal-between-space">
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
            <div className="review-board-center">
              <p style={{ fontSize: "20px", fontWeight: "bolder" }}>카테고리</p>
              <p>{reviewBoard.reviewBoardCategory}</p>
              <div className="review-board-horizontal-between-space">
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: "bolder",
                    paddingLeft: "20px",
                  }}
                >
                  첨부파일
                </p>
                {reviewBoard.fileList
                  ? reviewBoard.fileList.map((file, i) => {
                      return <FileItem key={"file-" + i} file={file} />;
                    })
                  : ""}
              </div>
            </div>
          </div>
          {isLogin ? (
            <p
              className="review-board-button-link-report"
              style={{ marginLeft: "auto" }}
              onClick={reviewBoardViewReport}
            >
              신고하기
            </p>
          ) : (
            ""
          )}
        </div>
        <div style={{ marginTop: "50px" }}>
          {reviewBoard.reviewBoardContent ? (
            <Viewer initialValue={reviewBoard.reviewBoardContent} /> //토스트 editor에서 기본적으로 제공하는 viewer
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
        {isLogin ? ( // isLogin이 true일 경우에만 표시
          <div>
            <textarea
              value={newComment}
              onChange={handleCommentChange} // 댓글 내용 변경 시 상태 업데이트
              placeholder="댓글을 작성해주세요."
              style={{
                marginTop: "30px",
                padding: "10px",
                width: "1000px",
                border: "none",
                outline: "none",
                borderBottom: "1px solid black",
                resize: "none", // 크기 조절 비활성화
                minHeight: "50px", // 최소 높이 설정
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.shiftKey) {
                  // Shift + Enter가 눌렸을 때 기본 엔터 키 동작(줄 바꿈)을 허용
                  return;
                } else if (e.key === "Enter") {
                  // 엔터 키가 눌렸을 때
                  e.preventDefault(); // 기본 엔터 키 동작(줄 바꿈) 방지
                  addComment(); // 댓글 등록 함수 호출
                }
              }}
            ></textarea>
            <button
              type="button"
              onClick={addComment} // 버튼 클릭 시 댓글 등록
              className="review-board-button-link-view-comment-regist"
              style={{ margin: "15px", width: "100px" }}
            >
              등록
            </button>
          </div>
        ) : (
          <h4 style={{ margin: "10px" }}>댓글을 작성하려면 로그인하세요.</h4>
        )}
        {/* 댓글 조회 */}
        <div>
          {comments.map((comment) => (
            <div
              key={comment.reviewBoardCommentNo}
              style={{
                margin: "20px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px",
              }}
            >
              {/* 작성자(닉네임)와 작성일을 수평으로 출력 */}
              <div
                style={{
                  display: "flex",
                }}
              >
                <p style={{ marginRight: "15px", fontWeight: "bold" }}>
                  {comment.reviewBoardCommentWriter}
                </p>
                <p>{comment.reviewBoardCommentDate}</p>
              </div>

              {editingComment?.reviewBoardCommentNo ===
              comment.reviewBoardCommentNo ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={editingComment.content || ""}
                    onChange={handleCommentEditChange}
                    style={{ marginLeft: "20px", width: "300px" }}
                  />
                  <div>
                    <button
                      onClick={() => updateComment(comment)}
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "transparent",
                        color: "#000",
                      }}
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditingComment(null)}
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "transparent",
                        color: "#000",
                      }}
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    alignItems: "flex-end", // 세로 정렬을 위쪽으로 맞춤
                    marginBottom: "5px", // 댓글 내용과 버튼 사이의 간격
                  }}
                >
                  <p
                    style={{
                      marginLeft: "20px",
                      marginBottom: "0", // 댓글 내용과 밑줄 간격 없애기
                      flexGrow: 1, // 버튼과 공간을 나누기 위해
                    }}
                    // 이 기능 사용 시, 다른 자식 요소를 추가 X /해당 속성만 사용해야 함
                    dangerouslySetInnerHTML={{
                      __html: comment.reviewBoardCommentContent,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column", // 버튼을 수직으로 정렬
                      justifyContent: "flex-end", // 버튼을 아래쪽에 정렬
                      marginLeft: "20px", // 버튼과 댓글 내용 사이의 간격
                    }}
                  >
                    {/* 로그인한 유저와 댓글 작성자가 같은 경우에만 수정 및 삭제 버튼을 보여줌 */}
                    {userNick === comment.reviewBoardCommentWriter && (
                      <div>
                        <button
                          onClick={() => updateComment(comment)}
                          style={{
                            marginLeft: "20px",
                            backgroundColor: "transparent",
                            color: "#000",
                          }}
                        >
                          수정
                        </button>
                        <button
                          onClick={() =>
                            deleteComment(comment.reviewBoardCommentNo)
                          }
                          style={{
                            marginLeft: "10px",
                            backgroundColor: "transparent",
                            color: "#000",
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
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
      .get(`${backServer}/reviewBoard/file/${file.reviewBoardFileNo}`, {
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
    <div className="review-board-file">
      <span className="material-icons file-icon" onClick={filedown}>
        file_download
      </span>
      <span className="file-name">{file.filename}</span>
    </div>
  );
};
export default ReviewBoardView;
