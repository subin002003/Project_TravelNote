package kr.co.iei.personalboard.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.personalboard.model.dao.PersonalBoardDao;
import kr.co.iei.personalboard.model.dto.PersonalBoardAnswerDTO;
import kr.co.iei.personalboard.model.dto.PersonalBoardDTO;
import kr.co.iei.personalboard.model.dto.PersonalBoardFileDTO;
import kr.co.iei.util.PageInfo;
import kr.co.iei.util.PageUtil;

@Service
public class PersonalBoardService {
	@Autowired
	private PersonalBoardDao personalBoardDao;
	@Autowired
	private PageUtil pageUtil;
	
	@Transactional
	public int insertPersonalBoard(PersonalBoardDTO personalBoard, List<PersonalBoardFileDTO> personalBoardFileList) {
		int result = personalBoardDao.insertPersonalBoard(personalBoard);
		for(PersonalBoardFileDTO personalBoardFile : personalBoardFileList) {
			personalBoardFile.setPersonalBoardNo(personalBoard.getPersonalBoardNo());
			result += personalBoardDao.insertPersonalBoardFile(personalBoardFile);
		}
		return result;
	}

	public Map selectBoardList(int personalBoardReqPage, String userNick) {
		int numPerPage = 3;
		int pageNaviSize = 3;
		int totalCount = personalBoardDao.totalCount(userNick);
		PageInfo pi = pageUtil.getPageInfo(personalBoardReqPage, numPerPage, pageNaviSize, totalCount);
		pi.setUserNick(userNick);
		List list = personalBoardDao.selectPersonalBoardList(pi);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list", list);
		map.put("pi",pi);
		return map;
	}

	public PersonalBoardDTO selectOnePersonalBoard(int personalBoardNo) {
		PersonalBoardDTO personalBoard = personalBoardDao.selectOnePersonalBoard(personalBoardNo);
		List<PersonalBoardFileDTO> personalBoardFileList = personalBoardDao.selectOnePersonalBoardFile(personalBoardNo);
		personalBoard.setPersonalBoardFileList(personalBoardFileList);
		return personalBoard;
	}

	public PersonalBoardAnswerDTO getPersonalBoardAnswer(int personalBoardNo) {
		PersonalBoardAnswerDTO personalBoardAnswer = personalBoardDao.getPersonalBoardAnswer(personalBoardNo);
		
		return personalBoardAnswer;
	}
	
	@Transactional
	public int deletePersonalBoard(int personalBoardNo) {
		int result = personalBoardDao.deletePersonalBoard(personalBoardNo);
		return result;
	}

	public PersonalBoardFileDTO getPersonalBoardFile(int personalBoardFileNo) {
		PersonalBoardFileDTO personalBoardFile = personalBoardDao.getPersonalBoardFile(personalBoardFileNo);
		return personalBoardFile;
	}


	public Map selectPersonalBoardList(int reqPage) {
		int numPerPage = 10;
		int pageNaviSize = 5;
		int totalCount = personalBoardDao.personalBoardTotalCount();
		PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List list = personalBoardDao.selectAllPersonalBoardList(pi);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list", list);
		map.put("pi",pi);
		return map;
	}

	@Transactional
	public int insertPersonalBoardAnswer(PersonalBoardAnswerDTO personalBoardAnswer) {
		int result = personalBoardDao.insertPersonalBoardAnswer(personalBoardAnswer);
		return result;
	}
	
	@Transactional
	public int updatePersonalBoardAnswerInfo(int personalBoardNo) {
		int result = personalBoardDao.updatePersonalBoardAnswerInfo(personalBoardNo);
		return result;
	}

	@Transactional
	public int deletePersonalBoardAnswer(int personalBoardNo) {
		int result = personalBoardDao.deletePersonalBoardAnswer(personalBoardNo);
		return result;
	}
	
	@Transactional
	public int updatePersonalBoardAnswerInfo2(int personalBoardNo) {
		int result = personalBoardDao.updatePersonalBoardAnswerInfo2(personalBoardNo);
		return result;
	}
	

	@Transactional
	public int updatePersonalBoardAnswer(PersonalBoardAnswerDTO personalBoardAnswer) {
		int result = personalBoardDao.updatePersonalBoardAnswer(personalBoardAnswer);
		return result;
	}
}
