const IMAGE_WIDTH = 1000;
const INDICATOR_WIDTH = 10;
const INDICATOR_DISTANCE = 10;

var carousel = document.getElementsByClassName('carousel-container')[0];
var imageWrapper = carousel.getElementsByTagName('div')[0];
var previous = document.getElementById('previous');
var next = document.getElementById('next');
var carouselIndicator = document.getElementsByClassName('carousel-indicator')[0];
var indicator = carouselIndicator.getElementsByTagName('ul')[0];

var imageArray = Array.from(imageWrapper.children);
imageWrapper.style.width = (IMAGE_WIDTH * imageArray.length) + 'px';

for (index in imageArray) {
    imageArray[index].style.left = (IMAGE_WIDTH * index) + 'px';
    var indicatorList = document.createElement('li');
    indicatorList.setAttribute('id', index);
    indicator.appendChild(indicatorList);
}

indicator.children[0].classList.add('active');
next.addEventListener('click', function (e) {
    autoSlide();
});

previous.addEventListener('click', function (e) {
    backSlide();
});

indicator.addEventListener('click', function(e){
    clearAllAttributes()

    e.target.classList.add('active');
    var curr = e.target.getAttribute('id');
    imageWrapper.style.marginLeft = '-' + (IMAGE_WIDTH * curr) + 'px';
    imageArray[curr].style.display = "block";
    imageArray[curr].classList.add("active");
});

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
setInterval(autoSlide, 4000);

function backSlide() {
    clearAllAttributes()
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = imageArray.length - 1;
    }
    
}

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