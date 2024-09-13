package kr.co.iei.faqboard.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.faqboard.model.dao.FaqBoardDao;

@Service
public class FaqBoardService {
	@Autowired
	private FaqBoardDao faqBaordDao;
	
}
