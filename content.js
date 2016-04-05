"use strict";
var words;

//default option
var drumpify = function(){

	var regexstring = "Trump";
	var replace = "Drumpf"
	var regex = new RegExp(regexstring, "gi")

    //checks every text element on the DOM
	$('*')
    .contents()
    .filter(function() {
        return this.nodeType == Node.TEXT_NODE
            && this.nodeValue.indexOf(regexstring) >= 0;
    }).each(function() {
        this.nodeValue = this.nodeValue.replace(regex, replace);
    });
}

//custom option
var change = function(words){

	for (var i = 0; i < words.length; i++) {
		var regexstring = words[i].o;
		var replace = words[i].f;
		var regex = new RegExp(regexstring, "gi")

        //checks every text element on the DOM
		$('*')
	    .contents()
	    .filter(function() {
	        return this.nodeType == Node.TEXT_NODE
	            && this.nodeValue.indexOf(regexstring) >= 0;
	    }).each(function() {
	        this.nodeValue = this.nodeValue.replace(regex, replace);
	    })
	}
}

var currentHeight = $("#globalContainer").height();

//checks the DOM on scrolling; esp useful on Facebook
$(document).on('scroll', function(event) {
    var heightRightNow = $("#globalContainer").height();
    if (currentHeight !== $("#globalContainer").height()) {
    	chrome.storage.local.get(function(values){
            if(values.wordsArr){
    	        words = JSON.parse(values.wordsArr)
    	    	if(words.length){
                    change(words)    
                }
            } else {
            	drumpify()
            }
        	currentHeight = heightRightNow;
	    })
    }
})

//listens to a message from popup
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        chrome.storage.local.get(function(values){
            if(values.wordsArr){
                words = JSON.parse(values.wordsArr)
                if(words.length){
        	        change(words)
                }
            }
	    })
    }
)

//runs on DOM load
$(document).ready(function() {
	chrome.storage.local.get(function(values){
        if(values.wordsArr){
            words = JSON.parse(values.wordsArr)
            if(words.length){
                change(words) 
            } else {
            	drumpify()
            }
        } else {
        	drumpify()
        }
    })
})
