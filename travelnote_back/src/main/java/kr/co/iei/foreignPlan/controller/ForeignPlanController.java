package kr.co.iei.foreignPlan.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.foreignPlan.model.dto.ForeignItineraryDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignItineraryInfoDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignPlanDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignRegionDTO;
import kr.co.iei.foreignPlan.model.service.ForeignPlanService;
import kr.co.iei.user.model.service.UserService;

@RestController
@CrossOrigin("*")
@RequestMapping(value="/foreign")
public class ForeignPlanController {
	@Autowired
	private ForeignPlanService foreignPlanService;
	@Autowired
	private UserService userService;
	
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
	@GetMapping(value="/regionInfo/{regionNo}")
	public ResponseEntity<ForeignRegionDTO> regionInfo(@PathVariable int regionNo) {
		ForeignRegionDTO region = foreignPlanService.selectOneRegion(regionNo);
		return ResponseEntity.ok(region);
	}
	
	// 여행 일정 생성
	@PostMapping(value="/createItinerary")
	public ResponseEntity<Integer> createItinerary(@RequestBody ForeignItineraryDTO itinerary) {
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
	@PatchMapping(value="/editPlanInfo")
	public ResponseEntity<Boolean> editPlanInfo(@RequestBody String planListStr) {
		boolean result = foreignPlanService.updatePlanInfo(planListStr);
		return ResponseEntity.ok(result);
	}
	
	// 일정에 장소 추가
	@PostMapping(value="/addPlace")
	public ResponseEntity<Integer> addPlace(@RequestBody ForeignPlanDTO plan) {
		int result = foreignPlanService.insertPlace(plan);
		return ResponseEntity.ok(result);
	}
	
	// 일정에 항공편 추가
	@PostMapping(value="/addFlights")
	public ResponseEntity<Boolean> addFlights(@RequestBody ArrayList<ForeignPlanDTO> flightInfo) {
		boolean result = foreignPlanService.insertFlights(flightInfo);
		return ResponseEntity.ok(result);
	}
	
	// 일정 삭제
	@DeleteMapping(value="/deletePlan/{planNo}")
	public ResponseEntity<Boolean> deletePlan(@PathVariable int planNo){
		boolean result = foreignPlanService.deletePlan(planNo);
		return ResponseEntity.ok(result);
	}
	
	// 여행 일정 삭제
	@PostMapping(value="/editItinerary")
	public ResponseEntity<Integer> editItinerary(@RequestBody ForeignItineraryDTO itinerary) {
		int result = foreignPlanService.updateItinerary(itinerary);
		return ResponseEntity.ok(result);
	}
	
	// 여행 일정 삭제
	@DeleteMapping(value="/deleteItinerary/{itineraryNo}")
	public ResponseEntity<Boolean> deleteItinerary(@PathVariable int itineraryNo){
		boolean result = foreignPlanService.deleteItinerary(itineraryNo);
		return ResponseEntity.ok(result);
	}

	// 동행자 초대 보내기
	@GetMapping(value="/inviteCompanion")
	public ResponseEntity<Integer> inviteCompanion(@RequestParam int itineraryNo, String memberEmail, String userEmail){
		int result = -1;
		int userCount = userService.findUserByEmail(memberEmail);
		if (userCount > 0) {
			 result = userService.sendInvitation(memberEmail, userEmail); // 발송 성공 시 1, 실패 시 0 받아 옴
		}
		if (result > 0) {
			result = foreignPlanService.insertCompanion(itineraryNo, memberEmail); // insert 성공 시 1, 실패 시 0
		}
		// 결론적으로 이메일 발송, insert 모두 성공했을 때만 1 리턴
		return ResponseEntity.ok(result);
	}

	// 로그인한 유저의 해당 여행 일정 조회 권한 확인
	@GetMapping(value="/checkUser")
	public ResponseEntity<Integer> checkUser(@RequestParam int itineraryNo, String userEmail) {
		int result = foreignPlanService.checkUser(itineraryNo, userEmail); // 1이면 해당 일정 주인, 0이면 동행자, -1이면 권한 없음
		return ResponseEntity.ok(result);
	}
	
	// 일정 순서 하나 위로 변경
	@GetMapping(value="/changeSeqUp/{planNo}")
	public ResponseEntity<Boolean> changeSeqUp(@PathVariable int planNo) {
		boolean result = foreignPlanService.changeSeqUp(planNo);
		return ResponseEntity.ok(result);
	}
}
