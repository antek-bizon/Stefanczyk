const express = require("express")
const app = express()
const PORT = 3000
const path = require("path")
const bodyParser = require("body-parser")
/*
let users = [
    {nick:"111", email:"111@w.pl"},
    {nick:"222", email:"222@w.pl"},
    {nick:"333", email:"333@w.pl"}
]
*/
let users = ["111@w.pl", "222@w.pl", "333@w.pl"]

app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function (req, res) {
    console.log("/")

    res.sendFile(path.join(__dirname + "/static/addUser.html"))
})

app.post("/handleAddUser", function (req, res) {
    console.log(req.body)
    let found = false
    for (let i = 0; i < users.length; i++) {
        if (req.body.email == users[i]) {
            found = true
            break
        }
    }

    if (found) {
        res.send("Taki mail już jest w bazie")
    } else {
        users.push(req.body.email)
        res.send("Mail został dodany do bazy")
    }
    
    console.log(users)
})

app.get("/removeBySelect", function (req, res) {
    console.log("By Select")
    
    let fileString = []
    users.forEach((e, i) => {
        fileString.push(`<option value="${i}">` + e + "</option>")
    })

    res.send("<form action='/deleteUser' method='post'><select name='index'>" + 
    fileString.join("") + 
    "</select><br><input type='submit'></input></form>")
})

app.get("/removeByRadio", function (req, res) {
    console.log("By Radio")
})

app.get("/removeByCheckbox", function (req, res) {
    console.log("By Checkbox")
})

app.post("/deleteUser", function (req, res) {
    users.splice(req.body.index, 1)
    
})

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})