// AnimationQueue
var AnimationsQueue = {
    elements: [],
    add: function(elem) {
        this.elements[this.elements.length] = elem;
    },
    checkAnimations: function() {
        for (var x = 0; x < this.elements.length; x++) {
            this.elements[x].checkAnim();
        }
    }
}

// Class animations (jQuery is required)
function Animations(elem, animation, delay) {
    this.element = $(elem);
    this.animation = animation;
    this.element.addClass("animate__animated");
    //this.element.addClass(animation);
    this.noMoreAnimate = true;
    this.animationDuration = 1;
    this.delay = delay || 0;
    this.element.css({"animation-duration": this.animationDuration+"s", "animation-delay": this.delay + "s"});
    this.element.addClass("remove-element");

}


// STATIC FUNCTION
// Returns true if the specified element has been scrolled into the viewport.
Animations.prototype.isElementInViewport = function(elem) {
    var $elem = $(elem);

    // Decay is offset from the bottom of how much to check
    var decay = 0.10 * $(window).innerHeight();

    var top_of_element = $elem.offset().top;
    var bottom_of_element = $elem.offset().top + $elem.outerHeight();
    var bottom_of_screen = $(window).scrollTop() + ($(window).innerHeight() - decay );
    var top_of_screen = $(window).scrollTop();

    return ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element));
};

// Check animations
Animations.prototype.checkAnim = function() {
    try {
        if (this.noMoreAnimate == true) {
            if (this.isElementInViewport(this.element)) {
                this.element.addClass(this.animation);
                this.element.removeClass("remove-element");
                this.noMoreAnimate = false;
                
                // Trigger an event
                this.element.trigger("ar.element.in-view");
                
                // After the element is done with it's animation
                // Check animations
                function checkAgain() {
                    AnimationsQueue.checkAnimations();
                    this.element.off("animationend", checkAgain);
                }
                this.element.on("animationend", checkAgain.bind(this));
    
            } else {
                this.element.removeClass(this.animation);
            }
        }

    } catch (err) {}

};


// On scroll
$(window).scroll(function() {
    AnimationsQueue.checkAnimations();
});

// On viewport change or resize
$(window).on("resize", function() {
    AnimationsQueue.checkAnimations();
})

// If the user goes to another tab, redo
// Checkanimations when user comes back to 
// the current tab

// Set the name of the hidden property and the change event for visibility
var visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
    visibilityChange = "visibilitychange";
} else if (typeof document.mozHidden !== "undefined") {
    visibilityChange = "mozvisibilitychange";
} else if (typeof document.msHidden !== "undefined") {
    visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
    visibilityChange = "webkitvisibilitychange";
}

document.addEventListener(visibilityChange, function() {
    AnimationsQueue.checkAnimations();
});