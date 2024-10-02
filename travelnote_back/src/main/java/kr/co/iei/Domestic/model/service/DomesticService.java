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
import kr.co.iei.Domestic.model.dto.EditPlanDTO;
import kr.co.iei.Domestic.model.dto.ItineraryDTO;
import kr.co.iei.Domestic.model.dto.ItineraryInfoDTO;
import kr.co.iei.Domestic.model.dto.PlanDTO;
import kr.co.iei.Domestic.model.dto.RegionDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignEditPlanDTO;


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
    
	public List selectPlan(int itineraryNo, int planDay) {
			List list = domesticDao.selectPlan(itineraryNo, planDay);
			return list;
		}
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
	
	@Transactional
	public void deletePlans(int planNo) {
	    domesticDao.deletePlans(planNo);
	}
	public int insertPlan(PlanDTO plan) {
		int result = domesticDao.insertPlan(plan);
		return result;
	}

}