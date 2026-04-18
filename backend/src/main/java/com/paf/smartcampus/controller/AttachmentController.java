package com.paf.smartcampus.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paf.smartcampus.entity.Attachment;
import com.paf.smartcampus.service.AttachmentService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    @PostMapping("/{id}/attachments")
    public Attachment upload(@PathVariable Long id,
                             @RequestParam String fileUrl,
                             @RequestParam String fileName) {
        return attachmentService.upload(id, fileUrl, fileName);
    }

    @GetMapping("/{id}/attachments")
    public List<Attachment> get(@PathVariable Long id) {
        return attachmentService.getByTicket(id);
    }
}
