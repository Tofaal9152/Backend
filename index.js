import cookieParser from "cookie-parser"
import express from "express"
import mongoose from "mongoose"
import path from 'path'
import jwt from "jsonwebtoken"
const app = express()
const port = 3000
// sharmin
app.use(express.static(path.join(path.resolve(), 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.set('view engine', 'ejs');
// mongoose
mongoose.connect("mongodb://localhost:27017/", {
    dbName: "Authentication"
}).then(() => console.log("Connected")).catch(() => console.log("Disconnected"))

// Registration
const collectionOfEmaiAndPass = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
})
const saveItems = mongoose.model("Information", collectionOfEmaiAndPass)

app.post('/login', async (req, res) => {
    const { password, email } = req.body
    const founded = await saveItems.findOne({ email })
    if (founded) {
        return res.render('logout.ejs')
    }else{
        return res.render('registration.ejs')
    }
})
app.post('/registration', async (req, res) => {
    const { name, email, password } = req.body
    const founded2 = await saveItems.findOne({ email })
    if (founded2) {
        return res.render('login.ejs')
    }
    const information = await saveItems.create({ name: name, email: email, password: password })
    const token = jwt.sign({ _id: information._id }, "bGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJfaWQiOiI2Nj")
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 1000)
    })
    res.redirect('/')

})

app.get('/logout', (req, res) => {

    res.cookie("token", null, {
        httpOnly: true, 
        expires: new Date(Date.now())
    })
    res.redirect('/')
})

// const isAuthenticate = async (req, res, next) => {
//     const { token } = req.cookies
//     if (token) {
//         // const decode = jwt.verify(token, "bGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJfaWQiOiI2Nj")
//         // const founded = await saveItems.findById(decode._id)
//         next()
//     }else {
//         res.render('login.ejs')

//     }
// }

app.get('/', (req, res) => {
    res.render('login.ejs')
})

app.listen(port, () => {
    console.log(`Server running at ${port}`)
})
