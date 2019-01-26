package com.pernt.models

import java.util.*
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Lob

/**
 * Model for Perntings (drawings)
 */
@Entity
class Pernting {
    //String id: This is a UUID
    @Id
    var id: String

    //String base64 representation of image. Used to render images when loaded
    @Lob
    @Column(name="imageDataURL")
    var imageDataURL: String

    //Int image width used for scaling to target screen
    @Column(name="imageWidth")
    var imageWidth: Int = 0

    //Int image height used for scaling to target screen
    @Column(name="imageHeight")
    var imageHeight: Int = 0

    constructor() {
        this.id = UUID.randomUUID().toString()
        this.imageDataURL = ""
    }

    constructor(imageDataURL: String, width: Int, height: Int) {
        this.id = UUID.randomUUID().toString()
        this.imageDataURL = imageDataURL
        this.imageWidth = width
        this.imageHeight = height
    }

    constructor(id: String, imageDataURL: String, width: Int, height: Int) {
        this.id = id
        this.imageDataURL = imageDataURL
        this.imageWidth = width
        this.imageHeight = height
    }

}
