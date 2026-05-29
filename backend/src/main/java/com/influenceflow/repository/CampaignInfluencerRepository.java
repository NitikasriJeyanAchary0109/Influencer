package com.influenceflow.repository;

import com.influenceflow.entity.CampaignInfluencer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignInfluencerRepository extends JpaRepository<CampaignInfluencer, String> {
    List<CampaignInfluencer> findByCampaignCampaignId(String campaignId);
    List<CampaignInfluencer> findByInfluencerInfluencerId(String influencerId);
}
