package kr.co.iei.personalboard.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.personalboard.model.dto.PersonalBoardDTO;
import kr.co.iei.personalboard.model.dto.PersonalBoardFileDTO;
import kr.co.iei.personalboard.model.service.PersonalBoardService;
import kr.co.iei.util.FileUtils;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/personalBoard")
public class PersonalBoardController {
	@Autowired
	private PersonalBoardService personalBoardService;
	
	@Autowired
	private FileUtils fileUtil;
	
	@Value("${file.root}")
	public String root;
	
	@PostMapping
	public ResponseEntity<Boolean> insertBoard(@ModelAttribute PersonalBoardDTO board, 
	                                           @ModelAttribute MultipartFile[] personalBoardFileList) {
		System.out.println(board);
		System.out.println(personalBoardFileList);
	    return ResponseEntity.ok(true);
	}
	
	@GetMapping(value = "/list/{personalBoardReqPage}")
	public ResponseEntity<Map> list(@PathVariable int personalBoardReqPage, @RequestBody String userEmail){
		Map map = personalBoardService.selectBoardList(personalBoardReqPage, userEmail);
		return ResponseEntity.ok(map);
	}

}
