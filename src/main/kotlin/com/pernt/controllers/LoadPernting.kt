package com.pernt.controllers

import com.pernt.models.Pernting
import com.pernt.models.PerntingRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.ModelAndView
import java.util.*

/**
 * Controller for pernting loading
 * @author Kevin Holland
 */
@Controller
class LoadPernting {
    /** Autowired pernting repo for database access */
    @Autowired lateinit var repository: PerntingRepository

    /**
     * Loads pernting from database and passes to view
     */
    @RequestMapping(value = ["/pernting/{uuid}"], method = [(RequestMethod.GET)])
    @ResponseBody
    fun loadPernting(@PathVariable uuid: String): ModelAndView {
        val mav = ModelAndView("index")
        val pernting: Pernting? = repository.findById(uuid).orElse(null)
        mav.addObject("imageDataURL", pernting?.imageDataURL)
        mav.addObject("imageWidth", pernting?.imageWidth)
        mav.addObject("imageHeight", pernting?.imageHeight)
        return mav
    }
}
