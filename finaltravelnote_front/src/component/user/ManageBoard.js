import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageNavi from "../utils/PagiNavi";
import Swal from "sweetalert2";

const ManageBoard = () => {
  // 신고 횟수가 5 이상인 글을 리스트로 가져오고, 글 삭제를 누르면 board_status를
  // update 하여 글을 보이지 않도록 설계
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [reportBoardList, setReportBoardList] = useState([]);
  const [boardReqPage, setBoardReqPage] = useState(1);
  const [boardPi, setBoardPi] = useState({});
  const [reportReviewBoardList, setReportReviewBoardList] = useState([]);
  const [reviewBoardReqPage, setReviewBoardReqPage] = useState(1);
  const [reviewBoardPi, setReviewBoardPi] = useState({});
  useEffect(() => {
    axios
      .get(`${backServer}/admin/reportBoardList/${boardReqPage}`)
      .then((res) => {
        setReportBoardList(res.data.list);
        setBoardPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [boardReqPage, backServer]);

  useEffect(() => {
    axios
      .get(`${backServer}/admin/reportReviewList/${reviewBoardReqPage}`)
      .then((res) => {
        setReportReviewBoardList(res.data.list);
        setReviewBoardPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reviewBoardReqPage, backServer]);

  // 게시글 상태 업데이트 함수
  const updateBoardStatus = (boardNo, newStatus) => {
    setReportBoardList((prevList) =>
      prevList.map((board) =>
        board.boardNo === boardNo ? { ...board, boardStatus: newStatus } : board
      )
    );
  };
  const updateReviewBoardStatus = (reviewBoardNo, newStatus) => {
    setReportReviewBoardList((prevList) =>
      prevList.map((reviewBoard) =>
        reviewBoard.reviewBoardNo === reviewBoardNo
          ? { ...reviewBoard, reviewBoardStatus: newStatus }
          : reviewBoard
      )
    );
  };

  return (
    <div className="manage-board-wrap">
      <div className="mypage-title">자유게시판 신고 목록</div>
      <table style={{ fontSize: "14px" }} className="report-board-list">
        <tbody>
          <tr>
            <th style={{ width: "12%" }}>게시글 번호</th>
            <th style={{ width: "20%" }}>게시글 제목</th>
            <th style={{ width: "15%" }}>작성자</th>
            <th style={{ width: "23%" }}>작성일</th>
            <th style={{ width: "20%" }}>삭제버튼</th>
            <th style={{ width: "15%" }}>삭제여부</th>
          </tr>
          {reportBoardList.map((reportBoard, i) => (
            <ReportBoardItem
              key={"reportBoard" + i}
              reportBoard={reportBoard}
              updateBoardStatus={updateBoardStatus} // 상태 업데이트 함수 전달
            />
          ))}
        </tbody>
      </table>
      <div style={{ marginBottom: "15px" }} className="manage-board-page-navi">
        <PageNavi
          pi={boardPi}
          reqPage={boardReqPage}
          setReqPage={setBoardReqPage}
        />
      </div>
      <div className="mypage-title">리뷰게시판 신고 목록</div>
      <table style={{ fontSize: "14px" }} className="report-board-list">
        <tbody>
          <tr>
            <th style={{ width: "12%" }}>게시글 번호</th>
            <th style={{ width: "20%" }}>게시글 제목</th>
            <th style={{ width: "15%" }}>작성자</th>
            <th style={{ width: "23%" }}>작성일</th>
            <th style={{ width: "20%" }}>삭제버튼</th>
            <th style={{ width: "15%" }}>삭제여부</th>
          </tr>
          {reportReviewBoardList.map((reviewBoard, i) => (
            <ReviewBoardItem
              key={"reportReviewBoard" + i}
              reviewBoard={reviewBoard}
              updateReviewBoardStatus={updateReviewBoardStatus} // 상태 업데이트 함수 전달
            />
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "15px" }} className="manage-board-page-navi">
        <PageNavi
          pi={reviewBoardPi}
          reqPage={reviewBoardReqPage}
          setReqPage={setReviewBoardReqPage}
        />
      </div>
    </div>
  );
};

const ReportBoardItem = (props) => {
  const reportBoard = props.reportBoard;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const updateBoardStatus = props.updateBoardStatus;
  const navigate = useNavigate();

  const deleteBoard = () => {
    axios
      .patch(`${backServer}/admin/updateBoardStatus/${reportBoard.boardNo}`)
      .then((res) => {
        if (res.data === 1) {
          Swal.fire({
            title: "삭제 성공",
            icon: "success",
          });
          // 삭제 후 boardStatus를 0으로 업데이트
          updateBoardStatus(reportBoard.boardNo, 0);
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

const ReviewBoardItem = (props) => {
  const reviewBoard = props.reviewBoard;
  const updateReviewBoardStatus = props.updateReviewBoardStatus;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const deleteReviewBoard = () => {
    axios
      .patch(
        `${backServer}/admin/updateReviewBoardStatus/${reviewBoard.reviewBoardNo}`
      )
      .then((res) => {
        if (res.data === 1) {
          Swal.fire({
            icon: "success",
            title: "삭제 성공",
          });
        }
        updateReviewBoardStatus(reviewBoard.reviewBoardNo, 0);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <tr>
      <td>{reviewBoard.reviewBoardNo}</td>
      <td>
        <Link to={`/reviewBoard/view/${reviewBoard.reviewBoardNo}`}>
          {reviewBoard.reviewBoardTitle}
        </Link>
      </td>
      <td>{reviewBoard.reviewBoardWriter}</td>
      <td>{reviewBoard.reviewBoardDate}</td>
      <td>
        <button onClick={deleteReviewBoard}>삭제</button>
      </td>
      <td>{reviewBoard.reviewBoardStatus === 1 ? "N" : "Y"}</td>
    </tr>
  );
};
export default ManageBoard;
