package com.pernt.models

import org.springframework.data.repository.CrudRepository
import javax.transaction.Transactional

/**
 * Created by kevinholland on 4/11/16.
 */
interface PerntingRepository : CrudRepository<Pernting, String> {
    @Transactional
    fun findById(id: String): Pernting;
}
