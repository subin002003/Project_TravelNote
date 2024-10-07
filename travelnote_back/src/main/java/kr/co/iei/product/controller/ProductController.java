package kr.co.iei.product.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import kr.co.iei.product.model.dto.ProductDTO;
import kr.co.iei.product.model.dto.ProductFileDTO;
import kr.co.iei.product.model.dto.ReviewDTO;
import kr.co.iei.product.model.service.ProductService;
import kr.co.iei.util.FileUtils;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/product")
public class ProductController {
	@Autowired
	private ProductService productService;
	
	@Autowired
	private FileUtils fileUtils;
	
	@Value("${file.root}")
	public String root;
	
//	@GetMapping(value = "/list/{reqPage}")
//	public ResponseEntity<Map> listProducts(@PathVariable int reqPage, @RequestParam(required = false) String searchQuery, @RequestParam(required = false) String userEmail, @RequestParam(required = false) String sortOption) {
//	    Map map = productService.listProducts(reqPage, searchQuery, userEmail, sortOption);
//	    return ResponseEntity.ok(map);
//	}
	
	// 상품 검색 기능
	@GetMapping(value="/list/{reqPage}{searchQuery}")
	public ResponseEntity<Map> searchProduct(@PathVariable int reqPage, @RequestParam(required = false) String searchQuery) {
		System.out.println("searchQuery : " + searchQuery);
		Map map = productService.searchProduct(reqPage, searchQuery);
		return ResponseEntity.ok(map);
	}
	
	// 패키지 상품 목록(이메일 없으면)
	@GetMapping(value="/list/{reqPage}")
	public ResponseEntity<Map> list(@PathVariable int reqPage){
		// 조회 결과는 게시물목록, pageNavi생성 시 필요한 데이터들
		Map map = productService.selectProductList(reqPage);
		return ResponseEntity.ok(map);
	}
	
	// 패키지 상품 목록(이메일 있으면)
	@GetMapping(value="/list/{reqPage}/{userEmail}")
	public ResponseEntity<Map> list(@PathVariable int reqPage, @PathVariable String userEmail){
		// 조회 결과는 게시물목록, pageNavi생성 시 필요한 데이터들
		Map map = productService.selectProductListEmail(reqPage, userEmail);
		return ResponseEntity.ok(map);
	}
	
	// 상품 정렬
	@GetMapping(value="/list/{reqPage}/{userEmail}/{sortOption}")
	public ResponseEntity<Map> list(@PathVariable int reqPage, @PathVariable String userEmail, @PathVariable String sortOption){
		// 조회 결과는 게시물목록, pageNavi생성 시 필요한 데이터들
		Map map = productService.selectProductListSortOption(reqPage, userEmail, sortOption);
		return ResponseEntity.ok(map);
	}
	
	// 첨부파일
	@PostMapping(value="/editorImage")
	public ResponseEntity<String> editorImage(@ModelAttribute MultipartFile image){
		String savepath = root + "/product/editor/";
		String filepath = fileUtils.upload(savepath, image);
		return ResponseEntity.ok("/product/editor/" + filepath);
	}
	
	// 패키지 상품 대표 이미지 처리
	@GetMapping("/{filename}")
	public ResponseEntity<Resource> getProductImage(@PathVariable String filename) throws FileNotFoundException {
	    // 이미지 파일의 저장 경로
	    String filePath = root + "/product/" + filename;
	    File file = new File(filePath);

	    if (!file.exists()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	    }

	    // 파일 확장자를 추출하여 MIME 타입을 설정
	    String mimeType = null;
	    if (filename.endsWith(".jpeg") || filename.endsWith(".jpg")) {
	        mimeType = MediaType.IMAGE_JPEG_VALUE;
	    } else if (filename.endsWith(".png")) {
	        mimeType = MediaType.IMAGE_PNG_VALUE;
	    } else {
	        // 그 외 확장자는 지원하지 않음
	        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).build();
	    } 

	    // 파일을 읽어와서 InputStreamResource로 반환
	    InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

