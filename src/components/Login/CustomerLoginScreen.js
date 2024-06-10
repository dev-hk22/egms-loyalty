import React, { Component } from 'react';
import { StatusBar, Button, BackHandler, Platform, StyleSheet, View, TextInput, Image, TouchableOpacity } from 'react-native';
import { Header, Left, Body, Content, Card, CardItem, Text, Title, Icon } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import LoginService from '../../services/LoginService/LoginService';
import Loader from '../../Utility/Loader';
import * as utilities from '../../Utility/utilities';
import * as app from '../../App';
import Modal from "react-native-modal";
import { URL, HEADER, APIKEY, ACCESSTOKEN } from '../../App';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import { strings } from '../../locales/i18n';
import I18n from 'react-native-i18n';
import { setLoginData } from '../../Redux/Actions/InstituteActions';
import { bindActionCreators } from 'redux';
import MyColors from '../../Utility/Colors';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import DeviceNumber from 'react-native-device-number';
import { IOS } from 'react-native-permissions/lib/typescript/constants';

class CustomerLoginScreen extends Component { //carpenter login screen
  constructor(props) {
    super(props);

    this.state = {
      mobileNumber: '', //9999999999
      password: '',//Test@1234
      borderBottomColorPassword: '#757575',
      borderBottomColorUserName: '#757575',
      loading: false,
      loaderText: 'Loading...',
      isModalVisible: false,
      brandCode: '',
      brandCodeError: '',
      distributorId: "TEST01",
      showHideMobile: true,
      ispass: false,
      isForgot: false,
      showPW: true
    };
  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  componentWillMount() {
    this.getUserData();
  }
  // componentWillUnmount() {
   
  // }

  componentDidMount() {
    SplashScreen.hide()
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        this.setState(this.state);
      }
    );
  }

  componentWillUnmount() {
    this.setState({
      mobileNumber: '',
      password: '',
      borderBottomColorPassword: '#757575',
      borderBottomColorUserName: '#757575',
      loading: false,
      loaderText: 'Loading...',
      isModalVisible: false,
      brandCode: '',
      brandCodeError: '',
      distributorId: "",
      showHideMobile: false,
      ispass: false,
      isForgot: false,
      showPW: true,
      phoneNumberError: ""
    });
    this.willFocusSubscription.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    // Alert.alert(
    //   'Exit App',
    //   'Are you sure you want to exit this app',
    //   [
    //     {text: 'NO', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
    //     {text: 'YES', onPress: () => { BackHandler.exitApp(); }},
    //   ],
    //   { cancelable: false }
    // );
    // BackHandler.exitApp();
    this.props.navigation.navigate('MainScreen');
    // BackHandler.exitApp();
    return true;
  }

  async closeActivityIndicator() {
    await setTimeout(() => {
      this.setState({ loading: false });
    });
  }
  getAsyncData = async () => {
    fcmtoke = await AsyncStorage.setItem('FCMTOKEN', JSON.stringify({ fcmToken: fcmToken }));
  }
  _handleNotificationOpen = (notifData) => {
    console.log("notifData :  ", notifData)
  }
  async getUserData() {
    await AsyncStorage.getItem('USERDATA', (err, result) => {
      var lData = JSON.parse(result);
      if (lData) {
        if (lData.data) {
          console.log("=-=-=-=-][][][][][][][][][][][][][][][][][][][][][][]=-=-=-=-=-=-=-=-=-=>>>>>>>>>??????????????????");
          console.log(lData.data);
          this.props.setLoginData(lData.data)
          app.ACCESSTOKEN = lData.data.accesstoken;
          this.props.navigation.navigate('CustomerHomeScreen');
        }
      }
    });
  }

  _validateMobileNumber() {
    let lMobileNumber = this.state.mobileNumber;
    console.log("=-=-=-=");
    console.log(lMobileNumber);

    let res = '';
    res = utilities.checkMobileNumber(lMobileNumber);
    if (!res || lMobileNumber.trim().length < 10) {
      this.setState({ phoneNumberError: "This mobile number appears to be invalid." });
    }
    return res;
  }

  async callLoginDistributor() {
    const formData = new FormData();
    formData.append('userType', 0);
    formData.append('distributorCode', this.state.distributorId);
    formData.append('deviceToken', app.FCMTOKEN);
    formData.append('password', this.state.password);
    console.log(formData);

    this.setState({ loading: true });

    var lUrl = URL + 'loginDist';
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
      .then(res => {
        res.json().then(response => {
          this.setState({ mobileNumber: '', showHideMobile: false })
          this.closeActivityIndicator();

          if (!response) {
            this.closeActivityIndicator();
            utilities.showToastMsg('Something went wrong. Please try again later');
            return true;
          }
          else if (response.status == 400 || response.status == 500 || response.status == 422) {
            this.closeActivityIndicator();
            utilities.showToastMsg(response.message);
          } else if (response.status == 403) {
            utilities.showToastMsg(response.message);
            this.props.navigation.navigate('CustomerLoginScreen');
            AsyncStorage.clear();
            return;
          }
          else if (response.status == 200) {
            try {
              console.log("header data ====" ,res.headers.map.accesstoken);
              console.log(response);
              AsyncStorage.setItem('USERDATA', JSON.stringify(response));
              app.ACCESSTOKEN = res.headers.map.accesstoken;
              this.closeActivityIndicator();
              this.props.setLoginData(response.data)
              AsyncStorage.setItem('SETPASS', JSON.stringify(false));
              this.props.navigation.navigate('CustomerHomeScreen');
              this.setState({
                mobileNumber: '',
                password: '',
                borderBottomColorPassword: '#757575',
                borderBottomColorUserName: '#757575',
                loading: false,
                loaderText: 'Loading...',
                isModalVisible: false,
                brandCode: '',
                brandCodeError: '',
                distributorId: "",
                showHideMobile: false,
                ispass: false,
                isForgot: false,
              });
            } catch (error) {
              console.log(error);
            }
          } else {
            this.closeActivityIndicator();
            utilities.showToastMsg('Something went wrong. Please try again later');
          }

        })
      })
  }

  

  async callForAPI() {

    console.log("calling login");
    let lMobileNumber = this.state.mobileNumber;
    // alert(this.state.mobileNumber);
    this.setState({ loading: true })
    const formData = new FormData();
    console.log(formData);
    // formData.append('mobileNo', lMobileNumber);
    formData.append('mobileNo', lMobileNumber);
    formData.append('password', this.state.password);
    formData.append('deviceToken', app.FCMTOKEN);
    formData.append('deviceType', Platform.OS);
    formData.append('language', "en");

    var loginApiObj = new LoginService();

    await loginApiObj.loginCustomer(formData);
    var lResponseData = await loginApiObj.getRespData();
    console.log("======response", JSON.stringify(lResponseData,null,2));

    this.setState({ mobileNumber: '' })
    this.closeActivityIndicator();

    if (!lResponseData) {
      this.setState({ loading: true })
      this.closeActivityIndicator();
      utilities.showToastMsg('Something went wrong. Please try again later');
      return true;
    }
    else if (lResponseData.status == 400 || lResponseData.status == 500 || lResponseData.status == 422 
      || lResponseData.status == 503 || lResponseData.status == 451) {
        this.setState({ loading: true })
      this.closeActivityIndicator();
      utilities.showToastMsg(lResponseData.message);
    } else if (lResponseData.status == 403) {
      utilities.showToastMsg(lResponseData.message);
      this.props.navigation.navigate('CustomerLoginScreen');
      AsyncStorage.clear();
      return;
    }
    else if (lResponseData.status == 200) {
      this.setState({ loading: true })
      this.closeActivityIndicator();
      // utilities.showToastMsg('OTP sent successfully');
      AsyncStorage.setItem('USERDATA', JSON.stringify(lResponseData));
      // console.log("login session data", lResponseData);
      console.log("isVerified", lResponseData.is_verified);
      if(lResponseData.is_verified == 0){
        this.props.navigation.navigate('CustomerOtpVerification', { mobileNumber: lMobileNumber});
        return;
      }
      // if (lResponseData.is_verified == ){

      // }
      // app.ACCESSTOKEN = lResponseData.data.accesstoken;
      // AsyncStorage.setItem('ACCESSTOKEN', lResponseData.data.accesstoken);
      try {
        this.setState({ password :''})
        this.props.navigation.navigate('CustomerHomeScreen', { mobileNumber: lMobileNumber});
      } catch (error) {
        console.log(error);
      }
    } else {
      this.closeActivityIndicator();
      utilities.showToastMsg('Something went wrong. Please try again later');
    }
  }


  //////////////


  async callOtpApi() {
    this.setState({ ispass: false })
    let lMobileNumber = this.state.mobileNumber;
    const formData = new FormData();

    // formData.append('mobileNo', lMobileNumber);
    // formData.append('userType', this.state.user);
    formData.append('mobileNo', lMobileNumber);
    // formData.append('distributorCode', this.state.distributorId);
    // formData.append('deviceToken', app.FCMTOKEN);
    formData.append('appVersion', "1.0");
    formData.append('language', "en");
    console.log(formData);


    // var loginApiObj = new LoginService();

    this.setState({ loading: true });

    var lUrl = URL + 'forgotPasswordCarpenter';
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
      .then((response) => response.json())
      .then((resForOtp) => {
        console.log(resForOtp)
        this.setState({ mobileNumber: '' })
        this.closeActivityIndicator();

        if (!resForOtp) {
          this.closeActivityIndicator();
          utilities.showToastMsg('Something went wrong. Please try again later');
          return true;
        }
        else if (resForOtp.status == 400 || resForOtp.status == 500 || resForOtp.status == 422) {
          this.closeActivityIndicator();
          utilities.showToastMsg(resForOtp.message);
        } else if (resForOtp.status == 403) {
          utilities.showToastMsg(resForOtp.message);
          // this.props.navigation.navigate('CustomerLoginScreen');
          // AsyncStorage.clear();
          return;
        }
        else if (resForOtp.status == 200) {
          this.closeActivityIndicator();
          utilities.showToastMsg('OTP sent successfully');
          try {
            // AsyncStorage.setItem('USERDATA', JSON.stringify(resForOtp));
            this.props.navigation.navigate('OTPVerification', { mobileNumber: lMobileNumber, regId: resForOtp.regId });
            this.setState({
              mobileNumber: '',
              password: '',
              borderBottomColorPassword: '#757575',
              borderBottomColorUserName: '#757575',
              loading: false,
              loaderText: 'Loading...',
              isModalVisible: false,
              brandCode: '',
              brandCodeError: '',
              distributorId: "",
              showHideMobile: false,
              ispass: false,
              isForgot: false,
              regId:''
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          this.closeActivityIndicator();
          utilities.showToastMsg('Something went wrong. Please try again later');
        }
      })
      .catch((error) => {
        console.error(error);
      });



    // await loginApiObj.generateOtp(formData);
    // var resForOtp = await loginApiObj.getRespData();
    // console.log("/??????????????????????????????????????????????????????");
    // console.log(resForOtp);
    // alert(JSON.stringify(resForOtp))
  }
  async _onPressButton() {
    let lMobileNumber = this.state.mobileNumber;
    var isValidMobileNumber = '';
    
    if (lMobileNumber == '') {
      utilities.showToastMsg('Enter registered mobile number');
      return;
    }
    else if(this.state.password == '')
    {
      utilities.showToastMsg('Please enter password');
      return;
    } 
    else if (lMobileNumber) {
     // isValidMobileNumber = await this._validateMobileNumber();
     // if (isValidMobileNumber) {
        this.callForAPI();
      // } else {
      //   utilities.showToastMsg('Wrong login credentials! Please check and try again');
      // }
    } else {
      alert('Server error');
    }
  }

  verifyBrandID = () => {
    this.setState({ loading: true })
    const formData = new FormData();
    formData.append('brandCode', this.state.brandCode);
    var lUrl = URL + 'validateBrand';
    fetch(lUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application\/json',
        'Content-Type': 'multipart\/form-data',
        'apikey': 'pFqDf7vuaOQ[87yF6D:=2OqjE*wa:0'
      },
      body: formData,
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({ loading: false })
        if (responseJson.status == 422) {
          this.setState({ brandCodeError: responseJson.message })
        } else if (responseJson.status == 200) {
          this.setState({ brandCodeError: '' }, () => {
            AsyncStorage.setItem('BRANDCODE', JSON.stringify(responseJson.brand_id));
            this.toggleModal();
            this.navigateToSignUpScreen();
          })
        } else {

        }
      })
      .catch((error) => {
        this.setState({ loading: false })
        console.log(error);
      });
  }
  navigateToSignUpScreen = () => {
    this.props.navigation.navigate('SignUpScreen')
  }
  render() {
    return (
      
      <KeyboardAwareScrollView   extraScrollHeight={150} contentContainerStyle={{alignContent:'center',flex:1}} keyboardShouldPersistTaps={'handled'} style={styles.container}>
       
        <StatusBar
          backgroundColor={MyColors.distributorColor}
          barStyle="light-content"
        />

        <Loader
          loading={this.state.loading}
          text={this.state.loaderText}
        />

      
          {/* <Image style={{ width: "100%", height: 350 }} resizeMode="stretch" source={require('../../images/wwe.png')} /> */}
          {/* <Image style={{ width: 100, height: 100,margin: 10, alignSelf:'flex-start' }} resizeMode='contain' source={require('../../images/small_logo.jpg')} /> */}
                
          <Animatable.Image animation="pulse"  iterationCount="3" easing="ease-in-out" style={{ alignSelf:'center' , width: 250, height: 200, marginLeft:20,marginRight:20,marginTop:Platform.OS=='ios'? 100: 50 }} resizeMode='contain' source={require('../../images/wwe.png')} />
               
      
     
          <View style={styles.loginViewContainer}>
            <ScrollView keyboardShouldPersistTaps={'handled'}>
              <Card style={[styles.cardContainer, { marginTop: 30, }]}>

                <CardItem header style={styles.cardHeader}>
                  <Text onPress={() => {
                    this.setState({
                      mobileNumber: '',
                      password: '',
                      borderBottomColorPassword: '#757575',
                      borderBottomColorUserName: '#757575',
                      loading: false,
                      loaderText: 'Loading...',
                      isModalVisible: false,
                      brandCode: '',
                      brandCodeError: '',
                      distributorId: "",
                      showHideMobile: false,
                      ispass: false,
                      isForgot: false,
                    })
                  }} style={{ marginLeft: -12, color: MyColors.distributorColor , fontWeight: 'bold', fontSize: 18 }}>{strings('login.customer_login')}</Text>
                </CardItem>

                <View style={{ paddingLeft: 0, paddingRight: 0, marginTop: 10 ,}}>
                <View style={{ flexDirection: "row", flex: 1, alignItems: "center", ...styles.inputs}}>
              
                  <Icon onPress={() => this.setState({ showPW: !this.state.showPW })} type="FontAwesome" name="phone" style={{  fontSize: 18, color: MyColors.dealerColor, }} />
                        
                    <TextInput
                  
                      style ={{ marginLeft:5}}
                      value={this.state.mobileNumber}
                      // maxLength={10}
                      keyboardType="number-pad"
                      placeholder={strings('login.paymentOptions_screen_placeholder_mobileno')}
                      placeholderTextColor={ MyColors.greyColor}
                      onFocus={() => { this.setState({ borderBottomColorUserName: '#50CAD0' }) }}
                      onBlur={() => { this.setState({ borderBottomColorUserName: '#757575' }); }}
                      onChangeText={(mobileNumber) => this.setState({ mobileNumber })}
                    />
                 
                  </View>

                  <View style={{ flexDirection: "row", flex: 1, alignItems: "center", marginTop:10,  ...styles.inputs }}>
                    {this.state.showPW ?
                              <Icon onPress={() => this.setState({ showPW: !this.state.showPW })} type="FontAwesome" name="eye-slash" style={{  fontSize: 18, color: MyColors.dealerColor, }} />
                              :
                              <Icon onPress={() => this.setState({ showPW: !this.state.showPW })} type="FontAwesome" name="eye" style={{  fontSize: 18, color: MyColors.dealerColor, }} />
                         }
                        <TextInput 
                         
                          style ={{ marginLeft:5}}
                          value={this.state.password}
                          placeholder={strings('login.distriPass')}
                          placeholderTextColor={ MyColors.greyColor}
                          secureTextEntry={this.state.showPW}
                          onFocus={() => { this.setState({ borderBottomColorUserName: '#50CAD0' }) }}
                          onBlur={() => { this.setState({ borderBottomColorUserName: '#757575' }); }}
                          onChangeText={(password) => this.setState({ password: password })}
                        />
                      </View>

                      <TouchableOpacity onPress={() => this.setState({ isForgot: true })}>
                    <Text style={{ color: "blue", textAlign: "right", fontSize: 16, opacity: 0.6, margin:10}}>{strings('login.forgot_password')} </Text>
                  </TouchableOpacity>
                </View>


                <View>
                  <Content padder>
                    <TouchableOpacity onPress={() => this._onPressButton()}>
                      <View style={styles.buttonLogin}>
                          <Text style={styles.buttonText}> 
                            {strings('login.login_button')}
                          </Text>
                        {/* </LinearGradient> */}

                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate("CustomerSignUpScreen")}>
                        <Text style={{ color: MyColors.distributorColor , marginTop: 20, fontSize: 16, textAlign: "center", textDecorationLine: 'underline' }}>{strings('login.new_user')}</Text>
                    </TouchableOpacity>

                    <Modal isVisible={this.state.isForgot}>
                        <View style={{ height: 300 }}>
                        <Card style={styles.cardContainer}>
                            <CardItem header >
                            <Text style={{ textAlign:'left', flex: 1,  }}>{strings('login.forgot_password')}?</Text>
                            <TouchableOpacity onPress={() => this.setState({ isForgot: false })}>
                                <Icon type="FontAwesome" name="times" style={{ fontSize: 20, color: 'black', paddingLeft: 13 }} />
                            </TouchableOpacity>
                            </CardItem>
                            <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey' }} />
                            <View style={{ marginTop: 20 }}>
                            <Text>Enter your Mobile No to reset your password: </Text>
                            <TextInput
                                style={{
                                borderBottomColor: this.state.borderBottomColorUserName,
                                ...styles.inputs
                                }}
                                value={this.state.mobileNumber}
                                keyboardType='number-pad'
                                maxLength={10}
                                placeholder={strings('login.paymentOptions_screen_placeholder_mobileno')}
                                onFocus={() => { this.setState({ borderBottomColorUserName: '#50CAD0' }) }}
                                onBlur={() => { this.setState({ borderBottomColorUserName: '#757575' }); }}
                                onChangeText={(mobileNumber) => this.setState({ mobileNumber })}
                            />
                            <View style={{ marginTop: 40 }}>
                                <Button onPress={() => { this.setState({ isForgot: false }, () => this.callOtpApi()) }} title="Send OTP" />
                                {/* <Button onPress={() => { this.setState({ isForgot: false }, () => this.callForAPI()) }} title={strings('login.profileScreenSubmit')} /> */}
                            </View>
                            </View>
                        </Card>
                        </View>
                    </Modal>

                    <Modal isVisible={this.state.isModalVisible}>
                      <View style={{ height: 300 }}>
                        <Card style={styles.cardContainer}>
                          <CardItem header >
                            <Text style={{ textAlign: 'center', flex: 1, paddingLeft: 10 }}>{strings('login.brandCodeInsert')}</Text>
                            <TouchableOpacity onPress={(isModalVisible) => this.setState({ isModalVisible: false, brandCodeError: '' })}>
                              <Icon type="FontAwesome" name="times" style={{ fontSize: 25, color: 'red', paddingLeft: 13 }} />
                            </TouchableOpacity>
                          </CardItem>
                          <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey' }} />
                          <View style={{ marginTop: 20 }}>
                            <Text>{strings('login.brandCode')} : </Text>
                            <TextInput
                              style={{
                                borderBottomColor: this.state.borderBottomColorUserName,
                                ...styles.inputs
                              }}
                              maxLength={4}
                              placeholder={strings('login.brandCode')}
                              onFocus={() => { this.setState({ borderBottomColorUserName: '#50CAD0' }) }}
                              onBlur={() => { this.setState({ borderBottomColorUserName: '#757575' }); }}
                              onChangeText={(brandCode) => this.setState({ brandCode })}
                            />
                            {this.state.brandCodeError ?
                              <View style={{ marginTop: 15, marginLeft: 20 }}>
                                <Text style={{ color: 'red' }}>{this.state.brandCodeError}</Text>
                              </View>
                              : <View></View>}
                            <View style={{ marginTop: 40 }}>
                              <Button title={strings('login.profileScreenSubmit')} disabled={this.state.brandCode ? false : true} onPress={this.verifyBrandID} />
                            </View>
                          </View>
                        </Card>
                      </View>
                    </Modal>
                   
                  </Content>
                </View>
              </Card>
              
            </ScrollView>
          </View>
        {/* } */}
      </KeyboardAwareScrollView>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#cccccc10'
  },
  containerLevel1: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor:"#ccc"
    // paddingTop: Dimensions.get('window').width * 0.1,
    // paddingLeft: 50,
    // paddingRight: 50,

  },
  loginViewContainer: {
    flex:1,
    alignItems: 'stretch',
    backgroundColor:MyColors.white,
    marginTop:10,
    borderTopLeftRadius:10,
    borderBottomRightRadius:10,
    
  },
  cardContainer: {
    padding: 15,
    marginLeft: 20,
    marginRight: 20,
    flex: 1,
    borderRadius:15,
  
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flex: 1
  },
  inputContainer: {
    marginTop: 25,
    marginBottom: 15,
    // backgroundColor: 'orange',
    flex: 1,
  },
  inputs: {
    height: 45,
    marginLeft: 5,
    borderRadius: 20,
    borderWidth:1,
    borderColor: MyColors.distributorColor,
    paddingLeft:20, 
    fontSize:18
  },
  buttonLogin: {
    marginTop: 10,
    backgroundColor: MyColors.distributorColor,
    borderRadius: 20,
    flex: 1,
  },
  buttonLogin1: {
    marginTop: 30,
    backgroundColor: '#e43c22',
    borderRadius: 5,
    width: 350,
    bottom: 5
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    // fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },

  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
},
  searchIcon: {
    padding: 10,
  },
