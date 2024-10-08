import axios from "axios";
import { useEffect, useState } from "react";
import { loginEmailState } from "../utils/RecoilData";
import { useRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import ReviewBoardFrm from "./ReviewBoardFrm";
import ReviewBoardToastEditor from "../utils/ReviewBoardToastEditor";
import Swal from "sweetalert2";

const ReviewBoardUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();
  const reviewBoardNo = params.reviewBoardNo;
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [reviewBoardTitle, setReviewBoardTitle] = useState("");
  const [reviewBoardCategory, setReviewBoardCategory] = useState("");
  const [reviewBoardContent, setReviewBoardContent] = useState("");
  const [reviewBoardSubContent, setReviewBoardSubContent] = useState("");
  //썸네일 파일을 새로 전송하기 위한 state
  const [thumbnail, setThumbnail] = useState(null);
  //조회해 온 썸네일을 화면에 보여주기 휘한 state
  const [reviewBoardThumbNail, setReviewBoardThumbNail] = useState(null);
  //첨부파일을 새로 전송하기 위한 state
  const [reviewBoardFile, setReviewBoardFile] = useState([]);
  //조회해 온 파일목록을 화면에 보여주기 위한 state
  const [fileList, setFileList] = useState([]);
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  //기존 첨부파일을 삭제하면 삭제한 파일번호를 저장할 배열
  const [delReviewBoardFileNo, setDelReviewBoardFileNo] = useState([]);
  const inputTitle = (e) => {
    setReviewBoardTitle(e.target.value);
  };
  const inputCategory = (e) => {
    setReviewBoardCategory(e.target.value);
  };

  useEffect(() => {
    axios
      .get(`${backServer}/reviewBoard/reviewBoardNo/${reviewBoardNo}`)
      .then((res) => {
        console.log(res);
        setReviewBoardTitle(res.data.reviewBoardTitle);
        setReviewBoardCategory(res.data.reviewBoardCategory);
        setReviewBoardContent(res.data.reviewBoardContent);
        setReviewBoardThumbNail(res.data.reviewBoardThumbNail);
        setReviewBoardSubContent(res.data.reviewBoardSubContent);
        setFileList(res.data.fileList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const updateReviewBoard = () => {
    Swal.fire({
      title: "수정하시겠습니까?",
      icon: "warning",
      showCancelButton: true, // 취소 버튼 표시
      cancelButtonColor: "#3085d6",
      confirmButtonText: "수정",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        // 사용자가 '등록'를 클릭했을 경우
        console.log(thumbnail);
        if (
          reviewBoardTitle !== "" &&
          reviewBoardContent !== "" &&
          reviewBoardSubContent !== ""
        ) {
          const form = new FormData();
          form.append("reviewBoardTitle", reviewBoardTitle);
          form.append("reviewBoardCategory", reviewBoardCategory);
          form.append("reviewBoardContent", reviewBoardContent);
          form.append("reviewBoardNo", reviewBoardNo);
          form.append("reviewBoardSubContent", reviewBoardSubContent);
          if (thumbnail !== null) {
            form.append("thumbnail", thumbnail);
          }
          if (reviewBoardThumbNail !== null) {
            form.append("reviewBoardThumbNail", reviewBoardThumbNail);
          }
          for (let i = 0; i < reviewBoardFile.length; i++) {
            form.append("reviewBoardFile", reviewBoardFile[i]);
          }
          for (let i = 0; i < delReviewBoardFileNo.length; i++) {
            form.append("delReviewBoardFileNo", delReviewBoardFileNo[i]);
          }
          for (let key of form.keys()) {
            console.log(`${key}: ${form.get(key)}`);
          }
          console.log(delReviewBoardFileNo);
          axios
            .patch(`${backServer}/reviewBoard`, form, {
              headers: {
                contentType: "multipart/form-data",
                processData: false,
              },
            })
            .then((res) => {
              console.log(res);
              if (res.data === true) {
                navigate(`/reviewBoard/view/${reviewBoardNo}`);
              } else {
                //실패시 로직
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    });
  };
  return (
    <section className="review-board-wrap">
      <h1 className="review-board-title" style={{ marginBottom: "40px" }}>
        여행 후기 수정
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <ReviewBoardFrm
          loginEmail={loginEmail}
          reviewBoardTitle={reviewBoardTitle}
          setReviewBoardTitle={inputTitle}
          reviewBoardCategory={reviewBoardCategory}
          setReviewBoardCategory={inputCategory}
          reviewBoardFile={reviewBoardFile}
          setReviewBoardFile={setReviewBoardFile}
          fileList={fileList}
          setFileList={setFileList}
          delReviewBoardFileNo={delReviewBoardFileNo}
          setDelReviewBoardFileNo={setDelReviewBoardFileNo}
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
          reviewBoardThumbNail={reviewBoardThumbNail}
          setReviewBoardThumbNail={setReviewBoardThumbNail}
          reviewBoardSubContent={reviewBoardSubContent}
          setReviewBoardSubContent={setReviewBoardSubContent}
        />
      </form>
      <div>
        <ReviewBoardToastEditor
          reviewBoardContent={reviewBoardContent}
          setReviewBoardContent={setReviewBoardContent}
          type={1}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <button
          onClick={updateReviewBoard}
          className="review-board-button-link-update"
        >
          수정
        </button>
      </div>
    </section>
  );
};
export default ReviewBoardUpdate;
