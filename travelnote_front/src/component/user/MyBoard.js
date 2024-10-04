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
  const [reviewBoardReqPage, setReviewBoardReqPage] = useState();
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
            {boardList.map((board, i) => {
              return <BoardItem key={"board" + i} board={board} />;
            })}
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
        <Link to={`/board/view/${board.boardNo}`}>{board.boardTitle}</Link>
      </td>
      <td>{board.boardCategory}</td>
      <td>{board.boardDate}</td>
      <td>{board.likeCount}</td>
    </tr>
  );
};

export default MyBoard;
