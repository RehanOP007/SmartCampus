package com.paf.smartcampus.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paf.smartcampus.dto.TicketRequestDTO;
import com.paf.smartcampus.dto.TicketResponseDTO;
import com.paf.smartcampus.service.TicketService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    public TicketResponseDTO create(@RequestBody TicketRequestDTO dto,
                                    @RequestParam Long userId) {
        return ticketService.createTicket(dto, userId);
    }

    @GetMapping
    public List<TicketResponseDTO> getAll() {
        return ticketService.getAllTickets();
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public TicketResponseDTO assign(@PathVariable Long id,
                                    @RequestParam Long techId) {
        return ticketService.assignTechnician(id, techId);
    }

    @PutMapping("/{id}/status")
    public TicketResponseDTO updateStatus(@PathVariable Long id,
                                          @RequestParam String status) {
        return ticketService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        ticketService.deleteTicket(id);
    }
}
