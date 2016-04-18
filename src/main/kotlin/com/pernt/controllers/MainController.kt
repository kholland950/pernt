package com.pernt.controllers

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod

/**
 * Created by kevinholland on 4/10/16.
 */

@Controller
class MainController {
    @RequestMapping(value = "/", method = arrayOf(RequestMethod.GET))
    fun indexMapping(): String {
        return "index";
    }
}
