import { useRecoilState } from "recoil";
import { userNickState } from "../utils/RecoilData";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const PersonalBoardWrite = () => {
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환
    setCurrentDate(formattedDate);
  }, []);
  const [personalBoard, setPersonalBoard] = useState({
    personalBoardTitle: "",
    personalBoardContent: "",
    personalBoardWriter: userNick,
  });

  const [personalBoardFiles, setPersonalBoardFiles] = useState([]); // 파일을 저장할 상태

  const changePersonalBoard = (e) => {
    const name = e.target.name;
    setPersonalBoard({ ...personalBoard, [name]: e.target.value });
  };

  // 파일 추가 로직
  const addFiles = (e) => {
    const files = e.target.files;
    setPersonalBoardFiles([...personalBoardFiles, ...files]); // 파일 추가
  };

  // 파일 삭제 로직
  const removeFile = (index) => {
    const updatedFiles = personalBoardFiles.filter((_, i) => i !== index);
    setPersonalBoardFiles(updatedFiles); // 파일 삭제
  };

  const writePersonalBoard = () => {
    const formData = new FormData();
    formData.append("personalBoardTitle", personalBoard.personalBoardTitle);
    formData.append("personalBoardContent", personalBoard.personalBoardContent);
    formData.append("personalBoardWriter", personalBoard.personalBoardWriter);
    if (personalBoardFiles.length > 0) {
      for (let i = 0; i < personalBoardFiles.length; i++) {
        formData.append("personalBoardFileList", personalBoardFiles[i]);
      }
    }
    axios
      .post(`${backServer}/personalBoard`, formData, {
        headers: {
          contentType: "multipart/form-data",
          processData: false,
        },
      })
      .then((res) => {
        if (res.data) {
          Swal.fire({
            title: "작성완료 !",
            text: "답변은 1~2일 내에 작성될 예정입니다.",
            icon: "success",
          });
          navigate("/customerService/customerBoard");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="write-section">
      <div className="page-title">1대1문의 작성하기</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          writePersonalBoard();
        }}
      >
        <table className="personalboard-tbl">
          <tbody>
            <tr>
              <th style={{ width: "25%" }}>
                <label htmlFor="personalBoardTitle">제목</label>
              </th>
              <td colSpan={3}>
                <div className="personalBoard-input">
                  <input
                    type="text"
                    id="personalBoardTitle"
                    name="personalBoardTitle"
                    onChange={changePersonalBoard}
                  ></input>
                </div>
              </td>
            </tr>
            <tr>
              <th style={{ width: "25%" }}>
                <label htmlFor="personalBoardWriter">작성자</label>
              </th>
              <td style={{ width: "25%" }}>
                <div className="personalBoard-input">
                  <input
                    type="text"
                    style={{ textAlign: "center" }}
                    id="personalBoardWriter"
                    name="personalBoardWriter"
                    value={userNick}
                    disabled
                  ></input>
                </div>
              </td>
              <th style={{ width: "25%" }}>
                <label>작성일</label>
              </th>
              <td>
                <div className="personalBoard-input">{currentDate}</div>
              </td>
            </tr>

            <tr>
              <th>
                <p>첨부파일</p>
              </th>
              <td colSpan={3} style={{ textAlign: "center" }}>
                <label htmlFor="personalBoardFile" className="file-btn">
                  첨부파일
                </label>
                <input
                  type="file"
                  id="personalBoardFile"
                  name="personalBoardFile"
                  multiple
                  style={{ display: "none" }}
                  onChange={addFiles} // 파일이 선택되었을 때 호출
                ></input>
              </td>
            </tr>
            <tr>
              <th style={{ height: "48px" }}>첨부파일목록</th>
              <td colSpan={3} style={{ textAlign: "center" }}>
                <div className="board-file-wrap">
                  {personalBoardFiles.length > 0 ? (
                    personalBoardFiles.map((file, index) => (
                      <p key={index}>
                        <span className="filename">{file.name}</span>
                        <span
                          className="material-icons del-file-icon"
                          onClick={() => removeFile(index)} // 파일 삭제
                        >
                          delete
                        </span>
                      </p>
                    ))
                  ) : (
                    <p>첨부된 파일이 없습니다.</p>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor="personalBoardContent">내용</label>
              </th>
              <td colSpan={3}>
                <div>
                  <textarea
                    className="personalBoard-content"
                    id="personalBoardContent"
                    name="personalBoardContent"
                    onChange={changePersonalBoard}
                  ></textarea>
                </div>
              </td>
            </tr>
            <tr className="btn-box">
              <td colSpan={4}>
                <button type="submit">작성하기</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default PersonalBoardWrite;
