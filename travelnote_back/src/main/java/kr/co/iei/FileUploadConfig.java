package kr.co.iei;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;

import jakarta.servlet.MultipartConfigElement;

import org.springframework.web.multipart.support.StandardServletMultipartResolver;


import java.io.File;

@Configuration
public class FileUploadConfig {

	@Bean
	public StandardServletMultipartResolver multipartResolver() {
	    return new StandardServletMultipartResolver();
	}
	
	@Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setLocation("C:/Temp/travelNote"); // 임시 파일 저장 위치
        return factory.createMultipartConfig();
    }
    
    
}
