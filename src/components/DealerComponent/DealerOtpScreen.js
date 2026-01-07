import React, { Component } from 'react';
import { Alert, StatusBar, BackHandler, Dimensions, Platform, StyleSheet, View, TextInput, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Header, Left, Body, Right, Content, Card, CardItem, Text, Title, Item, Label, Icon } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CodeInput from 'react-native-confirmation-code-input';
import LoginService from '../../services/LoginService/LoginService';
import Loader from '../../Utility/Loader';
import * as utilities from '../../Utility/utilities';
import * as app from '../../App';
import { Col, Row, Grid } from "react-native-easy-grid";
import { strings } from '../../locales/i18n';
import { setLoginData } from '../../Redux/Actions/InstituteActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MyColors from '../../Utility/Colors';
import AsyncStorage from '@react-native-community/async-storage';

var interval;
class DealerOtpScreen extends React.Component {
    constructor(props) {
        super(props);

        this.mobileNo = this.props.navigation.state.params.mobileNumber;
        // this.distributorId = this.props.navigation.state.params.distributorId;
        this.state = {
            OTP: '',
            time: '',
            otpCode: '',
            borderBottomColorPassword: '#757575',
            borderBottomColorUserName: '#757575',
            loading: false,
            loaderText: 'Verifying mobile number...',
            btnVerifyEnabled: false,
            btnResendOTPEnabled: false,
        };
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.countdown();
    }
    componentWillUnmount() {
        this.setState({ btnResendOTPEnabled: false })
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        clearInterval(interval);
    }
    handleBackPress = () => {
        BackHandler.exitApp();
        return true;
    }
    closeActivityIndicator() {
        setTimeout(() => {
            this.setState({ animating: false, loading: false });
        });
    }
    countdown() {
        var time;
        if (!this.state.btnResendOTPEnabled) {

            var timer = '3:00';
            timer = timer.split(':');
            var minutes = timer[0];
            var seconds = timer[1];
            interval = setInterval(() => {

                seconds -= 1;
                if (minutes < 0) return;
                else if (seconds < 0 && minutes != 0) {
                    minutes -= 1;
                    seconds = 59;
                }
                else if (seconds < 10 && seconds.length != 2) {
                    seconds = '0' + seconds;
                }
                time = minutes + ':' + seconds;
                this.setState({ time: time });

                if (minutes == 0 && seconds == 0) {
                    this.setState({ btnResendOTPEnabled: true });
                    clearInterval(interval);
                }
            }, 1000);
        }
    }

    _onFinishCheckingCode1(code) {
        //  ;
        this.setState({ btnVerifyEnabled: true, otpCode: code });
    }

