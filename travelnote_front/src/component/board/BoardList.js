import axios from "axios";
import { useEffect, useState } from "react";
import PagiNavi from "../utils/PagiNavi";
import { useRecoilValue } from "recoil";
import { isLoginState } from "../utils/RecoilData";
import { Link, useNavigate } from "react-router-dom";

const BoardList = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [boardList, setBoardList] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [pi, setPi] = useState({});
  const isLogin = useRecoilValue(isLoginState);

  useEffect(() => {
    axios
      .get(`${backServer}/board/list/${reqPage}`)
      .then((res) => {
        console.log(res);
        setBoardList(res.data.list);
        setPi(res.data.pi);
        console.log(pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);
  return (
    <section className="board-wrap">
      <h1 style={{ fontSize: "50px", margin: "5px", padding: "0px" }}>
        자유게시판
      </h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h5 style={{ fontSize: "20px", marginLeft: "5px" }}>
          자유로운 주제로 이야기할 수 있습니다.
        </h5>
        {isLogin ? (
          <Link to="/board/write" style={{ marginRight: "300px" }}>
            글쓰기
          </Link>
        ) : (
          ""
        )}
      </div>
      <div>
        <table className="boardList-table-no-border">
          <thead>
            <tr>
              <th style={{ width: "5%" }}>글번호</th>
              <th style={{ width: "65%" }}>제목</th>
              <th style={{ width: "10%" }}>작성자</th>
              <th style={{ width: "10%" }}>작성일</th>
              <th style={{ width: "5%" }}>조회수</th>
              <th style={{ width: "5%" }}>좋아요</th>
            </tr>
          </thead>
          <tbody>
            {boardList.map((board, i) => {
              return <BoardItem key={"board-" + i} board={board} />;
            })}
          </tbody>
        </table>
        <div>
          <PagiNavi pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
        </div>
      </div>
    </section>
  );
};

const BoardItem = (props) => {
  const board = props.board;
  const navigate = useNavigate();
  return (
    <tr className="boardlist-content">
      <td>{board.boardNo}</td>
      <td
        onClick={() => {
          navigate(`/board/view/${board.boardNo}`);
        }}
      >
        {board.boardTitle}
      </td>
      <td>{board.boardWriter}</td>
      <td>{board.boardDate}</td>
      <td>{board.boardReadCount}</td>
      <td>{board.boardLike}</td>
    </tr>
  );
};
export default BoardList;
