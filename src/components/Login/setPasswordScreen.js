import React from 'react';
import {  StatusBar, View, Text, } from 'react-native';
import { Header, Left, Button, Right, Body, Label, Form, Title, Item, Input, Icon } from 'native-base';
import Loader from '../../Utility/Loader';
import * as utilities from '../../Utility/utilities';
import * as app from '../../App';
import { URL, APIKEY } from '../../App';
import { strings } from '../../locales/i18n';
import AsyncStorage from '@react-native-community/async-storage';

const SetPasswordScreen = props => {
    const [state, setState] = React.useState({ showPW: true, showPW1: true, password: "", confirmPassword: "", disableButton: false, loading: false, loaderText: 'Loading...', errorMsg: "" })

    // console.log("][][][][][][][][][][][][][][][][][][][][][][][][][][]][][][][][][][][][][][]");
    // console.log(props.navigation.state.params);


    React.useEffect(() => {
        AsyncStorage.setItem('SETPASS', JSON.stringify(true));
    }, [])

    const checkValidation = async () => {
        if (state.password.length <= 0 || state.confirmPassword.length <= 0) {
            setState({ ...state, disableButton: true, errorMsg: "Password & Confirm Password cannot be blank" })
        } else if (state.password.length < 8) {
            setState({ ...state, errorMsg: "Password should have min 8 characters" })
        } else if (state.confirmPassword.length < 8) {
            setState({ ...state, errorMsg: "Confirm Password should have min 8 characters" })
        } else if (state.password !== state.confirmPassword) {
            setState({ ...state, disableButton: true, errorMsg: "Password & Confirm Password are not matching." })
        } else {
            await setState({ ...state, disableButton: false, errorMsg: "" })
            callSetPasswordApi();
        }
    }

    const callSetPasswordApi = async () => {
        setState({ ...state, loading: true });

        const formData = new FormData();
        formData.append('userType', 0);
        formData.append('mobileNo', props.navigation.state.params.data.mobileNo);
        formData.append('otp', props.navigation.state.params.data.otp);
        formData.append('distributorCode', props.navigation.state.params.distributorId);
        formData.append('password', state.password);
        console.log("][][===================================================================================");
        console.log(formData);

        var lUrl = URL + 'setPassword';
        console.log(lUrl);
        await fetch(lUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application\/json',
                'Content-Type': 'multipart\/form-data',
                'apikey': APIKEY
            },
            body: formData,
        })
            // .then((response) => response.json())
            // .then((lResponseData) => {
            .then(res => {
                res.json().then(lResponseData => {
                    console.log(res.headers.map.accesstoken);
                    console.log(lResponseData);
                    app.ACCESSTOKEN = res.headers.map.accesstoken;
                    if (!lResponseData) {
                        setState({ ...state, loading: false });
                        utilities.showToastMsg('Something went wrong. Please try again later');
                        return true;
                    } else if (lResponseData.status == 400 || lResponseData.status == 500 || lResponseData.status == 422) {
                        setState({ ...state, loading: false });
                        utilities.showToastMsg(lResponseData.message);
                    } else if (lResponseData.status == 403) {
                        setState({ ...state, loading: false });
                        utilities.showToastMsg(lResponseData.message);
                        props.navigation.navigate('LoginScreen');
                        return;
                    } else if (lResponseData.status == 200) {
                        // await AsyncStorage.setItem('ISPASSWORD', JSON.stringify(res.headers.map.accesstoken));
                        AsyncStorage.setItem('USERDATA', JSON.stringify(lResponseData));
                        setState({ ...state, loading: false });
                        props.navigation.navigate("HomeScreen");
                    } else {
                        setState({ ...state, loading: false });
                        utilities.showToastMsg('Something went wrong. Please try again later');
                    }
                })
                    .catch((error) => {
                        console.error(error);
                    });
            })
    }
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <Header style={{ backgroundColor: '#e43c22', borderBottomColor: 'gray', borderBottomWidth: 1 }}>
                <Left style={{ flex: 0.1 }}>
                </Left>
                <Body style={{ flex: 0.8, alignItems: 'center' }}>
                    <Title style={{ color: 'white', fontSize: 16 }}>{strings('login.setPassword')}</Title>
                </Body>
                <Right style={{ flex: 0.1 }} />
            </Header>
            <StatusBar
                backgroundColor="#e43c22"
                barStyle="light-content"
            />
            <Loader loading={state.loading} text={state.loaderText} />

            <View style={{ flex: 1, marginTop: 10 }}>
                <Form>
                    <Item floatingLabel>
                        <Label style={{ color: "#3c24ae" }}>Password:</Label>
                        <Input value={state.password} secureTextEntry={state.showPW} onChangeText={(e) => setState({ ...state, password: e })} />
                        {state.showPW ?
                            <Icon onPress={() => setState({ ...state, showPW: !state.showPW })} type="FontAwesome" name="eye-slash" style={{ fontSize: 20, color: 'red', }} />
                            :
                            <Icon onPress={() => setState({ ...state, showPW: !state.showPW })} type="FontAwesome" name="eye" style={{ fontSize: 20, color: 'red', }} />
                        }
                    </Item>
                    <Item floatingLabel>
                        <Label style={{ color: "#3c24ae" }}>Confirm Password:</Label>
                        <Input value={state.confirmPassword} secureTextEntry={state.showPW1} onChangeText={(e) => setState({ ...state, confirmPassword: e })} />
                        {state.showPW1 ?
                            <Icon onPress={() => setState({ ...state, showPW1: !state.showPW1 })} type="FontAwesome" name="eye-slash" style={{ fontSize: 20, color: 'red', }} />
                            :
                            <Icon onPress={() => setState({ ...state, showPW1: !state.showPW1 })} type="FontAwesome" name="eye" style={{ fontSize: 20, color: 'red', }} />
                        }
                    </Item>
                </Form>

                {state.errorMsg.length ? <Text style={{ color: "red", marginTop: 20, textAlign: "center" }}>{state.errorMsg}</Text> : null}

                <Button rounded onPress={() => checkValidation()} style={{ width: 150, alignSelf: "center", flex: 1, marginTop: 70, backgroundColor: "#e43c22" }}>
                    <Text style={{ textAlign: "center", color: "white", }}>Set Password</Text>
                </Button>
            </View>
        </View >
    )
}
export default SetPasswordScreen;