package kr.co.iei.faqboard.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.faqboard.model.dto.FaqBoardDTO;
import kr.co.iei.faqboard.model.service.FaqBoardService;

@CrossOrigin
@RestController
@RequestMapping(value = "/faqBoard")
public class FaqBoardController {
	@Autowired
	private FaqBoardService faqBoardService;
	
	@PostMapping(value="/writeFaqBoard")
	public ResponseEntity<Integer> writeFaqBoard(@RequestBody FaqBoardDTO faqBoard){
		int result = faqBoardService.writeFaqBoard(faqBoard);
		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value="/list/{reqPage}")
	public ResponseEntity<Map> list(@PathVariable int reqPage){
		//조회 결과는 게시물 목록, pageNavi 생성시 필요한 데이터
		Map map = faqBoardService.selectBoardList(reqPage);
		return ResponseEntity.ok(map);
	}
	
	@GetMapping(value="/view/{faqBoardNo}")
	public ResponseEntity<FaqBoardDTO> view(@PathVariable int faqBoardNo){
		FaqBoardDTO faqBoard = faqBoardService.view(faqBoardNo);
		return ResponseEntity.ok(faqBoard);
	}
	
	@DeleteMapping(value="/{faqBoardNo}")
	public ResponseEntity<Integer> deleteFaqBoard(@PathVariable int faqBoardNo){
		int result = faqBoardService.deleteFaqBoard(faqBoardNo);
		return ResponseEntity.ok(result);
	}
	
	@PatchMapping(value="/{faqBoardNo}")
	public ResponseEntity<Integer> updateFaqBoard(@RequestBody FaqBoardDTO faqBoard, @PathVariable int faqBoardNo){
		faqBoard.setFaqBoardNo(faqBoardNo);
		int result = faqBoardService.updateFaqBoard(faqBoard);
		return ResponseEntity.ok(result);
	}
}
