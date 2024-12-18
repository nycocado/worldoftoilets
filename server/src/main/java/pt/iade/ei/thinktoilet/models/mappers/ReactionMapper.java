package pt.iade.ei.thinktoilet.models.mappers;

import org.springframework.stereotype.Component;
import pt.iade.ei.thinktoilet.models.dtos.ReactionDTO;
import pt.iade.ei.thinktoilet.models.entities.Reaction;

import java.util.List;

@Component
public class ReactionMapper {
    public ReactionDTO mapReactionDTO(Reaction reaction) {
        return new ReactionDTO(
                reaction.getComment().getId(),
                reaction.getTypeReaction().getName().toUpperCase()
        );
    }

    public List<ReactionDTO> mapReactionDTOS(List<Reaction> reactions) {
        return reactions.stream()
                .map(this::mapReactionDTO)
                .toList();
    }
}
