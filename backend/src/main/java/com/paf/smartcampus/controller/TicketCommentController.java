package com.paf.smartcampus.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paf.smartcampus.dto.CommentRequestDTO;
import com.paf.smartcampus.service.TicketCommentService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketCommentController {

    private final TicketCommentService commentService;

    @PostMapping("/{id}/comments")
    public void addComment(@PathVariable Long id,
                           @RequestParam Long userId,
                           @RequestBody CommentRequestDTO dto) {

        commentService.addComment(id, userId, dto.getComment());
    }
}
