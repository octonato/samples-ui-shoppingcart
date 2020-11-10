import * as React from 'react';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import withRoot from '../withRoot';
import { Button, Grid, TextField } from '@material-ui/core';
import { User } from '../stores/index'
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

const styles = (theme: Theme) =>
    createStyles({
        root: {

        },
        button: {
            margin: theme.spacing(1),
        },
        buttonBar: {
            textAlign: "right"
        },
        editorContainer:{
            paddingTop: "20px"
        },
        padding: {
            padding: theme.spacing(2),
            minWidth: 600,
            textAlign:"center",
        },
        connected: {
            color: "green"
        },
        failed: {
            color: "red"
        }
    });


interface Props {
    onClose: () => void;
    onUserAdded: (User) => void;
    open: boolean;
    store: any;
};

type State = {
    name: string;
    avatar: string;
    hostname: string;
    connected: boolean;
    connectError: string;
}



class UserDialog extends React.Component<Props & WithStyles<typeof styles>, State> {
    state = {name: "", avatar: "imgs/" + Math.round(Math.random()*23) + ".png", hostname: window.localStorage.getItem("hostname") || "", connected: false, connectError: undefined }

    handleClose = () => {
        this.props.onClose();
    };
    onChange = (key) => (event) => {
        let x = {}
        x[key] = event.target.value;
        this.setState(x);
    }
    handleAddUser = () => {
        this.setState({name: "", avatar: "imgs/" + Math.round(Math.random()*23) + ".png" });

        this.props.onUserAdded({name: this.state.name, avatar: this.state.avatar, online: true} as User);
    }
    handleConnect = () => {
        const hostname = !/^https?\:\/\//.test(this.state.hostname) ? "https://"+this.state.hostname : this.state.hostname;
        this.props.store.api.setHostname(hostname);
        window.localStorage.setItem("hostname", this.state.hostname);
        this.props.store.api.getCart({name: "test", avatar: "test", online: true} as User).then( (x) =>{
            this.setState({connected:true});
        }).catch( (err) => {
            console.error("error", err);
            this.setState({connectError:err.toString()});
        });
    }
    handleAvatarSelect = (avatar) => {
        this.setState({avatar});
    }

    render() {
        const  classes = this.props.classes;
        let avtarImage = []
        for(var i=0; i<=23; i++)avtarImage.push("imgs/"+i+".png");
        return (
            <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.props.open} maxWidth="lg">
                {this.state.connected ?
                    <div className={classes.padding}>
                        <DialogTitle id="te-dialog-title">Choose a Username</DialogTitle>
                        <Grid item xs={12} className={classes.padding}>
                            <Typography variant="h6" gutterBottom className={classes.connected}>
                              <CheckIcon />  You are connected
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.padding}>
                            <TextField label={"Select a user name to store the cart under."} type="text"
                                       onChange={this.onChange("name")} value={this.state.name} required id="name"
                                       fullWidth/>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleAddUser}
                                disabled={
                                    !(this.state.name != "")
                                }
                                className={classes.button}>
                                Login
                            </Button>
                        </Grid>
                    </div>
                    :
                    <div className={classes.padding}>
                        <DialogTitle id="te-dialog-title">Configure your Backend</DialogTitle>
                        {this.state.connectError?
                        <Grid item xs={12} className={classes.padding}>
                            <Typography variant="h6" className={classes.failed} gutterBottom><CloseIcon /> {this.state.connectError}</Typography>
                        </Grid>: null}
                        <Grid item xs={12} className={classes.padding}>
                            <TextField label={"Enter the hostname of your exposed shopping-cart service."} type="text"
                                       onChange={this.onChange("hostname")} value={this.state.hostname} required
                                       id="hostname" fullWidth/>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleConnect}
                                disabled={
                                    !(this.state.hostname != "")
                                }
                                className={classes.button}>
                                Connect
                            </Button>
                        </Grid>
                    </div>
                }
            </Dialog>
        );
    }
}

export default withRoot(withStyles(styles)(UserDialog));