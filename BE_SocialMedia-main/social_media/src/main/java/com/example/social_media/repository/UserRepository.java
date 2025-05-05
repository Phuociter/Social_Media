package com.example.social_media.repository;

import com.example.social_media.dto.MonthUserDTO;
import com.example.social_media.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);

    User findByEmail(String email);

    User findByStatus(Integer status);

    int countByStatus(Integer status);

    List<User> findByCreatedAt(Date createdAt);

    List<User> findByUsernameContainingIgnoreCase(String keyword);

    Optional<User> findByEmailIgnoreCase(String email);

    @Query("SELECT new com.example.social_media.dto.MonthUserDTO(MONTH(u.createdAt), COUNT(u)) " +
            "FROM User u WHERE YEAR(u.createdAt) = :year GROUP BY MONTH(u.createdAt) ORDER BY MONTH(u.createdAt)")
    List<MonthUserDTO> countUsersByMonth(@Param("year") int year);

}
