const express = require("express");
const bodyParser = require("body-parser");
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const app = express();
const port = 5000;
const cors = require("cors");
const pool = require("./db")

app.use(cors());
app.use(express.json());


//ROUTES//
// https://www.youtube.com/watch?v=ldYcgPKEZC8&t=1310s&ab_channel=CodingEntrepreneursCodingEntrepreneursVerified

// Create Alert
app.post("/alerts", async(req,res) =>{
    try {
        console.log(req.body);
        const {alert_category, phone_number, team_name, time_restriction,is_active} = req.body;
        const parsed_phone_number = parseNumber(phone_number);
        const newAlert = await pool.query("INSERT INTO alerts (alert_category, phone_number, team_name, time_restriction, is_active) VALUES($1,$2,$3,$4,$5) ON CONFLICT (phone_number,team_name) DO UPDATE SET alert_category = EXCLUDED.alert_category , time_restriction = EXCLUDED.time_restriction , is_active = EXCLUDED.is_active RETURNING *",[alert_category, parsed_phone_number, team_name, time_restriction,is_active])
        
        res.json(newAlert);
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
        const message = "You will now recieve game updates for the "+team_name+"\n\n\n"+"Reply REMOVE to stop recieving updates for this team. Reply STOP to unsubscribe from all teams.";

        client.messages
        .create({
            body: message,
            from: twilio_phone_number,
            to: phone_number
        })
        .then(message => console.log(message.sid));

        res.sendStatus(200).end();

    } catch(error){
        console.log(error.message);
    }
})

app.post('remove',(req,res) =>{
    print(req);
    const twiml = new MessagingResponse();

    twimil.message("Your alerts for this team have been removed.");

    res.writeHead(200,{'Content-Type':'text/xml'});
    res.end(twiml.toString());

}
)

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