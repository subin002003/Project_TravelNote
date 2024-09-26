package kr.co.iei.foreignPlan.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.co.iei.foreignPlan.model.dto.ForeignItineraryDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignItineraryInfoDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignPlanDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignRegionDTO;
import kr.co.iei.foreignPlan.model.service.ForeignPlanService;

@RestController
@CrossOrigin("*")
@RequestMapping(value="/foreign")
public class ForeignPlanController {
	@Autowired
	private ForeignPlanService foreignPlanService;
	
	// 여행지 개수 조회
	@GetMapping(value="/totalCount")
	public ResponseEntity<Integer> totalCount(@RequestParam(required = false) String searchInput){
		int totalCount = foreignPlanService.getTotalCount(searchInput);
		return ResponseEntity.ok(totalCount);
	}
	
	// 여행지 목록 조회, 검색
	@GetMapping(value="/list/{reqPage}")
	public ResponseEntity<List> list(@PathVariable int reqPage, @RequestParam(required = false) String searchInput) {
		List list = foreignPlanService.selectRegionList(reqPage, searchInput);
		return ResponseEntity.ok(list);
	}
	
	// 여행지 정보 조회
	@GetMapping(value="/view/{regionNo}")
	public ResponseEntity<ForeignRegionDTO> view(@PathVariable int regionNo) {
		ForeignRegionDTO region = foreignPlanService.selectOneRegion(regionNo);
		return ResponseEntity.ok(region);
	}
	
	// 여행 일정 생성
	@PostMapping(value="/createItinerary")
	public ResponseEntity<Integer> createItinerary(@ModelAttribute ForeignItineraryDTO itinerary) {
		int itineraryNo = foreignPlanService.insertItinerary(itinerary);
		return ResponseEntity.ok(itineraryNo);
	}
	
	// 여행 일정 조회
	@GetMapping(value="/getItineraryInfo/{itineraryNo}")
	public ResponseEntity<ForeignItineraryInfoDTO> getItineraryInfo(@PathVariable int itineraryNo) {
		ForeignItineraryInfoDTO itinerary = foreignPlanService.selectOneItinerary(itineraryNo);
		return ResponseEntity.ok(itinerary);
	}
	
	// 일정 번호, Day 번호로 해당 날짜의 계획 조회
	@GetMapping(value="/getPlanList")
	public ResponseEntity<List> getPlanList(@RequestParam int itineraryNo, int planDay){
		List list = foreignPlanService.selectPlanList(itineraryNo, planDay);
		return ResponseEntity.ok(list);
	}
	
	// 배열 받아 메모, 시간 수정
//	@PostMapping(value="/editPlanInfo")
//	public ResponseEntity<Boolean> editPlanInfo(@ModelAttribute ForeignPlanDTO[] editPlanList) {
//		System.out.println(editPlanList);
//		boolean result = foreignPlanService.updatePlanInfo(editPlanList);
//		return ResponseEntity.ok(result);
//	}
	
	
}
