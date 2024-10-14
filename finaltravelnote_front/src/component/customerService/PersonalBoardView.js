import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userNickState, userTypeState } from "../utils/RecoilData";
import Swal from "sweetalert2";

const PersonalBoardView = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const params = useParams();
  const personalBoardNo = params.personalBoardNo;
  const [personalBoard, setPersonalBoard] = useState({});
  const [personalBoardAnswer, setPersonalBoardAnswer] = useState({});
  const [userType] = useRecoilState(userTypeState);
  const [userNick] = useRecoilState(userNickState);

  // 문의글 데이터를 가져오는 useEffect
  useEffect(() => {
    axios
      .get(`${backServer}/personalBoard/view/${personalBoardNo}`)
      .then((res) => {
        setPersonalBoard(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [personalBoardNo, backServer]);

  // 답변 데이터를 가져오는 useEffect
  useEffect(() => {
    axios
      .get(`${backServer}/personalBoard/getAnswer/${personalBoardNo}`)
      .then((res) => {
        setPersonalBoardAnswer(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [personalBoardNo, backServer]);

  const deletePersonalBoard = () => {
    Swal.fire({
      title: "문의글 삭제",
      icon: "info",
      text: "문의글을 삭제 하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "삭제하기",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(`${backServer}/personalBoard/${personalBoardNo}`)
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
                icon: "error",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  return (
    <div className="write-section">
      <div className="page-small-title">
        <h2>1대1문의 상세보기</h2>
      </div>
      <table className="personalboard-tbl">
        <tbody>
          <tr>
            <th style={{ width: "25%" }}>제목</th>
            <td colSpan={3}>{personalBoard.personalBoardTitle}</td>
          </tr>
          <tr>
            <th style={{ width: "25%" }}>작성자</th>
            <td style={{ width: "25%" }}>
              {personalBoard.personalBoardWriter}
            </td>
            <th style={{ width: "25%" }}>답변 여부</th>
            <td style={{ width: "25%" }}>
              {personalBoard.personalBoardStatus}
            </td>
          </tr>
          <tr>
            <th style={{ width: "25%" }}>작성일</th>
            <td style={{ width: "25%" }}>
              {personalBoard.personalBoardWriteDate}
            </td>
            <th style={{ width: "25%" }}>답변일</th>
            <td style={{ width: "25%" }}>
              {personalBoard.personalBoardAnswerDate === null
                ? "조금만 더 기다려주세요 :>"
                : personalBoard.personalBoardAnswerDate}
            </td>
          </tr>
          <tr>
            <th>첨부파일</th>
            <td colSpan={3}>
              <div className="personalboard-filezone">
                {personalBoard.personalBoardFileList &&
                personalBoard.personalBoardFileList.length > 0 ? (
                  personalBoard.personalBoardFileList.map((file, i) => (
                    <FileItem key={"file" + i} file={file} />
                  ))
                ) : (
                  <p>첨부파일이 없습니다.</p>
                )}
              </div>
            </td>
          </tr>
          <tr>
            <th style={{ width: "25%" }}>내용</th>
            <td colSpan={3}>
              <div className="personalBoard-content">
                {personalBoard.personalBoardContent}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {personalBoard.personalBoardWriter === userNick && (
        <div className="personalBoard-btn-box">
          <button
            onClick={() =>
              navigate(
                `/customerService/personalBoard/update/${personalBoardNo}`
              )
            }
          >
            수정하기
          </button>
          <button onClick={deletePersonalBoard}>삭제하기</button>
        </div>
      )}

      <div className="answer-section">
        <div className="page-small-title">
          <h2>1대1문의 답변내용</h2>
        </div>
        {personalBoardAnswer &&
        personalBoardAnswer.personalBoardAnswerContent ? (
          <table className="personalboard-tbl">
            <tbody>
              <tr>
                <th style={{ width: "25%" }}>작성자</th>
                <td style={{ width: "25%" }}>
                  {personalBoardAnswer.personalBoardAnswerWriter}
                </td>
                <th style={{ width: "25%" }}>작성일</th>
                <td style={{ width: "25%" }}>
                  {personalBoard.personalBoardAnswerDate}
                </td>
              </tr>
              <tr>
                <th>내용</th>
                <td colSpan={3}>
                  <div className="faqBoard-content">
                    {personalBoardAnswer.personalBoardAnswerContent}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: "center" }} className="faqBoard-content">
            <p>아직 답변이 작성되지 않았습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const FileItem = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const { file } = props;

  const filedown = () => {
    axios
      .get(`${backServer}/personalBoard/file/${file.personalBoardFileNo}`, {
        responseType: "blob",
      })
      .then((res) => {
        const blob = new Blob([res.data]);
        const fileObjecturl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = fileObjecturl;
        link.style.display = "none";
        link.download = file.personalBoardFilename;
        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(fileObjecturl);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="board-file">
      <span className="material-icons file-icon" onClick={filedown}>
        file_download
      </span>
      <span className="file-name">{file.personalBoardFilename}</span>
    </div>
  );
};

export default PersonalBoardView;
