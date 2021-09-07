import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


export default function SnackBar(props) {
    const handleCloseSnack = () => {
        props.onCloseSnack();
        
    }
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            open={props.openSnack}
            autoHideDuration={6000}
            onClose={handleCloseSnack}
            message={"You are now tracking the " + props.selectedTeam + ". Check your text message for details"}
            action={
                <React.Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnack}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
            }
        />

    )
}
