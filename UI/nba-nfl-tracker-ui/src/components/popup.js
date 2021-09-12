import {useState, useRef} from 'react'
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { DialogContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MuiPhoneNumber from "material-ui-phone-number";
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import ReCAPTCHA from "react-google-recaptcha";


//https://dev.to/samirasaad/environment-variables-for-a-react-js-app-329j
//might have to change npm build after this

// https://codesandbox.io/s/0x7mqonlw0?file=/src/CreateUserDialog.js
const dotenv = require('dotenv');
const {REACT_APP_RECAPTCHA_KEY, REACT_APP_VERIFY_URL,REACT_APP_ALERTS_URL, REACT_APP_GREETING_URL} = process.env;





const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        alignContent: 'center',
        
        

    },
    dialog: {
        margin: 10,
        

    },
    number: {
        height: theme.spacing(10),
    },
    team: {
        height: theme.spacing(5),
        fontSize: "1.3em"
    },
    title: {
        height: theme.spacing(3),
        
    },
    text: {
        height: theme.spacing(5),
    },
    slider: {
        height: theme.spacing(5),
        margin: 2,
        

    },
    form: {
        height: theme.spacing(20),
    },
    cancel:{
        margin: theme.spacing(1),
        marginRight: theme.spacing(3)
    },
    recaptchaErrorText:{
        color:"#ff0000"
    }

}));

const marks = [

    {
        value: 19,
        label: 'Anytime',
    },
    {
        value: 20,
        label: '8pm',
    },
    {
        value: 21,
        label: '9pm',
    },
    {
        value: 22,
        label: '10pm',
    },
    {
        value: 23,
        label: '11pm',
    },
    {
        value: 24,
        label: '12am',
    },
];



function valuetext(value) {
    return { value };
}

const initialFormValues = {
    alert_category: "All Game Starts",
    phone_number: "",
    team_name:"",
    time_restriction: "Anytime",
    is_active: true,
}

export default function Popup(props) {
    //form validation
    //re structure code, creatre reusable components + clean up
    // backend
    const reRef = useRef();
    let timeMap ={};
    marks.forEach(time =>{
        timeMap[time.value]=time.label;
    });

    const classes = useStyles();
    const { onClose, selectedTeam, open, onOpenSnack } = props;
    const [values, setValues] = useState({...initialFormValues});
    const [errors, setErrors] = useState({});
    const [captcha,setCaptcha] = useState();
    

    const handleClose = () => {
        setErrors({})

        setValues({
            ...initialFormValues
        })

        // Destructuring seems to work instead of iteration
        // for (const property in initialFormValues){
        //     setValues({
        //         ...values,
        //         [property]:initialFormValues[property]
        //     })
        // }

        onClose();

    };

    const handleSubmit = async (event) => {
        //add push notification as well
        event.preventDefault();
        const hasPassed = await validate();
        if(hasPassed){
            try{
                const alertResponse = fetch(REACT_APP_ALERTS_URL, {
                    method:"POST",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify(values)
                });

                const greetingResponse = fetch(REACT_APP_GREETING_URL,{
                    method:"POST",
                    headers: {"Content-Type": "application/json"},
                    body:JSON.stringify(values)
                });
                const openSnack =  Promise.all([alertResponse,greetingResponse]);
                openSnack.then(onOpenSnack(selectedTeam));
            } catch(err){
                console.error(err.message);
            }
        
            
            setValues({
                ...initialFormValues
            })
            setErrors({})
            onClose();
        }
        
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setValues({
            ...values,
            [name]: value
        })

    };

    const handleNumberChange = (value) => {

        setValues({
            ...values,
            "phone_number": value,
            "team_name":selectedTeam
        })

    };

    const handleSliderChange = (_, value) => {
        setValues({
            ...values,
            "time_restriction": timeMap[value]
        })

    };
    
    const handleRecaptcha=(value)=>{
        setCaptcha(value);
        return true
    };

    const validate = async () =>{


        const verifyToken = await fetch(REACT_APP_VERIFY_URL, {
            method:"POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({token:captcha})
        });

        const response = await verifyToken.json();
        let temp  = {};
        let parsedNumber = values.phone_number;
        parsedNumber = parsedNumber.replace(/\s+/g, "");
        parsedNumber = parsedNumber.replace(/[&\/\\#,+()$~%.'":*?<>{}-]/g, '');
        temp.phone_number = parsedNumber.length>7 ? "" : "Please enter a valid phone number";
        temp.recaptcha = response.success ? "":response.msg;
        
        reRef.current.reset();
        setCaptcha("");
        
        setErrors({
            ...temp
        })

        return Object.values(temp).every(x => x === "");
        
    }



    return (
        //change title to have styling
        //map time restriction to text
        //submit to db?
        <Dialog className={classes.dialog} onClose={handleClose} open={open}>
            <DialogTitle>
                <Typography className={classes.team} align="center">
                    {selectedTeam}
                </Typography>
                <Typography className={classes.title}>
                    Enter your phone number to be reminded of future games
                </Typography>
            </DialogTitle>
            <DialogContent className={classes.dialog}>
                <form>
                    <Grid container className={classes.root}>
                        <Grid item xs={12}>
                            <MuiPhoneNumber className={classes.number}
                                name="phoneNumber"
                                label="Phone Number"
                                data-cy="user-phone"
                                defaultCountry={"us"}
                                disableAreaCodes='true'
                                value={values.phone_number}
                                onChange={handleNumberChange}
                                error={errors.phone_number ? true:false}
                                helperText={errors.phone_number}


                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl component="fieldset" className={classes.form}>
                                <FormLabel component="legend">Text Me For</FormLabel>
                                <RadioGroup aria-label="gender" name="alert_category" defaultValue={initialFormValues.alert_category} onChange={handleInputChange}>
                                    <FormControlLabel name="alert_category" value="All Game Starts" control={<Radio />} label="All Game Starts" />
                                    <FormControlLabel name="alert_category" value="All Game Halftimes" control={<Radio />} label="All Game Halftimes" />
                                    <FormControlLabel name="alert_category" value="When the Game is Good" control={<Radio />} label="When the Game is Good" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography className={classes.text} id="discrete-slider-custom" gutterBottom align="center">
                                Text Me Before
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Slider className={classes.slider} onChange={handleSliderChange}
                                defaultValue={19}
                                getAriaValueText={valuetext}
                                aria-labelledby="discrete-slider"
                                valueLabelDisplay="off"
                                step={1}
                                marks={marks}
                                min={19}
                                max={24}
                                name="time_restriction"

                            />
                        </Grid>

                        <Grid item xs={12}  align="right" justifycontent="right">
                            <ReCAPTCHA 
                            sitekey={REACT_APP_RECAPTCHA_KEY}
                            ref={reRef}
                            onChange={handleRecaptcha}/>
                            <Typography className={classes.recaptchaErrorText}>
                                {errors.recaptcha}
                            </Typography>
                        </Grid>
                        
                        <Grid container justifycontent="flex-end">
                            <Grid align="right" item xs={12}>
                                <Button className={classes.cancel}
                                    color="primary"
                                    // className={this.props.classes.cancelButton}
                                    // data-cy="cancel-create-user"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            onClick ={handleSubmit}
                                        >
                                            Submit
                                </Button>

                            </Grid>

                                    
                        </Grid>
                    </Grid>
                   
                </form>
            
            </DialogContent>
        </Dialog>
    )
}
