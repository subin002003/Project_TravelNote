package kr.co.iei.personalboard.model.service;

import java.util.List;

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
		// TODO Auto-generated method stub
		return 0;
	}
}
