import React, { Component } from 'react';
import { Alert, Dimensions, Platform, StyleSheet, View, AppState, TextInput, TouchableOpacity,StatusBar, Modal, Image } from 'react-native';
import { Header, Left, Body, Right, Card, Text, Title, Icon, Label, Button } from 'native-base';
import CircleCheckBox, { LABEL_POSITION } from 'react-native-circle-checkbox';
import { Col, Grid, Row } from "react-native-easy-grid";
import * as utilities from '../../Utility/utilities';
import { ScrollView } from 'react-native-gesture-handler';
import { strings } from '../../locales/i18n';
import { URL, APIKEY, ACCESSTOKEN } from '../../App';
import Loader from '../../Utility/Loader';
import { setMechanicData, setCounterValue, setCounter1Value } from '../../Redux/Actions/VerifierActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import MyColors from '../../Utility/Colors';
import ProfileService from '../../services/ProfileService/ProfileService';
import ImagePicker from "react-native-image-picker";

class PaymentDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentWallet: '',
      bankTransfer: '',
      phoneNoError: '',
      phoneNo: '',
      beneficiaryName: '',
      acNo: '',
      ifscCode: '',
      beneficiaryNameError: '',
      acNoError: '',
      ifscCodeError: '',
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      loading: false,
      loaderText: 'Loading',
      mechanicID: "",
      showHideVerifyForWallet: "",
      showHideVerifyForBank: "",
      pymOpn: '',
      showRefreshButton: '',
      disableFields: true,
      enable_edit: false,
      showHideUpdate: true,
      showHideUpdateForPhoneNo: true,
      appState: AppState.currentState,
      inValidIfsc: false,
      showHideVerifyButtonForWallet: false,
      showHideVerifyButton: false,
      showHideErrorMSg: false,
      showPayOtp1: '',
      showPayOtp2: '',
      callApiOrNo1: false,
      callApiOrNo2: false,
      carpenterId:'',
      accesstoken:'',
      userType:'',
      last_updated:'-',
      message:'-',
      modalVisible: false,
      image:"",
      pickedImage: "",
      showHideLoading: false,
      passbookFile: '',
      bank_passbook: null,
    };
  }

  toggleModal(visible) {
    this.setState({ modalVisible: visible });
  }

  imagePickerHandler = () => {
    ImagePicker.showImagePicker({ title: "Pick an image" }, res => {
        // console.log("res");
        //  console.log("name:",res);
        if (res.didCancel) {
            // alert("u have cancelled.")
        } else if (res.error) {
            console.log(res.error);
            alert("u have an error."+res.error);
        } else {
            console.log("123123123");
            alert("Save changes to upload the image.");
            this.setState({
                isImage: true,
                pickedImage: { uri: res.uri, data: res }
            })
        }
        console.log(this.state.pickedImage.uri);
    });
}

  async getAsyncData() {
    this.setState({ loading: true });
    await AsyncStorage.multiGet(['USERDATA','ACCESSTOKEN'], (err, result) => {
      console.log(result, "result");
      var lData = JSON.parse(result[0][1]);
      var at = result[1][1];
      console.log("login details:",lData);
      console.log("at",at);
      if(lData)
      {
        this.setState({ carpenterId : lData.data.id, accesstoken: at ,userType : lData.data.userType, })
      }
      
      this._getUserData();
     
    });
  }

  async _getUserData() {
    const formData = new FormData();
    
    formData.append('carpenterId', this.state.carpenterId);
    formData.append('userType', this.state.userType);
    console.log("-----------"+formData);
    var profileApiObj = new ProfileService();
    
    this.setState({ loading: true });
    await profileApiObj.getCarpenterProfile(formData,this.state.accesstoken);
    var lResponseData = profileApiObj.getRespData();
    if (!lResponseData) {
        utilities.showToastMsg('Something went wrong. Please try again later');
    } else if (lResponseData.status == 500 || lResponseData.status == 400) {
        utilities.showToastMsg(lResponseData.message);
    } else if (lResponseData.status == 403) {
        utilities.showToastMsg(lResponseData.message);
        this.props.navigation.navigate('LoginScreen');
        AsyncStorage.clear();
        return;
    }
    else if (lResponseData.status == 200) {
        console.log(lResponseData, "Response");
        // this._getStatesByCountry(101);
        // this.userdata = lResponseData.data;
        if(lResponseData.bankDetails.beneficiary_name)
        {
        this.setState({
            beneficiaryName: lResponseData.bankDetails.beneficiary_name,
            acNo: lResponseData.bankDetails.account_no,
            ifscCode: lResponseData.bankDetails.ifsc_code,
            last_updated: strings('login.last_updated_on')+lResponseData.bankDetails.updated_date,
            message: lResponseData.bankDetails.message,
            bank_passbook: lResponseData.data.bank_passbook,
            passbookFile: lResponseData.data.passbookFile,
            showHideUpdate:false
        });

      }
      else{
        utilities.showToastMsg("No Bank Details");
      }

    } else {
        utilities.showToastMsg('Something went wrong. Please try again later');
    }
}

  componentDidMount = () => {
    this.getAsyncData();
    // this.setState({
    //   callApiOrNo1: this.props.callApiOrNo1, callApiOrNo2: this.props.callApiOrNo2, 
    //   showPayOtp1: this.props.showPayOtp1, showPayOtp2: this.props.showPayOtp2, 
    //   showHideErrorMSg: this.props.showHideErrorMSg, showHideVerifyButton: this.props.showHideVerifyButton,
    //    showHideVerifyButtonForWallet: this.props.showHideVerifyButtonForWallet, inValidIfsc: this.props.inValidIfsc, 
    //    showHideUpdate: this.props.showHideUpdate == '' ? false : true, mechanicID: this.props.mechanicID, showHideUpdateForPhoneNo: this.props.showHideVerifyForWallet == '1' ? false : true, phoneNo: this.props.showHideVerifyForWallet == '1' ? this.props.phoneNo : '', showHideVerifyForWallet: this.props.showHideVerifyForWallet, pymOpn: this.props.pymOpn,
    //   showHideVerifyForBank: this.props.showHideVerifyForBank, beneficiaryName: this.props.beneficiaryName, acNo: this.props.acNo, ifscCode: this.props.ifscCode
    // }, () => {
    //   if (this.props.pymOpn == '1' && this.props.showHideVerifyForWallet == '1' && this.props.counter < 1) {
    //     this.paymentApi("Paytm Wallet");
    //   } if (this.props.pymOpn == '2' && this.props.showHideVerifyForBank == '1' && this.props.counter1 < 1) {
    //     this.paymentApi("Bank Transfer");
    //   }
    // })
    // if (this.props.pymOpn == '0') {
    //   this.setState({ paymentWallet: true, bankTransfer: false })
    //   return;
    // } else if (this.props.pymOpn == '1') {
    //   this.setState({ paymentWallet: true, bankTransfer: false })
    // } else {
    //   this.setState({ paymentWallet: false, bankTransfer: true })
    // }
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange = (nextAppState) => {
    this.setState({ appState: nextAppState });
    if (nextAppState === 'active') {
      if (this.props.fingerPrintEnable) {
        this.props.navigation.navigate('FingerPrintScannerDemo')
        // this.authCurrent();
      }
    }
  };
  _showHeader() {
    if (Platform.OS == 'ios') {
      return (
        <Header style={{ backgroundColor:MyColors.distributorColor }} hasTabs>
          <Left style={{ flex: 0.2 }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('HomeScreen')}>
              <Icon type="FontAwesome5" name="arrow-left" style={{ fontSize: 20, color: '#FFFFFF', paddingRight: 10 }} />
            </TouchableOpacity>
          </Left>
          <Body style={{ flex: 0.6, alignItems: 'center' }}>
            <Title style={{ textAlign: 'center', color: '#FFFFFF' }}>{strings('login.paymentOptions_screen_title')}</Title>
          </Body>
          <Right style={{ flex: 0.2 }}>
          </Right>
        </Header>
      )
    } else {
      return (
        <Header style={{ backgroundColor: MyColors.distributorColor }} >
          <Left style={{ flex: 0.2 }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('HomeScreen')}>
              <Icon type="FontAwesome5" name="arrow-left" style={{ fontSize: 20, color: '#FFFFFF', paddingRight: 10 }} />
            </TouchableOpacity>
          </Left>
          <Body style={{ flex: 0.6, alignItems: 'center' }}>
            <Title style={{ color: '#FFFFFF', fontSize: 16 }}>{strings('login.paymentOptions_screen_title')}</Title>
          </Body>
          <Right style={{ flex: 0.2 }}>
          </Right>
        </Header>
      )
    }
  }

  recuriterDataChange = phoneNo => { this.setState({ phoneNo: phoneNo, phoneNoError: '' }) }
  _onPressButton = methodForMoney => {
    // if (methodForMoney === 'Wallet') {
    //   this.setState({ loaderText: 'Verifying mobile number...' })
    //   if (!this.state.phoneNo || this.state.phoneNo === 'null') {
    //     this.setState({ phoneNoError: "Phone no is required." });
    //     return;
    //   } else if (!utilities.checkMobileNumber(this.state.phoneNo)) {
    //     this.setState({ phoneNoError: "This phone number appears to be invalid." });
    //     return;
    //   } else {
    //     this.paymentApi("Paytm Wallet");
    //   }
    // } 
    // else 
    if (methodForMoney === 'Bank') {
      this.setState({ loaderText: 'Loading...' })
      // formData.append('bank_passbook', passbookImg);
      if (!this.state.beneficiaryName || this.state.beneficiaryName === 'null') {
        this.setState({ beneficiaryNameError: "Beneficiary name is required." });
        return;
      } else if (!this.state.acNo || this.state.acNo === 'null') {
        this.setState({ acNoError: "A/C no is required." });
        return;
      } else if (!this.state.ifscCode || this.state.ifscCode === 'null') {
        this.setState({ ifscCodeError: "IFSC code is required." });
        return;
      } else if (!this.state.bank_passbook || this.state.bank_passbook === 'null') {
        this.setState({ bank_passbook: "Passbook image is required."});
      }
      // else if (!utilities.checkIFSC(this.state.ifscCode)) {
      //   this.setState({ ifscCodeError: "IFSC code appears to be invalid." });
      //   return;
      // } 
      else {
        this.paymentApi("Bank Transfer");
      }
    }
  }

  paymentApi = paymentOptions => {
    this.setState({ loading: true })
    const formData = new FormData();
    formData.append('carpenterId', this.state.carpenterId);
      // formData.append('paymentOption', 2);
      formData.append('beneficiaryName', this.state.beneficiaryName);
      formData.append('accNo', this.state.acNo);
      formData.append('ifscCode', this.state.ifscCode);
      if (!this.state.pickedImage == "") {
        const passbookImg = {
          uri:  this.state.pickedImage.uri,
          type: this.state.pickedImage.data.type ? this.state.pickedImage.data.type : "image/jpeg",
          name: Platform.OS == "ios" ? 'coupon_front.jpg' :this.state.pickedImage.data.fileName
        }
        formData.append('passbookFile', passbookImg);
      } 
      else {
        formData.append('passbookFile', '');
      }
      if (this.props.languageControl) {
        formData.append('language', 'en');
      } else {
        formData.append('language', 'hi');
      } 
      console.log(formData, "formData");

    var lUrl = URL + 'updateBankDetails';
    fetch(lUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application\/json',
        'Content-Type': 'multipart\/form-data',
        'apikey': APIKEY,
        "accesstoken": this.state.accesstoken
      },
      body: formData,
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({ loading: false })
        console.log(responseJson, "jsonres");
        if (responseJson.status == 200) {
          Alert.alert(
            strings('login.paymentScreen_alertTitle'),
            `${responseJson.message}`,
            [
              { text: strings('login.OK'), onPress: () => {  this._getUserData() } },
            ],
            { cancelable: false }
          );
          this.setState({ showHideUpdate: false })
          this.setState({enable_edit: false})
        
        } else if (responseJson.status == 202) {
          utilities.showToastMsg(responseJson.message);
          
        }
        else if (responseJson.status == 449) {
          utilities.showToastMsg(responseJson.message);
        }
        else if (responseJson.status == 422) {
        
          utilities.showToastMsg(responseJson.message);
            
          
          // this.props.setMechanicData(responseJson.data);
        } else if (responseJson.status == 500) {
          utilities.showToastMsg(responseJson.message);
        } else if (responseJson.status == 403) {
          utilities.showToastMsg(responseJson.message);
        }
      })
      .catch((error) => {
        this.setState({ loading: false })
        console.log(error);
      });
  }
  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: this.props.enableDarkTheme ? "black" : '#F8F8F8' }} keyboardShouldPersistTaps={'handled'}>
        {this._showHeader()}
        <StatusBar backgroundColor={  MyColors.distributorColor  } barStyle="light-content" />
        {/* <Loader loading={this.state.loading} text={this.state.loaderText} /> */}
      
            <View style={{ margin:10, }}>
              <View style={{ marginLeft: 10, marginRight: 10, marginTop: 10, }}>

               
                    <Text style={{ color:'#000', fontSize:18, marginVertical:10,fontWeight:'bold'}}>Please Update Bank Details: </Text>
              

                {!!this.state.beneficiaryNameError ?
                  <View style={{ marginTop: 15 }}>
                    <Label style={{ color:  'black' }}>{strings('login.paymentOptions_screen_beneficiaryName')}<Text style={{ color: 'red' }}>*</Text> :</Label>
                    <TextInput
                      value={this.state.beneficiaryName}
                      placeholder={strings('login.paymentOptions_screen_beneficiaryName')}
                      style={{ height: 40, borderColor: 'black', borderWidth: 1, marginTop: 10, width: '100%',borderRadius:25,paddingLeft:20 }}
                      // style={this.props.showHideVerifyForBank == '1' ? { height: 40, borderColor: 'red', borderWidth: 1, marginTop: 10, width: '80%' } : { height: 40, borderColor: 'red', borderWidth: 1, marginTop: 10, width: '100%' }}
                      maxLength={30}
                      onChangeText={(beneficiaryName) => this.setState({ beneficiaryName: beneficiaryName, beneficiaryNameError: '' })}
                    />
                    <View style={{ justifyContent: 'center' }}>
                      <Icon name="exclamation-circle" type="FontAwesome" style={{ fontSize: 18, color: 'red', marginTop: 5 }}>
                        {' '}<Text style={styles.errorMsg}>{this.state.beneficiaryNameError}</Text>
                      </Icon>
                    </View>
                  </View>
                  :
                  <View>
                    <Grid>
                      <Col size={10}>
                        <Label style={{ color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.paymentOptions_screen_beneficiaryName')}<Text style={{ color: 'red' }}>*</Text> :</Label>
                        <TextInput
                          value={this.state.beneficiaryName}
                          editable={this.state.showHideUpdate}
                          placeholder={strings('login.paymentOptions_screen_beneficiaryName')}
                          style={{ height: 40, borderColor: 'black', borderWidth: 1, marginTop: 10, width: '100%',borderRadius:25,paddingLeft:20 }}
                          // style={this.props.showHideVerifyForBank == '1' ? { height: 40, borderColor: this.props.enableDarkTheme ? 'white' : 'black', borderWidth: 0.8, marginTop: 10, width: '95%', fontSize: 17, color: this.props.enableDarkTheme ? 'white' : 'black' } : { height: 40, borderColor: this.props.enableDarkTheme ? 'white' : 'black', borderWidth: 1, marginTop: 10, width: '100%', fontSize: 17, color: this.props.enableDarkTheme ? 'white' : 'black' }}
                          maxLength={30}
                          onChangeText={(beneficiaryName) => this.setState({ beneficiaryName: beneficiaryName })}
                        />
                      </Col>
                      {this.props.showHideVerifyButton ?
                        <Col size={2}>
                          <Icon name="check-circle-o" type="FontAwesome" style={{ fontSize: 30, color: 'green', textAlign: 'center' }} />
                          <Text style={{ color: 'green', textAlign: 'center' }}>{strings('login.paymentOptions_screen_verifiedLogo')}</Text>
                        </Col>
                        : <View />}
                    </Grid>
                  </View>
                }

                {!!this.state.acNoError ?
                  <View style={{ marginTop: 15 }}>
                    <Label style={{ color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.paymentOptions_screen_acNo')}<Text style={{ color: 'red' }}>*</Text> :</Label>
                    <TextInput
                      value={this.state.acNo}
                      placeholder={strings('login.paymentOptions_screen_acNo')}
                      style={{ height: 40, borderColor: 'black', borderWidth: 1, marginTop: 10, width: '100%',borderRadius:25,paddingLeft:20 }}
                      // style={this.props.showHideVerifyForBank == '1' ? { height: 40, borderColor: this.props.enableDarkTheme ? 'white' : 'red', color: this.props.enableDarkTheme ? 'white' : 'black', borderWidth: 1, marginTop: 10, width: '80%' } : { height: 40, borderColor: this.props.enableDarkTheme ? 'white' : 'red', color: this.props.enableDarkTheme ? 'white' : 'black', borderWidth: 1, marginTop: 10, width: '100%' }}
                      maxLength={20}
                      keyboardType="phone-pad"
                      onChangeText={(acNo) => this.setState({ acNo: acNo, acNoError: '' })}
                    />
                    <View style={{ justifyContent: 'center' }}>
                      <Icon name="exclamation-circle" type="FontAwesome" style={{ fontSize: 18, color: 'red', marginTop: 5 }}>
                        {' '}<Text style={styles.errorMsg}>{this.state.acNoError}</Text>
                      </Icon>
                    </View>
                  </View>
                  :
                  <View style={{ marginTop: 15 }}>
                    <Label style={{ color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.paymentOptions_screen_acNo')}<Text style={{ color: 'red' }}>*</Text> :</Label>
                    <TextInput
                      value={this.state.acNo}
                      placeholder={strings('login.paymentOptions_screen_acNo')}
                      style={{ height: 40, borderColor: 'black', borderWidth: 1, marginTop: 10, width: '100%',borderRadius:25,paddingLeft:20 }}
                      // style={this.props.showHideVerifyForBank == '1' ? { height: 40, borderColor: this.props.enableDarkTheme ? 'white' : 'black', color: this.props.enableDarkTheme ? 'white' : 'black', borderWidth: 0.8, marginTop: 10, width: '80%', fontSize: 17 } : { height: 40, borderColor: this.props.enableDarkTheme ? 'white' : 'black', color: this.props.enableDarkTheme ? 'white' : 'black', borderWidth: 1, marginTop: 10, width: '100%', fontSize: 17 }}
                      maxLength={20}
                      editable={this.state.showHideUpdate}
                      onChangeText={(acNo) => this.setState({ acNo: acNo })}
                      keyboardType="phone-pad"
                    />
                  </View>
                }

                {!!this.state.ifscCodeError ?
                  <View style={{ marginTop: 15 }}>
                    <Label style={{ color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.paymentOptions_screen_ifsc_code')}<Text style={{ color: 'red' }}>*</Text> :</Label>
                    <TextInput
                      value={this.state.ifscCode}
                      placeholder={strings('login.paymentOptions_screen_ifsc_code')}
                      style={{ height: 40, borderColor: 'black', borderWidth: 1, marginTop: 10, width: '100%',borderRadius:25,paddingLeft:20 }}
                      // style={this.props.showHideVerifyForBank == '1' ? { height: 40, borderColor: this.props.enableDarkTheme ? 'white' : 'red', color: this.props.enableDarkTheme ? 'white' : 'black', borderWidth: 1, marginTop: 10, width: '80%' } : { height: 40, borderColor: this.props.enableDarkTheme ? 'white' : 'red', color: this.props.enableDarkTheme ? 'white' : 'black', borderWidth: 1, marginTop: 10, width: '100%' }}
                      maxLength={11}
                      onChangeText={(ifscCode) => this.setState({ ifscCode: ifscCode, ifscCodeError: '' })}
                    />
                    <View style={{ justifyContent: 'center' }}>
                      <Icon name="exclamation-circle" type="FontAwesome" style={{ fontSize: 18, color: 'red', marginTop: 5 }}>
                        {' '}<Text style={styles.errorMsg}>{this.state.ifscCodeError}</Text>
                      </Icon>
                    </View>
                  </View>
                  :
                  <View style={{ marginTop: 15 }}>
                    <Label style={{ color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.paymentOptions_screen_ifsc_code')}<Text style={{ color: 'red' }}>*</Text> :</Label>
                    <TextInput
                      value={this.state.ifscCode}
                      placeholder={strings('login.paymentOptions_screen_ifsc_code')}
                      style={{ height: 40, borderColor: 'black', borderWidth: 1, marginTop: 10, width: '100%',borderRadius:25,paddingLeft:20 }}
                      // style={this.props.showHideVerifyForBank == '1' ? { height: 40, borderColor: this.props.enableDarkTheme ? 'white' : 'black', color: this.props.enableDarkTheme ? 'white' : 'black', borderWidth: 0.8, marginTop: 10, width: '80%', fontSize: 17 } : { height: 40, borderColor: this.props.enableDarkTheme ? 'white' : 'black', color: this.props.enableDarkTheme ? 'white' : 'black', borderWidth: 1, marginTop: 10, width: '100%', fontSize: 17 }}
                      maxLength={11}
                      editable={this.state.showHideUpdate}
                      onChangeText={(ifscCode) => this.setState({ ifscCode: ifscCode })}
                    />
                  </View>
                }

                {/* if passbook not Uploaded*/}
                {this.state.bank_passbook == null || this.state.bank_passbook == "" && this.state.pickedImage == "" ? (
                  <View style={{ marginTop: 15 }}>
                    <Label>Passbook Image: </Label>
                      <Button disabled = { this.state.enable_edit ? false : true } style={{marginTop: 10, marginRight: 10, backgroundColor: MyColors.distributorColor, borderRadius: 20 }} onPress={this.imagePickerHandler} >
                        <Text style={styles.textUpload}>{strings('login.uploadImage')}</Text>
                        <Icon type="FontAwesome" name="camera-retro" style={{ fontSize: 25, alignSelf: "center", }} />
                      </Button>
                  </View>                  
                ): (
                  <View style={{ marginTop: 15 }}>
                    <Modal animationType={"slide"} transparent={false}
                      visible={this.state.modalVisible}
                      onRequestClose={() => { console.log("Image has been closed.") }}>
                      <View style={styles.modal}>
                        <Image
                          style={{ width: '100%', height: '90%', resizeMode: 'stretch' }}
                          source={{ uri: this.state.bank_passbook }}
                        />
                        
                        <TouchableOpacity style={styles.touchableButton}
                          onPress={() => { this.toggleModal(!this.state.modalVisible) }}>
                          <Text style={styles.text}>Close</Text>
                          {/* <Text>{this.state.bank_passbook}//</Text> */}
                        </TouchableOpacity>
                      </View>
                    </Modal>
                    <TouchableOpacity onPress={() => { this.toggleModal(true) }}>
                      <Text style={{ color:'blue', textDecorationLine: 'underline' , paddingLeft: 5, paddingTop: 10 }}>{strings('login.view_passbook_img')}</Text>
                    </TouchableOpacity>
                  </View>
                  )
                }

                <Grid>
                  <Row>
                    {!this.state.showHideUpdate ?
                      <Col>
                        <TouchableOpacity onPress={() => this.setState({ disableFields: true, showHideUpdate: true, enable_edit: true })} style={{ alignItems: 'center', marginTop: 30 }}>
                          <View style={styles.buttonSignUp}>
                            <Text style={styles.buttonTextSignUp}>{strings('login.Edit_button')}</Text>
                          </View>
                        </TouchableOpacity>
                      </Col>
                      :
                      <Col>
                        <TouchableOpacity onPress={() => this._onPressButton('Bank')} style={{ alignItems: 'center', marginTop: 30 }}>
                          <View style={styles.buttonSignUp}>
                            <Text style={styles.buttonTextSignUp}>{strings('login.paymentOptions_screen_saveButton')}</Text>
                          </View>
                        </TouchableOpacity>
                      </Col>
                    }
                  </Row>
                  <Row >
                  <Col>
                        <TouchableOpacity disabled style={{ alignItems: 'center', marginTop: 10 }}> 
                          <Text style={{ color:'#000000', fontSize:12, alignSelf:'center' }}> {!this.state.last_updated  ? '-' : this.state.last_updated } </Text>
                          <Text style={{ color:'#000000', fontSize:12, alignSelf:'center' }}> {!this.state.message  ? '-' : this.state.message }</Text>
                        </TouchableOpacity>
                      </Col>
                   
                  </Row>
                </Grid>
                {/* {!this.props.showHideVerifyButton && !this.props.inValidIfsc && this.props.beneficiaryName && this.props.showHideErrorMSg ?
                  <View style={{ marginTop: 20 }}>
                    <Text style={{ color: 'red', textAlign: 'center' }}>We are verifying the bank account details. Kindly click on refresh to obtain the latest status.{'  '}
                    </Text>
                    <View>
                      <TouchableOpacity style={{ marginTop: 10, marginLeft: this.state.width / 3, marginRight: this.state.width / 3 }} onPress={() => this.paymentApi("Bank Transfer")}>
                        <Icon type="FontAwesome" name="refresh" style={{ fontSize: 30, color: '#00ff00', textAlign: 'center' }} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  : <View />} */}
              </View>
            </View>
          {/* } */}
          <Text></Text>
        {/* </Card> */}
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  buttonSignUp: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: MyColors.distributorColor,
    borderRadius: 15,
    width: '100%',
  },
  buttonTextSignUp: {
    padding: 10,
    color: "#fefefe",
    
  },
  errorMsg: {
    fontSize: 12,
    color: 'red',
  },
  modal:{
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding : 5,
    marginTop: 5,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  touchableButton: {
    width: '70%',
    padding: 10,
    backgroundColor: '#293863',
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 20,
  },
  buttonImage: {
    marginLeft: 10, 
    marginTop: 10, 
    marginRight: 10, 
    backgroundColor: MyColors.distributorColor, 
    borderRadius: 20,
},
textUpload: {
    color: '#fff',
    textAlign: 'center',
},
})
const mapStateToProps = (state) => {
  console.log(state.VerifierReducer);

  return {
    mechanicID: state.VerifierReducer.mechanicData.id,
    phoneNo: state.VerifierReducer.mechanicData.paytm_reg_no,
    showHideVerifyForWallet: state.VerifierReducer.mechanicData.is_valid_payment_data_mobile,
    pymOpn: state.VerifierReducer.mechanicData.payment_option,
    showHideVerifyForBank: state.VerifierReducer.mechanicData.is_valid_payment_data_bank,
    beneficiaryName: state.VerifierReducer.mechanicData.beneficiary_name,
    acNo: state.VerifierReducer.mechanicData.account_no,
    ifscCode: state.VerifierReducer.mechanicData.ifsc_code,
    disableFieldsForBank: state.VerifierReducer.mechanicData.disableFields,

    showHideVerifyButton: state.VerifierReducer.mechanicData.showHideVerifyButton,
    showHideUpdate: state.VerifierReducer.mechanicData.showHideUpdate,
    inValidIfsc: state.VerifierReducer.mechanicData.inValidIfsc,
    showHideVerifyButtonForWallet: state.VerifierReducer.mechanicData.showHideVerifyButtonForWallet,
    showHideErrorMSg: state.VerifierReducer.mechanicData.showHideErrorMSg,
    showPayOtp1: state.VerifierReducer.mechanicData.showPayOtp1,
    showPayOtp2: state.VerifierReducer.mechanicData.showPayOtp2,
    callApiOrNo1: state.VerifierReducer.mechanicData.callApiOrNo1,
    callApiOrNo2: state.VerifierReducer.mechanicData.callApiOrNo2,
    counter: state.VerifierReducer.testCounter,
    counter1: state.VerifierReducer.testCounter1,
    enableDarkTheme: state.VerifierReducer.enableDarkTheme,
    languageControl: state.VerifierReducer.languageEnglish,
    fingerPrintEnable: state.VerifierReducer.enableFingerPrint
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setMechanicData: setMechanicData,
    setCounterValue: setCounterValue,
    setCounter1Value: setCounter1Value
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PaymentDetailsScreen)