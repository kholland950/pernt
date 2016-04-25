package com.pernt

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.web.WebMvcAutoConfiguration
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
open class PerntApplication : WebMvcAutoConfiguration() {
    companion object {
        @JvmStatic fun main(args: Array<String>) {
            System.setProperty("org.eclipse.jetty.server.Request.maxFormContentSize", "500000");
            SpringApplication.run(PerntApplication::class.java, *args)
        }
    }
}
