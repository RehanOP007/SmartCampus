package com.paf.smartcampus.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.paf.smartcampus.entity.Attachment;
import com.paf.smartcampus.entity.Ticket;
import com.paf.smartcampus.repository.AttachmentRepository;
import com.paf.smartcampus.repository.TicketRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final TicketRepository ticketRepository;
    private final AttachmentRepository attachmentRepository;

    public Attachment upload(Long ticketId, String fileUrl, String fileName) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        Attachment attachment = Attachment.builder()
                .ticket(ticket)
                .fileUrl(fileUrl)
                .fileName(fileName)
                .uploadedAt(LocalDateTime.now())
                .build();

        return attachmentRepository.save(attachment);
    }

    public List<Attachment> getByTicket(Long ticketId) {
        return attachmentRepository.findByTicketId(ticketId);
    }
}
