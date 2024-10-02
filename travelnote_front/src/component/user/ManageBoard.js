import axios from "axios";
import { useEffect, useState } from "react";

const ManageBoard = () => {
  //신고 횟수가 5 이상인 글을 리스트로 가져오고, 글 삭제 를 누르면 board_status 를
  //update 하여 글을 보이지 않도록 설계
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [reportBoardList, setReportBoardList] = useState([]);
  const [reportReviewBoardList, setReportReviceBoardList] = useState([]);
  const [boardReqPage, setBoardReqPage] = useState(1);
  const [reviewBoardReqPage, setReviewBoardReqPage] = useState(1);
  const [boardPi, setBoardPi] = useState({});
  const [reviewBoardPi, setReviewBoardPi] = useState({});
  useEffect(() => {
    axios
      .get(`${backServer}/admin/reportBoardList/${boardReqPage}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="manage-board-wrap">
      <div className="mypage-title">자유게시판 신고 목록</div>
      <table>
        <tbody></tbody>
      </table>
      <div className="mypage-title">리뷰게시판 신고 목록</div>
      <table>
        <tbody></tbody>
      </table>
    </div>
  );
};
export default ManageBoard;
