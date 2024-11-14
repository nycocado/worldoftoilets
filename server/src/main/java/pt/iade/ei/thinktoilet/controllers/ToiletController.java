package pt.iade.ei.thinktoilet.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import pt.iade.ei.thinktoilet.models.entities.Toilet;
import pt.iade.ei.thinktoilet.models.repositories.ToiletRepository;

@RestController
@RequestMapping(path = "/api/toilets")
public class ToiletController {
    private final Logger logger = LoggerFactory.getLogger(ToiletController.class);
    @Autowired
    private ToiletRepository toiletRepository;

    @GetMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Toilet> getToilets() {
        logger.info("Sending all toilets");
        return toiletRepository.findAll();
    }

    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Toilet> getToilet(@PathVariable int id) {
        logger.info("Sending toilet with id {}", id);
        return toiletRepository.findById(id);
    }

    @GetMapping(path = "/nearby", produces = MediaType.APPLICATION_JSON_VALUE)
    public Page<Toilet> getToiletsNearby(
            @RequestParam(required = true) double lon,
            @RequestParam(required = true) double lat,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "10", required = false) int limit) {

        Pageable pageable = PageRequest.of(page, limit);
        logger.info("Sending toilets near lon {} and lat {}", lon, lat);
        return toiletRepository.findByDistance(lat, lon, pageable);
    }
}
