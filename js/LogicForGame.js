var round = false; // false - сейчас нет раунда, 1 - идет раунд
// Для начала раунда жмем конпку, изменяется индикация, и настройки становятся неактивными и за серым фоном
// Весь экран серый и идет отсчет до начала, когда отсчет закончен, то идет отчет до конца раунда пара секунд и надо выбрать карту, либо луз
// Добавить в настройки кол-во матчей и победитель тот, у кого больше выигрышей в этих матчах
// Победитель объявляется выездом анимки с конфетти 
// Также в настройки добавить ползунок например для скорости анимки у карт (вращение фона, скорость подъема)
//
var chosenCard = null;
var botCard = null;
var blocker = document.querySelector('.blocker');
var blockerformenu = document.querySelector('.blockerformenu');
var timediv = document.querySelector('.time');
var historyofgames = document.querySelector('#historyofgames');
var counterforcards = document.querySelector('#counterforcards');
var orange_chart = document.querySelector('#orange-chart');
var orange_chart_percent = document.querySelector('#orange-chart-percent');
var idmatchesinput = document.getElementById('idmatches');
var idtimeformatchinput = document.getElementById('idtimeformatch');
var backfortime = document.querySelector('.backfortime');
var skiptimer = false;

var counterarray = [0,0,0,0,0]; // счетчик для карт
var winsandloses = [0,0]; // победы, проигрышы

//Ссылки на настройки
const countMatches = document.querySelector('.matches input');
const animationTime = document.querySelector('.animforcardback input');
const timeForMatch = document.querySelector('.timeformatch input');
const allrounds = document.querySelector('.allrounds');
const wincounter = document.querySelector('.win');
const losecounter = document.querySelector('.lose');
const btndeletehistory = document.querySelector('.button.deletehistory');
const cardtoindex = new Map([["card-rock", 0],["card-scissors", 1],["card-paper", 2],["card-lizard", 3],["card-fox", 4]]);
const cards = document.querySelectorAll('.card-rock, .card-paper, .card-scissors, .card-lizard, .card-fox');
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
btndeletehistory.addEventListener('click', ClearHistoryAndStorage);

window.addEventListener('load',LoadFromLocalStorage);
window.addEventListener('load',() => 
{
    console.log('Игра "Камень-ножницы-бумага"\n \
                 1. В игре можно настроить длительность одного матча в раунде, а также кол-во необходимых побед для выигрыша в матче\n \
                 2. Кнопка "Старт/Стоп" начинает обратный отсчет до старта, также может остановить игру в любой момент, и начать ее сначала\n \
                 3. Справа от песочных часов таймер на матч, по достижению нуля игрок и бот показывают свои карты, затем выбирается победитель, который получает + балл (зеленое число - счет побед игрока, красное - бота)\n \
                 4. Если игрок ничего не выбрал, то автоматически проигрывает\n \
                 5. Карта бота - слева, карта игрока - справа\n \
                 6. После набора необходимого количества побед ботом или игроком, появляется надпись о проигрыше или победе игрока\n \
                 7. Игры, которые были доиграны до конца, добавляются в историю (localStorage), историю можно очистить с помощью соответствующей кнопки');
});

function LoadFromLocalStorage()
{
    var t1 = localStorage.getItem('table1');
    var t2 = localStorage.getItem('table2');
    var winrate = localStorage.getItem('winrate');
    if(t1!=null)historyofgames.innerHTML=t1;
    if(t2!=null)
    {
        counterarray = t2.split(',').map(Number);
        ChangeCounterForCards();
    }
    else
    {
        ChangeCounterForCards();
    }
    if (winrate!=null)
    {
        winsandloses = winrate.split(',').map(Number);
        ChangeWinRate();
    }
}

function CheckSkipTimer(checkbox)
{
    if (checkbox.checked)
    {
        skiptimer = true;
    }
    else
    {
        skiptimer = false;
    }
}

function ForbtnStart()
{
    var idinterval;
    if (RegExp("^[1-9][0-9]*$").exec(idmatchesinput.value) == null ||RegExp("^[1-9][0-9]*$").exec(idtimeformatchinput.value) == null)
    {
        console.log('Неверный ввод');
        alert('Неверный ввод');
        return;
    }
    DeselectCard();
    if (round==false)
    {
        round=true;
        //затенение экрана и обратный отсчет по центру, затем старти отчет где-то в другом месте до конца выбора, можно сделать часы, которые трястись будут
        var time=3;
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
        blockerformenu.style.visibility='hidden';
        clearInterval(idinterval);
        clearInterval(fortimer);
        //clearInterval(idintervalround);
    }
}
var fortimer = 0, idinterval = 0;
var winc = 0, losec = 0;
var placeForCompare = document.querySelector('.spaceforcards');

//Проблема с ранним скипом, если выбран чекбокс на 

