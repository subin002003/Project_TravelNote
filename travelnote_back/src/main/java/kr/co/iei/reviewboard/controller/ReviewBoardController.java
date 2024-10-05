package kr.co.iei.reviewboard.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.reviewboard.model.service.ReviewBoardService;
import kr.co.iei.util.FileUtils;

@CrossOrigin("*")
@RestController
@RequestMapping("/reviewBoard")
public class ReviewBoardController {
	@Autowired
	private ReviewBoardService reviewBoardService;
	
	@Autowired
	private FileUtils fileUtil;
	
	@Value("${file.root}")
	public String root;
	
	// 게시물 전체 조회
	@GetMapping(value = "/list/{reqPage}")
	public ResponseEntity<Map> list(@PathVariable int reqPage){
		//조회결과는 게시물목록, pageNavi생성 시 필요한 데이터들
		Map map = reviewBoardService.selectReviewBoardList(reqPage);
		return ResponseEntity.ok(map);
	}
	
	// 게시물 검색 조회
	@GetMapping(value = "/search/{reqPage}")
	public ResponseEntity<Map> searchlist(@PathVariable int reqPage,  // URL 경로에서 페이지 번호 받기
											@RequestParam String searchTerm, // 쿼리 파라미터에서 검색어 받기
	        								@RequestParam String searchFilter) // 쿼리 파라미터에서 필터 타입 받기)
	{
		// 조회결과는 게시물 목록과 pageNavi 생성 시 필요한 데이터들
		Map<String, Object> map = reviewBoardService.selectReviewBoardSearchList(reqPage, searchTerm, searchFilter);
	    return ResponseEntity.ok(map); // 결과를 JSON 형식으로 반환
	}
	
	
}























