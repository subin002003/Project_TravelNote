package kr.co.iei.pay.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.pay.model.dto.PayDTO;
import kr.co.iei.pay.model.service.PayService;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/pay")
public class PayController {
	@Autowired
	private PayService payService;
	
	@PostMapping(value="/saveOrder")
	public ResponseEntity<Integer> payment(@ModelAttribute PayDTO pay) {
		System.out.println(pay);
		int result = payService.payment(pay);
		return ResponseEntity.ok(result);
	}
}
