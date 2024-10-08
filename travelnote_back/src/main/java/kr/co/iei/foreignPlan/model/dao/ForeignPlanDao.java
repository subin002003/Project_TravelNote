package kr.co.iei.foreignPlan.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.foreignPlan.model.dto.ForeignEditPlanDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignItineraryDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignItineraryInfoDTO;
import kr.co.iei.foreignPlan.model.dto.ForeignPlanChangeSeqDTO;
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

	int deletePlan(int planNo);

	ForeignPlanDTO selectChangeList(int planNo);

	int changeSeq(ForeignPlanChangeSeqDTO changePlan);

	int updateItinerary(ForeignItineraryDTO itinerary);

	int selectTotalPlanCount(int itineraryNo);

	int deleteItinerary(int itineraryNo);

	int checkUser(int itineraryNo, String userEmail);

	int checkCompanion(int itineraryNo, String userEmail);

	int insertCompanion(int itineraryNo, String memberEmail);

	int changePrevSeqDown(int planNo);

	int changeSeqUp(int planNo);

	int changeNextSeqUp(int planNo);

	int changeSeqDown(int planNo);


}
