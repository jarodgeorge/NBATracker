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


//ROUTES//
// https://www.youtube.com/watch?v=ldYcgPKEZC8&t=1310s&ab_channel=CodingEntrepreneursCodingEntrepreneursVerified

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
        const message = "You will now recieve game updates for the "+team_name+"\n\n\n"+"Reply STOP to unsubscribe from all teams.";

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
//need to test with actual server hosted 
// to remove team by team? request that in the payload?
app.post('/remove',async(req,res) =>{
    const {phone_number, team_name} = req.body;
    const parsed_phone_number = parseNumber(phone_number);
    //add call to remove from db
    // console.log(req);
    const twiml = new MessagingResponse();
    const removeAlert = await pool.query("DELETE FROM alerts WHERE phone_number = $1 AND team_name = $2",[parsed_phone_number,team_name])
    twiml.message("Your alerts for this team have been removed.");

    res.writeHead(200,{'Content-Type':'text/xml'});
    res.end(twiml.toString());
})
//add recaptcha functionality
//https://www.youtube.com/watch?v=UzCkSzmEq8E&ab_channel=TraversyMedia

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

// Delete Alert
app.listen(port, () =>{
    console.log("Server has started on port "+ port);
})


const parseNumber = (number) =>{
    let parsedNumber = number;
    parsedNumber = parsedNumber.replace(/\s+/g, "");
    parsedNumber = parsedNumber.replace(/[&\/\\#,+()$~%.'":*?<>{}-]/g, '');
    return parsedNumber
};