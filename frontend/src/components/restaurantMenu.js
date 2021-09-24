import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {makeStyles, withStyles } from '@material-ui/core/styles';
import {
    Typography,
    Box,
    Grid,
    Hidden,
    Card,
    CardActions,
    CardActionArea,
    CardContent,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { orange, teal } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Navigationbar from './navigationbar';
import Dish1 from "../images/dish1.jpeg";
import { getResMenu } from '../app/reducers/mainSlice';

// CSS styles
const useStyles = makeStyles(theme=>({
    mainContainer: {
        height: '100%'
    },
    cardContainer: {
        width: '95vw',
        margin: '1rem auto'
    },
    container : {
        flexDirection: 'column !important',
        marginTop: '4rem',
        paddingTop: '2rem'
    },
    menuItem: {
        background: 'transparent',
        '&:hover': {
            background: '#e5f2fd !important'
        },
        '&:active': {
            color: '#2c5cc5 !important',
            background: '#e5f2fd !important'
        }
    },
    bullet: {
        paddingRight: '1rem',
        fontSize: '24px'
    },
    circle: {
        height: '10px',
        width: '10px',
        display: 'inline-block',
        borderRadius: '50%'
    },
    button: {
        margin: theme.spacing(1),
    },
    formControl: {
        margin: theme.spacing(1),
        marginLeft: '-1px',
        minWidth: '100%',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    ticketsHeader: {
        color: 'black',
        marginLeft: '3rem',
        [theme.breakpoints.down("md")]: {
            marginLeft: '1rem',
        }
    }
}));

const ColorButton = withStyles((theme) => ({
    root: {
        color: 'white',
        backgroundColor: teal[500],
        '&:hover': {
            backgroundColor: teal[700],
        },
    },
}))(Button);

const ColorButton2 = withStyles((theme) => ({
    root: {
        color: 'white',
        backgroundColor: orange[500],
        '&:hover': {
            backgroundColor: orange[700],
        },
    },
}))(Button);

const Tickets = () => {
    const mainReducer = useSelector((state) => state.mainReducer);
    const { resProfile, token, resMenu } = mainReducer;
    console.log("resProfile", resProfile);
    const classes = useStyles();
    const [tickets, setTickets] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [status, setStatus] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [query, setQuery] = React.useState('');
    const [desc, setDesc] = React.useState('');
    const [isEdit, setIsEdit] = React.useState(false);
    const [id, setId] = React.useState('');
    useEffect(() => {
        getTickets();
        getResDishes();
    }, [])
    const dispatch = useDispatch()
    // const classes = useStyles();
    // const {register, handleSubmit, control} = useForm()
    const history = useHistory();
    console.log("token==", token);
    const url =  `/restaurants/${resProfile?.res_id}/dishes`;
    console.log("======url", url);
    const getResDishes = async () => {
        const headers = { 
            'x-access-token': token,
            // 'id': resProfile?.res_id,
        };
        try {
            const res = await axios.get(url, {headers });
            console.log("response",res);
            await dispatch(getResMenu(res.data?.data))
            // setTimeout(() => history.push("/"), 2000);
            
        }catch(err){
            console.log(err)
        }

    }

    useEffect(() => {
        getTickets();
    }, [])

    const handleChange = (event) => {
        setStatus(event.target.value);
    };

    const handleTitle = (event) => {
        setTitle(event.target.value);
    };

    const handleQuery = (event) => {
        setQuery(event.target.value);
    };

    const handleDescription = (event) => {
        setDesc(event.target.value);
    };

    const handleClickOpen = (edit) => {
        setOpen(true);
        setIsEdit(edit);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClear = () => {
        setTitle('');
        setDesc('');
        setQuery('');
        setStatus('');
        setId('');
    };

    const handleEdit = (ticket) => {
        setId(ticket.id);
        setTitle(ticket.title);
        setDesc(ticket.description);
        setQuery(ticket.querytype);
        setStatus(ticket.status);
        handleClickOpen(true);
    }

    const getTickets = async () => {
        const url = 'https://60bf454597295a0017c42497.mockapi.io/tickets';
        const resp = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        }).then((response) => {
            return response.json()
        });
        console.log("=======resp", resp);
        setTickets(resp)
    }

    const handleCreate = async (edit) => {
        const ticketData = {
            title: title,
            querytype: query,
            description: desc,
            status: status
        }
        if (title && query && desc && status && !edit) {
            fetch(url, {
                method: "POST",
                body: JSON.stringify(ticketData),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }).then(async (response) => {
                handleClose();
                handleClear();
                await getTickets();
            });
        } else if (title && query && desc && status && edit) {
            fetch(url + "/" + id, {
                method: "PUT",
                body: JSON.stringify(ticketData),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }).then(async (response) => {
                handleClose();
                handleClear();
                await getTickets();
            });
        }
    }

    const handleDelete = async (id) => {
        await fetch(url + "/" + id, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        }).then(async (response) => {
            await getTickets();
        });
    }

    return (
        <Box component='div' className={classes.mainContainer}>
            <Navigationbar />
            <Grid container className={classes.container} justify="center">
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Typography gutterBottom variant='h5' className={classes.ticketsHeader}>
                        All Dishes
                    </Typography>
                    <ColorButton2
                        variant="contained"
                        color="primary"
                        style={{marginRight: '3rem'}}
                        onClick={function() {handleClickOpen(false)}}
                        className={classes.button}
                    >
                        Add Dishes
                    </ColorButton2>
                </div>
                {console.log("============ResMenu", resMenu)}
                {resMenu.length > 0  && resMenu.map((dish) => {
                    return (
                        <Grid item xs={12} sm={12} md={12} key={0}>
                    <Card className={classes.cardContainer}>
                        {/* <Hidden mdDown> */}
                            <CardActionArea disableRipple style={{display: 'flex', justifyContent: 'start'}}>
                                <CardContent style={{width: '150px', backgroundColor: 'white'}}>
                                    <img src={Dish1} alt="Avatar" style={{ width: '100px', backgroundColor: 'pink', height: '100px', textAlign: 'left'}} />
                                 </CardContent>
                                <CardContent>
                                    <Typography gutterBottom variant='h6' id={dish.id}>
                                        {dish.dish_name}
                                    </Typography>
                                    <Typography variant='body2' style={{color: '#6f7c87', padding: '0 0 10px 0'}} component='p'>
                                        {dish.description}
                                    </Typography>
                                    <Typography variant='body2' component='p'>
                                        <div className={classes.circle} style={{backgroundColor: 'black'}}></div>
                                        <span style={{marginLeft: '1rem'}}>$ {dish.dish_price} </span>
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                <div style={{marginRight: '2rem'}}>
                                <ColorButton onClick={function() {handleEdit(dish)}} variant="contained" startIcon={<EditIcon />} color="primary" className={classes.button}>
                                    Edit
                                </ColorButton>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className={classes.button}
                                        onClick={function() {handleDelete(dish.id)}}
                                        startIcon={<DeleteIcon />}
                                    >
                                        Delete
                                    </Button>
                                </div>
                                </CardActions>
                            </CardActionArea>
                        {/* </Hidden> */}
                        {/* <Hidden mdUp>
                            <CardActionArea disableRipple>
                                <CardContent>
                                    <Typography gutterBottom variant='h6' id={dish.id}>
                                        {dish.dish_name}<span style={{color: 'tomato'}}> #{dish.id}</span>
                                    </Typography>
                                    <Typography variant='body2' style={{color: '#6f7c87', padding: '0 0 10px 0'}} component='p'>
                                        {dish.description}
                                    </Typography>
                                    <Typography variant='body2' component='p'>
                                        <div className={classes.circle} style={{backgroundColor: 'blue'}}></div>
                                        <span style={{marginLeft: '1rem'}}>{dish.dish_price}</span>
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                <div style={{marginRight: '2rem'}}>
                                <ColorButton onClick={function() {handleEdit(dish)}} variant="contained" startIcon={<EditIcon />} color="primary" className={classes.button}>
                                    Edit
                                </ColorButton>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className={classes.button}
                                        onClick={function() {handleDelete(dish.id)}}
                                        startIcon={<DeleteIcon />}
                                    >
                                        Delete
                                    </Button>
                                </div>
                                </CardActions>
                            </CardActionArea>
                        </Hidden> */}
                    </Card>
                </Grid>)})}
                <div>
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Dish Detail</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            Enter query details to create a ticket.
                        </DialogContentText>
                        <TextField
                            margin="dense"
                            id="name"
                            value={title}
                            onChange={handleTitle}
                            label="Title"
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="description"
                            value={desc}
                            onChange={handleDescription}
                            label="Description"
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="query"
                            value={query}
                            onChange={handleQuery}
                            label="Query Type"
                            fullWidth
                        />
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={status}
                                onChange={handleChange}
                                >
                                    <MenuItem value={1}>Active</MenuItem>
                                    <MenuItem value={2}>Resolved</MenuItem>
                                    <MenuItem value={3}>On Hold</MenuItem>
                                </Select>
                        </FormControl>
                        </DialogContent>
                        <DialogActions>
                        <Button variant="contained" onClick={function() {handleCreate(isEdit)}} color="primary">
                            Submit
                        </Button>
                        </DialogActions>
                </Dialog>
            </div>
            </Grid>
        </Box>
    )
}

export default Tickets;
