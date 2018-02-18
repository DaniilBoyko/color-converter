
(function() {
    
    'use strict';

    const $document = document;
    const $body = $document.body;

    let ColorPicker = {
        limit: 23,
        el: $document.querySelector('[data-color-picker]'),
        wrap: $document.createElement('ul'),

        createItem(index) {

            let baseColor = '#000000';
            let colorPickerItem = $document.createElement('li');
            let randomHex = baseColor.replace(/0/g, function() {
                return (~~(Math.random() * 16)).toString(16);
            });

            colorPickerItem.classList.add('js-color-picker-i-' + index);
            colorPickerItem.setAttribute('data-color', randomHex);
            colorPickerItem.setAttribute('title', randomHex);
            colorPickerItem.style.backgroundColor = randomHex;

            this.wrap.appendChild(colorPickerItem);

        },

        createSet() {

            for (var i = 0; i <= this.limit; i += 1) {
                this.createItem(i);
            }

            this.el.appendChild(this.wrap);

            return this;

        },

        addEvents() {

            this.el.addEventListener('click', e => {

                let color;

                if (e.target && e.target.nodeName === 'LI') {
                    color = e.target.getAttribute('data-color');
                    color = hexToRgb(color);

                    let R = color.r;
                    let G = color.g;
                    let B = color.b;

                    setInputNumber(RED, R);
                    setInputNumber(GREEN, G);
                    setInputNumber(BLUE, B);
                    update();
                }

            }, false);

            return this;

        },

        init() {

            this.createSet().addEvents();

        }
    };

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }


    ColorPicker.limit = 15;

    ColorPicker.init();

}());