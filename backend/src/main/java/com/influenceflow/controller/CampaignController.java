package com.influenceflow.controller;

import com.influenceflow.entity.Campaign;
import com.influenceflow.service.CampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {

    @Autowired
    private CampaignService campaignService;

    @GetMapping
    public List<Campaign> getAllCampaigns() {
        return campaignService.getAllCampaigns();
    }

    @GetMapping("/brand/{brandId}")
    public List<Campaign> getCampaignsByBrand(@PathVariable String brandId) {
        return campaignService.getCampaignsByBrand(brandId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campaign> getCampaignById(@PathVariable String id) {
        return campaignService.getCampaignById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Campaign createCampaign(@RequestBody Campaign campaign) {
        return campaignService.saveCampaign(campaign);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Campaign> updateCampaign(@PathVariable String id, @RequestBody Campaign campaignDetails) {
        return campaignService.getCampaignById(id)
                .map(campaign -> {
                    campaign.setTitle(campaignDetails.getTitle());
                    campaign.setDescription(campaignDetails.getDescription());
                    campaign.setStartDate(campaignDetails.getStartDate());
                    campaign.setEndDate(campaignDetails.getEndDate());
                    campaign.setStatus(campaignDetails.getStatus());
                    campaign.setBudget(campaignDetails.getBudget());
                    return ResponseEntity.ok(campaignService.saveCampaign(campaign));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable String id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.ok().build();
    }
}
