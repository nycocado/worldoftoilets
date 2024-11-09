package pt.iade.ei.thinktoilet.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pt.iade.ei.thinktoilet.models.repositories.CommentRepository;

@RestController
@RequestMapping(path = "/api/comments")
public class CommentController {
    private Logger logger = LoggerFactory.getLogger(CommentController.class);
    @Autowired
    private CommentRepository commentRepository;

}
