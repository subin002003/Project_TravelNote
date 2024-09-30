package kr.co.iei.personalboard.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.personalboard.model.dao.PersonalBoardDao;
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
		System.out.println("map 잘나오나요 ? : "+map);
		return map;
	}
}
