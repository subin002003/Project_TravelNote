package kr.co.iei.foreignPlan.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.foreignPlan.model.service.ForeignPlanService;

@RestController
@RequestMapping(value="/foreignPlan")
public class ForeignPlanController {
	@Autowired
	private ForeignPlanService foreignPlanService;
	
	
}
