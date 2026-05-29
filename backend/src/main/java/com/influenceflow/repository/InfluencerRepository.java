package com.influenceflow.repository;

import com.influenceflow.entity.Influencer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InfluencerRepository extends JpaRepository<Influencer, String> {
    List<Influencer> findByBrandId(String brandId);
}
