package com.pernt.controllers

import com.pernt.models.HelloMessage
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
class HelloController {

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    fun greeting(message: HelloMessage) : String {
        Thread.sleep(1000); // simulated delay
        return "Hello, " + message.name + "!";
    }
}
