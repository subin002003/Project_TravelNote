package kr.co.iei.Domestic.model.dao;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import kr.co.iei.Domestic.model.dto.ItineraryDTO;
import kr.co.iei.Domestic.model.dto.RegionDTO;

@Mapper
public interface DomesticDao {

    // 지역 리스트 가져오기
    List<RegionDTO> getAllRegions(int startNum, int endNum);

    // 일정 저장
    int saveItinerary(ItineraryDTO itinerary);

    // 일정 조회 메서드 (추가된 기능)
    ItineraryDTO selectItinerary(int itineraryNo);

    // 여행지 정보 조회
    RegionDTO selectRegion(int regionNo);
}