package kr.co.iei.Domestic.model.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import kr.co.iei.Domestic.model.dao.DomesticDao;
import kr.co.iei.Domestic.model.dto.CompanionDTO;
import kr.co.iei.Domestic.model.dto.EditPlanDTO;
import kr.co.iei.Domestic.model.dto.ItineraryDTO;
import kr.co.iei.Domestic.model.dto.ItineraryInfoDTO;
import kr.co.iei.Domestic.model.dto.PlanDTO;
import kr.co.iei.Domestic.model.dto.RegionDTO;


@Service
public class DomesticService {

    @Autowired
    private DomesticDao domesticDao;

    // 페이지 번호에 따른 지역 리스트 가져오기
    public List<RegionDTO> getAllRegions(int reqPage) {
        int itemNum = 8; // 첫 페이지 사진 갯수
        int endNum = reqPage * itemNum;
        int startNum = endNum - itemNum + 1;
        List list = domesticDao.getAllRegions(startNum, endNum);
        return list;
    }
    // 여행지 정보 조회
    public RegionDTO selectRegion(int regionNo) {
    	return domesticDao.selectRegion(regionNo);
    }

    @Transactional
    // 여행 일정 저장
    public int saveItinerary(ItineraryDTO itinerary) {
        domesticDao.saveItinerary(itinerary);
        return itinerary.getItineraryNo();
    }

    // 일정 조회 메서드
    public ItineraryInfoDTO getItinerary(int itineraryNo) {
    	ItineraryInfoDTO itinerary = domesticDao.getItinerary(itineraryNo);
    	return itinerary;
    }
    
    //상세 일정 조회
	public List selectPlan(int itineraryNo, int planDay) {
			List list = domesticDao.selectPlan(itineraryNo, planDay);
			return list;
		}
	//상세 일정 수정
	@Transactional
	public boolean updatePlan(String updateList) {
		// Json 문자열로 받은 배열 변환
		List<EditPlanDTO> editList = new ArrayList<>();
		Gson gson = new Gson();
		JsonArray planListArr = JsonParser.parseString(updateList).getAsJsonArray();
		for (JsonElement jsonPlan : planListArr) {
			EditPlanDTO plan = gson.fromJson(jsonPlan, EditPlanDTO.class);
			editList.add(plan);
		}
		int result = 0;
		for (int i = 0; i < editList.size(); i ++) {		
			result += domesticDao.updatePlan(editList.get(i));
		}
		return editList.size() == result;
		}
	//상세 일정 삭제
	@Transactional
	public void deletePlans(int planNo) {
	    domesticDao.deletePlans(planNo);
	}
	//상세 일정 추가
	public int insertPlan(PlanDTO plan) {
		int result = domesticDao.insertPlan(plan);
		return result;
	}
	
	//일정 관리 조회
	public ItineraryDTO scheduleUpdate(int itineraryNo) {
		ItineraryDTO itinerary = domesticDao.scheduleUpdate(itineraryNo);
		return itinerary;
	}
	
	//일정 관리 수정
	public void updateItinerary(int itineraryNo, ItineraryDTO itineraryDTO) {
		itineraryDTO.setItineraryNo(itineraryNo);
	    domesticDao.updateItinerary(itineraryNo, itineraryDTO);
	}
	
	public void planDelete(int itineraryNo) {
		domesticDao.planDelete(itineraryNo);	
	}

	   // 동행자 추가 메서드
    public void addCompanion(CompanionDTO companion) {
        domesticDao.insertCompanion(companion);
    }

    // 이미 추가된 동행자인지 확인하는 메서드
    public CompanionDTO findCompanion(int itineraryNo, int userNo) {
        return domesticDao.selectCompanion(itineraryNo, userNo);
    }

}