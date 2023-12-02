const rotatingGradient = document.querySelectorAll('.card-undef, .card-rock, .card-paper, .card-scissors');
var percent = 0;
var time = 25; // в ms
var step = 1/time;
setInterval(() => {
    rotatingGradient.forEach(element => {
        element.style.background = `conic-gradient(from ${percent*360}deg, #ff6600, #ffcc00, #ff6600)`;
        });
    percent+=step;
    percent%=1;
}, time);
// потом в меню добавить настройки цветов, типа градиента, может быть