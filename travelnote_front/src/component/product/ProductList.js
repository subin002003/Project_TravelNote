import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageNavi from "../utils/PagiNavi";

const ProductList = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [productList, setProductList] = useState([
    {
      productNo: 1,
      productName:
        "[선착순/항공+시내호텔] 마쓰야마 칸데오 자유온천 3박4일 (제주항공)",
      productSubName: "떠나자!",
      productThumb: "",
      productPrice: 48500,
      productInfo: "본문내용",
      productLatitude: "string",
      productLongitude: "string",
      productWriter: "여행사1",
      productStatus: 1,
      enrollDate: "2024-09-19",
      fileList: [
        {
          productFileNo: 1,
          productNo: 1,
          filename: "ice6.png",
          filepath: "C:/Temp/travelNote/product/thumb/ice6.png",
        },
      ],
      delProductFileNo: [0],
    },
    {
      productNo: 2,
      productName:
        "[선착순/항공+시내호텔] 마쓰야마 칸데오 자유온천 4박5일 (제주항공)",
      productSubName: "떠나자!",
      productThumb: "",
      productPrice: 55300,
      productInfo: "본문내용",
      productLatitude: "string",
      productLongitude: "string",
      productWriter: "여행사2",
      productStatus: 1,
      enrollDate: "2024-09-19",
      fileList: [
        {
          productFileNo: 2,
          productNo: 2,
          filename: "ice6.png",
          filepath: "C:/Temp/travelNote/product/thumb/ice6.png",
        },
      ],
      delProductFileNo: [0],
    },
    {
      productNo: 3,
      productName:
        "[선착순/항공+시내호텔] 마쓰야마 칸데오 자유온천 4박5일 (제주항공)",
      productSubName: "떠나자!",
      productThumb: "",
      productPrice: 79300,
      productInfo: "본문내용",
      productLatitude: "string",
      productLongitude: "string",
      productWriter: "여행사3",
      productStatus: 1,
      enrollDate: "2024-09-19",
      fileList: [
        {
          productFileNo: 3,
          productNo: 3,
          filename: "ice6.png",
          filepath: "C:/Temp/travelNote/product/thumb/ice6.png",
        },
      ],
      delProductFileNo: [0],
    },
  ]);
  const [reqPage, setReqPage] = useState(1);
  const [pi, setPi] = useState({});

  useEffect(() => {
    axios
      .get(`${backServer}/product/list/${reqPage}`)
      .then((res) => {
        console.log(res.data);
        setProductList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);

  return (
    <section className="section product-list">
      <Link to="/product/write" className="btn-primary">
        상품 등록
      </Link>

      <div className="product-list-wrap">
        <ul className="posting-wrap">
          {productList.map((product, i) => {
            return <ProductItem key={"product-" + i} product={product} />;
          })}
        </ul>
      </div>
      <div className="product-paging-wrap">
        <PageNavi pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
      </div>
    </section>
  );
};

const ProductItem = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const product = props.product;
  const navigate = useNavigate();

  return (
    <li className="posting-item">
      <div
        className="posting-info-left"
        onClick={() => {
          navigate(`/product/view/${product.productNo}`);
        }}
      >
        <div className="posting-title">
          <p>{product.productName}</p>
        </div>
        <div className="posting-title">
          <p>{product.productSubName}</p>
        </div>
      </div>
      <div className="posting-info-right">
        <div className="posting-img">
          <img
            style={{ width: "150px" }}
            src={
              product.productThumb
                ? `${backServer}/product/thumb/${product.productThumb}`
                : "/image/default_img.png"
            }
          />
        </div>
        <div className="like-icon">
          <span className="like-checked">
            <i className="fa-heart fa-regular"></i>
          </span>
        </div>
        <span className="price">{product.productPrice}</span>
      </div>
    </li>
  );
};

export default ProductList;
