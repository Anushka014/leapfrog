const IMAGE_WIDTH = 400;
const INDICATOR_WIDTH = 10;
const INDICATOR_DISTANCE = 10;

var carousel = document.getElementsByClassName('carousel-container')[0];
var imageWrapper = carousel.getElementsByTagName('div')[0];
var previous = document.getElementById('previous');
var next = document.getElementById('next');
var carouselIndicator = document.getElementsByClassName('carousel-indicator')[0];
var indicator = carouselIndicator.getElementsByTagName('ul')[0];

//array.from creates a new collection in array of the imagewrapper children.
var imageArray = Array.from(imageWrapper.children);
imageWrapper.style.width = (IMAGE_WIDTH * imageArray.length) + 'px';

for (index in imageArray) {
    imageArray[index].style.left = (IMAGE_WIDTH * index) + 'px';
    //creates new li tag at the end of indicatorlist.
    var indicatorList = document.createElement('li');
    indicatorList.setAttribute('id', index);
    indicator.appendChild(indicatorList);
}


//width of the indicator.
carouselIndicator.style.width = (INDICATOR_WIDTH * imageArray.length) + (INDICATOR_DISTANCE * (imageArray.length - 1)) + 'px';
indicator.style.width = carouselIndicator.style.width; 

indicator.children[0].classList.add('active');
//sets the next click and backclick function.
next.addEventListener('click', function (e) {
    autoSlide();

});

previous.addEventListener('click', function (e) {
    backSlide();
});

indicator.addEventListener('click', function(e){
    clearAllAttributes()

    //its adds the active status and changes the image wrapper margin.
    e.target.classList.add('active');
    var curr = e.target.getAttribute('id');
    imageWrapper.style.marginLeft = '-' + (IMAGE_WIDTH * curr) + 'px';
    imageArray[curr].style.display = "block";
    imageArray[curr].classList.add("active");
});

//autoslide is called which chnages the slides as per its length and after it reaches its length it goes back to start image.
var list = document.getElementsByTagName('li');
var currentIndex = 0;
function autoSlide() {
    clearAllAttributes()
    currentIndex++;
    if (currentIndex >= imageArray.length) {
        currentIndex = 0;
    }
    addAttributes()
    
}
setInterval(autoSlide, 3000);

//backslide does the reverse of autoslide.
function backSlide() {
    clearAllAttributes()
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = imageArray.length - 1;
    }
   addAttributes() 
}
//clears the active status of the class indicator.
function clearAllAttributes(){
    for (var i = 0; i < imageArray.length; i++) {
        imageArray[i].style.display = "none";
        if (imageArray[i].classList.contains('active')) {
            currentIndex = imageArray[i].getAttribute('id');
            imageArray[i].classList.remove("active");
            list[i].classList.remove("active");
        }
    }
}

function addAttributes(){
    imageWrapper.style.marginLeft = '-' + (IMAGE_WIDTH * currentIndex) + 'px';
    imageArray[currentIndex].style.display = "block";
    imageArray[currentIndex].classList.add("active");
    list[currentIndex].classList.add("active");
}


function fadeOutEffect() {
    var target = document.getElementsByClassName("container-image-wrapper");
    var fadeEffect = setInterval(function () {
        if (!target.style.opacity) {
            target.style.opacity = 1;
        }
        if (target.style.opacity > 0) {
            target.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
        }
    }, 1000);
}

document.getElementById("container-image-wrapper").addEventListener('click', fadeOutEffect);