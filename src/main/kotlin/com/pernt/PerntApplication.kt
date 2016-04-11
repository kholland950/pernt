package com.pernt

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.web.WebMvcAutoConfiguration
import org.springframework.web.servlet.config.annotation.EnableWebMvc

@SpringBootApplication
@EnableWebMvc
open class PerntApplication : WebMvcAutoConfiguration() {
    companion object {
        @JvmStatic fun main(args: Array<String>) {
            SpringApplication.run(PerntApplication::class.java, *args)
        }
    }
}
