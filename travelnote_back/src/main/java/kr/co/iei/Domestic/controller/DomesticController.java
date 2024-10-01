package kr.co.iei.Domestic.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import kr.co.iei.Domestic.model.dto.ItineraryDTO;
import kr.co.iei.Domestic.model.dto.ItineraryInfoDTO;
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
    //상세일정 수정
    @PatchMapping(value="/updatePlan")
    public ResponseEntity<Boolean> updatePlan(@RequestBody String updateList){
    	boolean result = domesticService.updatePlan(updateList);
		return ResponseEntity.ok(result);
    }
    //기차편 리스트 검색
    @GetMapping(value="/search")
    public ResponseEntity<List<RegionDTO>> search(){
    	List<RegionDTO> list = domesticService.search();
    	return ResponseEntity.ok(list);
    }
}