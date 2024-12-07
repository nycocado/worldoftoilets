package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pt.iade.ei.thinktoilet.models.entities.Interaction;
import pt.iade.ei.thinktoilet.models.entities.Toilet;
import pt.iade.ei.thinktoilet.models.entities.User;
import pt.iade.ei.thinktoilet.repositories.InteractionRepository;

import java.util.Optional;

@Service
public class InteractionService {
    @Autowired
    private InteractionRepository interactionRepository;

    public Interaction getInteractionById(Toilet toilet, User user) {
        return Optional.ofNullable(interactionRepository.findInteractionByToiletIdAndUserId(toilet.getId(), user.getId()))
                .orElseGet(() -> saveInteraction(toilet, user));
    }

    public Interaction saveInteraction(Toilet toilet, User user) {
        Interaction interaction = new Interaction();
        interaction.setToilet(toilet);
        interaction.setUser(user);
        return interactionRepository.save(interaction);
    }
}
