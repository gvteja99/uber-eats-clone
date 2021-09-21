import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';
import DehazeIcon from '@material-ui/icons/Dehaze';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import {
    ListItemText,
    Avatar,
    Divider,
    Toolbar,
    ListItemIcon,
    List,
    Box,
    AppBar,
    ListItem,
    IconButton,
    Button
} from '@material-ui/core';
import {
    Home
} from '@material-ui/icons';
import MobileeRightMenuSlider from '@material-ui/core/Drawer';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';

import avatar from '../images/dish_icon.jpeg';
import app_logo from '../images/logo_appbar.svg';
import { onResLogout, onCustomerLogout } from '../app/reducers/mainSlice';
import axios from 'axios';

// CSS styles
const useStyles = makeStyles(theme=>({
    sidebarContainer: {
        background: '#F9F9F9',
        height: '100%',
        width: '100%',
        minWidth: '250px',
        paddingTop: '60px'
    },
    icon: {
        display: 'block',
        margin: '0.4rem auto',
        marginBottom: '3rem',
        width: theme.spacing(12),
        height: theme.spacing(12),
        borderRadius: 0,
    },
    listItemStyle: {
        color: 'black'
    }
}));

const Navigationbar = () => {
    const classes = useStyles();
    const mainReducer = useSelector((state) => state.mainReducer);
    useEffect(() => {}, [])
    const history = useHistory();
    const dispatch = useDispatch()
    const { userType, token } = mainReducer;
    // console.log("userType", userType, ",t:",token)

    const [state, setState] = useState({ right: false })

    const toggleSlider = (slider, open) => () => {
        setState({...state, [slider]: open});
    };
    // console.log("token==", token);
    const url =  "/restaurants/profile";

    const logoutApi = async () => {
        const { resProfile, token, customerProfile } = mainReducer;
        const url = userType == "1" ? "/logout/customer" : "/logout/restaurant";
        const headers = { 
            'x-access-token': token,
        };
        const body = {
            email: userType === 1 ? customerProfile?.email: resProfile?.email ,
            token,
        };
        // console.log("body", body);
        try {
            const res = await axios.post(url,body, {headers});
            console.log("response",res);
            userType === 1 ? dispatch(onCustomerLogout(res.data)): dispatch(onResLogout(res.data)); 
            setTimeout(() => history.push("/login"), 2000);
            
        }catch(err){
            console.log(err)
        }
    }

    const afterResLoginItems = [
        {
            itemText: 'Restaurant Profile',
            itemPath: '/res_profile',
        },
        {
            itemIcon: <Home />,
            itemText: 'Dashboard',
            itemPath: '/'
        },
        {
            itemText: 'Restaurant Menu',
            itemPath: '/restaurant/menu',
        },
        {
            itemIcon: <ConfirmationNumberIcon />,
            itemText: 'Tickets',
            itemPath: '/tickets'
        },
    ];

    const afterCustomerLoginItems = [
        {
            itemIcon: <Home />,
            itemText: 'Dashboard',
            itemPath: '/customer'
        },
        {
            itemText: 'Profile',
            itemPath: '/customer_profile'
        },
        {
            itemIcon: <ConfirmationNumberIcon />,
            itemText: 'Tickets',
            itemPath: '/tickets'
        },
    ];


    const beforeLogin = [
        {
            itemIcon: <Home />,
            itemText: 'Dashboard',
            itemPath: '/',
        },
        {
            itemIcon: <Home />,
            itemText: 'Login',
            itemPath: '/login'
        },
        {
            itemText: 'Customer Signup',
            itemPath: '/customer_signup',
        },
        {
            itemText: 'Restaurant Signup',
            itemPath: '/res_signup',
        },
    ];

    const menuItems = token ? (userType === 1 ? afterCustomerLoginItems : afterResLoginItems) : beforeLogin

    const sidebarList = slider => (
        <Box component='div'
            className={classes.sidebarContainer}
            onClick={toggleSlider(slider, false)}
        >
            <Avatar className={classes.icon} src={avatar} alt='' />
            <Divider />
            <List>
                {menuItems.map((listItem, key) => (
                    <ListItem button key={key} component={Link} to={listItem.itemPath}>
                        {/* <ListItemIcon className={classes.listItemStyle}>{listItem.itemIcon}</ListItemIcon> */}
                        <ListItemText className={classes.listItemStyle} primary={listItem.itemText} />
                    </ListItem>
                ))}
            </List>
            {token &&
                <Button
                    // type="submit"
                    fullWidth
                    // variant="outlined"
                    color="black"
                    className={classes.submit}
                    onClick={() => logoutApi()}
                    style={{  width: 100}}
                >
                    Logout
                </Button>
            }
        </Box>
    );
    return (
        <>
            <Box component='nav'>
                <AppBar position='fixed' style={{background: 'white'}}>
                    <Toolbar style={{display: 'flex', width: '100%'}}>
                        <MobileeRightMenuSlider open={state.right}
                            onClose={toggleSlider('right', false)}
                            anchor='right'>
                            {sidebarList('right')}
                        </MobileeRightMenuSlider>
                        <img src={app_logo} width={'124'} height={'82'} alt='' />
                        <IconButton onClick={toggleSlider('right', true)} style={{ position: 'absolute', right: '2%'}}>
                            <DehazeIcon style={{color: 'black'}} />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    )
}

export default Navigationbar;
