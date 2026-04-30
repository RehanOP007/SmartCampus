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
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Resource type is required");
        }

        if (dto.getStatus() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Resource status is required");
        }

        return Resource.builder()
                .name(dto.getName())
                .type(Resource.Type.valueOf(dto.getType().toUpperCase()))
                .capacity(dto.getCapacity())
                .availableCapacity(dto.getCapacity())
                .location(dto.getLocation())
                .status(Resource.Status.AVAILABLE)
                .build();
    }

    private ResourceResponseDTO mapToDTO(Resource resource) {
        return ResourceResponseDTO.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType().name())
                .capacity(resource.getCapacity())
                .availableCapacity(resource.getAvailableCapacity())
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

        if (resourceRepository.findByName(dto.getName()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Resource name already exists");
        }

        Resource resource = mapToEntity(dto);
        return mapToDTO(resourceRepository.save(resource));
    }

    public Resource createResource(Resource resource) {
    if (resource.getName() == null || resource.getName().trim().isEmpty()) {
        throw new RuntimeException("Resource name cannot be empty");
    }
    return resourceRepository.save(resource);
}

    public ResourceResponseDTO updateResource(Long id, ResourceRequestDTO dto) {

        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));

        // ✅ Name (with uniqueness check)
        if (dto.getName() != null) {
            resourceRepository.findByName(dto.getName())
                    .ifPresent(existing -> {
                        if (!existing.getId().equals(resource.getId())) {
                            throw new ResponseStatusException(HttpStatus.CONFLICT, "Resource name already exists");
                        }
                    });

            resource.setName(dto.getName());
        }

        // ✅ Type
        if (dto.getType() != null) {
            try {
                resource.setType(Resource.Type.valueOf(dto.getType().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid type");
            }
        }

        // ✅ Status
        if (dto.getStatus() != null) {
            try {
                resource.setStatus(Resource.Status.valueOf(dto.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
            }
        }

        // ✅ Capacity
        if (dto.getCapacity() != null) {
            resource.setCapacity(dto.getCapacity());
        }

        // ✅ Location
        if (dto.getLocation() != null) {
            resource.setLocation(dto.getLocation());
        }

        return mapToDTO(resourceRepository.save(resource));
    }

    public ResourceResponseDTO getResourceById(Long id) {

        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Resource not found"));

        return mapToDTO(resource);
    }

    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }
}
