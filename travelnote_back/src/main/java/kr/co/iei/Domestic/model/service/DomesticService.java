package kr.co.iei.Domestic.model.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import kr.co.iei.Domestic.model.dao.DomesticDao;

@Service
public class DomesticService {

    @Autowired
    private DomesticDao domesticDao;

    public List getAllRegions(int reqPage) {
        int itemNum = 8;
        int endNum = reqPage * itemNum;
        int startNum = endNum - itemNum + 1;
        List list = domesticDao.getAllRegions(startNum, endNum);
        return list;
    }
}