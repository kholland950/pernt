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
 * Created by kevinholland on 4/11/16.
 */
@RestController
class SaveController() {
    @Autowired lateinit var repository: PerntingRepository;

    @RequestMapping(value = "/svprnt", method = arrayOf(RequestMethod.POST))
    fun savePernting(@RequestParam(name = "imageDataURL") imageDataURL: String,
                     @RequestParam(name = "imageWidth") imageWidth: Int,
                     @RequestParam(name = "imageHeight") imageHeight: Int ): ResponseEntity<String> {
        var pernting = Pernting(imageDataURL, imageWidth, imageHeight);
        repository.save(pernting);
        return ResponseEntity(pernting.id, HttpStatus.OK);
    }
}
