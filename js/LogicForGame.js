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

const cardtoindex = new Map([["card-rock", 0],["card-scissors", 1],["card-paper", 2]]);

function ForbtnStart()
{
    var idinterval;
    if (round==false)
    {
        round=true;
        //затенение экрана и обратный отсчет по центру, затем старти отчет где-то в другом месте до конца выбора, можно сделать часы, которые трястись будут
        var time=5;
        blocker.innerHTML=time;
        blocker.style.visibility='visible';
        time--;
        idinterval = setInterval(()=>
        {
            blocker.innerHTML=time;
            if (time==0)
            {
                Game();
                clearInterval(idinterval);
            }
            time--;
        }, 1000);
    }
    else
    {
        round = false;
        clearInterval(idinterval);
        clearInterval(fortimer);
        clearInterval(idintervalround);
    }
}
var fortimer = 0, idinterval = 0;
var winc = 0, losec = 0;
function Game()
{
    blocker.style.visibility='hidden';
    //заблочить потом настройки надо и доступ к ним и сброс игры по нажатию кнопки старт/сброс
    var matchestoplay = countMatches.value;
    winc = losec = 0
    wincounter.innerHTML=winc;
    losecounter.innerHTML=losec;
    if (matchestoplay<=0)
    {
        alert('Кол-во матчей должно быть больше 0');
    }
    var timeformatch = timeForMatch.value;
    //сам раунд
    idintervalround = setInterval(() => {
        var botcard = cards[Math.floor(Math.random()* 3)];
        var compareres = CompareCards(chosenCard, botcard);
        if (compareres == 1)
        {
            winc++;
            wincounter.innerHTML=winc;
        }
        else if (compareres == -1)
        {
            losec++;
            losecounter.innerHTML=losec;
        }
        else
        {
            matchestoplay++;
        }
        DeselectCard();
        matchestoplay--;
        if (matchestoplay<=0)
        {
            clearInterval(idintervalround);
            Finish();
        }
    }, timeForMatch.value*1000);
    fortimer = setInterval(() =>
    {        
        timeformatch--;
        timediv.innerHTML = timeformatch;
        if (timeformatch<=0 && matchestoplay>=1)
        {
            timeformatch=timeForMatch.value;
            timediv.innerHTML = timeformatch;
        }
        else
        {
            if(timeformatch<=0 && matchestoplay<=0) 
            {
                clearInterval(fortimer);
            }
        }
    }, 1000);
}
// надо сделать анимацию проигрыша, выигрыша, движения и переворота карт игроков например за секунду и стопать таймер для функции в этот момент, ну хз как js даст мне это сделать
function Finish()
{
    round = false;
    if (winc > losec)
    {
        console.log("Победа");
    }
    else
    {
        console.log("Проигрыш");
    }
}
function CompareCards(card1, card2)
{
    // 0 камень, 1 ножницы, 2 бумага
    if (card1==null)
    {
        return -1;
    }
    var matrix = [
        [0, 1, -1], // камень
        [-1, 0, 1], // ножницы
        [1, -1, 0]  // бумага
    ];
    return matrix[cardtoindex.get(card1.className)][cardtoindex.get(card2.className)];

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
