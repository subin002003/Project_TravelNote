package kr.co.iei.personalboard.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.personalboard.model.dto.PersonalBoardAnswerDTO;
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
	
	@GetMapping(value = "/list/{personalBoardReqPage}")
	public ResponseEntity<Map> list(@PathVariable int personalBoardReqPage, @RequestParam String userNick){
		Map map = personalBoardService.selectBoardList(personalBoardReqPage, userNick);
		return ResponseEntity.ok(map);
	}
	
	@PostMapping
	public ResponseEntity<Boolean> insertPersonalBoard(@RequestParam("personalBoardTitle") String personalBoardTitle,
	        @RequestParam("personalBoardContent") String personalBoardContent,
	        @RequestParam("personalBoardWriter") String personalBoardWriter,
	        @RequestParam(value = "personalBoardFileList", required = false) MultipartFile[] personalBoardFileList) {

	    PersonalBoardDTO personalBoard = new PersonalBoardDTO();
	    personalBoard.setPersonalBoardContent(personalBoardContent);
	    personalBoard.setPersonalBoardTitle(personalBoardTitle);
	    personalBoard.setPersonalBoardWriter(personalBoardWriter);

	    List<PersonalBoardFileDTO> personalBoardFiles = new ArrayList<>();

	    // 파일이 있는 경우에만 처리
	    if (personalBoardFileList != null && personalBoardFileList.length > 0) {
	        String savepath = root + "/personalBoard/";
	        for (MultipartFile file : personalBoardFileList) {
	            if (!file.isEmpty()) {
	                PersonalBoardFileDTO fileDTO = new PersonalBoardFileDTO();
	                String filename = file.getOriginalFilename();
	                String filepath = fileUtil.upload(savepath, file);
	                fileDTO.setPersonalBoardFilename(filename);
	                fileDTO.setPersonalBoardFilepath(filepath);
	                personalBoardFiles.add(fileDTO);
	            }
	        }
	    }

	    int result = personalBoardService.insertPersonalBoard(personalBoard, personalBoardFiles);
	    return ResponseEntity.ok(result == 1 + personalBoardFiles.size());
	}
	
	@GetMapping(value="/view/{personalBoardNo}")
	public ResponseEntity<PersonalBoardDTO> viewPersonalBoard(@PathVariable int personalBoardNo){
		PersonalBoardDTO personalBoard = personalBoardService.selectOnePersonalBoard(personalBoardNo);
		return ResponseEntity.ok(personalBoard);
	}
	
	@GetMapping(value = "/getAnswer/{personalBoardNo}")
	public ResponseEntity<PersonalBoardAnswerDTO> getAnswer(@PathVariable int personalBoardNo){
		PersonalBoardAnswerDTO personalBoardAnswer = personalBoardService.getPersonalBoardAnser(personalBoardNo);
		return ResponseEntity.ok(personalBoardAnswer);
	}
	
	@DeleteMapping(value = "/{personalBoardNo}")
	public ResponseEntity<Integer> deletePersonalBoard(@PathVariable int personalBoardNo){
		int result = personalBoardService.deletePersonalBoard(personalBoardNo);
		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value = "/file/{personalBoardFileNo}")
	public ResponseEntity<Resource> filedown(@PathVariable int personalBoardFileNo) throws FileNotFoundException{
		PersonalBoardFileDTO personalBoardFile = personalBoardService.getPersonalBoardFile(personalBoardFileNo);
		String savepath = root+"/personalBoard/";
		File file = new File(savepath+personalBoardFile.getPersonalBoardFilepath());
		
		Resource resource = new InputStreamResource(new FileInputStream(file));
		
		HttpHeaders header = new HttpHeaders();
		header.add("Content-Disposition", "attachment; filename=\""+personalBoardFile.getPersonalBoardFilename()+"\"");
		header.add("Cache-Control", "no-cache, no-store, must-revalidate");
		header.add("Pragma", "no-cache");
		header.add("Expires", "0");
		
		return ResponseEntity.status(HttpStatus.OK)
				 .headers(header)
				 .contentLength(file.length())
				 .contentType(MediaType.APPLICATION_OCTET_STREAM)
				 .body(resource);
	}
}
