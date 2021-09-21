const express = require("express");
const bodyParser = require("body-parser");
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const app = express();
const port = 5000;
const cors = require("cors");
const pool = require("./db")
const fetch = require("node-fetch");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));

const nbaTeams = ["76ers", "bucks", "bulls", "cavaliers", "celtics", "clippers", "grizzlies", "hawks", "heat", "hornets", "jazz", "kings", "knicks", "lakers", "magic", "mavericks", "nets", "nuggets", "pacers", "pelicans", "pistons", "raptors", "rockets", "spurs", "suns", "thunder", "timberwolves", "trail blazers", "warriors", "wizards"];																									
const nflTeams = ["49ers", "bears", "bengals", "bills", "broncos", "browns", "buccaneers", "cardinals", "chargers", "chiefs", "colts", "cowboys", "dolphins", "eagles", "falcons","football team", "giants", "jaguars", "jets", "lions", "packers", "panthers", "patriots", "raiders", "rams", "ravens", "saints", "seahawks", "steelers", "texans", "titans", "vikings"];																																																	
//ROUTES//
// Create Alert
app.post("/alerts", async(req,res) =>{
    try {
        console.log(req.body);
        const {alert_category, phone_number,team_name, time_restriction,is_active} = req.body;
        const parsed_phone_number = parseNumber(phone_number);
        const newAlert = await pool.query("INSERT INTO alerts (alert_category, phone_number,team_name, time_restriction, is_active) VALUES($1,$2,$3,$4,$5) ON CONFLICT (phone_number,team_name) DO UPDATE SET alert_category = EXCLUDED.alert_category , time_restriction = EXCLUDED.time_restriction , is_active = EXCLUDED.is_active RETURNING *",[alert_category, parsed_phone_number, team_name, time_restriction,is_active])
        
        res.sendStatus(200).end();
    } catch (error) {
        console.log(error.message);

    }

})

// Create Welcome Message
app.post("/greeting", async(req,res)=>{
    try{
        console.log(req.body);
        const {alert_category, phone_number, team_name, time_restriction,is_active} = req.body;

        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilio_phone_number = process.env.TWILIO_PHONE_NUMBER;
        const client = require('twilio')(accountSid, authToken);
        const message = "You will now recieve game updates for the "+team_name+"\n\n\n"+"Reply 'Remove "+ team_name + "' to unsubscribe from this team."+"\n"+ "Reply STOP to unsubscribe from all teams.";

        client.messages
        .create({
            body: message,
            from: twilio_phone_number,
            to: phone_number
        })
        .then(message => console.log(message.sid)).catch(e => { console.error('Got an error:', e.code, e.message); });;

        res.sendStatus(200).end();

    } catch(error){
        console.log(error.message);
    }
})

// add logic to avoid spammers
// Remove alerts from a team
app.post('/remove', async (req,res) =>{
    const phone_number = req.body.From;
    let text = req.body.Body;
    let splitText = text.split(" ");
    let team_name = "";

    const parsed_phone_number = parseNumber(phone_number);
    for(let i = 0; i<splitText.length;i++){
        if (nbaTeams.includes(splitText[i].toLowerCase()) || nflTeams.includes(splitText[i].toLowerCase())){
            console.log(splitText[i]);
            team_name = splitText[i];
            break;
        }
    }

    const twiml = new MessagingResponse();
    if (team_name != ""){
        const removeAlert = await pool.query("DELETE FROM alerts WHERE phone_number = $1 AND team_name = $2",[parsed_phone_number,team_name])
        twiml.message("Your alerts for the " + team_name + " have been removed.");
    }
    else{
        twiml.message("Invalid team name");
    }
    res.writeHead(200,{'Content-Type':'text/xml'});
    res.end(twiml.toString());
})

// Verify recaptcha token
app.post('/verify', async (req, res) => {
    if (
        req.body.token === undefined || req.body.token === "" || req.body.token === null
    ) {
        return res.json({ "success": false, "msg": "Please select captcha" });
    }

    try {
        const secretKey = process.env.RECAPTCHA_SECRET;
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.token}`;
        const verifiedCaptcha = await fetch(verifyUrl, {
            method: "POST"
        });

        const status = await verifiedCaptcha.json();

        if (status.success) {
            res.json({ "success": true, "msg": "Captcha completed" })
        }
        else {
            res.json({ "success": false, "msg": "Please select captcha" });
        }
 
    }
    catch (error) {
        return res.json({ "success": false, "msg": "Please select captcha" });
    }
   

})


app.listen(port, () =>{
    console.log("Server has started on port "+ port);
})


const parseNumber = (number) =>{
    let parsedNumber = number;
    parsedNumber = parsedNumber.replace(/\s+/g, "");
    parsedNumber = parsedNumber.replace(/[&\/\\#,+()$~%.'":*?<>{}-]/g, '');
    return parsedNumber
};