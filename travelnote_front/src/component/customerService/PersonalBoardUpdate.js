import { useRecoilState } from "recoil";
import { userNickState } from "../utils/RecoilData";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const PersonalBoardUpdate = () => {
  const params = useParams();
  const personalBoardNo = params.personalBoardNo;
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();

  const [personalBoard, setPersonalBoard] = useState({
    personalBoardTitle: "",
    personalBoardContent: "",
    personalBoardWriter: userNick,
  });

  const [personalBoardFiles, setPersonalBoardFiles] = useState([]); // 기존 파일 상태
  const [newFiles, setNewFiles] = useState([]); // 새로 추가된 파일 상태
  const [delPersonalBoardFileNo, setDelPersonalBoardFileNo] = useState([]); // 삭제할 파일 번호 배열

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    axios
      .get(`${backServer}/personalBoard/view/${personalBoardNo}`)
      .then((res) => {
        setPersonalBoard(res.data);
        setPersonalBoardFiles(res.data.personalBoardFileList); // 기존 파일 설정
      })
      .catch((err) => {
        console.log(err);
      });
  }, [personalBoardNo, backServer]);

  const changePersonalBoard = (e) => {
    const name = e.target.name;
    setPersonalBoard({ ...personalBoard, [name]: e.target.value });
  };

  // 새 파일 추가 로직
  const addFiles = (e) => {
    const files = Array.from(e.target.files); // 새 파일 배열
    setNewFiles([...newFiles, ...files]); // 새로 추가된 파일 상태 업데이트
  };

  // 기존 파일 삭제 로직
  const removeFile = (index, fileNo) => {
    if (fileNo) {
      setDelPersonalBoardFileNo([...delPersonalBoardFileNo, fileNo]); // 삭제할 파일 번호 추가
    }
    const updatedFiles = personalBoardFiles.filter((_, i) => i !== index); // 해당 파일 삭제
    setPersonalBoardFiles(updatedFiles);
  };

  // 새 파일 삭제 로직
  const removeNewFile = (index) => {
    const updatedNewFiles = newFiles.filter((_, i) => i !== index); // 새 파일 리스트에서 해당 파일 삭제
    setNewFiles(updatedNewFiles);
  };

  const updatePersonalBoard = () => {
    const formData = new FormData();
    formData.append("personalBoardTitle", personalBoard.personalBoardTitle);
    formData.append("personalBoardContent", personalBoard.personalBoardContent);
    formData.append("personalBoardWriter", personalBoard.personalBoardWriter);
    formData.append("personalBoardNo", personalBoardNo);
    newFiles.forEach((file) => {
      formData.append("personalBoardFileList", file);
    });

    delPersonalBoardFileNo.forEach((fileNo) => {
      formData.append("delPersonalBoardFileNo", fileNo);
    });

    axios
      .patch(`${backServer}/personalBoard/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data === 1) {
          Swal.fire({
            title: "수정 완료",
            icon: "success",
          });
          navigate("/customerService/customerBoard");
        }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: "수정 실패",
          icon: "error",
        });
      });
  };

  return (
    <div className="write-section">
      <div className="page-title">1대1문의 수정하기</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updatePersonalBoard();
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
                    value={personalBoard.personalBoardTitle}
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
                <label>수정일</label>
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
                  onChange={addFiles} // 새 파일 추가
                ></input>
              </td>
            </tr>

            {/* 기존 파일 목록 */}
            <tr>
              <th style={{ height: "48px" }}>기존 첨부파일목록</th>
              <td colSpan={3} style={{ textAlign: "center" }}>
                <div className="board-file-wrap">
                  {personalBoardFiles.length > 0 ? (
                    personalBoardFiles.map((file, index) => (
                      <p key={index}>
                        <span className="filename">
                          {file.personalBoardFilename}
                        </span>
                        <span
                          className="material-icons del-file-icon"
                          onClick={() =>
                            removeFile(index, file.personalBoardFileNo)
                          } // 기존 파일 삭제
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

            {/* 새로 추가된 파일 목록 */}
            <tr>
              <th style={{ height: "48px" }}>새로 추가된 파일목록</th>
              <td colSpan={3} style={{ textAlign: "center" }}>
                <div className="board-file-wrap">
                  {newFiles.length > 0 ? (
                    newFiles.map((file, index) => (
                      <p key={index}>
                        <span className="filename">{file.name}</span>
                        <span
                          className="material-icons del-file-icon"
                          onClick={() => removeNewFile(index)} // 새 파일 삭제
                        >
                          delete
                        </span>
                      </p>
                    ))
                  ) : (
                    <p>새로 추가된 파일이 없습니다.</p>
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
                    value={personalBoard.personalBoardContent}
                    onChange={changePersonalBoard}
                  ></textarea>
                </div>
              </td>
            </tr>
            <tr className="btn-box">
              <td colSpan={4}>
                <button type="submit">수정하기</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default PersonalBoardUpdate;
