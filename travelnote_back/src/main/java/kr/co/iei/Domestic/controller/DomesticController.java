package kr.co.iei.Domestic.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.web.bind.annotation.*;

import kr.co.iei.Domestic.model.dto.CompanionDTO;
import kr.co.iei.Domestic.model.dto.ItineraryDTO;
import kr.co.iei.Domestic.model.dto.ItineraryInfoDTO;
import kr.co.iei.Domestic.model.dto.PlanDTO;
import kr.co.iei.Domestic.model.dto.RegionDTO;
import kr.co.iei.Domestic.model.service.DomesticService;
import kr.co.iei.user.model.dto.UserDTO;
import kr.co.iei.user.model.service.UserService;
import kr.co.iei.util.EmailSender;


@CrossOrigin("*")  // CORS 설정
@RestController
@RequestMapping("/domestic")
public class DomesticController {

    @Autowired
    private DomesticService domesticService;
    
    @Autowired
    private UserService userService;

    @Autowired
    private EmailSender emailSender;
    
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
    @GetMapping(value="/Schedule/{itineraryNo}")
    public ResponseEntity<ItineraryDTO> scheduleUpdate(@PathVariable int itineraryNo) {
        ItineraryDTO itinerary = domesticService.scheduleUpdate(itineraryNo);
        return ResponseEntity.ok(itinerary);
    }
    
    //불러온여행 일정 수정
    @PatchMapping(value="/itinerary/{itineraryNo}")
    public ResponseEntity<String> updateItinerary(@PathVariable int itineraryNo, @RequestBody ItineraryDTO itineraryDTO) {
        domesticService.updateItinerary(itineraryNo, itineraryDTO);
        return ResponseEntity.ok("일정이 성공적으로 수정되었습니다.");
    }
    
    //일정 관리 삭제
    @DeleteMapping(value="/planDelete/{itineraryNo}")
    public ResponseEntity<Integer> planDelete(@PathVariable int itineraryNo){
    	domesticService.planDelete(itineraryNo);
    	return ResponseEntity.ok(itineraryNo);
    }
    
    //동행자 추가 
    @PostMapping("/invite")
    public ResponseEntity<String> inviteCompanion(@RequestBody ItineraryDTO itinerary) {
        String userEmail = itinerary.getUserEmail();  // 초대할 동행자의 이메일
        
        // 이메일 전송 코드
        try {
            sendEmail(userEmail);  // 이메일 전송 메서드 호출
        } catch (Exception e) {
            e.printStackTrace(); // 예외 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이메일 전송에 실패했습니다.");
        }

        int itineraryNo = itinerary.getItineraryNo();
        // 이메일을 통해 사용자 정보 조회 (이미 등록된 사용자인지 확인)
        UserDTO user = userService.UserByEmail(userEmail);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("해당 이메일로 등록된 사용자가 없습니다.");
        }
        // 이미 동행자로 추가된 사용자인지 확인
        CompanionDTO companion = domesticService.findCompanion(itineraryNo, user.getUserNo());
        if (companion != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 동행자로 등록된 사용자입니다.");
        }
        // 동행자 추가
        CompanionDTO newCompanion = new CompanionDTO(0, itineraryNo, user.getUserNo());
        domesticService.addCompanion(newCompanion);
        return ResponseEntity.ok("동행자를 성공적으로 초대했습니다.");
    }

    // 이메일 전송 메서드
    private void sendEmail(String toEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("여행 초대");
        message.setText("여행 계획에 초대합니다.");
        emailSender.send(message); // 이메일 전송
    }

}