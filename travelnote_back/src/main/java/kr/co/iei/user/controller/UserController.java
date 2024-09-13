package kr.co.iei.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.user.model.service.UserService;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/user")
public class UserController {
	@Autowired
	private UserService userService;
}
