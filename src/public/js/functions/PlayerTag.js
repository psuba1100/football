export class TagHraca {
    constructor(dbData) {
        this.id = dbData.id
        this.name = dbData.name
        this.prihravky = dbData.prihravky
        this.goly = dbData.goly
        this.nameElement = null

        this.statGoly = 0
        this.statPrihravky = 0
        this.cas = {interval: null, elapsed: 0}

        this.dndId = 0
    }
    generateElement(parentId) {
        let hracDiv = document.createElement('div');
        hracDiv.className = "playerNameTag"
        hracDiv.innerHTML = `<h2>${this.name}</h2>`
        hracDiv.setAttribute('draggable', 'true');
        document.getElementById(parentId).appendChild(hracDiv)
        this.nameElement = hracDiv
        return hracDiv
    }
    generateUnassignedElement(parentId) {
        let hracDiv = document.createElement('div');
        hracDiv.className = "playerTag"
        hracDiv.innerHTML = `<h4>${this.name}</h4><div style="display: flex; justify-content: space-between; align-items: center;"><p>${this.goly}</p><p>${this.prihravky}</p></div>`
        document.getElementById(parentId).appendChild(hracDiv)
        return hracDiv
    }
    generateStatElement(parentId) {
        let div = document.createElement('div')
        div.className = "playerStat"
        div.innerHTML = `
            <div class="playerStat">
                <h4>${this.name}</h4>
                <div class="btns">
                    <div class="btn goly">
                        <p>Góly</p>
                        <p class="display">${this.statGoly}</p>
                    </div>
                    <div class="btn prihravky">
                        <p>Prihrávky</p>
                        <p class="display">${this.statPrihravky}</p>
                    </div>
                    <div class="btn cas">
                        <p>Čas</p>
                        <p class="display">${this.cas.elapsed} s</p>
                    </div>
                </div>
            </div>`
        let goly = div.querySelector('.btns').querySelector('.goly')
        let prihravky = div.querySelector('.btns').querySelector('.prihravky')
        this.casomiera = div.querySelector('.btns').querySelector('.cas')
        goly.addEventListener("click", () => {
            this.statGoly++
            goly.querySelector('.display').textContent = this.statGoly
        })

        prihravky.addEventListener("click", () => {
            this.statPrihravky++
            prihravky.querySelector('.display').textContent = this.statPrihravky
        })

        document.getElementById(parentId).appendChild(div)
    }
}