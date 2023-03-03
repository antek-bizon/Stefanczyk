const express = require("express")
const hbs = require("express-handlebars")
const path = require("path")
const PORT = 3000
const app = express()
let context = require("./data/data.json")

app.use(express.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/partials",
    helpers: {
        prettyPrice: function (price) {
            let float = parseFloat(price)
            price = `${float.toFixed(2)} $`
            return price
        },
        imgStars: function (num) {
            num = parseInt(num)
            let arr = []
            for (let i = 0; i < num; i++) {
                arr.push('img')
            }
            return arr
        }
    }
}));

app.get("/", function (req, res) {
    context.arr = ["--wybierz--"]
    context.stars = []
    for (let i = 0; i < context.items.length; i++) {
        let alreadyPushed = false
        for (let j = 0; j < context.arr.length; j++) {
            if (context.items[i].category == context.arr[j]) {
                alreadyPushed = true
                break
            }
        }
        if (!alreadyPushed) {
            context.arr.push(context.items[i].category)
        }

        alreadyPushed = false
        for (let j = 0; j < context.stars.length; j++) {
            if (context.items[i].stars == context.stars[j]) {
                alreadyPushed = true
                break
            }
        }
        if (!alreadyPushed) {
            context.stars.push(context.items[i].stars)
        }
    }
    // console.log(context.items[0].img_stars)

    res.render("index.hbs", context)
})

app.post("/handle", function (req, res) {
    let filter = { items: [] }
    if (req.body.kategoria != "--wybierz--") {
        for (let i = 0; i < context.items.length; i++) {
            if (req.body.kategoria == context.items[i].category) {
                filter.items.push(context.items[i])
            }
        }
    } else {
        for (let i = 0; i < context.items.length; i++) {
            if (req.body.stars == context.items[i].stars) {
                filter.items.push(context.items[i])
            }
        }
    }

    res.render("filter.hbs", filter)
})

app.use(express.static("static"))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
