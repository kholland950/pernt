package com.pernt.models

import org.springframework.data.repository.CrudRepository
import javax.transaction.Transactional

/**
 * CRUD Repository used for accessing pernting database
 */
interface PerntingRepository : CrudRepository<Pernting, String> {
    @Transactional
    fun findById(id: String): Pernting;
}
