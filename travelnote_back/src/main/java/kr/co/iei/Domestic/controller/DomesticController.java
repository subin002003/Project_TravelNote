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

    // 지역 리스트를 가져오는 메서드
    @GetMapping("/list/{reqPage}")
    public ResponseEntity<List<RegionDTO>> list(@PathVariable int reqPage) {
        List<RegionDTO> list = domesticService.getAllRegions(reqPage);
        return ResponseEntity.ok(list);
    }
    
    // 여행 일정 저장 메서드
    @PostMapping(value="/Schedule")
    public ResponseEntity<Integer> saveItinerary(@ModelAttribute ItineraryDTO itinerary) {
          int itineraryNo = domesticService.saveItinerary(itinerary);  // 일정 저장
           return ResponseEntity.ok(itineraryNo); 
    }

    // 여행지 정보 조회 메서드
    @GetMapping("/view/{regionNo}")
    public ResponseEntity<RegionDTO> view(@PathVariable int regionNo) {
        RegionDTO region = domesticService.selectRegion(regionNo);
       return ResponseEntity.ok(region);
    }
}
