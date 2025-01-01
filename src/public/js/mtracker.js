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
    tagyHracov = document.getElementById("nepridaniHraci").querySelectorAll('.playerTag')
    tagyHracov.forEach(tag => { tag.remove() })
    const searchValue = searchBar.value
    let zoznamHracov = []

    try {
        const response = await fetch(`${window.location.protocol}//${window.location.host}/hraci?filter=${searchValue}`);
        zoznamHracov = await response.json();
    } catch (error) { console.error(error); }

    zoznamHracov.forEach(hrac => {
        if (!pridaniHraci.some(player => player.id === hrac.id)) {
            const hracDiv = document.createElement('div');
            hracDiv.className = "playerTag"
            hracDiv.innerHTML = `<h4>${hrac.name}</h4><div style="display: flex; justify-content: space-between; align-items: center;"><p>${hrac.goly}</p><p>${hrac.prihravky}</p></div>`
            hracDiv.addEventListener('click', () => {
                if (hracDiv.parentElement.id == "nepridaniHraci"){
                    document.getElementById("pridaniHraci").appendChild(hracDiv)
                    pridaniHraci.push(hrac)
                }else{
                    hracDiv.remove()
                    pridaniHraci = pridaniHraci.filter(player => player.id !== hrac.id);
                }
            })

            document.getElementById("nepridaniHraci").appendChild(hracDiv)
        }
    });
})