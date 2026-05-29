package com.influenceflow.repository;

import com.influenceflow.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, String> {
    List<Post> findByCampaignCampaignId(String campaignId);
    List<Post> findByInfluencerInfluencerId(String influencerId);
}
