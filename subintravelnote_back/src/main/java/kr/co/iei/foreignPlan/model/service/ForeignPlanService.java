package kr.co.iei.foreignPlan.model.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import kr.co.iei.foreignPlan.model.dao.ForeignPlanDao;
import kr.co.iei.foreignPlan.model.dto.ForeignEditPlanDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignItineraryDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignItineraryInfoDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignPlanChangeSeqDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignPlanDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignRegionDTO;

@Service
public class ForeignPlanService {
	@Autowired
	private ForeignPlanDao foreignPlanDao;

	// 여행지 개수 조회
	public int getTotalCount(String searchInput) {
		int totalCount = foreignPlanDao.getTotalCount(searchInput);
		return totalCount;
	}

	// 여행지 목록 6개씩 조회
	public List selectRegionList(int reqPage, String searchInput) {
		int itemNum = 6;
		int endNum = reqPage * itemNum;
		int startNum = endNum - itemNum + 1;
		List list = foreignPlanDao.selectRegionList(startNum, endNum, searchInput);
		return list;
	}

	// 여행지 정보 조회
	public ForeignRegionDTO selectOneRegion(int regionNo) {
		ForeignRegionDTO region = foreignPlanDao.selectOneRegion(regionNo);
		return region;
	}

	// 여행 일정 생성
	@Transactional
	public int insertItinerary(ForeignItineraryDTO itinerary) {
		foreignPlanDao.insertItinerary(itinerary);
		return itinerary.getItineraryNo();
	}

	// 여행 일정 조회
	public ForeignItineraryInfoDTO selectOneItinerary(int itineraryNo) {
		ForeignItineraryInfoDTO itinerary = foreignPlanDao.selectOneItinerary(itineraryNo);
		return itinerary;
	}

	// 일정 목록 조회
	public List selectPlanList(int itineraryNo, int planDay) {
		List list = foreignPlanDao.selectPlanList(itineraryNo, planDay);
		return list;
	}

	// 일정 메모, 시간 수정
	@Transactional
	public boolean updatePlanInfo(String planListStr) {
		// Json 문자열로 받은 배열 변환
		List<ForeignEditPlanDTO> editPlanList = new ArrayList();
		Gson gson = new Gson();
		JsonArray planListArr = JsonParser.parseString(planListStr).getAsJsonArray();
		for (JsonElement jsonPlan : planListArr) {
			ForeignEditPlanDTO plan = gson.fromJson(jsonPlan, ForeignEditPlanDTO.class);
			editPlanList.add(plan);
		}
		
		// DB 작업
		int result = 0;
		for (int i = 0; i < editPlanList.size(); i ++) {		
			result += foreignPlanDao.updatePlanInfo(editPlanList.get(i));
		}
		if (editPlanList.size() == result) {
			return true;
		}
		return false;
	}

	// 일정에 장소 추가
	@Transactional
	public int insertPlace(ForeignPlanDTO plan) {
		int result = foreignPlanDao.insertPlan(plan);
		return result;
	}

	// 일정에 항공편 추가
	@Transactional
	public boolean insertFlights(ArrayList<ForeignPlanDTO> flightInfo) {
		int result = 0;
		for (int i = 0; i < flightInfo.size(); i++) {
			result += foreignPlanDao.insertPlan(flightInfo.get(i));
		}
		return (result == 2);
	}

	// 일정 삭제
	@Transactional
	public boolean deletePlan(int planNo) {
		int result = 0;
		// planNo와 같은 itineraryNo, planDay를 가지면서 planSeq이 planNo보다 큰 일정들의 planSeq 조정
		ForeignPlanDTO delPlan = foreignPlanDao.selectChangeList(planNo);
		for (int i = 0; i < delPlan.getChangeSeqList().size(); i++) {
			ForeignPlanChangeSeqDTO changePlan = delPlan.getChangeSeqList().get(i);
			result += foreignPlanDao.changeSeq(changePlan);
		}
		// 해당 일정 삭제
		result += foreignPlanDao.deletePlan(planNo);
		// 결과 처리
		if (result == delPlan.getChangeSeqList().size() + 1) {
			return true;
		} else {
			return false;
		}
	}

	// 일정 수정
	@Transactional
	public int updateItinerary(ForeignItineraryDTO itinerary) {
		int result = foreignPlanDao.updateItinerary(itinerary);
		return result;
	}
	
	// 일정 삭제
	@Transactional
	public boolean deleteItinerary(int itineraryNo) {
		int result = foreignPlanDao.deleteItinerary(itineraryNo);
		if (result > 0) {
			return true;
		} else {
		return false;
		}
	}

	// 동행자 추가
	@Transactional
	public int insertCompanion(int itineraryNo, String memberEmail) {
		int result = foreignPlanDao.insertCompanion(itineraryNo, memberEmail);
		return result;
	}

	// 일정 조회 권한 확인
	public int checkUser(int itineraryNo, String userEmail) {
		int result = foreignPlanDao.checkUser(itineraryNo, userEmail);
		if (result > 0) {
			return 1;
		} else {
			result = foreignPlanDao.checkCompanion(itineraryNo, userEmail);
			if (result > 0) {
				return 0;
			}
		}
		return -1;
	}

	// 일정 순서 하나 위로 변경
	public boolean changeSeqUp(int planNo) {
		int result = foreignPlanDao.changePrevSeqDown(planNo);
		result += foreignPlanDao.changeSeqUp(planNo);
		if (result == 2) {
			return true;
		} else {
			return false;
		}
	}

	// 일정 순서 하나 아래로 변경
	public boolean changeSeqDown(int planNo) {
		int result = foreignPlanDao.changeNextSeqUp(planNo);
		result += foreignPlanDao.changeSeqDown(planNo);
		if (result == 2) {
			return true;
		} else {
			return false;
		}
	}
}
