import { getHraci } from "./search.js";
import { convertToMinutes } from "./functions/Convert.js";

let hraci = getHraci()

document.getElementById("closeModal").addEventListener("click", () => {
    let id = 0

    document.getElementById("stats").querySelectorAll(".playerStat").forEach(playerStatTag => playerStatTag.remove())
    document.getElementById("hraci").querySelectorAll(".playerNameTag").forEach(playerNameTag => playerNameTag.remove())
    document.getElementById("drop").querySelectorAll(".playerNameTag").forEach(playerNameTag => playerNameTag.remove())

    hraci = getHraci()
    hraci.forEach(hrac => {
        console.log(hrac)
        hrac.generateStatElement('stats')
        hrac.generateElement('hraci')
        hrac.nameElement.addEventListener('dragstart', dragStart)
        hrac.nameElement.id = `nameTag-${id}`
        hrac.dndId = `nameTag-${id}`
        ++id

        if(hrac.cas.interval) stopniCas(hrac)
    })

})

//  ##########

const drop = document.getElementById('drop')
const casomieraButton = document.getElementById('casomieraButton')
const casDisplay = document.getElementById('casDisplay')

let hlavnyCasovacBezi = false
let hlavnyCasovac = {interval: null, elapsed: 0}

casomieraButton.addEventListener('click', () => {
    hlavnyCasovacBezi = !hlavnyCasovacBezi
    casomieraButton.textContent = hlavnyCasovacBezi ? 'Stop' : 'Štart';

    if (hlavnyCasovacBezi) {
        zapniCasovace();
        hlavnyCasovac.interval = setInterval(() => {
            hlavnyCasovac.elapsed++
            casDisplay.innerText = convertToMinutes(hlavnyCasovac.elapsed)
        }, 1000)
    } else {
        stopniCasovace();
        clearInterval(hlavnyCasovac.interval)
        hlavnyCasovac.interval = null
    }
});

function zapniCasovace() {
    hraci.forEach(hrac =>{
        if(hrac.nameElement.parentElement == drop){
            zapniCas(hrac)
        }
    })
}

function stopniCasovace() {
    hraci.forEach(hrac => stopniCas(hrac))
}

function zapniCas(hrac) {
    if (!hrac.cas.interval) {
        hrac.cas.interval = setInterval(() => {
            hrac.cas.elapsed++;
            updateTimerDisplay(hrac);
        }, 1000);
    }
}

function stopniCas(hrac) {
    if (hrac.cas.interval) {
        clearInterval(hrac.cas.interval);
        hrac.cas.interval = null;
    }
}

function updateTimerDisplay(hrac) {
    const timer = hrac.casomiera.querySelector('.display')
    timer.textContent = `${hrac.cas.elapsed} s`;
}

// ##########

drop.addEventListener('dragover', dragOver);
drop.addEventListener('drop', dropFunkcia);

function dragStart(event) {
    event.dataTransfer.setData('text', event.target.id);
}

function dragOver(event) {
    event.preventDefault();
}

function dropFunkcia(event) {
    event.preventDefault();

    const nameTagId = event.dataTransfer.getData('text');
    const nameTag = document.getElementById(nameTagId);

    // Calculate the position of the drop relative to the big area
    const dropRect = drop.getBoundingClientRect();
    const dropX = event.clientX - dropRect.left - nameTag.offsetWidth / 2;
    const dropY = event.clientY - dropRect.top - nameTag.offsetHeight / 2;

    // Update the element's position
    nameTag.style.left = `${Math.max(0, Math.min(drop.offsetWidth - nameTag.offsetWidth, dropX))}px`;
    nameTag.style.top = `${Math.max(0, Math.min(drop.offsetHeight - nameTag.offsetHeight, dropY))}px`;
    nameTag.style.position = "absolute";

    // Append to the drop area
    drop.appendChild(nameTag);

    // Start timer for the player
    if (hlavnyCasovacBezi) zapniCas(hraci.find(hrac => hrac.dndId == nameTagId));

    // Add a single click listener for the element if not already added
    if (!nameTag.dataset.listenerAdded) {
        nameTag.addEventListener('click', () => {
            const hraciContainer = document.getElementById('hraci');
            hraciContainer.appendChild(nameTag);

            // Reset position styles
            nameTag.style.position = '';
            nameTag.style.left = '';
            nameTag.style.top = '';

            // Stop the timer for the player
            stopniCas(hraci.find(hrac => hrac.dndId == nameTagId));
        });

        // Mark listener as added
        nameTag.dataset.listenerAdded = true;
    }
}