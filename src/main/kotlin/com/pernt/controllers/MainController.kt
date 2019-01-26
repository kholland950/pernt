package com.pernt.controllers

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod

/**
 * Main controller with index mapping
 */
@Controller
class MainController {
    @RequestMapping(value = ["/"], method = [(RequestMethod.GET)])
    fun indexMapping(): String {
        return "index"
    }
}
