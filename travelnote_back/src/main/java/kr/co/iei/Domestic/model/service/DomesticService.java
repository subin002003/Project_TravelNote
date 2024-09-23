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
        List<RegionDTO> list = domesticDao.getAllRegions(startNum, endNum);
        return list;
    }
    @Transactional
    // 여행 일정 저장
    public int saveItinerary(ItineraryDTO itinerary) {
        domesticDao.saveItinerary(itinerary);  // 수정된 메서드 호출
        return itinerary.getItineraryNo();
    }


    // 여행지 정보 조회
    public RegionDTO selectRegion(int regionNo) {
        RegionDTO region = domesticDao.selectRegion(regionNo);
    	return region;
    }

}
