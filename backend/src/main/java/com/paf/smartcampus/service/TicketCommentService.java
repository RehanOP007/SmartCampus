package com.paf.smartcampus.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.paf.smartcampus.entity.Comment;
import com.paf.smartcampus.entity.Ticket;
import com.paf.smartcampus.entity.User;
import com.paf.smartcampus.repository.TicketCommentRepository;
import com.paf.smartcampus.repository.TicketRepository;
import com.paf.smartcampus.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketCommentService {

    private final TicketRepository ticketRepository;
    private final TicketCommentRepository commentRepository;
    private final UserRepository userRepository;

    public void addComment(Long ticketId, Long userId, String commentText) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = Comment.builder()
                .ticket(ticket)
                .user(user)
                .content(commentText)
                .createdAt(LocalDateTime.now())
                .build();

        commentRepository.save(comment);
    }
}
