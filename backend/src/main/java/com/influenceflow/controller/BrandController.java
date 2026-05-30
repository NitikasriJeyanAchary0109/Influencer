package com.influenceflow.controller;

import com.influenceflow.entity.Brand;
import com.influenceflow.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    @Autowired
    private BrandRepository brandRepository;

    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandById(@PathVariable String id) {
        return brandRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Brand> updateBrand(@PathVariable String id, @RequestBody Brand brandDetails) {
        return brandRepository.findById(id)
                .map(brand -> {
                    brand.setBrandName(brandDetails.getBrandName());
                    brand.setIndustry(brandDetails.getIndustry());
                    brand.setContactEmail(brandDetails.getContactEmail());
                    brand.setContactPhone(brandDetails.getContactPhone());
                    return ResponseEntity.ok(brandRepository.save(brand));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
