package kr.co.iei.foreignPlan.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.foreignPlan.model.dto.ForeignRegionDTO;
import kr.co.iei.foreignPlan.model.service.ForeignPlanService;

@RestController
@CrossOrigin("*")
@RequestMapping(value="/foreign")
public class ForeignPlanController {
	@Autowired
	private ForeignPlanService foreignPlanService;
	
	// 여행지 목록 조회
	@GetMapping(value="/list/{reqPage}")
	public ResponseEntity<List> list(@PathVariable int reqPage) {
		List list = foreignPlanService.selectRegionList(reqPage);
		return ResponseEntity.ok(list);
	}
	
	// 여행지 정보 조회
	@GetMapping(value="/view/{regionNo}")
	public ResponseEntity<ForeignRegionDTO> view(@PathVariable int regionNo) {
		ForeignRegionDTO region = foreignPlanService.selectOneRegion(regionNo);
		return ResponseEntity.ok(region);
	}
}
