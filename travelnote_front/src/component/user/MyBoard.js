import { useRecoilState } from "recoil";
import { userNickState } from "../utils/RecoilData";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import PageNavi from "../utils/PagiNavi";

const MyBoard = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const [boardList, setBoardList] = useState([]);
  const [reviewBoardList, setReviewBoardList] = useState([]);
  const [boardReqPage, setBoardReqPage] = useState(1);
  const [reviewBoardReqPage, setReviewBoardReqPage] = useState(1);
  const [boardPi, setBoardPi] = useState({});
  const [reviewBoardPi, setReviewBoardPi] = useState({});

  useEffect(() => {
    axios
      .get(`${backServer}/user/myBoardList/${userNick}/${boardReqPage}`)
      .then((res) => {
        console.log(res);
        setBoardList(res.data.list);
        setBoardPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [boardReqPage]);
  useEffect(() => {
    axios
      .get(
        `${backServer}/user/myReviewBoardList/${userNick}/${reviewBoardReqPage}`
      )
      .then((res) => {
        console.log(res);
        setReviewBoardList(res.data.list);
        setReviewBoardPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reviewBoardReqPage]);
  return (
    <div className="myboard-content">
      <div className="page-title-info">
        <h1>내가 작성한 글</h1>
      </div>
      <div className="page-title-info">
        <h3>자유 게시판</h3>
      </div>
      <div className="myboard-list">
        <table>
          <tbody>
            <tr>
              <th>제목</th>
              <th>카테고리</th>
              <th>작성일</th>
              <th>좋아요 수</th>
            </tr>
            {boardList && boardList.length > 0 ? (
              boardList.map((board, i) => {
                return <BoardItem key={"board" + i} board={board} />;
              })
            ) : (
              <tr
                style={{
                  marginTop: "20px",
                  marginBottom: "20px",
                  textAlign: "center",
                  height: "100px",
                }}
              >
                <th colSpan={4}>아직 작성한 글이 없습니다.</th>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="myboard-page-navi">
        <PageNavi
          pi={boardPi}
          reqPage={boardReqPage}
          setReqPage={setBoardReqPage}
        />
      </div>
      <div className="page-title-info">
        <h3>후기 게시판</h3>
        <div className="myreviewboard-content">
          {reviewBoardList && reviewBoardList.length > 0 ? (
            reviewBoardList.map((reviewBoard, i) => {
              return (
                <ReviewBoardItem
                  key={"reviewBoard" + i}
                  reviewBoard={reviewBoard}
                />
              );
            })
          ) : (
            <div
              style={{
                marginTop: "20px",
                marginBottom: "20px",
                textAlign: "center",
                height: "100px",
                margin: "0 auto",
              }}
            >
              <h3>아직 작성한 글이 없습니다.</h3>
            </div>
          )}
        </div>
        <div style={{ marginTop: "20px" }} className="myreviewboard-page-navi">
          <PageNavi
            pi={reviewBoardPi}
            reqPage={reviewBoardReqPage}
            setReqPage={setReviewBoardReqPage}
          />
        </div>
      </div>
    </div>
  );
};

const BoardItem = (props) => {
  const board = props.board;
  const navigate = useNavigate();
  return (
    <tr>
      <td>
        <p className="myboard-title">
          <Link to={`/board/view/${board.boardNo}`}>{board.boardTitle}</Link>
        </p>
      </td>
      <td>{board.boardCategory}</td>
      <td>{board.boardDate}</td>
      <td>{board.likeCount}</td>
    </tr>
  );
};

const ReviewBoardItem = (props) => {
  const reviewBoard = props.reviewBoard;
  const naviaget = useNavigate();
  return (
    <div className="myreviewboard-item">
      <div className="myreviewboard-thumb">
        <img src="/image/logo1.png"></img>
      </div>
      <div className="myreviewboard-title">
        <span>{reviewBoard.reviewBoardTitle}</span>
      </div>
      <div className="myreviewboard-date">
        <span>{reviewBoard.reviewBoardDate}</span>
      </div>
    </div>
  );
};

export default MyBoard;
