import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const sortOptions = [
    { label: '상품 찜이 많은 순', value: 'mostLiked' },
    { label: '등록 최신 순', value: 'newest' },
];

const ProductList = () => {
    const backServer = process.env.REACT_APP_BACK_SERVER;
    const [productList, setProductList] = useState([]);
    const [reqPage, setReqPage] = useState(1);
    const [pi, setPi] = useState({});

    // 상품 리스트 조회
    const fetchProductList = (sortOption) => {
        const requestUrl = `${backServer}/product/list/${reqPage}?sort=${sortOption}`; // 정렬 조건에 따른 URL 설정
        axios.get(requestUrl)
            .then((res) => {
                setProductList(res.data.list); // 상품 목록 업데이트
                setPi(res.data.pi); // 페이지 정보 업데이트
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // 페이지가 로드될 때 기본 정렬 조건으로 데이터 요청
    useEffect(() => {
        fetchProductList('newest'); // 처음에 '등록 최신 순'으로 데이터 요청
    }, [reqPage, backServer]);

    // 각 정렬 옵션에 따른 클릭 이벤트 처리
    const handleSortClick = (sortOption) => {
        fetchProductList(sortOption); // 해당 정렬 조건으로 상품 목록 요청
    };

    return (
        <section style={{ margin: "50px auto" }} className="section product-list">
            {/* 정렬을 위한 Select 대신 직접적인 클릭 이벤트 처리 */}
            <FormControl sx={{ m: 1, width: '150px', mt: 3 }}>
                <Select
                    displayEmpty
                    input={<OutlinedInput />}
                    defaultValue="" // 기본값 설정
                    renderValue={() => <em>정렬 기준 선택</em>}
                >
                    {sortOptions.map((option) => (
                        <MenuItem
                            key={option.value}
                            value={option.value}
                            onClick={() => handleSortClick(option.value)} // onClick으로 axios 요청
                        >
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* 상품 리스트 */}
            <div className="product-list-wrap">
                <ul className="posting-wrap">
                    {productList.map((product, i) => (
                        <ProductItem key={product.productNo} product={product} />
                    ))}
                </ul>
            </div>

            <div className="product-paging-wrap">
                <PageNavi pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
            </div>
            <ChannelTalk />
        </section>
    );
};

const ProductItem = ({ product }) => {
    return (
        <li>
            <div>{product.productName}</div>
            <div>{product.productSubName}</div>
            <div>{product.productPrice}</div>
        </li>
    );
};

export default ProductList;
