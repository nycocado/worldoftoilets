package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pt.iade.ei.thinktoilet.exceptions.NotFoundException;
import pt.iade.ei.thinktoilet.models.entities.Interaction;
import pt.iade.ei.thinktoilet.models.entities.Toilet;
import pt.iade.ei.thinktoilet.models.entities.User;
import pt.iade.ei.thinktoilet.repositories.InteractionRepository;
import pt.iade.ei.thinktoilet.repositories.ToiletRepository;
import pt.iade.ei.thinktoilet.repositories.UserRepository;

import java.util.Optional;

@Service
public class InteractionService {
    @Autowired
    private InteractionRepository interactionRepository;
    @Autowired
    private ToiletRepository toiletRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Interaction addInteraction(Toilet toilet, User user) {
        Interaction interaction = new Interaction();
        interaction.setToilet(toilet);
        interaction.setUser(user);
        return interactionRepository.save(interaction);
    }

    @Transactional
    public Interaction addInteractionSafety(int toiletId, int userId) {
        return Optional.ofNullable(interactionRepository.findInteractionByToiletIdAndUserId(toiletId, userId))
                .orElseGet(() -> {
                    Toilet toilet = Optional.ofNullable(toiletRepository.findToiletById(toiletId))
                            .orElseThrow(() -> new NotFoundException(String.valueOf(toiletId), "Toilet", "id"));
                    User user = Optional.ofNullable(userRepository.findUserById(userId))
                            .orElseThrow(() -> new NotFoundException(String.valueOf(userId), "User", "id"));
                    Interaction newInteraction = new Interaction();
                    newInteraction.setToilet(toilet);
                    newInteraction.setUser(user);
                    return interactionRepository.save(newInteraction);
                });
    }
}
