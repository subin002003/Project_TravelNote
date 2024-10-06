import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageNavi from "../utils/PagiNavi";
import Swal from "sweetalert2";

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
        setReportBoardList(res.data.list);
        setBoardPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [boardReqPage]);
  console.log(reportBoardList);
  return (
    <div className="manage-board-wrap">
      <div className="mypage-title">자유게시판 신고 목록</div>
      <table className="report-board-list">
        <tbody>
          <tr>
            <th>게시글 번호</th>
            <th>게시글 제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>삭제버튼</th>
            <th>삭제여부</th>
          </tr>
          {reportBoardList.map((reportBoard, i) => {
            return (
              <ReportBoardItem
                key={"reportBoard" + i}
                reportBoard={reportBoard}
              />
            );
          })}
        </tbody>
      </table>
      <div className="manage-board-page-navi">
        <PageNavi
          pi={boardPi}
          reqPage={boardReqPage}
          setReqPage={setBoardReqPage}
        />
      </div>
      <div className="mypage-title">리뷰게시판 신고 목록</div>
      <table>
        <tbody></tbody>
      </table>
    </div>
  );
};

const ReportBoardItem = (props) => {
  const reportBoard = props.reportBoard;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const deleteBoard = () => {
    axios
      .patch(`${backServer}/admin/updateBoardStatus/${reportBoard.boardNo}`)
      .then((res) => {
        console.log(res);
        if (res.data === 1) {
          Swal.fire({
            title: "삭제 성공",
            icon: "success",
          });
          navigate("/mypage/admin/manageBoard");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <tr>
      <td>{reportBoard.boardNo}</td>
      <td>
        <p className="manageboard-title">
          <Link to={`/board/view/${reportBoard.boardNo}`}>
            {reportBoard.boardTitle}
          </Link>
        </p>
      </td>
      <td>{reportBoard.boardWriter}</td>
      <td>{reportBoard.boardDate}</td>
      <td>
        <button onClick={deleteBoard}>삭제</button>
      </td>
      <td>{reportBoard.boardStatus === 1 ? "N" : "Y"}</td>
    </tr>
  );
};

export default ManageBoard;
