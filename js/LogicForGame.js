var round = false; // false - сейчас нет раунда, 1 - идет раунд
// Для начала раунда жмем конпку, изменяется индикация, и настройки становятся неактивными и за серым фоном
// Весь экран серый и идет отсчет до начала, когда отсчет закончен, то идет отчет до конца раунда пара секунд и надо выбрать карту, либо луз
// Добавить в настройки кол-во матчей и победитель тот, у кого больше выигрышей в этих матчах
// Победитель объявляется выездом анимки с конфетти 
// Также в настройки добавить ползунок например для скорости анимки у карт (вращение фона, скорость подъема)
//
var chosenCard = null;
var blocker = document.querySelector('.blocker');
var timediv = document.querySelector('.time');

function ForbtnStart()
{
    if (round==false)
    {
        
        round=true;
        //затенение экрана и обратный отсчет по центру, затем старти отчет где-то в другом месте до конца выбора, можно сделать часы, которые трястись будут
        var time=5;
        blocker.innerHTML=time;
        blocker.style.visibility='visible';
        time--;
        var idinterval = setInterval(()=>
        {
            blocker.innerHTML=time;
            if (time==0)
            {
                clearInterval(idinterval);
                Game();
            }
            time--;
        }, 1000);
    }
}

function Game()
{
    blocker.style.visibility='hidden';
    //заблочить потом настройки надо и доступ к ним и сброс игры по нажатию кнопки старт/сброс
    var matchestoplay = countMatches.value;
    // win lose = 0
    wincounter.innerHTML=0;
    losecounter.innerHTML=0;
    if (matchestoplay<=0)
    {
        alert('Кол-во матчей должно быть больше 0');
    }
    //сам раунд
    var idinterval = setInterval(() => {

        DeselectCard();

        matchestoplay--;
        if (matchestoplay<=0)
        {
            clearInterval(idinterval);
            Finish();
        }
    }, timeForMatch*1000);
}
function Finish()
{

}
function DeselectCard()
{
    if (chosenCard==null) return;
    chosenCard.style.borderColor='black';
    chosenCard = null;
}
function ChooseCard(element)
{
    if (chosenCard!=null)
    {
        chosenCard.style.borderColor='black'
    }
    chosenCard = element;
    chosenCard.style.borderColor='red';
}

//Ссылки на настройки
const countMatches = document.querySelector('.matches input');
const animationTime = document.querySelector('.animforcardback input');
const timeForMatch = document.querySelector('.timeformatch input');
const allrounds = document.querySelector('.allrounds');
const wincounter = document.querySelector('.win');
const losecounter = document.querySelector('.lose');

//animationTime.addEventListener('input', () => {timeanim=document.getElementById('idanimforcardback').value;});
timeForMatch.addEventListener('input', () => {timediv.innerHTML = timeForMatch.value});
countMatches.addEventListener('input', () => {allrounds.innerHTML = countMatches.value});
timediv.innerHTML = timeForMatch.value;
allrounds.innerHTML = countMatches.value;
const btnStart = document.querySelector('.button.start'); // кнопка "Старт"
// cards уже содержит карты игрока


//События
btnStart.addEventListener('click', ForbtnStart);
cards.forEach(element => {
    element.addEventListener('click', () => ChooseCard(element));
});
