export class Slider {
    constructor(element, autoplay = false, delay = 4000) {
        this.class = 'slider';
        this.container = element;
        this.containerWrapper = this.container.querySelector(`.${this.class}__wrapper`);;
        this.slidesWrapper = this.container.querySelector(`.${this.class}__list`);
        this.slides = this.container.querySelectorAll(`.${this.class}__item`);
        this.arrowLeft = this.container.querySelector(`.${this.class}__arrow--left`);
        this.arrowRight = this.container.querySelector(`.${this.class}__arrow--right`);
        this.dotItems = this.container.querySelectorAll(`.${this.class}__dot-item`);
        this.animate = true;
        this.currentIndex = 0;
        this.startX = 0;
        this.delay = delay;
        this.autoplay = autoplay;        
        this.numberOfSlides = this.isInViewport();
        this.timeout = null;
        
        this.init();
    }

    init() {
        if (this.autoplay) this.autoplaySlider();
        if (this.numberOfSlides >= this.slides.length) {
            this.arrowLeft.style.display = 'none';
            this.arrowRight.style.display = 'none';
            this.autoplay = false;
            return;
        }       

        this.slides[0].classList.add(`${this.class}__item--active`);        

        if (this.dotItems.length) {            
            [...this.dotItems][0].classList.add(`${this.class}__dot-item--active`);
        }

        this.setEventListeners(); 
    }

    autoplaySlider() {
        this.timeout = setTimeout(() => this.moveToNext(), this.delay);
    }

    setEventListeners() {
        this.arrowLeft.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.moveToPrev();
        });

        this.arrowRight.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.moveToNext();
        });

        if (this.dotItems.length) {
                [...this.dotItems].forEach((dot, index)=> {
                dot.addEventListener('click', () => {
                    this.currentIndex = index;
                    this.moveSlide();
                });
            });
        }

        this.slidesWrapper.addEventListener('touchstart', (evt) => {
            this.startX = (evt.touches || evt.originalEvent.touches)[0].clientX;
        }, {passive: true});

        this.slidesWrapper.addEventListener('touchmove', (evt) => {
            if (!this.startX) return;

            const xDelta = this.startX - (evt.touches || evt.originalEvent.touches)[0].clientX;

            if (xDelta > 20) {
                this.moveToNext();
                this.startX = null;
            } else if (xDelta < -20) {
                this.moveToPrev();
                this.startX = null;
            }
        }, {passive: true});
    }

    moveToNext() {
        if (this.animate) {
            this.animate = false;
            this.currentIndex += 1;
            if (this.currentIndex > this.slides.length - this.numberOfSlides) {
                this.currentIndex = 0;
            }
            this.moveSlide();
        }
    }

    moveToPrev() {
        if (this.animate) {
            this.animate = false;
            this.currentIndex -= 1;
            if (this.currentIndex < 0) {
                this.currentIndex = this.slides.length - this.numberOfSlides;
            }

            this.moveSlide();
        }
    }

    moveSlide() {
        clearTimeout(this.timeout);
        const newPosition = this.slides[this.currentIndex].getBoundingClientRect().left - this.slidesWrapper.getBoundingClientRect().left;
        this.changeActiveSlide(this.currentIndex);
        this.slidesWrapper.style.transform = `translate3d(-${newPosition}px, 0, 0)`;
        if (this.dotItems.length) this.dotMove(this.currentIndex);
        this.animate = true;
        if (this.autoplay) this.autoplaySlider();
    }

    changeActiveSlide(index) {
        [...this.slides]
            .find(slide => slide.classList.contains(`${this.class}__item--active`))
            .classList.remove(`${this.class}__item--active`);
        this.slides[index].classList.add(`${this.class}__item--active`);
    }

    dotMove(index) {
        [...this.dotItems].forEach(dot => {
            if (dot.classList.contains(`${this.class}__dot-item--active`)) {
                dot.classList.remove(`${this.class}__dot-item--active`);
            }
        });
        [...this.dotItems][index].classList.add(`${this.class}__dot-item--active`);   
    }

    isInViewport() {
        const containerXPosition = this.containerWrapper.getBoundingClientRect().x;
        const containerWidth = this.containerWrapper.getBoundingClientRect().width;
        let numberOfSlides = 0;
        this.slides.forEach(slide => {
            const slidePosition = slide.getBoundingClientRect().x;
            if (slidePosition < containerXPosition + containerWidth && slidePosition >= containerXPosition) {
                numberOfSlides++;
            }
        });
        return numberOfSlides;
    }
}
