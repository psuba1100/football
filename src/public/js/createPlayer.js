import { Request } from "./functions/Request.js"
const btn = document.getElementById("submit")
const display = document.getElementById("players")

btn.addEventListener("click", async ()=>{
    const menoHraca = document.getElementById("menoHraca").value
    const request = new Request().setBody({username: menoHraca}).setSufix("/createPlayer").setMethod("POST")
    const user = await request.send()
    
    display.innerText = ""
    user.players.forEach(element => {
        display.innerText = `${display.innerText}${element}\n`
    });
})