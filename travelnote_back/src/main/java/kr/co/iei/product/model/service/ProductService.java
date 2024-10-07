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

	// 상품 검색 기능
	public Map<String, Object> searchProduct(int reqPage, String searchQuery) {
		int numPerPage = 8;						// 한 페이지당 출력할 상품 갯수
		int pageNaviSize = 7;						// 페이지네비 길이
		int totalCount = productDao.totalCount();	// 전체 상품 수
		// 페이징에 필요한 값들을 연산해서 객체로 리턴받음
		PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);

		// 검색어가 있으면 검색어로, 없으면 전체 조회
	    List<ProductDTO> list = (searchQuery == null || searchQuery.isEmpty())
	        ? productDao.selectProductList(pi)
	        : productDao.searchProduct(pi, searchQuery);
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list", list);
		map.put("pi", pi);
		return map;
	}
	
	// 패키지 상품 목록 조회(이메일 없으면)
	public Map<String, Object> selectProductList(int reqPage) {
		int numPerPage = 8;						// 한 페이지당 출력할 상품 갯수
		int pageNaviSize = 7;						// 페이지네비 길이
		int totalCount = productDao.totalCount();	// 전체 상품 수
		// 페이징에 필요한 값들을 연산해서 객체로 리턴받음
		PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List<ProductDTO> list = productDao.selectProductList(pi);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list", list);
		map.put("pi", pi);
		return map;
	}

	// 패키지 상품 목록 조회(이메일 있으면)
	public Map<String, Object> selectProductListEmail(int reqPage, String userEmail) {
//		int userNo = productDao.selectOneUser(userEmail);
		// 게시물 조회 및 페이징에 필요한 데이터를 모두 취합
		int numPerPage = 8;						// 한 페이지당 출력할 상품 갯수
		int pageNaviSize = 7;						// 페이지네비 길이
		int totalCount = productDao.totalCount();	// 전체 상품 수
		// 페이징에 필요한 값들을 연산해서 객체로 리턴받음
		PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List<ProductDTO> list = productDao.selectProductListEmail(pi, userEmail);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list", list);
		map.put("pi", pi);
		return map;
	}
	
	// 상품 정렬
