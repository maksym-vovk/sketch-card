export default () => {
    var linkNav = document.querySelectorAll('[href^="#"]'),
        V = 0.1;

    for (var i = 0; i < linkNav.length; i++) {
        linkNav[i].addEventListener('click', function (e) {
            e.preventDefault();

            var w = window.pageYOffset, // текущая позиция прокрутки
                hash = this.getAttribute('href'), // получаем хеш якоря
                target = document.querySelector(hash); // находим элемент по хешу

            if (!target) return; // если элемент не найден, ничего не делаем

            var t = target.getBoundingClientRect().top - 20, // расстояние до элемента
                start = null;

            requestAnimationFrame(step);

            function step(time) {
                if (start === null) start = time;
                var progress = time - start,
                    r = (t < 0 ? Math.max(w - progress / V, w + t) : Math.min(w + progress / V, w + t));

                window.scrollTo(0, r);

                if (r !== w + t) {
                    requestAnimationFrame(step);
                } else {
                    history.replaceState(null, null, hash); // меняем хеш в адресной строке без резкого скролла
                }
            }
        }, false);
    }
};