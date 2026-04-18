package com.paf.smartcampus.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    

    // Related resource
    @ManyToOne
    @JoinColumn(name = "resource_id")
    private Resource resource;

    // Assigned technician (also a User)
    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    private String description;

    private String title;

     @Enumerated(EnumType.STRING)
    private Type type;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private Status status;

    // Creator
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User createdBy;

    private LocalDateTime createdAt;

    public enum Priority {
        LOW,
        MEDIUM,
        HIGH
    }

    public enum Status {
        OPEN,
        IN_PROGRESS,
        RESOLVED,
        CLOSED,
        REJECTED
    }

    public enum Type {
        TECHNICAL,
        FACILITY,
        OTHER
    }
}
