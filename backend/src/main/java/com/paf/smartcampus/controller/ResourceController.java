package com.paf.smartcampus.controller;


import com.paf.smartcampus.dto.ResourceRequestDTO;
import com.paf.smartcampus.dto.ResourceResponseDTO;
import com.paf.smartcampus.entity.Resource;
import com.paf.smartcampus.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    // GET all resources
    @GetMapping
    public List<ResourceResponseDTO> getAllResources() {
        return resourceService.getAllResources();
    }

    // POST create resource
    @PostMapping
    public ResourceResponseDTO createResource(@RequestBody ResourceRequestDTO dto) {
        return resourceService.createResource(dto);
    }

    // PUT update resource
    @PutMapping("/{id}")
    public ResourceResponseDTO updateResource(@PathVariable Long id, @RequestBody ResourceRequestDTO dto) {
        return resourceService.updateResource(id, dto);
    }

    // DELETE resource
    @DeleteMapping("/{id}")
    public void deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
    }
}