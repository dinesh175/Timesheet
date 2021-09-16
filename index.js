var express = require('express');
const bodyParser = require('body-parser')
var session = require('express-session')
const CookieParser = require('cookie-parser');
const cors = require('cors')
//var router = require('./Router/login')
var user = require('./Router/user')
var app = express();

var client = require('./Db/db')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
app.use(bodyParser.json())
app.use(CookieParser());
app.use(session({
    secret: 'gfsgghdth',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    }
}))
app.use('/user', user);
app.post('/login', async function (req, res) {
    //console.log(req.session);
    const response = req.body;

    const JsonFile = JSON.parse(JSON.stringify(response));

    let username = JsonFile["username"];
    let password = JsonFile['password'];
    let Querylogin = `SELECT userid,username,password FROM timesheet.users where username = '${username}' and password = '${password}'`
    let result2 = await client.query(Querylogin);
    //console.log(result2.rows)
    if (result2.rowCount > 0) {
        var resultid = result2.rows[0].userid;
        ///console.log(resultid);
        ///console.log(result2.rows);
        if (result2.rowCount > 0) {

            req.session.userid = resultid
            console.log(req.session.userid);
            return res.status(200).send({ message: `Welcome ${username}` });
        }
        else {
            res.status(403).send({ message: `u r not authorized` })
        }
    }
    else {
        res.status(403).send({ message: `u r not authorized` })
    }
});
app.get('/', async (req, res) => {
    var userid = req.session.userid
    // console.log(userid);

    res.status(403).send({ message: "u r correct person" });
});

app.post('/details', async function (req, res) {
    const response = req.body;
    var userid = req.session.userid
    // console.log(userid);
    const JsonFile = JSON.parse(JSON.stringify(response));

    let projectid = JsonFile["projectid"]
    let date = JsonFile["date"];
    let fromtime = JsonFile['fromtime'];
    let totime = JsonFile["totime"];
    let description = JsonFile["description"];
    //console.log("1")
    let Querycheck = `select userid from timesheet.users
    where userid='${userid}'`
    let result = await client.query(Querycheck);
    //console.log(result.rows[0].userid)
    if (result.rows[0].userid == "undefined" || result.rows[0].userid == '') {
        
        res.status(403).send({ message: `no user` });
    }
    else {
        if (result.rowCount > 0) {
            let Queryinsert = `insert into timesheet.details(projectid,userid,dates,fromtime,totime,description)
        values('${projectid}','${userid}','${date}','${fromtime}','${totime}','${description}');`
            let result2 = await client.query(Queryinsert);
            res.status(200).send({ message: `data inserted sucessfully` });
        }
        else {
            res.status(403).send({ message: `no data saved` });
        }

    }


});


app.listen(8080, () => {
    console.log('server run in 8080')
});