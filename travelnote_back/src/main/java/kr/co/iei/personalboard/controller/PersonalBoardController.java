package kr.co.iei.personalboard.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
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
	
	@PostMapping(value = "/write", consumes = "multipart/form-data")
	public ResponseEntity<Integer> writePersonalBoard(
	        @ModelAttribute PersonalBoardDTO personalBoard, 
	        @RequestParam("personalBoardFileList") MultipartFile[] personalBoardFile) {

	    List<PersonalBoardFileDTO> personalBoardFileList = new ArrayList<>();
	    if (personalBoardFile != null && personalBoardFile.length > 0) {
	        String savepath = root + "/board/";
	        for (MultipartFile file : personalBoardFile) {
	            if (!file.isEmpty()) {
	                PersonalBoardFileDTO personalBoardFileDTO = new PersonalBoardFileDTO();
	                String filename = file.getOriginalFilename();
	                String filepath = fileUtil.upload(savepath, file);
	                personalBoardFileDTO.setPersonalBoardFilename(filename);
	                personalBoardFileDTO.setPersonalBoardFilepath(filepath);
	                personalBoardFileList.add(personalBoardFileDTO);
	            }
	        }
	    }

	    int result = personalBoardService.insertPersonalBoard(personalBoard, personalBoardFileList);
	    return ResponseEntity.ok(result);
	}

}
