import express from "express"
import mongoose from "mongoose"
import path from 'path'
const app = express()
const port = 3000
// 
app.use(express.static(path.join(path.resolve(), 'public')))
app.use(express.urlencoded({ extended: true }))
// mongoose
mongoose.connect("mongodb://localhost:27017/", {
    dbName: "bacskend"
}).then((e) => console.log("Connected to mongoDB")).catch((e) => console.log("Not Connected to mongoDB"))

const messageSchema = new mongoose.Schema({
    email: String,
    password: String
})
const Emails = mongoose.model("Emails", messageSchema)
// 
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs')
})
app.post('/contact', (req, res) => {
    const {email,password} =req.body
    Emails.create({email,password })
    res.redirect("success")
})

app.get('/success', (req, res) => {
    res.render('success.ejs')
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
