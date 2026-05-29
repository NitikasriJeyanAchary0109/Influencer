package com.influenceflow.controller;

import com.influenceflow.service.ROIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private ROIService roiService;

    @GetMapping("/roi")
    public Map<String, Double> calculateROI(@RequestParam double revenue, @RequestParam double spend) {
        Map<String, Double> result = new HashMap<>();
        result.put("roi", roiService.calculateROI(revenue, spend));
        return result;
    }

    @GetMapping("/cpe")
    public Map<String, Double> calculateCPE(@RequestParam double payment, @RequestParam long engagements) {
        Map<String, Double> result = new HashMap<>();
        result.put("cpe", roiService.calculateCPE(payment, engagements));
        return result;
    }
}
