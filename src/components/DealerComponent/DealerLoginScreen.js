import React, { Component } from 'react';
import { StatusBar, BackHandler, View, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Text, Card, CardItem } from 'native-base';
import * as app from '../../App';
import { strings } from '../../locales/i18n';
import SplashScreen from 'react-native-splash-screen';
import * as utilities from '../../Utility/utilities';
import Loader from '../../Utility/Loader';
import DeviceInfo from 'react-native-device-info';
import MyColors from '../../Utility/Colors';
import AsyncStorage from '@react-native-community/async-storage';

export default class DealerLoginScreen extends Component {
    constructor(props) {
        super(props);
        SplashScreen.hide()

        this.state = {
            mobileNumber: "",
            mobileNoError: "",
            loading: false,
            loaderText: "Logging in..."
        }
    }

    componentDidMount = () => {
        this.getUserData()
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

   
    componentWillUnmount() {
        
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
      
    }
    handleBackPress = () => {
       this.props.navigation.navigate('LandingScreen');
        return true;
    }

    
    async getUserData() {
        await AsyncStorage.getItem('USERDATA', (err, result) => {
            var lData = JSON.parse(result);
            if (lData) {
                if (lData.data.id) {
                    console.log("Dealer login=-=-=-=-][][][][][][][][][][][][][][][][][][][][][][]=-=-=-=-=-=-=-=-=-=>>>>>>>>>??????????????????");
                    console.log(lData.data);
                    app.ACCESSTOKEN = lData.data.accesstoken;
                    this.props.navigation.navigate('HomeScreen');
                }
            }
        });
    }
    loginwithDealer = () => {
        if (this.state.mobileNumber == "") {
            this.setState({ mobileNoError: "No cannot be blank." })
        } else if (this.state.mobileNumber.length < 10) {
            this.setState({ mobileNoError: "No cannot be less than 10 digits.." })
        } else {
            this.setState({ mobileNoError: "", loading: true }, () => {
                const formData = new FormData();
                formData.append('mobileNo', this.state.mobileNumber);
                console.log(formData);

                var lUrl = app.URL + 'loginDealer';
                console.log(lUrl);
                console.log(app.APIKEY);

                fetch(lUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application\/json',
                        'Content-Type': 'multipart\/form-data',
                        'apikey': app.APIKEY
                    },
                    body: formData
                })
                    .then((response) => response.json())
                    .then(async (responseJson) => {
                        this.setState({ loading: false })
                        if (responseJson.status == 200) {
                            await AsyncStorage.setItem("LOGINEDUSERFLAG", "DEALER");
                            utilities.showToastMsg(responseJson.message);
                            this.props.navigation.navigate("DealerOtpScreen", { mobileNumber: this.state.mobileNumber });
                        } else if (responseJson.status == 400) {
                            utilities.showToastMsg(responseJson.message);
                        } else if (responseJson.status == 422) {
                            utilities.showToastMsg(responseJson.message);
                        } else if (responseJson.status == 403) {
                            utilities.showToastMsg(responseJson.message);
                        } else {
                            utilities.showToastMsg('Something went wrong. Please try again later');
                        }
                        console.log(responseJson);
                    })
                    .catch((error) => {
                        console.error(error);
                        this.setState({ loading: false })
                    });
            })
        }
    }
    render() {
        return (
            <ScrollView style={{ flex: 1, }} contentContainerStyle={{ alignItems: "center" }} keyboardShouldPersistTaps={"handled"}>
                <StatusBar backgroundColor={MyColors.dealerColor} barStyle="light-content" />
                <Loader loading={this.state.loading} text={this.state.loaderText} />
                {/* <Image style={{ width: "100%", height: 350 }} resizeMode='stretch' source={require('../../images/wwe.png')} /> */}
                <Image style={{ width: 100, height: 100,margin: 10, alignSelf:'flex-start' }} resizeMode='contain' source={require('../../images/small_logo.jpg')} />
                
                <Image style={{ width: "100%", height: 250, marginLeft:20,marginRight:20 }} resizeMode='contain' source={require('../../images/wwe.png')} />
               
           
                <Card style={{ padding: 15, height: 300, width: "90%", borderRadius: 15,}}>
                    <CardItem header style={{ borderBottomWidth: 1, borderBottomColor: '#E0E0E0', }}>
                        <Text style={{ marginLeft: -12, color: MyColors.dealerColor, fontWeight: 'bold', fontSize: 18 }}>{strings('login.dealerLogin')}</Text>
                    </CardItem>

                    <View style={{ marginTop: 35, flex: 0.8 }}>
                        <TextInput
                            style={{ paddingLeft:20, fontSize:18, height: 45, marginLeft: 5, borderBottomWidth: 1, borderColor: MyColors.dealerColor , borderRadius: 25, borderWidth:1 }}
                            value={this.state.mobileNumber}
                            keyboardType='number-pad'
                            placeholderTextColor={ MyColors.greyColor}
                            maxLength={10}
                            placeholder={strings('login.paymentOptions_screen_placeholder_mobileno')}
                            onChangeText={(mobileNumber) => this.setState({ mobileNumber: mobileNumber.replace(/[^0-9]/g, '') })}
                        />
                        <Text style={{ color: "red", fontSize: 13 }}>{this.state.mobileNoError}</Text>
                    </View>
                    <Button onPress={() => this.loginwithDealer()} style={{ marginTop: 20, backgroundColor: MyColors.dealerColor, width: '90%', borderRadius: 5, alignSelf: "center", justifyContent: "center" }}>
                        <Text style={{}}>{strings('login.login_button')}</Text>
                    </Button>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("DealerSignupScreen")}>
                        {/* <Text style={{ color: "blue", marginTop: 20, fontSize: 14, textAlign: "right", textDecorationLine: 'underline' }}>{strings('login.clickHereToSignUp')}</Text> */}
                        <Text style={{ color: MyColors.distributorColor , marginTop: 20, fontSize: 16, textAlign: "center", textDecorationLine: 'underline' }}>New User? Register Here</Text>
                    </TouchableOpacity>
                </Card>
            </ScrollView>
        )
    }
}