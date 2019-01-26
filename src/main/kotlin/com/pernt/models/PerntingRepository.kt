package com.pernt.models

import org.springframework.data.repository.CrudRepository
import java.util.*
import javax.transaction.Transactional

/**
 * CRUD Repository used for accessing pernting database
 */
interface PerntingRepository : CrudRepository<Pernting, String> {
    @Transactional
    override fun findById(id: String): Optional<Pernting>
}
