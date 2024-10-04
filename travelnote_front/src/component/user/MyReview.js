import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userNickState } from "../utils/RecoilData";
import axios from "axios";
import { Link } from "react-router-dom";
import PageNavi from "../utils/PagiNavi";

const MyReview = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const [reviewList, setReviewList] = useState([]);
  const [pi, setPi] = useState({});
  const [reqPage, setReqPage] = useState(1);

  useEffect(() => {
    axios
      .get(`${backServer}/user/myReviewList/${userNick}/${reqPage}`)
      .then((res) => {
        console.log(res);
        setReviewList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage, userNick]);

  return (
    <div className="myreview-content">
      <div className="page-title-info">내가 작성한 리뷰</div>
      <div className="myreview-list">
        <table>
          <tbody>
            <tr>
              <th style={{ width: "20%" }}>리뷰 상품</th>
              <th style={{ width: "50%" }}>리뷰 내용</th>
              <th style={{ width: "20%" }}>작성일</th>
              <th style={{ width: "10%" }}>리뷰 점수</th>
            </tr>
            {reviewList.map((review, i) => {
              return <ReviewItem key={"review" + i} review={review} />;
            })}
          </tbody>
        </table>
        <div style={{ marginTop: "20px" }}>
          <PageNavi pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
        </div>
      </div>
    </div>
  );
};

const ReviewItem = (props) => {
  const review = props.review;
  return (
    <tr>
      <td>
        <Link to={`/product/view/${review.productNo}`}>
          {review.productName}
        </Link>
      </td>
      <td>
        <p className="myreview-content">{review.reviewContent}</p>
      </td>
      <td>{review.reviewDate}</td>
      <td>{review.reviewScore}</td>
    </tr>
  );
};

export default MyReview;
