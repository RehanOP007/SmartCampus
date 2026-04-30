package com.paf.smartcampus.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    private Type type;

    private Integer capacity;

    private Integer availableCapacity;

    private String location;

    private String description;  // Resource description

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Type {
        LAB,
        ROOM,
        EQUIPMENT
    }

    public enum Status {
        ACTIVE,
        MAINTENANCE,
        AVAILABLE,
        BOOKED,
        OUT_OF_SERVICE
    }
}
