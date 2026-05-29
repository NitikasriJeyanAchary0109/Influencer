package com.influenceflow.controller;

import com.influenceflow.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/{brandId}")
    public Map<String, Object> getDashboardMetrics(@PathVariable String brandId) {
        return dashboardService.getDashboardMetrics(brandId);
    }
}
