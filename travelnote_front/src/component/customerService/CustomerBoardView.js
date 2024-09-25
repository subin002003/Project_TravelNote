import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userTypeState } from "../utils/RecoilData";
import Swal from "sweetalert2";

const CustomerBoardView = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const params = useParams();
  const faqBoardNo = params.faqBoardNo;
  const [faqBoard, setFaqBoard] = useState({});
  const [userType, setUserType] = useRecoilState(userTypeState);
  useEffect(() => {
    axios
      .get(`${backServer}/faqBoard/view/${faqBoardNo}`)
      .then((res) => {
        console.log(res);
        setFaqBoard(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const deleteFaqBoard = () => {
    Swal.fire({
      title: "게시글 삭제",
      icon: "info",
      text: "게시글을 삭제 하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "삭제하기",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(`${backServer}/faqBoard/${faqBoardNo}`)
          .then((res) => {
            if (res.data === 1) {
              Swal.fire({
                title: "삭제완료",
                icon: "success",
              });
              navigate("/customerService/customerBoard");
            } else {
              Swal.fire({
                title: "삭제실패",
                text: "잠시 후 다시 시도해주세요.",
                icon: "success",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
      }
    });
  };

  const navigateUpdate = () => {
    navigate(`/customerService/customerBoard/update/${faqBoardNo}`);
  };

  return (
    <div className="write-section">
      <div className="page-small-title">
        <h2>자주묻는 질문 상세보기</h2>
      </div>
      <table className="faqboard-tbl">
        <tbody>
          <tr>
            <th style={{ width: "25%" }}>
              <p>제목</p>
            </th>
            <td colSpan={3}>
              <div className="faqboard-input">
                <p>{faqBoard.faqBoardTitle}</p>
              </div>
            </td>
          </tr>
          <tr>
            <th style={{ width: "25%" }}>
              <label htmlFor="faqBoardWriter">작성자</label>
            </th>
            <td style={{ width: "25%" }}>
              <div className="faqboard-input">{faqBoard.faqBoardWriter}</div>
            </td>
            <th style={{ width: "25%" }}>
              <label htmlFor="faqWriteDate">작성일</label>
            </th>
            <td style={{ width: "25%" }}>
              <div className="faqboard-input">{faqBoard.faqWriteDate}</div>
            </td>
          </tr>
          <tr>
            <th style={{ width: "25%" }}>
              <label htmlFor="faqBoardContent">내용</label>
            </th>
            <td colSpan={3}>
              <div className="faqBoard-content">{faqBoard.faqBoardContent}</div>
            </td>
          </tr>
        </tbody>
      </table>
      {userType === 3 ? (
        <div className="faqboard-btn-box">
          <button onClick={navigateUpdate}>수정하기</button>
          <button onClick={deleteFaqBoard}>삭제하기</button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CustomerBoardView;
