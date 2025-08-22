package com.ferramentas.toolhub.service;

import com.ferramentas.toolhub.dto.UserRequestDTO;
import com.ferramentas.toolhub.dto.UserResponseDTO;
import com.ferramentas.toolhub.model.User;
import com.ferramentas.toolhub.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Transactional
    public Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }

    @Transactional
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Transactional
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional
    public Optional<User> findByUsernameOrEmail(String credential) {
        return userRepository.findByUsernameOrEmail(credential);
    }

    @Transactional
    public User save(User user) {
        if (user.getPasswordHash() != null && !user.getPasswordHash().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        }
        return userRepository.save(user);
    }

    @Transactional
    public void deleteById(UUID id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public List<UserResponseDTO> findAllAsDTO() {
        return userRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<UserResponseDTO> findByIdAsDTO(UUID id) {
        return userRepository.findById(id)
                .map(this::convertToResponseDTO);
    }

    @Transactional
    public UserResponseDTO saveFromDTO(UserRequestDTO userRequestDTO) {
        User user = convertToEntity(userRequestDTO);
        if (user.getPasswordHash() != null && !user.getPasswordHash().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        }
        User savedUser = userRepository.save(user);
        return convertToResponseDTO(savedUser);
    }

    @Transactional
    public Optional<UserResponseDTO> updateFromDTO(UUID id, UserRequestDTO userRequestDTO) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User userToUpdate = userOptional.get();
            userToUpdate.setUsername(userRequestDTO.username());
            userToUpdate.setEmail(userRequestDTO.email());
            if (userRequestDTO.passwordHash() != null && !userRequestDTO.passwordHash().isEmpty()) {
                userToUpdate.setPasswordHash(passwordEncoder.encode(userRequestDTO.passwordHash()));
            }
            User updatedUser = userRepository.save(userToUpdate);
            return Optional.of(convertToResponseDTO(updatedUser));
        }
        return Optional.empty();
    }

    private UserResponseDTO convertToResponseDTO(User user) {
        return new UserResponseDTO(
                user.getUsername(),
                user.getEmail(),
                "USER", // role padrão, pois não há campo role na entidade User
                user.getCreatedAt().toString(),
                user.getCreatedAt().toString() // usando createdAt como updatedAt pois não há campo updatedAt
        );
    }

    private User convertToEntity(UserRequestDTO dto) {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setUsername(dto.username());
        user.setEmail(dto.email());
        user.setPasswordHash(dto.passwordHash());
        user.setCreatedAt(LocalDateTime.now());
        return user;
    }
}