function Game()
{
    blocker.style.visibility='hidden';
    blockerformenu.style.visibility='visible';
    //заблочить потом настройки надо и доступ к ним и сброс игры по нажатию кнопки старт/сброс
    var matchestoplay = countMatches.value;
    winc = losec = 0
    wincounter.innerHTML=winc;
    losecounter.innerHTML=losec;
    if (matchestoplay<=0)
    {
        alert('Кол-во матчей должно быть больше 0');
        return;
    }
    var timeformatch = timeForMatch.value;
    timediv.innerHTML = timeformatch;
    var locked = false;
    var rotationfortime = false;
    var timepassed = 0;
    fortimer = setInterval(async() =>
    {        
        if (locked==false)
        {
            locked=true;
            if (timepassed<1000 & !(skiptimer & chosenCard!=null))
            {
                timepassed+=100;
            }
            else
            {
                timepassed=0;
                timeformatch--;
                timediv.innerHTML = timeformatch;
                backfortime.style.transform=`rotate(${rotationfortime?0:180}deg)`;
                rotationfortime=!rotationfortime;
                if ((skiptimer & chosenCard!=null) || timeformatch<=0)
                {
                    botCard = cards[Math.floor(Math.random()* 5)];
                    var compareres = CompareCards(chosenCard, botCard);
                    MoveCards();
                    if (compareres == 1)
                    {
                        winc++;
                        wincounter.innerHTML=winc;
                        placeForCompare.innerHTML="<";
                    }
                    else if (compareres == -1)
                    {
                        losec++;
                        losecounter.innerHTML=losec;
                        placeForCompare.innerHTML=">";
                    }
                    else
                    {
                        placeForCompare.innerHTML="=";
                    }
                    counterarray[cardtoindex.get(botCard.className.split(" ")[1])]++;
                    if (chosenCard!=null)counterarray[cardtoindex.get(chosenCard.className.split(" ")[1])]++;
                    ChangeCounterForCards();
                    DeselectCard();
                    await sleep(1000);
                    RemoveCards();
                    if (matchestoplay==winc||matchestoplay==losec)
                    {
                        //clearInterval(idintervalround);
                        clearInterval(fortimer);
                        timediv.innerHTML = timeForMatch.value;
                        Finish();
                    }
                    timeformatch=timeForMatch.value;
                    timediv.innerHTML = timeformatch;
                }
            }
            locked=false;
        }
    }, 100);
}
// надо сделать анимацию проигрыша, выигрыша, движения и переворота карт игроков например за секунду и стопать таймер для функции в этот момент, ну хз как js даст мне это сделать
function Finish()
{
    round = false;
    blocker.style.visibility = 'visible';
    var prevcolor = blocker.style.color;
    if (winc > losec)
    {
        console.log("Победа");
        blocker.style.color = 'green';
        blocker.innerHTML = 'Победа';
        winsandloses[0]++;
    }
    else
    {
        console.log("Проигрыш");
        blocker.style.color = 'red';
        blocker.innerHTML = 'Проигрыш';
        winsandloses[1]++;
    }
    var functionForFinish = function()
    {
        blocker.style.visibility = 'hidden';
        blocker.removeEventListener('click',functionForFinish);
        blocker.style.color=prevcolor;
        blockerformenu.style.visibility = 'hidden';
    }
    MakeRecordForHistory();
    ChangeWinRate();
    blocker.addEventListener('click',functionForFinish);
}
function CompareCards(card1, card2)
{
    // 0 камень, 1 ножницы, 2 бумага, 3 ящерица, 4 лиса
    if (card1==null)
    {
        return -1;
    }
    var matrix = [
        [0, 1, -1, 1, -1], // камень
        [-1, 0, 1, 1, -1], // ножницы
        [1, -1, 0, -1, 1], // бумага
        [-1, -1, 1, 0, 1], // ящерица
        [1, 1, -1, -1, 0]  // лиса
    ];
    return matrix[cardtoindex.get(card1.className.split(" ")[1])][cardtoindex.get(card2.className.split(" ")[1])];

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
function MoveCards()
{
    var targetForPlayer = document.querySelector('.placeforplayercard');
    var targetForBot = document.querySelector('.placeforbotcard');
    if (chosenCard!=null)
    {
        var clonePlayerCard = chosenCard.cloneNode(true);
        clonePlayerCard.style.borderColor='black'
        clonePlayerCard.style.transform='';
        chosenCard.visibility = false;
        targetForPlayer.appendChild(clonePlayerCard);
    }
    var cloneBotCard = botCard.cloneNode(true);
    cloneBotCard.style.borderColor='black'
    cloneBotCard.style.transform='';
    targetForBot.appendChild(cloneBotCard);
}
function RemoveCards()
{
    var targetForPlayer = document.querySelector('.placeforplayercard');
    var targetForBot = document.querySelector('.placeforbotcard');
    targetForBot.removeChild(targetForBot.firstChild);
    if (targetForPlayer.childElementCount!=0)targetForPlayer.removeChild(targetForPlayer.firstChild);
    placeForCompare.innerHTML="";
}
function ChangeCounterForCards()
{
    counterforcards.innerHTML = `<tr><td>${counterarray[0]}</td><td>${counterarray[1]}</td><td>${counterarray[2]}</td><td>${counterarray[3]}</td><td>${counterarray[4]}</td></tr>`;
}
function MakeRecordForHistory()
{
    /* table1 */
    var template = document.createElement('tr');
    var res = winc>losec;
    var rec = `<td class="res">${res==true?'Игрок':'Бот'}<td class="wins">${winc}</td><td class="loses">${losec}</td></td>`;
    template.innerHTML = rec;
    historyofgames.appendChild(template);
    SaveToLocalStorageBad();
}
function SaveToLocalStorageBad()
{
    var toStorage = '';
    var elementsToStorage = historyofgames.querySelectorAll('tr');
    elementsToStorage.forEach(element => {
        toStorage+=element.outerHTML;
    });
    localStorage.setItem('table1', toStorage);
    localStorage.setItem('table2', counterarray);
    localStorage.setItem('winrate', winsandloses);
}
function ClearHistoryAndStorage()
{
    localStorage.clear();

    historyofgames.innerHTML='';
    counterforcards.innerHTML='';
}
function ChangeWinRate()
{
    var winrate = winsandloses[0]/(winsandloses[0]+winsandloses[1]) * 100;
    winrate = Math.round(winrate * 100) / 100;
    orange_chart.setAttribute('stroke-dasharray',`${winrate},100`);
    orange_chart_percent.innerHTML=`${winrate}%`;
}

function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
  }