package com.paf.smartcampus.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import com.paf.smartcampus.entity.Resource;

import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    Optional<Resource> findByName(String name);

    List<Resource> findByType(Resource.Type type);

    List<Resource> findByCapacityGreaterThanEqual(int capacity);

    List<Resource> findByLocationContainingIgnoreCase(String location);
}
