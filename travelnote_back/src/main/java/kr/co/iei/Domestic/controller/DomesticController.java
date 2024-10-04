package kr.co.iei.Domestic.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import kr.co.iei.Domestic.model.dto.ItineraryDTO;
import kr.co.iei.Domestic.model.dto.ItineraryInfoDTO;
import kr.co.iei.Domestic.model.dto.PlanDTO;
import kr.co.iei.Domestic.model.dto.RegionDTO;
import kr.co.iei.Domestic.model.service.DomesticService;


@CrossOrigin("*")  // CORS 설정
@RestController
@RequestMapping("/domestic")
public class DomesticController {

    @Autowired
    private DomesticService domesticService;

    // 지역 리스트를 조회
    @GetMapping("/list/{reqPage}")
    public ResponseEntity<List<RegionDTO>> list(@PathVariable int reqPage) {
        List<RegionDTO> list = domesticService.getAllRegions(reqPage);
        return ResponseEntity.ok(list);
    }
    
    // 여행지 정보 조회 
    @GetMapping("/view/{regionNo}")
    public ResponseEntity<RegionDTO> view(@PathVariable int regionNo) {
    	 System.out.println("Received request for regionNo: " + regionNo); // 로그 추가
    	RegionDTO region = domesticService.selectRegion(regionNo);
    	return ResponseEntity.ok(region);
    }

    // 여행 일정 저장 
    @PostMapping("/Schedule")
    public ResponseEntity<Integer> saveItinerary(@RequestBody ItineraryDTO itinerary) {
        int itineraryNo = domesticService.saveItinerary(itinerary);  // 일정 저장
        return ResponseEntity.ok(itineraryNo);
    }

    // 여행 상세일정 조회 
    @GetMapping(value="/getItinerary/{itineraryNo}")
    public ResponseEntity<ItineraryInfoDTO> getItinerary(@PathVariable int itineraryNo) {
        ItineraryInfoDTO itinerary = domesticService.getItinerary(itineraryNo);
        return ResponseEntity.ok(itinerary);
    }
    
    // 상세일정 리스트
    @GetMapping(value="/plan")
	public ResponseEntity<List> plan(@RequestParam int itineraryNo, int planDay){
		List list = domesticService.selectPlan(itineraryNo, planDay);
		return ResponseEntity.ok(list);
	}
    
    //상세 일정 추가
    @PostMapping(value="/insertPlan")
    public ResponseEntity<Integer> insertPlan(@RequestBody PlanDTO plan){
    	int result = domesticService.insertPlan(plan);
    	return ResponseEntity.ok(result);
    }
    
    //상세일정 수정
    @PatchMapping(value="/updatePlan")
    public ResponseEntity<Boolean> updatePlan(@RequestBody String updateList){
    	boolean result = domesticService.updatePlan(updateList);
		return ResponseEntity.ok(result);
    }

    //상세 일정 삭제
    @DeleteMapping(value="/deletePlans/{planNo}")
    public ResponseEntity<Integer> deletePlans(@PathVariable int planNo){
    	domesticService.deletePlans(planNo);
    	return ResponseEntity.ok(planNo);
    }
    
    //불러온 여행 일정 조회
    @GetMapping(value="/itinerary/{regionNo}")
    public ResponseEntity<List<ItineraryDTO>> scheduleUpdate(@PathVariable int regionNo) {
        List<ItineraryDTO> region = domesticService.scheduleUpdate(regionNo);
        return ResponseEntity.ok(region);
    }
    
    //불러온여행 일정 수정
    @PatchMapping(value="/itinerary/{itineraryNo}")
    public ResponseEntity<String> updateItinerary(@PathVariable int itineraryNo, @RequestBody ItineraryDTO itineraryDTO) {
        domesticService.updateItinerary(itineraryNo, itineraryDTO);
        return ResponseEntity.ok("일정이 성공적으로 수정되었습니다.");
    }
}