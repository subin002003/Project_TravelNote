package kr.co.iei.foreignPlan.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.foreignPlan.model.dto.ForeignEditPlanDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignItineraryDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignItineraryInfoDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignPlanDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignRegionDTO;

@Mapper
public interface ForeignPlanDao {
	
	int getTotalCount(String searchInput);

	List selectRegionList(int startNum, int endNum, String searchInput);

	ForeignRegionDTO selectOneRegion(int regionNo);

	int insertItinerary(ForeignItineraryDTO itinerary);

	ForeignItineraryInfoDTO selectOneItinerary(int itineraryNo);

	List selectPlanList(int itineraryNo, int planDay);

	int updatePlanInfo(ForeignEditPlanDTO foreignEditPlanDTO);

	int insertPlan(ForeignPlanDTO plan);


}
