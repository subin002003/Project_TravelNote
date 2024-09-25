package kr.co.iei.Domestic.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.Domestic.model.dao.DomesticDao;
import kr.co.iei.Domestic.model.dto.ItineraryDTO;
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
    public ItineraryDTO getItinerary(int itineraryNo) {
    	ItineraryDTO itinerary = domesticDao.selectItinerary(itineraryNo);
    	return itinerary;
    }
	public List selectPlan(int itineraryNo, int planDay) {
			List list = domesticDao.selectPlan(itineraryNo, planDay);
			return list;
		}
	}