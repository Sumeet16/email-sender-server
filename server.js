const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
var nodeoutlook = require('nodejs-nodemailer-outlook')
app.use(express.json())

dotenv.config({ path: `./config.env` });


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors({
    origin: ["*"],
    methods: ["GET", "POST"],
    credentials: true
}))

app.post('/sendit', async (req, res) => {
    try {
        const { info, templateInput } = req.body

        const sender = (email) => {
            nodeoutlook.sendEmail({
                auth: {
                    user: process.env.user,
                    pass: process.env.pass,
                },
                from: process.env.user,
                to: email,
                subject: 'Apologies from our side',
                html: templateInput,
                text: templateInput,
                replyTo: process.env.user,

                onError: (e) => console.log(e),
                onSuccess: (i) => console.log(i),
            });
        }

        info.forEach(element => {
            sender(element)
        });

        res.json({ message: "Email send to all users...", json: "200" });
    } catch (error) {
        console.log(error);
    }
});

const port = process.env.PORT || 3002;

app.listen(port, () => console.log(`Listening on port ${port}....`));