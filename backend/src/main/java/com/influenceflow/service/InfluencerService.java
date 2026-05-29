package com.influenceflow.service;

import com.influenceflow.entity.Influencer;
import com.influenceflow.repository.InfluencerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InfluencerService {

    @Autowired
    private InfluencerRepository influencerRepository;

    public List<Influencer> getAllInfluencers() {
        return influencerRepository.findAll();
    }

    public List<Influencer> getInfluencersByBrand(String brandId) {
        return influencerRepository.findByBrandId(brandId);
    }

    public Optional<Influencer> getInfluencerById(String id) {
        return influencerRepository.findById(id);
    }

    public Influencer saveInfluencer(Influencer influencer) {
        return influencerRepository.save(influencer);
    }

    public void deleteInfluencer(String id) {
        influencerRepository.deleteById(id);
    }
}