	    HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.parseMediaType(mimeType));  // 파일의 MIME 타입을 설정
	    headers.setContentLength(file.length());

	    return new ResponseEntity<Resource>(resource, headers, HttpStatus.OK);
	}

	
	// 상품 등록
	@PostMapping
	public ResponseEntity<Boolean> insertProduct(@ModelAttribute ProductDTO product, @ModelAttribute MultipartFile thumbnail, @ModelAttribute MultipartFile[] productFile){
		if(thumbnail != null) {
			String savepath = root+"/product/thumb/";
			String filepath = fileUtils.upload(savepath, thumbnail);
			product.setProductThumb(filepath);
		}
		List<ProductFileDTO> productFileList = new ArrayList<ProductFileDTO>();
		if(productFile != null) {
			String savepath = root+"/product/";
			for(MultipartFile file : productFile) {
				ProductFileDTO fileDTO = new ProductFileDTO();
				String filename = file.getOriginalFilename();
				String filepath = fileUtils.upload(savepath, file);
				fileDTO.setFilename(filename);
				fileDTO.setFilepath(filepath);
				productFileList.add(fileDTO);
			}
		}
		int result = productService.insertProduct(product, productFileList);
		return ResponseEntity.ok(result == 1 + productFileList.size());
	}
	
	// 패키지 상품 상세페이지
