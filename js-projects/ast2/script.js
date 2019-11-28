var carousel = document.getElementsByClassName('carousel-container')[0];
var imageWrapper = carousel.getElementsByTagName('div')[0];
var previous = document.getElementById('previous');
var next = document.getElementById('next');
var carouselIndicator = document.getElementsByClassName('carousel-indicator')[0];
var indicator = carouselIndicator.getElementsByTagName('ul')[0];
// array.from creates a new collection in array of the imagewrapper children.
var imageArray = Array.from(imageWrapper.children);

var slider = new Slider(carousel, imageWrapper, previous, next, carouselIndicator);
slider.setStyle();
slider.setUpList();
setTimeout(slider.autoSlide,3000);


function Slider(carousel, imageWrapper, previous, next, carouselIndicator){
    this.IMAGE_WIDTH = 400;
    this.INDICATOR_WIDTH = 10;
    this.INDICATOR_DISTANCE = 10;
    this.carousel = carousel;
    this.imageWrapper = imageWrapper;
    this.previous = previous;
    this.next = next;
    this.carouselIndicator = carouselIndicator;
    this.indicator = this.carouselIndicator.getElementsByTagName('ul')[0];
    this.imageArray = Array.from(this.imageWrapper.children);
    var that = this;


    //sets the width of imagewrapper and indicator.
    this.setStyle = function(){
        that.imageWrapper.style.width = (that.IMAGE_WIDTH * that.imageArray.length) / 16 * 100 + '%';
        that.imageWrapper.style.transition = '0.9s ease-in';
        //width of the indicator.
        that.carouselIndicator.style.width = (that.INDICATOR_WIDTH * that.imageArray.length) + (that.INDICATOR_DISTANCE * (that.imageArray.length - 1)) + 'px';
        that.indicator.style.width = that.carouselIndicator.style.width;
        
        //imagearray which is the array of the collection is for lopped to set ech index id and style in left.
        for (index in that.imageArray) {
            that.imageArray[index].setAttribute('id', index);
            that.imageArray[index].style.left = (that.IMAGE_WIDTH * index) + 'px';
        }
    }

    this.setUpList = function(){
        for (index in imageArray) {
            //creates new li tag at the end of indicatorlist which takes the id from the current image index.
            that.indicatorList = document.createElement('li');
            that.indicatorList.setAttribute('id', index);
            that.indicator.appendChild(that.indicatorList);
        }
        that.indicator.children[0].classList.add('active');
        //that.list will be used to remove the active status in clearallattributes.
        that.list = document.getElementsByTagName('li');
    }

    this.previous.onclick = function (){
        that.backSlide();
    }

    this.next.onclick = function (){
        that.autoSlide();
    }

    this.indicator.onclick = function(e){
        that.clearAllAttributes();

        //its adds the active status and changes the image wrapper margin.
        e.target.classList.add('active');
        var curr = e.target.getAttribute('id');
        that.imageWrapper.style.marginLeft = '-' + (that.IMAGE_WIDTH * curr) + 'px';
        that.imageArray[curr].style.display = "block";
        that.imageArray[curr].classList.add("active");
    }
    //clears the active status of the class indicator.
    this.clearAllAttributes = function(){
        for (var i = 0; i < this.imageArray.length; i++) {
            if (that.imageArray[i].classList.contains('active')) {
                that.currentIndex = that.imageArray[i].getAttribute('id');
                that.imageArray[i].classList.remove("active");
                that.list[i].classList.remove("active");
            }
        }
    }

    this.addAttributes = function(){
        that.imageWrapper.style.marginLeft = '-' + (that.IMAGE_WIDTH * that.currentIndex)  + 'px';
        that.imageArray[that.currentIndex].style.display = "block";
        that.imageArray[that.currentIndex].classList.add("active");
        that.list[that.currentIndex].classList.add("active");
    }

    this.autoSlide = function() {
        that.clearAllAttributes();

        that.currentIndex++;
        if (that.currentIndex >= that.imageArray.length) {
            that.currentIndex = 0;

        }
        that.addAttributes();
        setTimeout(that.autoSlide, 3000); 
    }

    //backslide does the reverse of autoslide.
    this.backSlide = function() {
        that.clearAllAttributes()
        that.currentIndex--;
        if (that.currentIndex < 0) {
            that.currentIndex = that.imageArray.length - 1;
        }
       that.addAttributes();
    }

}
