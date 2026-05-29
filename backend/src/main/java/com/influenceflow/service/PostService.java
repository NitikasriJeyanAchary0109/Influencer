package com.influenceflow.service;

import com.influenceflow.entity.Post;
import com.influenceflow.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public List<Post> getPostsByCampaign(String campaignId) {
        return postRepository.findByCampaignCampaignId(campaignId);
    }

    public List<Post> getPostsByInfluencer(String influencerId) {
        return postRepository.findByInfluencerInfluencerId(influencerId);
    }

    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    public Post savePost(Post post) {
        return postRepository.save(post);
    }

    public void deletePost(String id) {
        postRepository.deleteById(id);
    }
}
