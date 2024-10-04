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
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [searchFilter, setSearchFilter] = useState("title"); // 검색 필터 (기본값: 제목)
  const isLogin = useRecoilValue(isLoginState);

  useEffect(() => {
    axios
      .get(`${backServer}/board/list/${reqPage}`)
      .then((res) => {
        setBoardList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);

  // 검색 버튼 클릭 시 호출되는 함수
  const handleSearch = () => {
    // 검색어와 필터가 변경된 경우 API 호출
    axios
      .get(
        `${backServer}/board/search/${reqPage}?searchTerm=${searchTerm}&searchFilter=${searchFilter}`
      )
      .then((res) => {
        setBoardList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className="board-wrap">
      <h1 className="board-title" style={{ marginBottom: "5px" }}>
        자유게시판
      </h1>
      <div className="board-horizontal-between-space">
        <h4 style={{ marginLeft: "5px" }}>
          자유로운 주제로 이야기할 수 있습니다.
        </h4>
        {isLogin ? (
          <Link
            to="/board/write"
            className="board-button-link-write"
            style={{ marginLeft: "auto", marginRight: "20px" }}
          >
            글쓰기
          </Link>
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
      <div>
        <table className="boardList-table-no-border" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: "5%" }}>글번호</th>
              <th style={{ width: "55%" }}>제목</th>
              <th style={{ width: "10%" }}>카테고리</th>
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

        {/* 검색창 추가 */}
        <div
          style={{
            margin: "20px 0",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <select
            onChange={(e) => setSearchFilter(e.target.value)}
            value={searchFilter}
            style={{
              width: "120px",
              height: "40px",
              fontSize: "20px",
              textAlign: "center",
            }}
          >
            <option value="title">제목</option>
            <option value="writer">작성자</option>
            <option value="category">카테고리</option>
          </select>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="검색어를 입력하세요"
            style={{
              marginLeft: "10px",
              width: "250px",
              height: "43px",
              fontSize: "17px",
              textAlign: "center",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              display: "inline-block",
              marginLeft: "10px",
              marginTop: "0px", // 버튼을 아래로 내리기 위해 마진 추가
              backgroundColor: "transparent",
              color: "black",
              fontWeight: "bold",
              padding: "0", // 버튼 패딩 제거
            }}
          >
            <span
              className="material-icons"
              style={{ fontSize: "40px", margin: "0" }}
            >
              search
            </span>
          </button>
        </div>

        <div style={{ margin: "50px" }}>
          <PagiNavi pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
        </div>
      </div>
    </section>
  );
};

const BoardItem = (props) => {
  const board = props.board;
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const handleClick = () => {
    // 조회수 증가 api 호출
    axios
      .get(`${backServer}/board/view/${board.boardNo}`)
      .then(() => {
        navigate(`/board/view/${board.boardNo}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <tr className="boardlist-content">
      <td>{board.boardNo}</td>
      <td onClick={handleClick} className="boardTitle-mouse-on">
        {board.boardTitle}
      </td>
      <td>{board.boardCategory}</td>
      <td>{board.boardWriter}</td>
      <td>{board.boardDate}</td>
      <td>{board.boardReadCount}</td>
      <td style={{ display: "flex" }}>
        <span className="material-icons">favorite</span>
        {board.likeCount}
      </td>
    </tr>
  );
};
export default BoardList;

// onClick={() => {
//   navigate(`/board/view/${board.boardNo}`);
// }}