input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
},

})

const mapStateToProps = (state) => {
  if (state.VerifierReducer.languageEnglish == "English - (English)") {
    I18n.locale = 'en'
  } else if (state.VerifierReducer.languageEnglish == "French - (Française)") {
    I18n.locale = 'fr'
  } else if (state.VerifierReducer.languageEnglish == "Hindi - (हिन्दी)") {
    I18n.locale = 'hi'
  } else if (state.VerifierReducer.languageEnglish == "Punjabi - (ਪੰਜਾਬੀ)") {
    I18n.locale = 'pa'
  } else if (state.VerifierReducer.languageEnglish == "Marathi - (मराठी)") {
    I18n.locale = 'ma'
  } else if (state.VerifierReducer.languageEnglish == "Gujarati - (ગુજરાતી)") {
    I18n.locale = 'gu'
  } else if (state.VerifierReducer.languageEnglish == "Telgu - (Telgu)") {
    I18n.locale = 'tl'
  } else if (state.VerifierReducer.languageEnglish == "Tamil - (தமிழ்)") {
    I18n.locale = 'ta'
  } else if (state.VerifierReducer.languageEnglish == "Bengali - (বাংলা)") {
    I18n.locale = 'ben'
  } else if (state.VerifierReducer.languageEnglish == "Urdu - (اردو)") {
    I18n.locale = 'ur'
  } else if (state.VerifierReducer.languageEnglish == "Kannada - (ಕನ್ನಡ)") {
    I18n.locale = 'kan'
  } else if (state.VerifierReducer.languageEnglish == "Odia - (ଓଡିଆ)") {
    I18n.locale = 'od'
  } else if (state.VerifierReducer.languageEnglish == "Swahili - (Kiswahili)") {
    I18n.locale = 'swa'
  } else {
    I18n.locale = 'en'
  }
  return {
    languageControl: state.VerifierReducer.languageEnglish,
    enableDarkTheme: state.VerifierReducer.enableDarkTheme,
    fingerPrintEnable: state.VerifierReducer.enableFingerPrint
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setLoginData: setLoginData
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomerLoginScreen)