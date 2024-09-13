package kr.co.iei.personalboard.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.personalboard.model.dao.PersonalBoardDao;

@Service
public class PersonalBoardService {
	@Autowired
	private PersonalBoardDao personalBoardDao;
}
