import { useRecoilState } from "recoil";
import { loginEmailState, userNickState } from "../utils/RecoilData";
import { useEffect, useState } from "react";
import axios from "axios";
import PageNavi from "../utils/PagiNavi";
import { useNavigate } from "react-router-dom";

const MyProduct = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [myProductList, setMyProductList] = useState([]);
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const [pi, setPi] = useState({});
  const [reqPage, setReqPage] = useState(1);
  useEffect(() => {
    axios
      .get(`${backServer}/user/myProduct/${userNick}/${reqPage}`)
      .then((res) => {
        setMyProductList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage, userNick]);
  return (
    <div className="myproduct-wrap">
      <div
        style={{ marginTop: "20px", marginBottom: "20px" }}
        className="page-title-info"
      >
        내가 판매중인 상품
      </div>
      <div className="myproduct-list">
        {myProductList && myProductList.length > 0 ? (
          myProductList.map((myProduct, i) => {
            return (
              <MyProductItem key={"myProduct" + i} myProduct={myProduct} />
            );
          })
        ) : (
          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
              height: "100px",
              margin: "0 auto",
              lineHeight: "100px",
            }}
          >
            <h3>아직 판매중인 상품이 없습니다.</h3>
          </div>
        )}
      </div>
      <div
        style={{ marginTop: "20px", marginBottom: "20px" }}
        className="myproduct-page-navi"
      >
        <PageNavi pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
      </div>
    </div>
  );
};

const MyProductItem = (props) => {
  const myProduct = props.myProduct;
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigateProductView = () => {
    navigate(`/product/view/${myProduct.productNo}`);
  };
  return (
    <div
      style={{ cursor: "pointer" }}
      onClick={navigateProductView}
      className="myproduct-content"
    >
      <div style={{ borderRadius: "10px" }} className="myproduct-thumb">
        <img
          style={{ width: "100%", height: "100%", borderRadius: "10px" }}
          className="myproduct-img"
          src={
            myProduct.productThumb
              ? `${backServer}/product/thumb/${myProduct.productThumb}`
              : "/image/default_img.png"
          }
        ></img>
      </div>
      <table>
        <tr>
          <th>제품명</th>
        </tr>
        <tr>{myProduct.productName}</tr>
        <tr>
          <th>가격</th>
        </tr>
        <tr>{myProduct.productPrice}원</tr>
      </table>
    </div>
  );
};

export default MyProduct;
