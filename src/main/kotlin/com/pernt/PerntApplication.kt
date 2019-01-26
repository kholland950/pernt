package com.pernt

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration
import org.springframework.web.servlet.config.annotation.EnableWebMvc

/**
 * PerntApplication main class
 * @author Kevin Holland
 *
 * DESIGN PATTERNS: (entire application)
 * MVC:
 * - see com.pernt.controllers  (Controllers)
 * - see com.pernt.models       (Models)
 * - see resources/templates    (Views)
 */
@SpringBootApplication
@EnableWebMvc
class PerntApplication : WebMvcAutoConfiguration() {
    companion object {
        @JvmStatic fun main(args: Array<String>) {
            System.setProperty("org.eclipse.jetty.server.Request.maxFormContentSize", "500000")
            SpringApplication.run(PerntApplication::class.java, *args)
        }
    }
}
