package kr.co.iei.personalboard.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.personalboard.model.dao.PersonalBoardDao;
import kr.co.iei.personalboard.model.dto.PersonalBoardDTO;
import kr.co.iei.personalboard.model.dto.PersonalBoardFileDTO;

@Service
public class PersonalBoardService {
	@Autowired
	private PersonalBoardDao personalBoardDao;
	
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
		int numPerPage = 5;
		int pageNaviSize = 3;
		int totalCount = personalBoardDao.totalCount(userNick);
		return null;
	}
}
