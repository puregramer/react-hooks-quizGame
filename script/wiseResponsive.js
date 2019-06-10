/***
 * file name : wiseResponsive.js
 * description : responsive Class
 * create date : 2018-05-17
 * creator : saltgamer
 ***/

const WiseResponsive = (() => {
    class Responsive {
        constructor() {
            this.currentZoomRate = 0;
            this.target = document.querySelector('#gameScene');
            this.baseContainer = {
                width: this.target.clientWidth,
                height: this.target.clientHeight
            };

            this.update();
            this.setScaleElement();

            window.addEventListener('resize', this.resize.bind(this), false);
            // console.log('| -> target: ', target);
            // console.log('| -> baseContainer: ', this.baseContainer);

        }

        update() {
            this.screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            this.screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        }

        setScaleElement() {
            console.log('--> setScaleElement... ');

            const zoomVertical = this.screenHeight / this.baseContainer.height,
                zoomHorizontal = this.screenWidth / this.baseContainer.width;

            if (this.baseContainer.width * zoomVertical > this.screenWidth) {
                this.setTransformCSS(zoomHorizontal);
                this.target.style.left = '0';
            } else {
                this.setTransformCSS(zoomVertical);
                this.target.style.left = ((this.screenWidth - (this.baseContainer.width * zoomVertical)) / 2)  + 'px';
            }

        }

        setTransformCSS(zoomRate) {
            this.currentZoomRate = zoomRate;
            const target = this.target;

            // console.log('~> setTransformCSS target: ', target);

            target.style.msTransform = 'scale(' + zoomRate + ', ' + zoomRate + ')';
            target.style.webkitTransform = 'scale(' + zoomRate + ', ' + zoomRate + ')';
            target.style.transform = 'scale(' + zoomRate + ', ' + zoomRate + ')';

            target.style.transformOrigin = '0% 0%';
            target.style.msTransformOrigin = '0% 0%';
            target.style.webkitTransformOrigin = '0% 0%';

        }

        resize() {
            this.update();
            this.setScaleElement();
        }


    }
    return new Responsive();
})();
