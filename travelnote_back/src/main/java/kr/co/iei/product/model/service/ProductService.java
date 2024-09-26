package kr.co.iei.product.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.product.model.dao.ProductDao;
import kr.co.iei.product.model.dto.ProductDTO;
import kr.co.iei.product.model.dto.ProductFileDTO;
import kr.co.iei.product.model.dto.ReviewDTO;
import kr.co.iei.util.PageInfo;
import kr.co.iei.util.PageUtil;

@Service
public class ProductService {
	@Autowired
	private ProductDao productDao;
	
	@Autowired
	private PageUtil pageUtil;

	// 패키지 상품 목록 조회
	public Map selectProductList(int reqPage, String userEmail) {
		int userNo = productDao.selectOneUser(userEmail);
		// 게시물 조회 및 페이징에 필요한 데이터를 모두 취합
		int numPerPage = 4;						// 한 페이지당 출력할 상품 갯수
		int pageNaviSize = 7;						// 페이지네비 길이
		int totalCount = productDao.totalCount();	// 전체 상품 수
		// 페이징에 필요한 값들을 연산해서 객체로 리턴받음
		PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List list = productDao.selectProductList(pi, userNo);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list", list);
		map.put("pi", pi);
		return map;
	}

	// 패키지 상품 등록
	@Transactional
	public int insertProduct(ProductDTO product, List<ProductFileDTO> productFileList) {
		int result = productDao.insertProduct(product);
		for(ProductFileDTO productFile : productFileList) {
			productFile.setProductNo(product.getProductNo());
			result += productDao.insertProductFile(productFile);
		}
		return result;
	}

//	public ProductDTO selectOneProduct(int productNo) {
//		ProductDTO product = productDao.selectOneProduct(productNo);
//		List<ProductFileDTO> fileList = productDao.selectOneProductFileList(productNo);
//		List<ReviewDTO> reviews = productDao.selectOneProductReviews(productNo);
//		product.setFileList(fileList);
//		product.setReviews(reviews);
//		return product;
//	}

	// 패키지 상품 상세페이지
	public ProductDTO selectOneProduct(int productNo, String userEmail) {
	    ProductDTO product = productDao.selectOneProduct(productNo);
	    List<ProductFileDTO> fileList = productDao.selectOneProductFileList(productNo);
	    int userNo = productDao.selectOneUser(userEmail);
	    List<ReviewDTO> reviews = productDao.selectOneProductReviews(productNo, userNo); // userNo 추가
	    product.setFileList(fileList);
	    product.setReviews(reviews);
	    return product;
	}

	// 패키지 상품의 첨부파일(대표이미지) 조회
	public ProductFileDTO getProductFile(int productFileNo) {
		ProductFileDTO productFile = productDao.getProductFile(productFileNo);
		return productFile;
	}

	// 패키지 상품 삭제
	@Transactional
	public List<ProductFileDTO> deleteProduct(int productNo) {
		List<ProductFileDTO> fileList = productDao.selectOneProductFileList(productNo);
		int result = productDao.deleteProduct(productNo);
		if(result > 0) {
			return fileList;
		}else {			
			return null;
		}
	}

	// 패키지 상품 수정
	@Transactional
	public List<ProductFileDTO> updateProduct(ProductDTO product, List<ProductFileDTO> productFileList) {
		int result = productDao.updateProduct(product);
		if(result > 0) {
			// 삭제한 파일이 있으면 조회 후 삭제
			List<ProductFileDTO> delFileList = new ArrayList<ProductFileDTO>();
			if(product.getDelProductFileNo() != null) {
				delFileList = productDao.selectProductFile(product.getDelProductFileNo());
				result += productDao.deleteProductFile(product.getDelProductFileNo());
			}
			// 새 첨부파일이 있으면 새 첨부파일을 insert
			for(ProductFileDTO productFile : productFileList) {
				result += productDao.insertProductFile(productFile);
			}
			int updateTotal = product.getDelProductFileNo() == null
					? 1 + productFileList.size()
					: 1 + productFileList.size() + product.getDelProductFileNo().length;
			if(result == updateTotal) {
				return delFileList;
			}
		}
		return null;
	}

