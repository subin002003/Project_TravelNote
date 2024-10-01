package kr.co.iei.admin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.personalboard.model.dto.PersonalBoardAnswerDTO;
import kr.co.iei.personalboard.model.dto.PersonalBoardDTO;
import kr.co.iei.personalboard.model.service.PersonalBoardService;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/admin")
public class AdminController {
	@Autowired
	private PersonalBoardService personalBoardService;
	
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
}
