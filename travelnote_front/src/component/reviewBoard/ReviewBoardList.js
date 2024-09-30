import { useRecoilValue } from "recoil";
import { isLoginState } from "../utils/RecoilData";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const ReviewBoardList = () => {
  // useRecoilValue는 상태를 읽기만 하고,
  // 업데이트 x / useRecoilState는 상태를 읽기 + 상태 변경가능한 함수도 제공
  const [reqPage, setReqPage] = useState(1);
  const isLogin = useRecoilValue(isLoginState);
  const [reviewBoardList, setReviewBoardList] = useState([]);

  return (
    <section className="section review-board-list">
      <div className="review-board-wrap">
        <h1>여행 후기 게시판</h1>
        <h4>여러분의 다양한 후기들을 작성해주세요.</h4>
        {isLogin ? (
          <Link to="/reviewBoard/write" className="btn-primary">
            글쓰기
          </Link>
        ) : (
          ""
        )}
      </div>
    </section>
  );
};
const ReviewBoardItem = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const reviewBoard = props.board;
  const navigate = useNavigate();
  return (
    <li
      onClick={() => {
        navigate(`/reviewBoard/view/${reviewBoard.reviewBoardNo}`);
      }}
    ></li>
  );
};

export default ReviewBoardList;
