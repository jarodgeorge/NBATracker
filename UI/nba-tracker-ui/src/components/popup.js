import React from 'react'
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { DialogContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MuiPhoneNumber from "material-ui-phone-number";
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';

// https://codesandbox.io/s/0x7mqonlw0?file=/src/CreateUserDialog.js
const useStyles = makeStyles((theme) => ({
    dialog:{
    }
    
}));

export default function Popup(props) {
    const classes = useStyles();
    const { onClose, selectedTeam, open } = props;

    const handleClose = () => {
      onClose();
    };

    return (
        //change title to have styling
        //make form
        //handle user input
        <Dialog className={classes.dialog} onClose={handleClose} open={open}>
            <DialogTitle>
                <div>{selectedTeam}</div>
                Enter your phone number to be alerted when future games start
            </DialogTitle>
            <DialogContent>
            <MuiPhoneNumber
                name="phone"
                label="Phone Number"
                data-cy="user-phone"
                defaultCountry={"us"}
                disableAreaCodes='true'
                // value={this.state.phone}
                // onChange={this.handlePhoneChange}
            />

            <Grid
                container
                justify="flex-end"
                // className={this.props.classes.buttonContainer}
                >
                <Button
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
                    data-cy="create-user"
                >
                    Submit
                </Button>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}
