package kr.co.iei.util;

import java.io.UnsupportedEncodingException;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Component
public class EmailSender {
	@Autowired
	private JavaMailSender sender;
	
	public void sendMail(String emailTitle, String receiver, String emailContent) {
		MimeMessage message = sender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);
		
		try {
			//언제 보냈는지
			helper.setSentDate(new Date());
			//누가
			helper.setFrom(new InternetAddress("travelnote0919@gmail.com", "TravelNote 인증 메일"));
			//누구에게
			helper.setTo(receiver);
			//제목
			helper.setSubject(emailTitle);
			//내용
			helper.setText(emailContent, true);
			//이메일 전송 코드
			sender.send(message);
		} catch (MessagingException e) {
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
	}
<<<<<<< HEAD
	
	public int sendInvitation(String emailTitle, String receiver, String emailContent) {
		MimeMessage message = sender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);
		
		try {
			helper.setSentDate(new Date());
			helper.setFrom(new InternetAddress("travelnote0919@gmail.com", "TravelNote 초대 메일"));
			helper.setTo(receiver);
			helper.setSubject(emailTitle);
			helper.setText(emailContent, true);
			sender.send(message);
			return 1;
		} catch (MessagingException e) {
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return 0;
	}
=======

	public void send(SimpleMailMessage message) {
        try {
            message.setSentDate(new Date());
            message.setFrom("travelnote0919@gmail.com");
            sender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
>>>>>>> khj
}
