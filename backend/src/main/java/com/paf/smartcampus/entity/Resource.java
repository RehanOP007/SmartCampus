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

    private String name;

    @Enumerated(EnumType.STRING)
    private Type type;

    private int capacity;

    private String location;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Type {
        LAB,
        ROOM,
        EQUIPMENT
    }

    public enum Status {
        ACTIVE,
        OUT_OF_SERVICE
    }
}
