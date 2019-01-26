package com.pernt.controllers

import com.pernt.models.Pernting
import com.pernt.models.PerntingRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

/**
 * Controller for saving pernting to database
 * @author Kevin Holland
 */
@RestController
class SaveController() {
    /** Autowried pernting repo for database access */
    @Autowired lateinit var repository: PerntingRepository

    /**
     * Saves pernting to database
     */
    @RequestMapping(value = ["/svprnt"], method = [(RequestMethod.POST)])
    fun savePernting(@RequestParam(name = "imageDataURL") imageDataURL: String,
                     @RequestParam(name = "imageWidth") imageWidth: Int,
                     @RequestParam(name = "imageHeight") imageHeight: Int ): ResponseEntity<String> {
        val pernting = Pernting(imageDataURL, imageWidth, imageHeight)
        repository.save(pernting)
        return ResponseEntity(pernting.id, HttpStatus.OK)
    }
}
