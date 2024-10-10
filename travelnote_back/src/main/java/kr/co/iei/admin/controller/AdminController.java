package kr.co.iei.admin.controller;

import java.util.List;
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

import kr.co.iei.board.model.service.BoardService;
import kr.co.iei.personalboard.model.dto.PersonalBoardAnswerDTO;
import kr.co.iei.personalboard.model.dto.PersonalBoardDTO;
import kr.co.iei.personalboard.model.service.PersonalBoardService;
import kr.co.iei.reviewboard.model.service.ReviewBoardService;
import kr.co.iei.user.model.service.UserService;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/admin")
public class AdminController {
	@Autowired
	private PersonalBoardService personalBoardService;
	@Autowired
	private BoardService boardService;
	@Autowired
	private UserService userService;
	@Autowired
	private ReviewBoardService reviewBoardService;
	
	@GetMapping(value = "/personalBoardList/{reqPage}")
	public ResponseEntity<Map> getPersonalBoardList(@PathVariable int reqPage){
		Map map = personalBoardService.selectPersonalBoardList(reqPage);
		return ResponseEntity.ok(map);
	}
	
	@PostMapping(value = "/writePersonalBoardAnswer")
	public ResponseEntity<Integer> insertPersonalBoardAnswer(@RequestBody PersonalBoardAnswerDTO personalBoardAnswer){
		int result = personalBoardService.insertPersonalBoardAnswer(personalBoardAnswer);
		result += personalBoardService.updatePersonalBoardAnswerInfo(personalBoardAnswer.getPersonalBoardNo());
		return ResponseEntity.ok(result);
	}
	
	@DeleteMapping(value = "/deletePersonalBoardAnswer/{personalBoardNo}")
	public ResponseEntity<Integer> deletePersonalBoardAnswer(@PathVariable int personalBoardNo){
		int result = personalBoardService.deletePersonalBoardAnswer(personalBoardNo);
		result += personalBoardService.updatePersonalBoardAnswerInfo2(personalBoardNo);
		return ResponseEntity.ok(result);
	}
	
	@PatchMapping(value = "/updatePersonalBoardAnswer/{personalBoardNo}")
	public ResponseEntity<Integer> updatePersonalBoardAnswer(@RequestBody PersonalBoardAnswerDTO personalBoardAnswer, @PathVariable int personalBoardNo){
		int result = personalBoardService.updatePersonalBoardAnswer(personalBoardAnswer);
		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value = "/reportBoardList/{boardReqPage}")
	public ResponseEntity<Map> selectReportBoardList(@PathVariable int boardReqPage){
		Map map = boardService.selectReportBoardList(boardReqPage);
		return ResponseEntity.ok(map);
	}
	
	@PatchMapping(value = "/updateBoardStatus/{boardNo}")
	public ResponseEntity<Integer> updateBoardStatus(@PathVariable int boardNo){
		int result = boardService.updateBoardStatus(boardNo);
		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value = "/reportUserList/{reqPage}")
	public ResponseEntity<Map> selectReportUserList(@PathVariable int reqPage){
		Map map = userService.selectReportUserList(reqPage);
		return ResponseEntity.ok(map);
	}
	
	@GetMapping(value = "/reportReviewList/{reviewBoardReqPage}")
	public ResponseEntity<Map> selectReportReviewList(@PathVariable int reviewBoardReqPage){
		Map map = reviewBoardService.selectReportReviewList(reviewBoardReqPage);
		return ResponseEntity.ok(map);
	}
	
}
