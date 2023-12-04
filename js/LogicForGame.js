var round = false; // false - сейчас нет раунда, 1 - идет раунд
// Для начала раунда жмем конпку, изменяется индикация, и настройки становятся неактивными и за серым фоном
// Весь экран серый и идет отсчет до начала, когда отсчет закончен, то идет отчет до конца раунда пара секунд и надо выбрать карту, либо луз
// Добавить в настройки кол-во матчей и победитель тот, у кого больше выигрышей в этих матчах
// Победитель объявляется выездом анимки с конфетти 
// Также в настройки добавить ползунок например для скорости анимки у карт (вращение фона, скорость подъема)
//
var chosenCard = null;

function ForbtnStart()
{
    if (round==false)
    {
        round=true;
        //затенение экрана и обратный отсчет по центру, затем старти отчет где-то в другом месте до конца выбора, можно сделать часы, которые трястись будут
    }
}

function ChooseCard(element)
{
    chosenCard = element.className;
}

//Ссылки на настройки
const countMatches = document.querySelector('.matches input');
const animationTime = document.querySelector('.animforcardback input');
const timForMath = document.querySelector('.timeformatch input');


const btnStart = document.querySelector('.button.start'); // кнопка "Старт"
// cards уже содержит карты игрока


//События
btnStart.addEventListener('click', ForbtnStart);
cards.forEach(element => {
    element.addEventListener('click', ChooseCard(element));
});
