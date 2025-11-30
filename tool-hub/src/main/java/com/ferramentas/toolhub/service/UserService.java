package com.ferramentas.toolhub.service;

import com.ferramentas.toolhub.dto.UpdateRoleRequestDTO;
import com.ferramentas.toolhub.dto.UpdateUserRequestDTO;
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
    public org.springframework.data.domain.Page<UserResponseDTO> findAllAsDTO(
            org.springframework.data.domain.Pageable pageable, String search) {
        org.springframework.data.domain.Page<User> usersPage;
        if (search != null && !search.trim().isEmpty()) {
            usersPage = userRepository.searchByUsernameOrEmail(search, pageable);
        } else {
            usersPage = userRepository.findAll(pageable);
        }
        return usersPage.map(this::convertToResponseDTO);
    }

    @Transactional
    public Optional<UserResponseDTO> findByIdAsDTO(UUID id) {
        return userRepository.findById(id)
                .map(this::convertToResponseDTO);
    }

    @Transactional
    public UserResponseDTO saveFromDTO(UserRequestDTO userRequestDTO) {
        User user = convertToEntity(userRequestDTO);
        // A senha já está como texto simples vindo do DTO, então basta codificar uma
        // vez
        user.setPasswordHash(passwordEncoder.encode(userRequestDTO.passwordHash()));
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
                user.getId().toString(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
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
        if (dto.role() != null && !dto.role().isEmpty()) {
            user.setRole(dto.role().toUpperCase());
        } else {
            user.setRole("USER"); // role padrão
        }
        user.setCreatedAt(LocalDateTime.now());
        return user;
    }

    /**
     * Atualiza apenas a role de um usuário
     */
    @Transactional
    public Optional<UserResponseDTO> updateRole(UUID id, UpdateRoleRequestDTO roleRequest) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setRole(roleRequest.role());
            User updatedUser = userRepository.save(user);
            return Optional.of(convertToResponseDTO(updatedUser));
        }
        return Optional.empty();
    }

    /**
     * Atualiza informações do usuário (username, email, role e opcionalmente senha)
     */
    @Transactional
    public Optional<UserResponseDTO> updateUser(UUID id, UpdateUserRequestDTO updateRequest) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Atualiza apenas os campos que não são nulos
            if (updateRequest.username() != null && !updateRequest.username().isEmpty()) {
                user.setUsername(updateRequest.username());
            }

            if (updateRequest.email() != null && !updateRequest.email().isEmpty()) {
                user.setEmail(updateRequest.email());
            }

            if (updateRequest.role() != null && !updateRequest.role().isEmpty()) {
                user.setRole(updateRequest.role());
            }

            // Atualiza senha apenas se fornecida
            if (updateRequest.passwordHash() != null && !updateRequest.passwordHash().isEmpty()) {
                user.setPasswordHash(passwordEncoder.encode(updateRequest.passwordHash()));
            }

            User updatedUser = userRepository.save(user);
            return Optional.of(convertToResponseDTO(updatedUser));
        }
        return Optional.empty();
    }

    /**
     * Verifica se um usuário tem uma determinada role
     */
    @Transactional
    public boolean hasRole(UUID id, String role) {
        Optional<User> userOptional = userRepository.findById(id);
        return userOptional.map(user -> role.equalsIgnoreCase(user.getRole())).orElse(false);
    }

    /**
     * Lista todos os usuários com uma determinada role
     */
    @Transactional
    public List<UserResponseDTO> findByRole(String role) {
        return userRepository.findAll().stream()
                .filter(user -> role.equalsIgnoreCase(user.getRole()))
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<UserResponseDTO> findByUsernameAsDTO(String username) {
        return userRepository.findByUsername(username)
                .map(this::convertToResponseDTO);
    }

    @Transactional
    public Optional<UserResponseDTO> updateProfile(String username, UpdateUserRequestDTO updateRequest) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (updateRequest.username() != null && !updateRequest.username().isEmpty()) {
                user.setUsername(updateRequest.username());
            }
            if (updateRequest.email() != null && !updateRequest.email().isEmpty()) {
                user.setEmail(updateRequest.email());
            }
            // Profile update should NOT allow role change
            if (updateRequest.passwordHash() != null && !updateRequest.passwordHash().isEmpty()) {
                user.setPasswordHash(passwordEncoder.encode(updateRequest.passwordHash()));
            }

            User updatedUser = userRepository.save(user);
            return Optional.of(convertToResponseDTO(updatedUser));
        }
        return Optional.empty();
    }

    @Transactional
    @org.springframework.cache.annotation.Cacheable("userCount")
    public long countActiveUsers() {
        return userRepository.count();
    }
}
