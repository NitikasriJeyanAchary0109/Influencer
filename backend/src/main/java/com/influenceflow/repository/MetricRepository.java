package com.influenceflow.repository;

import com.influenceflow.entity.Metric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MetricRepository extends JpaRepository<Metric, String> {
    Optional<Metric> findByPostId(String postId);
}
