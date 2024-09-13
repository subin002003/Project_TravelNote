package kr.co.iei.user.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.user.model.dao.UserDao;

@Service
public class UserService {
	@Autowired
	private UserDao userDao;
}
