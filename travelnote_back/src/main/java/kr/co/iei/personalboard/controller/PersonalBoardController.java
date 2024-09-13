package kr.co.iei.personalboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.personalboard.model.service.PersonalBoardService;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/personalBoard")
public class PersonalBoardController {
	@Autowired
	private PersonalBoardService personalBoardService;
	
}
