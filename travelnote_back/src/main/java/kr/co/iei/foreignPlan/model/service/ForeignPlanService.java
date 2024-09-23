package kr.co.iei.foreignPlan.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.foreignPlan.model.dao.ForeignPlanDao;
import kr.co.iei.foreignPlan.model.dto.ForeginItineraryInfoDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignItineraryDTO;
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
		int result = foreignPlanDao.insertItinerary(itinerary);
		return itinerary.getItineraryNo();
	}

	// 여행 일정 조회
	public ForeginItineraryInfoDTO selectOneItinerary(int itineraryNo) {
		ForeginItineraryInfoDTO itinerary = foreignPlanDao.selectOneItinerary(itineraryNo);
		return itinerary;
	}

}
