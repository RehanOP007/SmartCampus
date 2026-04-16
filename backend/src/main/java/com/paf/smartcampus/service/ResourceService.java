package com.paf.smartcampus.service;

import com.paf.smartcampus.dto.ResourceRequestDTO;
import com.paf.smartcampus.dto.ResourceResponseDTO;
import com.paf.smartcampus.entity.Resource;
import com.paf.smartcampus.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    private Resource mapToEntity(ResourceRequestDTO dto) {
        if (dto.getType() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Resource type is required");
        }

        if (dto.getStatus() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Resource status is required");
        }

        return Resource.builder()
                .name(dto.getName())
                .type(Resource.Type.valueOf(dto.getType().toUpperCase()))
                .capacity(dto.getCapacity())
                .location(dto.getLocation())
                .status(Resource.Status.valueOf(dto.getStatus().toUpperCase()))
                .build();
    }

    private ResourceResponseDTO mapToDTO(Resource resource) {
        return ResourceResponseDTO.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType().name())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .status(resource.getStatus().name())
                .build();
    }

    public List<ResourceResponseDTO> getAllResources() {
        return resourceRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public ResourceResponseDTO createResource(ResourceRequestDTO dto) {
        Resource resource = mapToEntity(dto);
        return mapToDTO(resourceRepository.save(resource));
    }

    public ResourceResponseDTO updateResource(Long id, ResourceRequestDTO dto) {

    Resource resource = resourceRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Resource not found"));

        if (dto.getType() == null || dto.getStatus() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Type and Status are required");
        }

        resource.setName(dto.getName());
        resource.setType(Resource.Type.valueOf(dto.getType().toUpperCase()));
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setStatus(Resource.Status.valueOf(dto.getStatus().toUpperCase()));

        return mapToDTO(resourceRepository.save(resource));
    }

    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }
}
