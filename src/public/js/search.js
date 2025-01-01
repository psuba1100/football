import { Request } from "./functions/Request.js";
import { TagHraca } from "./functions/PlayerTag.js";

const otvorModal = document.getElementById('pridatHraca');
const zatvorModal = document.getElementById('closeModal')
const modal = document.getElementById('pridanieHracov');
const searchBar = document.getElementById('vyhladanieHraca')

let pridaniHraci = []

otvorModal.addEventListener("click", () => {
    modal.showModal()
})

zatvorModal.addEventListener("click", () => {
    modal.close()
})

searchBar.addEventListener('input', async () => {
    let tagyHracov = document.getElementById("nepridaniHraci").querySelectorAll('.playerTag')
    tagyHracov.forEach(tag => { tag.remove() })

    const searchValue = searchBar.value
    let zoznamHracov = []
    let request = new Request().setSufix(`/hraci?filter=${searchValue}`)
    zoznamHracov = await request.send()

    zoznamHracov.forEach(hrac => {
        if (!pridaniHraci.some(player => player.id === hrac.id)) {
            const tagHraca = new TagHraca(hrac)
            const hracDiv = tagHraca.generateUnassignedElement("nepridaniHraci")

            hracDiv.addEventListener('click', () => {
                if (hracDiv.parentElement.id == "nepridaniHraci") {
                    document.getElementById("pridaniHraci").appendChild(hracDiv)
                    pridaniHraci.push(tagHraca)
                } else {
                    hracDiv.remove()
                    pridaniHraci = pridaniHraci.filter(player => player.id !== hrac.id);
                }
            })
        }
    });
})

export function getHraci() {
    return pridaniHraci
}