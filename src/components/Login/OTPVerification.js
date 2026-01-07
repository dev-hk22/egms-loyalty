import React, { Component } from 'react';
import { Alert, StatusBar, BackHandler, Dimensions, Platform, StyleSheet, View, TextInput, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Header, Left, Body, Right, Content, Card, CardItem, Text, Title, Item, Label, Icon,Input } from 'native-base';
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
import { URL, HEADER, APIKEY, ACCESSTOKEN } from '../../App';

var interval;
class OTPVerification extends React.Component {
	constructor(props) {
		super(props);

		this.mobileNo = this.props.navigation.state.params.mobileNumber;
		this.regId = this.props.navigation.state.params.regId;
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
			password:'',
			confirmpassword:''
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
		formData.append('password', this.state.password);
		// formData.append('deviceToken', app.FCMTOKEN);
		// formData.append('deviceType', Platform.OS);
		formData.append('regId', this.regId);
		formData.append('language', "en");
		formData.append('appVersion', "1.0");
		console.log(formData);

		
			var lUrl = URL + 'resetPasswordCarpenter';
			await fetch(lUrl, {
				method: 'POST',
				headers: {
					'Accept': 'application\/json',
					'Content-Type': 'multipart\/form-data',
					'apikey': APIKEY
				},
				body: formData,
			}).then((response) =>
				{
					this.setState({ loading: false })
					// console.log(response.headers.map.accesstoken);
					// AsyncStorage.setItem('ACCESSTOKEN',response.headers.map.accesstoken);
					//response['accesstoken'].push(response.headers.map.accesstoken);
					return response.json();
				})
				.then((respForVerfiyOtp) => {
					
					// console.log("response data",responseJson);
					if (!respForVerfiyOtp) {
						utilities.showToastMsg('Something went wrong. Please try again later');
						return true;
					} 
					else if (respForVerfiyOtp.status == 422) {
						Alert.alert(
							'Alert',
							respForVerfiyOtp.message,
							[
								{ text: 'CANCEL', onPress: () => { } },
								{ text: 'LOGIN', onPress: () => this.props.navigation.navigate('LoginScreen'), style: 'cancel' },
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
						
						// AsyncStorage.setItem('ACCESSTOKEN', accessToken);
						AsyncStorage.setItem('USERDATA', JSON.stringify(respForVerfiyOtp));
						this.props.navigation.navigate('LoginScreen');
						// this.props.navigation.navigate('SetPasswordScreen', { data: obj, distributorId: this.distributorId });
					} else {
						utilities.showToastMsg('Something went wrong. Please try again later');
					}
					
				})
				.catch((error) => {
					console.error(error);
					// this.setRespData({'Error':'Service API failure','Message': error});
				});
		


		// var loginApiObj = new LoginService();
		// await loginApiObj.verifyOtp(formData);

		// var respForVerfiyOtp = loginApiObj.getRespData();
		// var accessToken = loginApiObj.getAccessToken();
		// console.log("opopoppopopop");
		// console.log(accessToken);

		
		// await loginApiObj.getRespData().then((data) => { respForVerfiyOtp = data });
		
		
	}

	_onPressButton(action) {
		let lOTP = this.state.otpCode;
		if (lOTP == '') {
			utilities.showToastMsg('Enter OTP');
			return;
		}
		else if(this.state.password == '')
		{
			utilities.showToastMsg('Enter Password');
			return;
		}
		else if(this.state.confirmpassword == '')
		{
			utilities.showToastMsg('Enter Confirm Password');
			return;
		}
		else if(this.state.password != this.state.confirmpassword)
		{
			utilities.showToastMsg('Passwords Mismatch');
			return;
		}
		else if (lOTP) {
			this.callForAPI();
		} else {
			console.warn('Error');
		}
	}

	async _onPressResendOTP() {
        this.setState({ loading: true })
        const formData = new FormData();
        formData.append('mobileNo', this.mobileNo);
        formData.append('language', "en");
        formData.append('regId', this.regId);
        // var lUrl = URL + 'loginMechanic';
		console.log("resend otp - otp verification", formData);
        var lUrl = URL + 'resendOtpCarpenter';
        fetch(lUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application\/json',
                'Content-Type': 'multipart\/form-data',
                'apikey': APIKEY,
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ loading: false })
                console.log("----");

                console.log(JSON.stringify(responseJson));
                if (responseJson.status == 200) {
                    utilities.showToastMsg('OTP resent successfully.');
                    this.setState({ btnResendOTPEnabled: false });
                    this.countdown();
                } else if (responseJson.status == 409) {
                    utilities.showToastMsg(responseJson.message);
                } else if (responseJson.status == 422) {
                    utilities.showToastMsg(responseJson.message)
                } else if (responseJson.status == 400) {
                    utilities.showToastMsg(responseJson.message)
                } else if (responseJson.status == 403) {
                    utilities.showToastMsg(responseJson.message);
                    this.props.navigation.navigate('LoginScreen');
                    AsyncStorage.clear();
                    return;
                }
            })
            .catch((error) => {
                console.error(error);
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
				{ text: 'YES', onPress: () => this.props.navigation.navigate('LoginScreen'), style: 'cancel' },
			],
			{ cancelable: false }
		);
	}
	render() {
		return (
			<View style={styles.container}>
				<Header style={{ backgroundColor: MyColors.distributorColor }}>
					<Grid>
						<Col size={1} style={{ justifyContent: 'center' }}>
							<TouchableOpacity onPress={this.backToLandingScreen} >
								<Icon type="FontAwesome5" name="arrow-left" style={{ fontSize: 20, color: '#FFFFFF' }} />
							</TouchableOpacity>
						</Col>
						<Col size={10} style={{ justifyContent: 'center' }}>
							<Title style={{ color: '#FFFFFF', fontSize: 16, textAlign: 'center' }}>{strings('login.SeQr')}</Title>
						</Col>
					</Grid>
				</Header>
				<StatusBar
					backgroundColor={MyColors.distributorColor}
					barStyle="light-content"
				/>

				<Loader
					loading={this.state.loading}
					text={this.state.loaderText}
				/>

				<View style={styles.OTPViewContainer}>
				<KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={150} keyboardShouldPersistTaps={'handled'}>
						{/* <Card style={styles.cardContainer}> */}

							<CardItem header style={styles.cardHeader}>
								<Text style={{ marginLeft: -12, color: '#212121', fontWeight: 'normal', fontSize: 18 }}>{strings('login.verifyMobileNo')}</Text>
							</CardItem>

							<View style={{ paddingLeft: 0, paddingRight: 0, marginTop: 5}}>
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
										onFulfill={(code) => this._onFinishCheckingCode1(code)}
										containerStyle={{ marginTop: 10, marginBottom: 10, }}
										codeInputStyle={{ color: 'black', borderWidth: 1.5, borderBottomColor: 'black', borderTopColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent' }}
										codeLength={4}
									/>

								</View>
							</View>
						{/* </Card> */}

						{/* <Card style={styles.cardContainer}> */}
							<View>

						<Item stackedLabel  style={{ marginTop: 10 }} >
                            
                            <View style={{ flexDirection:'row', alignSelf:'flex-start'}}><Label style={{ color: 'black', fontSize: 16 }}>Password*:</Label><Label style={{ color:'#ccc'}}>(Minimum 6 characters)</Label></View>
                            <View style={{ flex:1,flexDirection: "row", }}>
                            <Input placeholderTextColor="#ccc" secureTextEntry  placeholder="Password"  value={this.state.password} onChangeText={(e) => this.setState({ password: e })} />
                           
                        </View>
                        </Item>
                        {/* {this.state.passwordError.length > 0 ? <Text style={{ color: "red", textAlign: "center", }}>{this.state.passwordError}</Text> : <View />} */}


                        <Item stackedLabel  style={{ marginTop: 5 }} >
                        <View style={{ flexDirection:'row', alignSelf:'flex-start'}}><Label style={{ color:'black', fontSize: 16 }}>Confirm Password*:</Label><Label style={{ color:'#ccc'}}>(Minimum 6 characters)</Label></View>

                            <Input placeholderTextColor="#ccc" secureTextEntry placeholder="Confirm Password"  value={this.state.confirmpassword} onChangeText={(e) => this.setState({ confirmpassword: e })} />
                        </Item>
                        {/* {this.state.confirmpasswordError.length > 0 ? <Text style={{ color: "red", textAlign: "center", }}>{this.state.confirmpasswordError}</Text> : <View />} */}

						</View>

							<Content style={{ marginTop: 20 }}>
								{this._showBtnVerify()}

								<View style={{ marginTop: 20 }}>
									<Text style={{ fontSize: 12 }}>{strings('login.didntRec')}</Text>
								</View>

								{this._showBtnResendOTP()}
							</Content>
						{/* </Card> */}
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
		paddingTop: Dimensions.get('window').height * 0.05,
		margin:10
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
		marginTop: 5,
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
		backgroundColor: MyColors.distributorColor,
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
		backgroundColor: '#e43c22',
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
export default connect(mapStateToProps, mapDispatchToProps)(OTPVerification)