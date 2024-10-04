import { useRecoilState } from "recoil";
import { userNickState } from "../utils/RecoilData";
import { useEffect, useState } from "react";

const MyBoard = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const [boardList, setBoardList] = useState([]);
  const [boardReqPage, setBoardReqPage] = useState(1);
  const [reviewBoardReqPage, setReviewBoardReqPage] = useState();
  useEffect(() => {}, []);
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
          <tbody></tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBoard;
