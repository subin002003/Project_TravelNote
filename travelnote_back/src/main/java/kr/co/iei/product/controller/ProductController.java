package kr.co.iei.product.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.product.model.dto.ProductDTO;
import kr.co.iei.product.model.dto.ProductFileDTO;
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
	
	// 패키지 상품 목록
	@GetMapping(value="/list/{reqPage}")
	public ResponseEntity<Map> list(@PathVariable int reqPage){
		// 조회 결과는 게시물목록, pageNavi생성 시 필요한 데이터들
		Map map = productService.selectProductList(reqPage);
		return ResponseEntity.ok(map);
	}
	
	// 첨부파일
	@PostMapping(value="/editorImage")
	public ResponseEntity<String> editorImage(@ModelAttribute MultipartFile image){
		String savepath = root + "/product/editor/";
		String filepath = fileUtils.upload(savepath, image);
		return ResponseEntity.ok("/product/editor/" + filepath);
	}
	
	// 상품 등록
	@PostMapping
	public ResponseEntity<Boolean> insertProduct(@ModelAttribute ProductDTO product, @ModelAttribute MultipartFile thumbnail, @ModelAttribute MultipartFile[] productFile){
		if(thumbnail != null) {
			String savepath = root+"/product/thumb/";
			String filepath = fileUtils.upload(savepath, thumbnail);
			product.setProductThumb(filepath);
		}
		List<ProductFileDTO> productFileList = new ArrayList<ProductFileDTO>();
		if(productFile != null) {
			String savepath = root+"/product/";
			for(MultipartFile file : productFile) {
				ProductFileDTO fileDTO = new ProductFileDTO();
				String filename = file.getOriginalFilename();
				String filepath = fileUtils.upload(savepath, file);
				fileDTO.setFilename(filename);
				fileDTO.setFilepath(filepath);
				productFileList.add(fileDTO);
			}
		}
		int result = productService.insertProduct(product, productFileList);
		return ResponseEntity.ok(result == 1 + productFileList.size());
	}
	
	@GetMapping(value="/productNo/{productNo}")
	public ResponseEntity<ProductDTO> selectOneProduct(@PathVariable int productNo){
		ProductDTO product = productService.selectOneProduct(productNo);
		return ResponseEntity.ok(product);
	}
	
	@DeleteMapping(value="/{productNo}")
	public ResponseEntity<Integer> deleteProduct(@PathVariable int productNo) {
		List<ProductFileDTO> delFileList = productService.deleteProduct(productNo);
		if(delFileList != null) {
			String savepath = root + "/product/";
			for(ProductFileDTO productFile : delFileList) {
				File delFile = new File(savepath+productFile.getFilepath());
				delFile.delete();
			}
			return ResponseEntity.ok(1);
		}else {
			return ResponseEntity.ok(0);
		}
	}
	
	@PatchMapping
	public ResponseEntity<Boolean> updateProduct(@ModelAttribute ProductDTO product, @ModelAttribute MultipartFile thumbnail, @ModelAttribute MultipartFile[] productFile){
		System.out.println(product.getProductStatus());
		if(thumbnail != null) {
			String savepath = root + "/product/thumb/";
			String filepath = fileUtils.upload(savepath, thumbnail);
			product.setProductThumb(filepath);
		}
		List<ProductFileDTO> productFileList = new ArrayList<ProductFileDTO>();
		if(productFile != null) {
			String savepath = root+"/product/";
			for(MultipartFile file : productFile){
				ProductFileDTO productFileDTO = new ProductFileDTO();
				String filename = file.getOriginalFilename();
				String filepath = fileUtils.upload(savepath, file);
				productFileDTO.setFilename(filename);
				productFileDTO.setFilepath(filepath);
				productFileDTO.setProductNo(product.getProductNo());
				productFileList.add(productFileDTO);
			}
		}
		List<ProductFileDTO> delFileList = productService.updateProduct(product, productFileList);
		if(delFileList != null) {
			String savepath = root+"/product/";
			for(ProductFileDTO deleteFile : delFileList) {
				File delFile = new File(savepath + deleteFile.getFilepath());
				delFile.delete();
			}
			return ResponseEntity.ok(true);
		}else {
			return ResponseEntity.ok(false);
		}
	}
	
}
