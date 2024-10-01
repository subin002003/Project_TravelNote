import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userNickState, userTypeState } from "../utils/RecoilData";
import Swal from "sweetalert2";
const PersonalBoardAnswerUpdate = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const parmas = useParams();
  const navigate = useNavigate();
  const personalBoardNo = parmas.personalBoardNo;
  const [userNick, setUserNick] = useRecoilState(userNickState); // Recoil에서 상태 가져오기
  const [userType, setUserType] = useRecoilState(userTypeState); // Recoil에서 상태 가져오기
  const [personalBoard, setPersonalBoard] = useState({});
  const [personalBoardAnswer, setPersonalBoardAnswer] = useState({
    personalBoardNo: personalBoardNo,
    personalBoardAnswerContent: "",
    personalBoardAnswerWriter: userNick,
  });

  const changePersonalBoardAnswerContent = (e) => {
    setPersonalBoardAnswer((prevState) => ({
      ...prevState,
      personalBoardAnswerContent: e.target.value,
    }));
  };
  useEffect(() => {
    axios
      .get(`${backServer}/personalBoard/view/${personalBoardNo}`)
      .then((res) => {
        setPersonalBoard(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [personalBoardNo]);

  useEffect(() => {
    axios
      .get(`${backServer}/personalBoard/getAnswer/${personalBoardNo}`)
      .then((res) => {
        if (res.data) {
          setPersonalBoardAnswer((prevState) => ({
            ...prevState,
            ...res.data,
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [personalBoardNo]);

  const updatePersonalBoardAnswer = () => {
    axios
      .patch(
        `${backServer}/admin/updatePersonalBoardAnswer/${personalBoardNo}`,
        personalBoardAnswer
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <div className="page-small-title">
        <h2>1대1문의 내용보기</h2>
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
              <div className="personalboard-file0zone">
                {personalBoard.personalBoardFileList ? (
                  personalBoard.personalBoardFileList.map((file, i) => {
                    return <FileItem key={"file" + i} file={file} />;
                  })
                ) : (
                  <></>
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
      <div className="answer-section">
        <div className="page-small-title">
          <h2>1대1문의 답변</h2>
        </div>
        <div className="faqBoard-content" style={{ minHeight: "400px" }}>
          <textarea
            className="personalboard-answer"
            id="personalBoardAnswerContent"
            name="personalBoardAnswerContent"
            value={personalBoardAnswer.personalBoardAnswerContent}
            onChange={changePersonalBoardAnswerContent}
          ></textarea>
        </div>
        <div className="btn-box">
          <button onClick={updatePersonalBoardAnswer}>수정완료</button>
        </div>
      </div>
    </div>
  );
};

const FileItem = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const file = props.file;
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

export default PersonalBoardAnswerUpdate;
