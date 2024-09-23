package kr.co.iei.Domestic.model.dao;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import kr.co.iei.Domestic.model.dto.ItineraryDTO;
import kr.co.iei.Domestic.model.dto.RegionDTO;

@Mapper
public interface DomesticDao {

    // 지역 리스트 가져오기
    List getAllRegions(int startNum, int endNum);

    // 일정 저장
    int insertItinerary(ItineraryDTO itineraryDTO);

	RegionDTO selectRegion(int regionNo);

	ItineraryDTO selectItinerary(int itineraryNo);
}