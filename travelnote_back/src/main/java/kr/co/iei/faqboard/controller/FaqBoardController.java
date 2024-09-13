package kr.co.iei.faqboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.faqboard.model.service.FaqBoardService;

@CrossOrigin
@RestController
@RequestMapping(value = "/faqBoard")
public class FaqBoardController {
	@Autowired
	private FaqBoardService faqBoardService;
}