//	@GetMapping(value="/productNo/{productNo}")
//	public ResponseEntity<ProductDTO> selectOneProduct(@PathVariable int productNo) {
//		ProductDTO product = productService.selectOneProduct(productNo);
//		return ResponseEntity.ok(product);
//	}

	// 상품 상세페이지
    @GetMapping(value="/productNo/{productNo}/{userEmail}")
    public ResponseEntity<Map> selectOneProduct(@PathVariable int productNo, @PathVariable String userEmail) {
        Map<String, Object> productDetails = productService.selectOneProduct(productNo, userEmail);
        return ResponseEntity.ok(productDetails);
    }
	
	// 패키지 상품 삭제
	@DeleteMapping(value="/{productNo}")
	public ResponseEntity<Integer> deleteProduct(@PathVariable int productNo) {
		List<ProductFileDTO> delFileList = productService.deleteProduct(productNo);
		if(delFileList != null) {
			String savepath = root + "/product/";
			for(ProductFileDTO productFile : delFileList) {
				File delFile = new File(savepath+productFile.getFilepath());
				delFile.delete();
			}
			return ResponseEntity.ok(1);
		}else {
			return ResponseEntity.ok(0);
		}
	}
	
	// 패키지 상품 수정
	@PatchMapping
	public ResponseEntity<Boolean> updateProduct(@ModelAttribute ProductDTO product, @ModelAttribute MultipartFile thumbnail, @ModelAttribute MultipartFile[] productFile){
		if(thumbnail != null) {
			String savepath = root + "/product/thumb/";
			String filepath = fileUtils.upload(savepath, thumbnail);
			product.setProductThumb(filepath);
		}
		List<ProductFileDTO> productFileList = new ArrayList<ProductFileDTO>();
		if(productFile != null) {
			String savepath = root+"/product/";
			for(MultipartFile file : productFile){
				ProductFileDTO productFileDTO = new ProductFileDTO();
				String filename = file.getOriginalFilename();
				String filepath = fileUtils.upload(savepath, file);
				productFileDTO.setFilename(filename);
				productFileDTO.setFilepath(filepath);
				productFileDTO.setProductNo(product.getProductNo());
				productFileList.add(productFileDTO);
			}
		}
		List<ProductFileDTO> delFileList = productService.updateProduct(product, productFileList);
		if(delFileList != null) {
			String savepath = root+"/product/";
			for(ProductFileDTO deleteFile : delFileList) {
				File delFile = new File(savepath + deleteFile.getFilepath());
				delFile.delete();
			}
			return ResponseEntity.ok(true);
		}else {
			return ResponseEntity.ok(false);
		}
	}
	
	// 리뷰 정렬
    @GetMapping(value="/productNo/{productNo}/{userEmail}/{sortOption}")
    public ResponseEntity<Map> selectReview(@PathVariable int productNo, @PathVariable String userEmail, @PathVariable String sortOption) {
        Map<String, Object> sortedReviews = productService.selectReviewListSortOption(productNo, userEmail, sortOption);
        return ResponseEntity.ok(sortedReviews);
    }
	
	// 리뷰 등록
	@PostMapping(value="/insertReview")
	public ResponseEntity<Integer> insertReview(@ModelAttribute ReviewDTO review) {
		System.out.println(review);
		int result = productService.insertReview(review);
		return ResponseEntity.ok(result);
	}
	
	// 리뷰 답글 등록
	@PostMapping(value="/insertReviewComment")
	public ResponseEntity<Integer> insertReviewComment(@ModelAttribute ReviewDTO review) {
		System.out.println(review);
		int result = productService.insertReviewComment(review);
		return ResponseEntity.ok(result);
	}
	
	// 리뷰 수정
	@PatchMapping(value="/updateReview/{reviewNo}")
	public ResponseEntity<Integer> updateReview(@ModelAttribute ReviewDTO review) {
		int result = productService.updateReview(review);
		return ResponseEntity.ok(result);
	}
	
	// 리뷰 삭제
	@DeleteMapping(value="/deleteReview/{reviewNo}")
	public ResponseEntity<Integer> deleteReview(@ModelAttribute ReviewDTO review) {
		int result = productService.deleteReview(review);
		return ResponseEntity.ok(result);
	}
	
	// 리뷰 좋아요 추가
	@PostMapping(value="/{reviewNo}/insertReviewLike/{userEmail}")
	public ResponseEntity<Integer> insertReviewLike(@PathVariable int reviewNo, @RequestParam(required = false) Integer reviewLike, @PathVariable String userEmail) {
		int userNo = productService.selectOneUser(userEmail);
		int result = productService.insertReviewLike(reviewNo, reviewLike, userNo);
		return ResponseEntity.ok(result);
	}
	
	// 리뷰 좋아요 취소
	@DeleteMapping(value="/{reviewNo}/deleteReviewLike/{userEmail}")
	public ResponseEntity<Integer> deleteReviewLike(@PathVariable int reviewNo, @RequestParam(required = true) Integer reviewLike, @PathVariable String userEmail) {
		int userNo = productService.selectOneUser(userEmail);
		int result = productService.deleteReviewLike(reviewNo, reviewLike, userNo);
		return ResponseEntity.ok(result);
	}
	
	// 리뷰 좋아요의 상태가 바뀔 때 마다 리뷰 좋아요 수 조회
	@GetMapping(value="/{reviewNo}/likeCount")
	public ResponseEntity<Integer> selectReviewLikeCount(@PathVariable int reviewNo) {
		int reviewLikeCount = productService.selectReviewLikeCount(reviewNo);
		return ResponseEntity.ok(reviewLikeCount);
	}
	
	// 상품 좋아요
	@PostMapping(value="/{productNo}/insertWishLike/{userEmail}")
	public ResponseEntity<Integer> insertWishLike(@PathVariable int productNo, @RequestParam(required = false) Integer productLike , @PathVariable String userEmail){
		int userNo = productService.selectOneUser(userEmail);
		int result = productService.insertWishLike(productNo, productLike, userNo);	    
		return ResponseEntity.ok(result);
	}
	
	// 상품 좋아요 취소
	@DeleteMapping(value="/{productNo}/deleteWishLike/{userEmail}")
	public ResponseEntity<Integer> deleteWishLike(@PathVariable int productNo, @RequestParam(required = true) Integer productLike , @PathVariable String userEmail){
		int userNo = productService.selectOneUser(userEmail);
		int result = productService.deleteWishLike(productNo, productLike, userNo);	    
		return ResponseEntity.ok(result);
	}
	
	// 상품 좋아요의 상태가 바뀔 때 마다 상품 좋아요 수 조회
	@GetMapping(value="/{productNo}/productLike")
	public ResponseEntity<Integer> selectProductLikeCount(@PathVariable int productNo) {
		int productLikeCount = productService.selectProductLikeCount(productNo);
		return ResponseEntity.ok(productLikeCount);
	}
}
