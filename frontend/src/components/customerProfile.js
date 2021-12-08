import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navigationbar from './navigationbar.js';
import { useHistory } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useMutation,
  useLazyQuery,
  gql
} from "@apollo/client";
import axios from 'axios';
import { 
    Avatar, CssBaseline, Button, Container, FormControl, FormLabel, FormControlLabel,
    makeStyles, Link, Grid, Checkbox, Typography, TextField, Radio, RadioGroup, MenuItem,
    Card, CardActions, CardContent, CardMedia, IconButton,
} from '@material-ui/core';

import { AccountCircle} from '@material-ui/icons';
import {useForm, Controller} from 'react-hook-form'
import { updateCustomerProfile } from '../app/reducers/mainSlice';
import { isValidEmail } from '../utility.js';
import { UPDATE_PROFILE } from '../graphql/mutation.js';
import { GET_CUSTOMER_PROFILE } from '../graphql/queries.js';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(12),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.success.light,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  textInput: {
      borderColor: theme.palette.success.light,
  }
}));

export default function CustomerProfile() {
    const mainReducer = useSelector((state) => state.mainReducer);
    const { customerProfile, token } = mainReducer;
    console.log("customerProfile", customerProfile);
    const [firstName, setFirstName] = useState(customerProfile && ( customerProfile?.first_name ||  ""));
    const [lastName, setLastName] = useState(customerProfile && ( customerProfile?.last_name ||  ""));
    const [dob, setDob] = useState(customerProfile?.dob || "");
    const [email, setEmail] = useState(customerProfile?.email ||  "");
    const [phone, setPhone] = useState(customerProfile?.phone_number || "");
    const [nickName, setNickName]= useState(customerProfile?.nickname || "");
    const [about, setAbout]= useState(customerProfile?.about || "");
    const [profilePic, setProfilePic] = useState(customerProfile?.profile_pic ||  "");
    const [streetAddress, setStreetAddress] = useState(customerProfile?.address?.street_address ||  "");
    const [aptNumber, setAptNumber] = useState(customerProfile?.address?.apt_number ||  "");
    const [city, setCity] = useState(customerProfile?.address?.city ||  "san jose");
    const [state, setState] = useState(customerProfile?.address?.state ||  "california");
    const [country, setCountry] = useState(customerProfile?.address?.country ||  "united states");
    const [zipcode, setZipcode] = useState(customerProfile?.address?.zipcode ||  "95111");
    const [fileText, setFileText] = useState("Choose image..");
    const [file, setFile] = useState("");
    // const [profileUrl, setProfileUrl] = useState("");

    useEffect(() => {
      // getCustomerProfileApi();
    }, [profilePic])

    const countries = [
        {
          value: 'united states',
          label: 'United States',
        },
        {
          value: 'india',
          label: 'India',
        },
        {
          value: 'canada',
          label: 'Canada',
        },
        {
          value: 'germany',
          label: 'Germany',
        },

      ];
    

    const dispatch = useDispatch()
    const classes = useStyles();
    const {register, handleSubmit, control} = useForm();
    const history = useHistory();

  //   const GET_CUSTOMER_PROFILE = gql`
  //   query getCustomerProfile($id: ID!) {
  //     getCustomerProfile(id: $id) {
  //       _id first_name last_name email password phone_number dob nickname profile_pic about token
  //       address { street_address apt_number city state country zipcode }
  //     }
  //  }
  // `; 


    const { loading: getProfileLoading, error: getProfileError, data: getProfileData} = useQuery(
      GET_CUSTOMER_PROFILE,
      {
        variables: { id: customerProfile?._id}
      }
    );


    if (!getProfileError && !getProfileLoading ) {
      console.log("GetprofileDATA:", getProfileData);
      const { getCustomerProfile } = getProfileData;
      dispatch(updateCustomerProfile(getCustomerProfile))

    }
    if (getProfileError) return `Error!: ${getProfileError}`;

    

    // if (!error && !loading ) {
    //   console.log("DATA:", data);
    //   const { getCustomerProfile } = data;
    //   dispatch(updateCustomerProfile(getCustomerProfile))

    // }
    // if (error) return `Error!: ${error}`;


    // const getCustomerProfileApi = async () => {
    //   const url =  `/customers/${customerProfile?._id}/profile`;
    //   const headers = { 
    //       'Authorization': token,
    //   };
    //   try {
    //       const res = await axios.get(url, {headers});
    //       console.log("response",res);
    //       await dispatch(updateCustomerProfile(res.data))
          
    //   }catch(err){
    //       console.log(err)
    //   }

    // }

    // const UPDATE_PROFILE = gql`
    //   mutation updateCustomerProfile(
    //     $customer_id: ID! $email: String! $first_name: String! $last_name: String! $phone_number: String
    //     $description: String $dob: String $nickname: String $profile_pic: String $about: String
    //     $street_address: String $apt_number: String $city: String $state: String $country: String $zipcode: Int
    //   ) {
    //     updateCustomerProfile(customerInput: {
    //       customer_id: $customer_id email: $email first_name: $first_name last_name: $last_name phone_number: $phone_number
    //       description: $description dob: $dob nickname: $nickname profile_pic: $profile_pic about: $about
    //       street_address: $street_address apt_number: $apt_number city: $city state: $state country: $country zipcode: $zipcode
    //     }) {
    //       _id first_name last_name email password phone_number dob nickname profile_pic about token
    //       address { street_address apt_number city state country zipcode }
    //     }
    //     }
    // `; 

    const [updateProfile, {data: updateProfileData, error: updateProfileError, loading: updateProfileLoading}] = useMutation(UPDATE_PROFILE, {
      onCompleted(res) {
        console.log("da", res);
        dispatch(updateCustomerProfile(res.updateCustomerProfile))
        setTimeout(() => history.push("/"), 100);
      }
    });

    const updateCustomerProfileApi = async () => {
      if(!validateInputs()) {
        return false;
      }
      updateProfile({
        variables: {
          // customerInput: {
          customer_id: customerProfile?._id,
          first_name: firstName,
          last_name: lastName,
          address_id: customerProfile?.customer_address_id,
          email: customerProfile?.email,
          phone_number: phone,
          description: `${firstName} is ${lastName} a good customer`,
          dob,
          nickname: nickName,
          about: about,
          profile_pic: profilePic,
          street_address: streetAddress,
          apt_number: aptNumber,
          city: city,
          state: state,
          country: country,
          zipcode: parseInt(zipcode),
      }});
    }

    const validateInputs = () =>  {
      if (!firstName) {
        alert("Needs first name");
        return false
      }
      if (!lastName) {
        alert("Needs last name");
        return false
      }
      if (!email) {
        alert("Needs email");
        return false
      }
      if (!isValidEmail(email)) {
        alert("Invalid Email");
        return false
      }
      if (!city) {
        alert("Needs city");
        return false
      }
      if (!country) { 
        alert("Needs country");
        return false
      }
      return true
    }
    const onClickSubmit = (data) => {
        console.log("calling")
        updateCustomerProfileApi();
    }
    const onError = (errors, e) => {
        console.log("errors", errors, "e", e);
    }

    const onImageChange = (e) => {
      setFileText(e.target.files[0].name)
      setFile(e.target.files[0])
    }

    const onUpload = async(e) => {
      e.preventDefault();
      const formData = new FormData();
      console.log("file", file);
      formData.append("image", file);
      // const uploadConfig = {
      //     headers: {
      //         "content-type": "multipart/form-data"
      //     }
      // };
      const headers = { 
        'Authorization': token,
        "content-type": "multipart/form-data",
      };
      try {
          // const url =  `/customers/${customerProfile?._id}/upload/profile_pic`;
          const url = `/image/customer/${customerProfile?._id}`;
          console.log("====url", url);

          const res = await axios.post(url,formData, {headers});
          // console.log("res", res.data);
          setProfilePic(`${res.data}`);
          // console.log("response",res);
          // alert("Image uploaded successfully!");
          await dispatch(updateCustomerProfile(res.data))
          // setTimeout(() => history.push("/"), 500);
          
      }catch(err){
          console.log(err)
      }
  }

    return (
      <>
        <Navigationbar />
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <AccountCircle />
            </Avatar>
            {/* <input type={"file"} onClick={(e) =>fileSelectedHandler(e)}></input> */}
            <Typography component="h1" variant="h5">
              Customer Profile
            </Typography>
            {profilePic &&
               <Card style={{ width: 140, backgroundColor: "transparent" }}>
               <CardMedia
                 component="img"
                //  height="140"
                 style={{borderRadius: 70, height: 140, width: 140}}
                 src={customerProfile?.profile_pic}
                 title="profile pic"
                 alt="loading"
                 />
           </Card>
            }
            <form onSubmit={onUpload}><br /><br /><br />
              <div className="custom-file" style={{width: "80%"}}>
                  <input type="file" className="custom-file-input" name="image" accept="image/*" onChange={onImageChange} required/>
              </div><br/><br/>
              {
                file && 
                <Button type="submit" variant="outlined">Upload Profile Pic</Button>
              }
          </form>
            <form className={classes.form} noValidate  onSubmit={handleSubmit(onClickSubmit, onError)}>
              <TextField
                variant="outlined"
                margin="normal"
                inputRef={{...register('firstName')}}
                fullWidth
                id="firstName"
                label="firstName"
                name="firstName"
                type='text'
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                autoFocus
                inputProps={{className: classes.textInput}}
              />
              <TextField
                variant="outlined"
                margin="normal"
                inputRef={{...register('lastName')}}
                fullWidth
                id="lastName"
                label="lastName"
                name="lastName"
                type='text'
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                autoFocus
                inputProps={{className: classes.textInput}}
              />
              <TextField
                variant="outlined"
                margin="normal"
                inputRef={{...register('email')}}
                fullWidth
                name="email"
                label="email"
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                inputRef={{...register('phone')}}
                fullWidth
                name="phone"
                label="phone"
                type="tel"
                id="phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                inputRef={{...register('nickName')}}
                fullWidth
                id="nickName"
                label="nickName"
                name="nickName"
                type='text'
                value={nickName}
                onChange={e => setNickName(e.target.value)}
                autoFocus
                inputProps={{className: classes.textInput}}
              />
              <TextField
                variant="outlined"
                margin="normal"
                inputRef={{...register('dob')}}
                fullWidth
                id="dob"
                helperText="Select date of birth"
                name="dob"
                type='date'
                value={dob}
                onChange={e => setDob(e.target.value)}
                autoFocus
                inputProps={{className: classes.textInput}}
              />
              <TextField
                variant="outlined"
                margin="normal"
                inputRef={{...register('streetAddress')}}
                fullWidth
                name="streetAddress"
                label="streetAddress"
                type="text"
                id="streetAddress"
                value={streetAddress}
                onChange={e => setStreetAddress(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                inputRef={{...register('aptNumber')}}
                // required
                fullWidth
                name="aptNumber"
                label="aptNumber"
                type="text"
                id="aptNumber"
                value={aptNumber}
                onChange={e => setAptNumber(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                // , { required: true }
                inputRef={{...register('city')}}
                // required
                fullWidth
                name="city"
                label="city"
                type="text"
                id="city"
                value={city}
                onChange={e => setCity(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                // , { required: true }
                inputRef={{...register('state')}}
                // required
                fullWidth
                name="state"
                label="state"
                type="text"
                id="state"
                value={state}
                onChange={e => setState(e.target.value)}
              />
              <TextField
                  id="country"
                  select
                  label="country"
                  value={country}
                  fullWidth
                  SelectProps={{
                    MenuProps: {
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left"
                      },
                      getContentAnchorEl: null
                    }
                  }}
                  onChange={e => setCountry(e.target.value)}
              >
                  {countries.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                      {option.label}
                  </MenuItem>
                  ))}
              </TextField>
              <TextField
                variant="outlined"
                margin="normal"
                // , { required: true }
                inputRef={{...register('zipcode')}}
                // required
                fullWidth
                name="zipcode"
                label="zipcode"
                type="text"
                id="zipcode"
                value={zipcode}
                onChange={e => setZipcode(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                inputRef={{...register('about')}}
                fullWidth
                id="about"
                label="about"
                name="about"
                type='text'
                value={about}
                onChange={e => setAbout(e.target.value)}
                autoFocus
                inputProps={{className: classes.textInput}}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Update Profile
              </Button>
            </form>
          </div>
        </Container>
      </>
  );
}