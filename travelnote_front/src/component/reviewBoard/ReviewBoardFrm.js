import { useRef, useState } from "react";

const ReviewBoardFrm = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const reviewBoardTitle = props.reviewboardTitle;
  const setReviewBoardTitle = props.setReviewBoardTitle;
  const thumbnail = props.thumbnail;
  const setThumbnail = props.setThumbnail;
  const reviewBoardFile = props.reviewBoardFile;
  const setReviewBoardFile = props.setReviewBoardFile;
  const reviewBoardCategory = props.reviewBoardCategory;
  const setReviewBoardCategory = props.setReviewBoardCategory;
  const reviewBoardSubContent = props.reviewBoardSubContent;
  const setReviewBoardSubContent = props.setReviewBoardSubContent;

  //수정인 경우에 추가로 전송되는 데이터
  const reviewBoardThumbNail = props.reviewBoardThumbNail;
  const setReviewBoardThumbNail = props.setReviewBoardThumbNail;
  const fileList = props.fileList;
  const setFileList = props.setFileList;
  const delReviewBoardFileNo = props.delReviewBoardFileNo;
  const setDelReviewBoardFileNo = props.setDelReviewBoardFileNo;

  // -> 썸네일을 추가(변경하면)전송할 state
  // thumbnail
  // -> 기존 썸네일정보( DB에서 조회해온 값 ) -> 작성 시에는 없음
  // boardThumb	->null or filepath
  // setBoardThumb
  // -> 화면에 썸네일을 미리보기하는 state  -> 초기값이 무조건 null
  // reviewBoardImg		->null
  // setReviewBoardImg
  const thumbnailRef = useRef(null); // 썸네일 파일 입력 참조
  //썸네일 미리보기용 state(데이터 전송하지 않음)
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
  return (
    <div>
      <div
        style={{
          borderTop: "1px solid black",
          // 상단, 우측, 하단, 좌측 여백
          margin: "20px 0px 40px 0px",
          width: "100%",
        }}
      ></div>
      <div className="review-board-thumb-and-subContent">
        <div className="review-board-thumb-wrap">
          {reviewBoardImg ? (
            <img
              onClick={() => {
                thumbnailRef.current.click();
              }}
              src={reviewBoardImg}
              alt="Thumbnail" //이미지 표시 안될 때 대신 표시될 텍스트
            />
          ) : reviewBoardThumbNail ? (
            <img
              src={`${backServer}/reviewBoard/thumb/${reviewBoardThumbNail}`}
              onClick={() => {
                thumbnailRef.current.click();
              }}
              alt="Thumbnail"
            />
          ) : (
            <img
              onClick={() => {
                thumbnailRef.current.click();
              }}
              src="/image/default_img.png"
              alt="Default"
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
              <label htmlFor="review-boardTitle" style={{ fontSize: "20px" }}>
                제목
              </label>
            </th>
            <td>
              <input
                type="text"
                id="review-boardTitle"
                name="review-boardTitle"
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
              <label htmlFor="reviewBoardCategory" style={{ fontSize: "15px" }}>
                카테고리
              </label>
            </th>
            <td style={{ textAlign: "left" }}>
              <input
                type="text"
                id="reviewBoardCategory"
                name="reviewBoardCategory"
                value={reviewBoardCategory}
                onChange={setReviewBoardCategory}
                style={{
                  height: "30px",
                  width: "100px",
                  border: "none",
                  outline: "none",
                  borderBottom: "1px solid black",
                }}
              />
            </td>
          </tr>
          <tr>
            <th>
              <label style={{ fontSize: "15px" }}>첨부파일</label>
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
            <th style={{ fontSize: "15px" }}>첨부파일 목록</th>
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
