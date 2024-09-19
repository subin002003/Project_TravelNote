package kr.co.iei.Domestic.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.Domestic.model.service.DomesticService;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/domestic")
public class DomesticController {
	@Autowired
	private DomesticService domestivService;
}