//	public Map<String, Object> selectProductListSortOption(int reqPage, String userEmail, String sortOption) {
//	    // 게시물 조회 및 페이징에 필요한 데이터를 모두 취합
//	    int numPerPage = 4;                        // 한 페이지당 출력할 상품 갯수
//	    int pageNaviSize = 7;                      // 페이지네비 길이
//	    int totalCount = productDao.totalCount();  // 전체 상품 수
//	    // 페이징에 필요한 값들을 연산해서 객체로 리턴받음
//	    PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
//
//	    List<ProductDTO> list; // Product 타입으로 리스트 선언
//
//	    if (sortOption.equals("mostLiked")) {
//	    	System.out.println("mostLiked");
//	        list = productDao.selectProductListMostLiked(pi, userEmail);
//	    } else if (sortOption.equals("newest")) {
//	    	System.out.println("newest");
//	        list = productDao.selectProductListNewest(pi, userEmail);
//	    } else {
//	        list = productDao.selectProductListEmail(pi, userEmail); // 기본값으로 빈 리스트 할당
//	    }
//
//	    Map<String, Object> map = new HashMap<String, Object>();
//	    map.put("list", list);
//	    map.put("pi", pi);
//	    return map;
//	}

	// 상품 정렬
	public Map<String, Object> selectProductListSortOption(int reqPage, String userEmail, String sortOption) {
	    int numPerPage = 8; // 한 페이지당 출력할 상품 갯수
	    int pageNaviSize = 7; // 페이지네비 길이
	    int totalCount = productDao.totalCount(); // 전체 상품 수

	    // 페이징에 필요한 값들을 연산해서 객체로 리턴받음
	    PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
	    
	    List<ProductDTO> list;
	    
	    switch (sortOption) {
	        case "mostLiked":
	            System.out.println("mostLiked");
	            list = productDao.selectProductListMostLiked(pi, userEmail);
	            break;
	        case "newest":
	            System.out.println("newest");
	            list = productDao.selectProductListNewest(pi, userEmail);
	            break;
	        default:
	        	list = productDao.selectProductListEmail(pi, userEmail);
	            break;
	    }

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
	// 상품 상세 정보 조회
    public Map<String, Object> selectOneProduct(int productNo, String userEmail) {
        ProductDTO product = productDao.selectOneProduct(productNo);
        List<ProductFileDTO> productFileList = productDao.selectOneProductFileList(productNo);
        int userNo = productDao.selectOneUser(userEmail);
        List<ReviewDTO> productReviewList = productDao.selectOneProductReviews(productNo, userNo);
	    product.setProductFileList(productFileList);
	    product.setProductReviewList(productReviewList);

        // 상품, 파일, 리뷰 정보를 맵에 담음
	    Map<String, Object> map = new HashMap<String, Object>();
        map.put("product", product);
        map.put("productFileList", productFileList);
        map.put("productReviewList", productReviewList);

        return map;
    }
	
//	public Map<String, Object> selectOneProduct(int productNo, String userEmail) {
//	    ProductDTO product = productDao.selectOneProduct(productNo);
//	    List<ProductFileDTO> productFileList = productDao.selectOneProductFileList(productNo);
//	    int userNo = productDao.selectOneUser(userEmail);
//	    List<ReviewDTO> productReviewList = productDao.selectOneProductReviews(productNo, userNo); // userNo 추가
//	    product.setProductFileList(productFileList);
//	    product.setProductReviewList(productReviewList);
//	    
//	    Map<String, Object> map = new HashMap<String, Object>();
//	    map.put("product", product);
//	    map.put("productFileList", productFileList);
//	    map.put("productReviewList", productReviewList);
//	    return map;
//	}
	
//	public Map selectProductListSortOption(int reqPage, String userEmail, String sortOption) {
//	    // 게시물 조회 및 페이징에 필요한 데이터를 모두 취합
//	    int numPerPage = 4;                        // 한 페이지당 출력할 상품 갯수
//	    int pageNaviSize = 7;                      // 페이지네비 길이
//	    int totalCount = productDao.totalCount();  // 전체 상품 수
//	    // 페이징에 필요한 값들을 연산해서 객체로 리턴받음
//	    PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
//
//	    List<ProductDTO> list; // Product 타입으로 리스트 선언
//
//	    if (sortOption.equals("mostLiked")) {
//	        list = productDao.selectProductListMostLiked(pi, userEmail);
//	    } else if (sortOption.equals("newest")) {
//	        list = productDao.selectProductListNewest(pi, userEmail);
//	    } else {
//	        list = productDao.selectProductListEmail(pi, userEmail); // 기본값으로 빈 리스트 할당
//	    }
//
//	    Map<String, Object> map = new HashMap<>();
//	    map.put("list", list);
//	    map.put("pi", pi);
//	    return map;
//	}

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
	
	// 리뷰 정렬
	// 리뷰 정렬 옵션에 따른 리뷰 리스트 조회
    public Map<String, Object> selectReviewListSortOption(int productNo, String userEmail, String sortOption) {
        int userNo = productDao.selectOneUser(userEmail);

        // 정렬 옵션에 따른 리뷰 리스트 선택
        List<ReviewDTO> productReviewList;
        switch (sortOption) {
		    case "mostLiked":
		        productReviewList = productDao.selectReviewListMostLiked(productNo, userNo);
		        break;
		    case "newest":
		        productReviewList = productDao.selectReviewListNewest(productNo, userNo);
		        break;
		    default:
		        productReviewList = productDao.selectReviewListNewest(productNo, userNo); // 기본값으로 최신순
		        break;
		}

        Map<String, Object> map = new HashMap<String, Object>();
	    map.put("productReviewList", productReviewList);

        return map;
    }
	
//	public Map<String, Object> selectReviewListSortOption(int productNo, String userEmail, String sortOption) {
//	    int userNo = productDao.selectOneUser(userEmail);
//	    
//	    List<ReviewDTO> productReviewList; // Product 타입으로 리스트 선언
//
//	    switch (sortOption) {
//		    case "mostLiked":
//		        productReviewList = productDao.selectReviewListMostLiked(productNo, userNo);
//		        break;
//		    case "newest":
//		        productReviewList = productDao.selectReviewListNewest(productNo, userNo);
//		        break;
//		    default:
//		        productReviewList = productDao.selectReviewListNewest(productNo, userNo); // 기본값으로 최신순
//		        break;
//		}
//
//	    Map<String, Object> map = new HashMap<String, Object>();
//	    map.put("productReviewList", productReviewList);
//
//	    return map; // 조회 결과 리턴
//	}

//	public Map selectOneProduct(int productNo, String userEmail) {
//	    ProductDTO product = productDao.selectOneProduct(productNo);
//	    List<ProductFileDTO> fileList = productDao.selectOneProductFileList(productNo);
//	    int userNo = productDao.selectOneUser(userEmail);
//	    List<ReviewDTO> reviews = productDao.selectOneProductReviews(productNo, userNo); // userNo 추가
//	    product.setFileList(fileList);
//	    product.setReviews(reviews);
//	    
//	    Map<String, Object> map = new HashMap<String, Object>();
//	    map.put("product", product);
//	    map.put("fileList", fileList);
//	    map.put("reviews", reviews);
//	    return map;
//	}

	// 리뷰 등록
	@Transactional
	public int insertReview(ReviewDTO review) {
		int result = productDao.insertReview(review);
		return result;
	}

	// 리뷰 답글 등록
	@Transactional
	public int insertReviewComment(ReviewDTO review) {
		int result = productDao.insertReviewComment(review);
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

	//오건하 작성 2024-10-04
	public Map myReviewList(String userNick, int reqPage) {
		int numPerPage = 15;
		int pageNaviSize = 5;
		int totalCount = productDao.myReviewTotalCount(userNick);
		PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		pi.setUserNick(userNick);
		List list = productDao.myReviewList(pi);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list",list);
		map.put("pi", pi);
		return map;
	}
	
	//오건하 작성 2024-10-04
	public Map myProduct(String userNick, int reqPage) {
		int numPerPage = 2;
		int pageNaviSize = 5;
		int totalCount = productDao.myProductTotalCount(userNick);
		PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		pi.setUserNick(userNick);
		List list = productDao.myProductList(pi);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list", list);
		map.put("pi", pi);
		return map;
	}
	
}
