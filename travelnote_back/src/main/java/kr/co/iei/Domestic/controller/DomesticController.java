package kr.co.iei.Domestic.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import kr.co.iei.Domestic.model.service.DomesticService;

@CrossOrigin("*")  // CORS 설정
@RestController
@RequestMapping("/regions")
public class DomesticController {

    @Autowired
    private DomesticService domesticService;

    @GetMapping("/list/{reqPage}")
    public ResponseEntity<List> list(@PathVariable int reqPage) {
        List list = domesticService.getAllRegions(reqPage);
        return ResponseEntity.ok(list);
    }
    
}