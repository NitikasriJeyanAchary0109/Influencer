package com.influenceflow.controller;

import com.influenceflow.entity.Influencer;
import com.influenceflow.service.InfluencerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/influencers")
public class InfluencerController {

    @Autowired
    private InfluencerService influencerService;

    @GetMapping
    public List<Influencer> getAllInfluencers() {
        return influencerService.getAllInfluencers();
    }

    @GetMapping("/brand/{brandId}")
    public List<Influencer> getInfluencersByBrand(@PathVariable String brandId) {
        return influencerService.getInfluencersByBrand(brandId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Influencer> getInfluencerById(@PathVariable String id) {
        return influencerService.getInfluencerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Influencer createInfluencer(@RequestBody Influencer influencer) {
        return influencerService.saveInfluencer(influencer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Influencer> updateInfluencer(@PathVariable String id, @RequestBody Influencer influencerDetails) {
        return influencerService.getInfluencerById(id)
                .map(influencer -> {
                    influencer.setName(influencerDetails.getName());
                    influencer.setPlatform(influencerDetails.getPlatform());
                    influencer.setFollowers(influencerDetails.getFollowers());
                    influencer.setEngagementRate(influencerDetails.getEngagementRate());
                    influencer.setNiche(influencerDetails.getNiche());
                    influencer.setEmail(influencerDetails.getEmail());
                    return ResponseEntity.ok(influencerService.saveInfluencer(influencer));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInfluencer(@PathVariable String id) {
        influencerService.deleteInfluencer(id);
        return ResponseEntity.ok().build();
    }
}
