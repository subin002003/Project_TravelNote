package kr.co.iei.Domestic.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import kr.co.iei.Domestic.model.dto.ItineraryDTO;
import kr.co.iei.Domestic.model.dto.RegionDTO;
import kr.co.iei.Domestic.model.service.DomesticService;


@CrossOrigin("*")  // CORS 설정
@RestController
@RequestMapping("/regions")
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
    public ResponseEntity<Integer> saveItinerary(@ModelAttribute ItineraryDTO itinerary) {
        int itineraryNo = domesticService.saveItinerary(itinerary);  // 일정 저장
        return ResponseEntity.ok(itineraryNo);
    }

 // 여행 일정 조회 
    @GetMapping("/getItinerary/{itineraryNo}")
    public ResponseEntity<ItineraryDTO> getItinerary(@PathVariable int itineraryNo) {
        ItineraryDTO itinerary = domesticService.getItinerary(itineraryNo);
        return ResponseEntity.ok(itinerary);
    }
}