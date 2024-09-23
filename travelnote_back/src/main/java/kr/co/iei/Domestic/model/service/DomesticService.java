package kr.co.iei.Domestic.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    // 여행 일정 저장
    public void saveItinerary(ItineraryDTO itineraryDTO) {
        domesticDao.insertItinerary(itineraryDTO);  // 수정된 메서드 호출
    }

    // 여행지 정보 조회
    public RegionDTO selectRegion(int regionNo) {
        return domesticDao.selectRegion(regionNo);
    }
    
    public ItineraryDTO getItinerary(int itineraryNo) {
        // DAO를 사용하여 일정 데이터를 가져오는 로직
        return domesticDao.selectItinerary(itineraryNo);
    }

}
