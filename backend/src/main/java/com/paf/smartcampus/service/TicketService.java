package com.paf.smartcampus.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.paf.smartcampus.dto.TicketRequestDTO;
import com.paf.smartcampus.dto.TicketResponseDTO;
import com.paf.smartcampus.entity.Resource;
import com.paf.smartcampus.entity.Ticket;
import com.paf.smartcampus.entity.User;
import com.paf.smartcampus.repository.ResourceRepository;
import com.paf.smartcampus.repository.TicketRepository;
import com.paf.smartcampus.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;

    // CREATE TICKET
    public TicketResponseDTO createTicket(TicketRequestDTO dto, Long userId) {

        Ticket.Type type = Ticket.Type.valueOf(dto.getType().toUpperCase());

        // VALIDATION RULE
        if ((type == Ticket.Type.TECHNICAL || type == Ticket.Type.FACILITY)
                && dto.getResourceId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Resource is required for TECHNICAL and FACILITY tickets"
            );
        }

        Resource resource = null;

        if (dto.getResourceId() != null) {
            resource = resourceRepository.findById(dto.getResourceId())
                    .orElseThrow(() ->
                            new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        

        Ticket ticket = Ticket.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .type(type)
                .resource(resource)
                .status(Ticket.Status.OPEN)
                .createdBy(user)
                .createdAt(LocalDateTime.now())
                .build();

        return mapToDTO(ticketRepository.save(ticket));
    }

    // GET ALL
    public List<TicketResponseDTO> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ASSIGN TECHNICIAN (ADMIN ONLY)
    public TicketResponseDTO assignTechnician(Long ticketId, Long techId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        User tech = userRepository.findById(techId)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        ticket.setAssignedTo(tech);
        ticket.setStatus(Ticket.Status.IN_PROGRESS);

        // If resource exists → set to MAINTENANCE
        if (ticket.getResource() != null) {

            Resource resource = ticket.getResource();
            resource.setStatus(Resource.Status.MAINTENANCE);

            resourceRepository.save(resource);
        }


        return mapToDTO(ticketRepository.save(ticket));
    }

    // UPDATE STATUS (TECHNICIAN)
    public TicketResponseDTO updateStatus(Long ticketId, String status) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(Ticket.Status.valueOf(status.toUpperCase()));

        Resource resource = ticket.getResource();

        if(resource.getStatus() == Resource.Status.MAINTENANCE && ticket.getStatus() == Ticket.Status.RESOLVED) {
            resource.setStatus(Resource.Status.AVAILABLE);
            resourceRepository.save(resource);
        }

        return mapToDTO(ticketRepository.save(ticket));
    }

    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }

    private TicketResponseDTO mapToDTO(Ticket t) {
        return TicketResponseDTO.builder()
                .id(t.getId())
                .title(t.getTitle())
                .type(t.getType().name())
                .description(t.getDescription())
                .status(t.getStatus().name())
                .createdBy(t.getCreatedBy().getId())
                .assignedTo(t.getAssignedTo() != null ? t.getAssignedTo().getId() : null)
                .build();
    }
}
