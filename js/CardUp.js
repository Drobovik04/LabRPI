// const cards = document.querySelectorAll('.card-rock, .card-paper, .card-scissors');
// var percent = 0;
// var time = 15; // в ms
// var step = 1/time;
// var data = {percent:percent};
// function Up(card, data, step, iddown)
// {
//     if (iddown !=-1)
//     {
//         clearInterval(iddown);
//     }
//     card.addEventListener('mouseleave',
//     ()=> {
//         Down(card, data, step, idint);
//     });  
//     var idint = setInterval(()=>
//     {
//         card.style.transform = `translateY(-${10*data.percent}px)`;
//         data.percent+=step; 
//         if (data.percent >= 1)
//         {         
//             card.removeEventListener('mouseenter', Up);
//             clearInterval(idint);
//         }
//     }, time);
// }
// function Down(card, data, step, idup)
// {
//     clearInterval(idup);
//     var idint = setInterval(()=>
//     {
//         card.style.transform = `translateY(-${10*data.percent}px)`;
//         data.percent-=step;
//         if (data.percent <= 0)
//         {            
//             card.removeEventListener('mouseleave', Down);
//             clearInterval(idint);
//         }
//     }, time);
// }
// cards.forEach(card =>
// {
//     card.addEventListener('mouseenter',
//     ()=> {
//         Up(card, {percent:0}, step, -1);
//     });
// });
// //