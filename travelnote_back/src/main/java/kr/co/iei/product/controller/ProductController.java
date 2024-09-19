package kr.co.iei.product.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.product.model.service.ProductService;
import kr.co.iei.util.FileUtils;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/product")
public class ProductController {
	@Autowired
	private ProductService productService;
	
	@Autowired
	private FileUtils fileUtils;
	
	@Value("${file.root}")
	public String root;
	
	@GetMapping(value="/list/{reqPage}")
	public ResponseEntity<Map> list(@PathVariable int reqPage){
		// 조회 결과는 게시물목록, pageNavi생성 시 필요한 데이터들
		Map map = productService.selectProductList(reqPage);
		return ResponseEntity.ok(map);
	}
	
	// 첨부파일
	@PostMapping(value="editorImage")
	public ResponseEntity<String> editorImage(@ModelAttribute MultipartFile image){
		String savepath = root + "/editor/";
		String filepath = fileUtils.upload(savepath, image);
		return ResponseEntity.ok("/editor/" + filepath);
	}
}
