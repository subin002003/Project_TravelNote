import { useRef, useState } from "react";

const ReviewBoardFrm = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;

  // props 에서 필요한 값들을 가져옴
  const reviewBoardTitle = props.reviewBoardTitle;
  const setReviewBoardTitle = props.setReviewBoardTitle;
  const thumbnail = props.thumbnail;
  const setThumbnail = props.setThumbnail;
  const reviewBoardFile = props.reviewBoardFile;
  const setReviewBoardFile = props.setReviewBoardFile;
  const reviewBoardSubContent = props.reviewBoardSubContent;
  const setReviewBoardSubContent = props.setReviewBoardSubContent;
  const reviewBoardCategory = props.reviewBoardCategory;
  const setReviewBoardCategory = props.setReviewBoardCategory;

  //수정인 경우에 추가로 전송되는 데이터
  const reviewBoardThumbNail = props.reviewBoardThumbNail;
  const setReviewBoardThumbNail = props.setReviewBoardThumbNail;
  const fileList = props.fileList;
  const setFileList = props.setFileList;
  const delReviewBoardFileNo = props.delReviewBoardFileNo;
  const setDelReviewBoardFileNo = props.setDelReviewBoardFileNo;

  const thumbnailRef = useRef(null); // 썸네일 파일 입력 참조
  const [reviewBoardImg, setReviewBoardImg] = useState(null); // 썸네일 미리보기 상태

  //썸네일 이미지 첨부파일이 변경되면 동작할 함수
  const changeThumbnail = (e) => {
    //요소들이 겹쳐있는 상태에서 해당 요소를 선택할 때는 currentTarget(target을 사용하면 여러요소가 한번에 선택)
    const files = e.currentTarget.files;
    if (files.length !== 0 && files[0] !== 0) {
      setThumbnail(files[0]); // 썸네일 파일 저장
      //화면에 썸네일 미리보기
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setReviewBoardImg(reader.result); // 미리보기용 이미지 설정
      };
    } else {
      setThumbnail(null);
      setReviewBoardImg(null);
    }
  };

  // 텍스트 영역에서 입력된 내용을 업데이트하는 함수
  const handleSubContentChange = (e) => {
    setReviewBoardSubContent(e.target.value); // 상태 업데이트
  };

  //첨부파일 화면에 띄울 state
  const [showReviewBoardFile, setShowReviewBoardFile] = useState([]);
  //첨부파일 추가시 동작할 함수
  const addReviewBoardFile = (e) => {
    const files = e.currentTarget.files;
    const fileArr = new Array(); //글 작성 시 전송할 파일 배열
    const filenameArr = new Array(); //화면에 노출시킬 파일이름 배열
    for (let i = 0; i < files.length; i++) {
      fileArr.push(files[i]);
      filenameArr.push(files[i].name);
    }
    setReviewBoardFile([...reviewBoardFile, ...fileArr]);
    setShowReviewBoardFile([...showReviewBoardFile, ...filenameArr]);
  };

  // 카테고리 리스트 설정
  const categories = [
    "숙소",
    "식사",
    "관광지",
    "교통",
    "활동",
    "문화",
    "안전",
    "예산",
    "팁",
    "경치",
    "소감",
  ];

  return (
    <div>
      <p style={{ marginLeft: "20px" }}>썸네일로 설정할 이미지를 등록하세요</p>
      <div style={{ marginLeft: "110px" }}>
        <p>Click!!</p>
        <p>
          <span className="material-icons" style={{ marginLeft: "10px" }}>
            south
          </span>
        </p>
      </div>
      <div className="review-board-thumb-and-subContent">
        <div className="review-board-thumb-wrap">
          {reviewBoardImg ? (
            <img
              onClick={() => {
                thumbnailRef.current.click();
              }}
              src={reviewBoardImg}
            />
          ) : reviewBoardThumbNail ? (
            <img
              src={`${backServer}/reviewBoard/thumb/${reviewBoardThumbNail}`}
              onClick={() => {
                thumbnailRef.current.click();
              }}
            />
          ) : (
            <img
              onClick={() => {
                thumbnailRef.current.click();
              }}
              src="/image/default_img.png"
            ></img>
          )}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={changeThumbnail}
            ref={thumbnailRef}
          ></input>
        </div>
        <div
          style={{
            width: "1120px",
            height: "300px",
            border: "1px solid black",
          }}
        >
          <textarea
            value={reviewBoardSubContent} // textarea의 값
            onChange={handleSubContentChange} // 텍스트 영역 상태 업데이트
            style={{
              width: "100%",
              height: "100%",
              boxSizing: "border-box", // 패딩과 보더를 포함한 크기 계산
              resize: "none", // 사용자가 크기를 조절하지 못하게 설정
            }}
          ></textarea>
        </div>
      </div>

      <table className="review-boardList-table-no-border">
        <tbody>
          <tr>
            <th>
              <label htmlFor="reviewBoardTitle" style={{ fontSize: "20px" }}>
                제목
              </label>
            </th>
            <td>
              <input
                type="text"
                id="reviewBoardTitle"
                name="reviewBoardTitle"
                value={reviewBoardTitle}
                onChange={setReviewBoardTitle}
                style={{
                  height: "30px",
                  width: "1400px",
                  border: "none",
                  outline: "none",
                  borderBottom: "1px solid black",
                }}
              />
            </td>
          </tr>
          <tr>
            <th>
              <label htmlFor="reviewBoardCategory" style={{ fontSize: "12px" }}>
                카테고리
              </label>
            </th>
            <td style={{ textAlign: "left" }}>
              {/* 드롭다운으로 카테고리 선택 */}
              <select
                id="reviewBoardCategory"
                value={reviewBoardCategory} // 선택된 카테고리 값
                onChange={setReviewBoardCategory}
                style={{
                  height: "30px",
                  width: "200px",
                }}
              >
                <option value="">선택하세요</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </td>
          </tr>

          <tr>
            <th>
              <label style={{ fontSize: "12px" }}>첨부파일</label>
            </th>
            <td style={{ textAlign: "left" }}>
              <input
                type="file"
                id="reviewBoardFile"
                onChange={addReviewBoardFile}
                multiple
              ></input>
            </td>
          </tr>
          <tr>
            <th style={{ fontSize: "12px" }}>첨부파일 목록</th>
            <td style={{ textAlign: "left" }}>
              <div>
                {fileList
                  ? fileList.map((reviewBoardFile, i) => {
                      const deleteFile = () => {
                        const newFileList = fileList.filter((item) => {
                          return item !== reviewBoardFile;
                        });
                        setFileList(newFileList); //화면에 반영
                        //Controller로 전송하기 위해서 배열에 추가
                        setDelReviewBoardFileNo([
                          ...delReviewBoardFileNo,
                          reviewBoardFile.reviewBoardFileNo,
                        ]);
                      };
                      return (
                        <p key={"oldFile-" + i}>
                          <span className="filename">
                            {reviewBoardFile.filename}
                          </span>
                          <span
                            className="material-icons del-file-icon"
                            onClick={deleteFile}
                          >
                            delete
                          </span>
                        </p>
                      );
                    })
                  : ""}
                {showReviewBoardFile.map((filename, i) => {
                  const deleteFile = () => {
                    reviewBoardFile.splice(i, 1);
                    setReviewBoardFile([...reviewBoardFile]);
                    showReviewBoardFile.splice(i, 1);
                    setShowReviewBoardFile([...showReviewBoardFile]);
                  };
                  return (
                    <p key={"newFile-" + i}>
                      <span className="filename">{filename}</span>
                      <span
                        className="material-icons del-file-icon"
                        onClick={deleteFile}
                      >
                        delete
                      </span>
                    </p>
                  );
                })}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReviewBoardFrm;
