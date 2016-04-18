package com.pernt.models

import java.util.*
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Lob

/**
 * Created by kevinholland on 4/11/16.
 */
@Entity
class Pernting {
    @Id
    var id: String;

    @Lob
    @Column(name="imageDataURL")
    var imageDataURL: String;

    @Column(name="imageWidth")
    var imageWidth: Int = 0;

    @Column(name="imageHeight")
    var imageHeight: Int = 0;

    constructor() {
        this.id = UUID.randomUUID().toString();
        this.imageDataURL = "";
    }

    constructor(imageDataURL: String, width: Int, height: Int) {
        this.id = UUID.randomUUID().toString();
        this.imageDataURL = imageDataURL;
        this.imageWidth = width;
        this.imageHeight = height;
    }

    constructor(id: String, imageDataURL: String, width: Int, height: Int) {
        this.id = id;
        this.imageDataURL = imageDataURL;
        this.imageWidth = width;
        this.imageHeight = height;
    }

}
