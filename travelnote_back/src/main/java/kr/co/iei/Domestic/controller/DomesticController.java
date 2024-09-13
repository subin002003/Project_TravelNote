package kr.co.iei.Domestic.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.Domestic.model.service.DomesticService;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/domestic")
public class DomesticController {

	private DomesticService domestivService;
}
