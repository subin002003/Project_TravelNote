import axios from "axios";
import { useEffect, useState } from "react";
import PagiNavi from "../utils/PagiNavi";
import { useRecoilValue } from "recoil";
import { isLoginState } from "../utils/RecoilData";
import { Link, useNavigate } from "react-router-dom";

const ReviewBoardList = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [reviewBoardList, setReviewBoardList] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [pi, setPi] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [searchFilter, setSearchFilter] = useState("title"); // 검색 필터 (기본값: 제목)
  const isLogin = useRecoilValue(isLoginState);

  useEffect(() => {
    axios
      .get(`${backServer}/reviewBoard/list/${reqPage}`)
      .then((res) => {
        setReviewBoardList(res.data.list);
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
        `${backServer}/reviewBoard/search/${reqPage}?searchTerm=${searchTerm}&searchFilter=${searchFilter}`
      )
      .then((res) => {
        setReviewBoardList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className="review-board-wrap">
      <h1 className="review-board-title" style={{ marginBottom: "5px" }}>
        후기게시판
      </h1>
      <div className="review-board-horizontal-between-space">
        <h4 style={{ marginLeft: "5px" }}>
          여러분의 다양한 후기들을 작성해주세요.
        </h4>
        {isLogin ? (
          <Link
            to="/reviewBoard/write"
            className="review-board-button-link-write"
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

      {/* 리뷰 보드 아이템을 Flexbox로 배열하기 위한 컨테이너 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {reviewBoardList.map((reviewBoard, i) => {
          // 각 ReviewBoardItem을 1/3 너비로 감싸는 div 추가
          return (
            <div
              key={"reviewBoard-" + i}
              style={{ flex: "1 1 calc(33.33% - 10px)", margin: "5px" }}
            >
              <ReviewBoardItem reviewBoard={reviewBoard} />
            </div>
          );
        })}
      </div>

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
    </section>
  );
};

const ReviewBoardItem = (props) => {
  const reviewBoard = props.reviewBoard;
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const handleClick = () => {
    // 조회수 증가 api 호출
    axios
      .get(`${backServer}/reviewBoard/view/${reviewBoard.reviewBoardNo}`)
      .then(() => {
        navigate(`/reviewBoard/view/${reviewBoard.reviewBoardNo}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ margin: "80px 80px 80px 0px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p style={{ margin: "0" }}>
          <span className="material-icons">favorite</span>
          {reviewBoard.likeCount}
        </p>
        <p>{reviewBoard.reviewBoardDate}</p>
      </div>

      <div>
        <p>
          <img
            style={{ width: "400px", height: "250px", objectFit: "cover" }}
            onClick={handleClick}
            className="review-board-mouse-on"
            src={
              reviewBoard.reviewBoardThumbNail
                ? `${backServer}/reviewBoard/thumb/${reviewBoard.reviewBoardThumbNail}`
                : "/image/default_img.png"
            }
          />
        </p>
      </div>

      <div
        style={{
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>제목 : {reviewBoard.reviewBoardTitle}</h1>
        <p>{reviewBoard.reviewBoardCategory}</p>
      </div>
      <p>{reviewBoard.reviewBoardWriter}</p>
    </div>
  );
};
export default ReviewBoardList;