    async callForAPI() {
        this.setState({ loading: true })
        let lOtp = this.state.otpCode;
        const formData = new FormData();
        var obj = {}
        obj.mobileNo = this.mobileNo
        obj.otp = lOtp
        obj.deviceToken = app.FCMTOKEN
        obj.deviceType = Platform.OS

        formData.append('mobileNo', this.mobileNo);
        formData.append('otp', lOtp);
        // formData.append('distributorCode', this.distributorId);
        formData.append('deviceToken', app.FCMTOKEN);
        formData.append('deviceType', Platform.OS);
        console.log(formData);

        var lUrl = app.URL + 'verifyOtpDealer';
        await fetch(lUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application\/json',
                'Content-Type': 'multipart\/form-data',
                'apikey': app.APIKEY
            },
            body: formData,
        })
            // .then((response) => response.json())
            //     .then(async (respForVerfiyOtp) => {
            .then(res => {
                res.json().then(async (respForVerfiyOtp) => {
                    console.log("respForVerfiyOtp.headers");
                    console.log(res);
                    console.log(res.headers.map.accesstoken);
                    console.log(respForVerfiyOtp);

                    this.setState({ loading: false })
                    if (!respForVerfiyOtp) {
                        utilities.showToastMsg('Something went wrong. Please try again later');
                        return true;
                    } else if (respForVerfiyOtp.status == 422) {
                        Alert.alert(
                            'Alert',
                            respForVerfiyOtp.message,
                            [
                                { text: 'CANCEL', onPress: () => { } },
                                { text: 'LOGIN', onPress: () => this.props.navigation.navigate('DealerLoginScreen'), style: 'cancel' },
                            ],
                            { cancelable: false }
                        );
                    }
                    else if (respForVerfiyOtp.status == 400) {
                        utilities.showToastMsg(respForVerfiyOtp.message);
                        return;
                    } else if (respForVerfiyOtp.status == 403) {
                        utilities.showToastMsg(respForVerfiyOtp.message);
                        // this.props.navigation.navigate('LoginScreen');
                        // AsyncStorage.clear();
                        return;
                    }
                    else if (respForVerfiyOtp.status == 200) {
                        utilities.showToastMsg('Login successful');
                        console.log("login successful");
                        this.props.setLoginData(respForVerfiyOtp.data)
                        app.ACCESSTOKEN = res.headers.map.accesstoken

                        respForVerfiyOtp.data.accesstoken = res.headers.map.accesstoken
                       
                        await AsyncStorage.setItem('USERDATA', JSON.stringify(respForVerfiyOtp));
                         await AsyncStorage.setItem('ACCESSTOKEN', res.headers.map.accesstoken );
                        
                          this.props.navigation.navigate('HomeScreen');
                    } else {
                        utilities.showToastMsg('Something went wrong. Please try again later');
                    }
                })
            })
            .catch((error) => {
                console.error(error);
                this.setState({ loading: false })
            });
    }
    _onPressButton(action) {
        let lOTP = this.state.otpCode;
        if (lOTP == '') {
            utilities.showToastMsg('Enter OTP');
        }
        else if (lOTP) {
            this.callForAPI();
        } else {
            console.warn('Error');
        }
    }

    async _onPressResendOTP() {
        this.setState({ loading: true, loaderText: "Loading..." });
        // const formData = new FormData();
        // formData.append('mobileNo', this.mobileNo);
        // formData.append('otp', lOtp);
        // // formData.append('distributorCode', this.distributorId);
        // formData.append('deviceToken', app.FCMTOKEN);
        // formData.append('deviceType', Platform.OS);
        // console.log(formData);
        // var loginApiObj = new LoginService();

        // this.setState({ loading: true });
        // await loginApiObj.verifyOtpDealer(formData);
        // var respn = loginApiObj.getRespData();
        // console.log(respn);

        // this.closeActivityIndicator();

        // if (!respn) {
        //     utilities.showToastMsg('Something went wrong. Please try again later');
        // } else if (respn.status == 200) {
        //     utilities.showToastMsg('OTP resent successfully.');
        //     this.setState({ btnResendOTPEnabled: false });
        //     this.countdown();
        // } else {
        //     utilities.showToastMsg('Something went wrong. Please try again later');
        // }
        const formData = new FormData();
        formData.append('mobileNo', this.mobileNo);
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
                    utilities.showToastMsg(responseJson.message);
                    this.setState({ btnResendOTPEnabled: false });
                    this.countdown();
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
    }

    _showBtnVerify() {
        if (this.state.btnVerifyEnabled) {
            return (
                <TouchableOpacity onPress={() => this._onPressButton()}>
                    <View style={styles.buttonVerifier}>
                        <Text style={styles.buttonText}>{strings('login.verify')}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity>
                    <View style={styles.btnVerifyDisabled}>
                        <Text style={styles.textVerifyDisabled}>{strings('login.verify')}</Text>
                    </View>
                </TouchableOpacity>
            );
        }

    }

    _showBtnResendOTP() {
        if (this.state.btnResendOTPEnabled) {
            return (
                <TouchableOpacity onPress={() => this._onPressResendOTP()}>
                    <View style={styles.btnResendOTP}>
                        <Text style={styles.buttonText}>{strings('login.reSendTp')}</Text>
                    </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity>
                    <View style={styles.btnResendOTPDisabled}>
                        <Text style={styles.textResendOTPDisabled}>
                            {strings('login.reSendTp')} :
						</Text>
                        <Text style={{ marginLeft: 1, color: 'white' }}>{this.state.time} </Text>
                    </View>
                </TouchableOpacity>
            )
        }
    }
    backToLandingScreen = () => {
        Alert.alert(
            'Alert',
            'Are you sure you want to go back ?',
            [
                { text: 'CANCEL', onPress: () => { } },
                // { text: 'YES', onPress: () => this.props.navigation.navigate('LoginScreen'), style: 'cancel' },
                { text: 'YES', onPress: () => this.props.navigation.navigate('LoginScreen'), style: 'cancel' },
            ],
            { cancelable: false }
        );
    }
    render() {
        return (
            <View style={styles.container}>
                <Header style={{ backgroundColor: MyColors.dealerColor }}>
                    <Grid>
                        <Col size={1} style={{ justifyContent: 'center' }}>
                            <TouchableOpacity onPress={this.backToLandingScreen} >
                                <Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF' }} />
                            </TouchableOpacity>
                        </Col>
                        <Col size={10} style={{ justifyContent: 'center' }}>
                            <Title style={{ color: '#FFFFFF', fontSize: 16, textAlign: 'center' }}>{strings('login.SeQr')}</Title>
                        </Col>
                    </Grid>
                </Header>
                <StatusBar backgroundColor={MyColors.dealerColor} barStyle="light-content" />

                <Loader
                    loading={this.state.loading}
                    text={this.state.loaderText}
                />

                <View style={styles.OTPViewContainer}>
                <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={150} keyboardShouldPersistTaps={'handled'}>
                        <Card style={styles.cardContainer}>

                            <CardItem header style={styles.cardHeader}>
                                <Text style={{ marginLeft: -12, color: '#212121', fontWeight: 'normal', fontSize: 18 }}>{strings('login.verifyMobileNo')}</Text>
                            </CardItem>

                            <View style={{ paddingLeft: 0, paddingRight: 0, marginTop: 10 }}>
                                <Text style={{ fontSize: 14, color: '#808080' }}>{strings('login.otpSent')}</Text>
                                <View style={styles.inputContainer}>
                                    <CodeInput
                                        ref="codeInputRef2"
                                        keyboardType="number-pad"
                                        inactiveColor='white'
                                        autoFocus={false}
                                        ignoreCase={true}
                                        className='border-b-t'
                                        size={50}
                                        onChangeText={(e) => this.setState({ code : e.replace(/[^0-9]/g, '') })} 
                                        onFulfill={(code) => this._onFinishCheckingCode1(code)}
                                        containerStyle={{ marginTop: 10, marginBottom: 10, }}
                                        codeInputStyle={{ color: 'black', borderWidth: 1.5, borderBottomColor: 'black', borderTopColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent' }}
                                        codeLength={4}
                                    />

                                </View>
                            </View>

                            <Content style={{ marginTop: 20 }}>
                                {this._showBtnVerify()}

                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: 12 }}>{strings('login.didntRec')}</Text>
                                </View>

                                {this._showBtnResendOTP()}
                            </Content>

                        </Card>
                    </KeyboardAwareScrollView>
                </View>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    OTPViewContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        paddingTop: Dimensions.get('window').height * 0.05
    },
    cardContainer: {
        flex: 1,
        padding: 15,
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
    },
    cardHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    inputContainer: {
        marginTop: 30,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'skyblue',
    },
    inputs: {
        height: 45,
        width: 50,
        marginLeft: 5,
        borderBottomWidth: 1,

    },
    buttonVerifier: {
        marginTop: 10,
        alignItems: 'center',
        backgroundColor: MyColors.dealerColor,
        borderRadius: 5
    },
    btnVerifyDisabled: {
        marginTop: 10,
        alignItems: 'center',
        backgroundColor: '#D3D3D3',
        borderRadius: 5
    },
    btnResendOTP: {
        marginTop: 3,
        alignItems: 'center',
        backgroundColor: MyColors.dealerColor,
        borderRadius: 5
    },
    buttonText: {
        padding: 10,
        color: 'white',
    },
    textVerifyDisabled: {
        padding: 10,
        color: 'white',
    },
    btnResendOTPDisabled: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 3,
        alignItems: 'center',
        backgroundColor: '#D3D3D3',
        borderRadius: 5
    },
    textResendOTPDisabled: {
        padding: 10,
        color: 'white',
    }

})
const mapStateToProps = (state) => {
    return {
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setLoginData: setLoginData
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(DealerOtpScreen)