package com.proyecto.Miguelcars.repository;

import com.proyecto.Miguelcars.modelo.Checklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChecklistRepository extends JpaRepository<Checklist, Integer> {
}
