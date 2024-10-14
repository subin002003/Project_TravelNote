import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { loginEmailState, userNickState } from "../utils/RecoilData";
import axios from "axios";
import PageNavi from "../utils/PagiNavi";
import { useNavigate } from "react-router-dom";

const Mywish = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const [myWishList, setMyWishList] = useState([]);
  const [pi, setPi] = useState({});
  const [reqPage, setReqPage] = useState(1);
  useEffect(() => {
    axios
      .get(`${backServer}/user/myWish/${userNick}/${reqPage}`)
      .then((res) => {
        setMyWishList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userNick]);
  return (
    <div className="mywish-wrap">
      <div
        className="page-title-info"
        style={{ marginBottom: "20px", marginTop: "20px" }}
      >
        내 찜 목록
      </div>
      <div className="mywish-content">
        {myWishList && myWishList.length > 0 ? (
          myWishList.map((mywish, i) => {
            return <MywishItem key={"mywish" + i} mywish={mywish} />;
          })
        ) : (
          <div
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            <h3>아직 찜한 상품이 없습니다!</h3>
          </div>
        )}
      </div>
      <div
        className="mywish-page-navi"
        style={{ marginBottom: "20px", marginTop: "20px" }}
      >
        <PageNavi pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
      </div>
    </div>
  );
};
const MywishItem = (props) => {
  const mywish = props.mywish;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const navigateProduct = () => {
    navigate(`/product/view/${mywish.productNo}`);
  };
  return (
    <div onClick={navigateProduct} className="wish-item">
      <div className="wish-product-thumb-wrap">
        <img
          className="wish-product-thumb"
          src={
            mywish.productThumb
              ? `${backServer}/product/thumb/${mywish.productThumb}`
              : "/image/logo1.png"
          }
        ></img>
      </div>
      <div className="wish-product-title">
        <span>{mywish.productName}</span>
        <span>{mywish.productPrice}원</span>
      </div>
    </div>
  );
};
export default Mywish;
