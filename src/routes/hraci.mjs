import { Router } from "express"
const router = Router()
let db = [
    { id: 1, name: "John", goly: 0, prihravky: 0 },
    { id: 2, name: "Jane", goly: 0, prihravky: 0 },
    { id: 3, name: "Bob", goly: 0, prihravky: 0 },
    { id: 4, name: "Peter", goly: 0, prihravky: 0 }
]

router.get("/hraci", (req, res) => {
    const { query: { filter } } = req

    if (!filter) return res.send(db.slice(0, 20));

    return res.send(
        db.filter((hrac) => hrac.name.includes(filter))
    )
})

export default router