	// email로 유저 조회
	public int selectOneUser(String userEmail) {
		int userNo = productDao.selectOneUser(userEmail);
		return userNo;
	}

	// 리뷰 등록
	@Transactional
	public int insertReview(ReviewDTO review) {
		int result = productDao.insertReview(review);
		return result;
	}
	
	// 리뷰 수정
	@Transactional
	public int updateReview(ReviewDTO review) {
		int result = productDao.updateReview(review);
		return result;
	}

	// 리뷰 삭제
	@Transactional
	public int deleteReview(ReviewDTO review) {
		int result = productDao.deleteReview(review);
		return result;
	}

	// 리뷰 좋아요 추가
	@Transactional
	public int insertReviewLike(int reviewNo, Integer reviewLike, int userNo) {
		int result = 0;
		if (reviewLike == null || reviewLike == 0) {
			// 좋아요를 누르지 않은 상태에서 클릭 -> 좋아요 추가 -> insert
			result = productDao.insertReviewLike(reviewNo, userNo);
		}
		if(result > 0) {
			// 좋아요 추가, 좋아요 취소 로직 수행 후 현재 좋아요 수 조회해서 리턴
			int reviewLikeCount = productDao.selectReviewLikeCount(reviewNo);
			return reviewLikeCount;
		}else {
			return -1;
		}
	}

	// 리뷰 좋아요 취소
	@Transactional
	public int deleteReviewLike(int reviewNo, Integer reviewLike, int userNo) {
		int result = 0;
		if(reviewLike != null && reviewLike == 1) {
			// 좋아요를 누른 상태에서 클릭 -> 좋아요 취소 -> delete
			result = productDao.deleteReviewLike(reviewNo, userNo);
		}
		if(result > 0) {
			// 좋아요 추가, 좋아요 취소 로직 수행 후 현재 좋아요 수 조회해서 리턴
			int reviewLikeCount = productDao.selectReviewLikeCount(reviewNo);
			return reviewLikeCount;
		}else {
			return -1;
		}
	}

	// 리뷰 좋아요의 상태가 바뀔 때 마다 리뷰 좋아요 수 조회
	public int selectReviewLikeCount(int reviewNo) {
		int reviewLikeCount = productDao.selectReviewLikeCount(reviewNo);
		return reviewLikeCount;
	}

	// 상품 찜
	@Transactional
	public int insertWishLike(int productNo, Integer productLike, int userNo) {
		int result = 0;
		if(productLike == null || productLike == 0) {
			// 좋아요를 누르지 않은 상태에서 클릭 -> 좋아요 추가 -> insert
			result = productDao.insertWishLike(productNo, userNo);
		}
		if(result > 0) {
			// 좋아요 추가, 좋아요 취소 로직 수행 후 현재 좋아요 수 조회해서 리턴
			int productLikeCount = productDao.selectProductLikeCount(productNo);
			return productLikeCount;
		}else {
			return -1;
		}
	}

	// 상품 찜 취소
	@Transactional
	public int deleteWishLike(int productNo, Integer productLike, int userNo) {
		int result = 0;
		if(productLike != null && productLike == 1) {
			// 좋아요를 누르지 않은 상태에서 클릭 -> 좋아요 추가 -> insert
			result = productDao.deleteWishLike(productNo, userNo);
		}
		if(result > 0) {
			// 좋아요 추가, 좋아요 취소 로직 수행 후 현재 좋아요 수 조회해서 리턴
			int productLikeCount = productDao.selectProductLikeCount(productNo);
			return productLikeCount;
		}else {
			return -1;
		}
	}

	// 상품 좋아요의 상태가 바뀔 때 마다 상품 좋아요 수 조회
	public int selectProductLikeCount(int productNo) {
		int productLikeCount = productDao.selectProductLikeCount(productNo);
		return productLikeCount;
	}
}
