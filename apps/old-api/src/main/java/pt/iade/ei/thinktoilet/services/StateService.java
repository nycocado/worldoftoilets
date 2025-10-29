package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pt.iade.ei.thinktoilet.exceptions.NotFoundException;
import pt.iade.ei.thinktoilet.models.entities.State;
import pt.iade.ei.thinktoilet.repositories.StateRepository;

import java.util.Optional;

@Service
public class StateService {
    @Autowired
    private StateRepository stateRepository;

    public State getStateByTechnicalName(String technicalName) {
        return Optional.ofNullable(stateRepository.findStateByTechnicalName(technicalName))
                .orElseThrow(() -> new NotFoundException(technicalName, "State", "technical name"));
    }

    public boolean existsStateByTechnicalName(String technicalName) {
        return stateRepository.existsStateByTechnicalName(technicalName);
    }
}
