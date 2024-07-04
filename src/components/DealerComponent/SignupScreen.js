import React, { Component } from 'react';
import { StatusBar, View, BackHandler, Image, TextInput, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Button, Text, Card, CardItem, Input, Label, Form, Item, Header, Left, Body, Icon, Title, Picker, Content, Grid, Col } from 'native-base';
import {
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import FileViewer from 'react-native-file-viewer';
import DocumentPicker from "react-native-document-picker";
  
import * as app from '../../App';
import LoginService from '../../services/LoginService/LoginService';
import RNPicker from "rn-modal-picker";
import * as utilities from '../../Utility/utilities';
import Loader from '../../Utility/Loader';
import { strings } from '../../locales/i18n';
import MyColors from '../../Utility/Colors';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceNumber from 'react-native-device-number';
import CheckBox from 'react-native-check-box';
// import FileUpload from './FileUpload';

export default class DealerSignupScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            distributorCode: "",
            distributorCodeError: "",
            shopName: "",
            shopNameError: "",
            name: "",
            nameError: "",
            mobileNo: "",
            mobileNoError: "",
            email:"",
            emailError:"",
            address: "",
            addressError: "",
            state: "",
            stateId: 0,
            stateError: "",
            city: "",
            cityId: "",
            cityError: "",
            pincode: "",
            pincodeError: "",
            stateList: [],
            cityList: [],
            loading: false,
            loaderText: "Signing up...",
            panNo:'',
            panNoError:'',
            password:'',
            passwordError:'',
            confirmpassword:'',
            confirmpasswordError:'',
            showPW:false,
            isShowImage:false,
            isCheck: false,
        }
    }

    handleFileUpload = event => {
        console.log(event.target.files[0].name);
    };

    componentDidMount = async () => {
        if(Platform.OS != 'ios'){
            DeviceNumber.get().then((res) => {
                this.setState({mobileNo : res.mobileNumber})
            });
        }
        this.stateListApiCall();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }


    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.props.navigation.navigate('LoginScreen');
        return true;
    }
    stateListApiCall = async () => {
        var statesApiObj = new LoginService();
        const formData = new FormData();
        formData.append('countryId', 113);
        await statesApiObj.getStatesByCountry(formData);
        var lResponseData = await statesApiObj.getRespData();
        this.setState({ stateList: lResponseData.states })
    }
    cityListApiCall = async (stateId) => {
        var statesApiObj = new LoginService();
        const formData = new FormData();
        formData.append('stateId', stateId);
        await statesApiObj.getCitiesByState(formData);
        var lResponseData = statesApiObj.getRespData();
        this.setState({ cityList: lResponseData.cities, stateId: stateId })
    }
    _showHeader() {
        if (Platform.OS == 'ios') {
            return (
                <Header style={{ backgroundColor: MyColors.distributorColor }}>
                    <Left style={{ flex: 0.1 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('LoginScreen')}>
                            <Icon type="FontAwesome5" name="arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingLeft: 10, paddingRight: 10 }} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{ flex: 0.9, paddingRight: 23 }}>
                        <Title style={{ color: '#FFFFFF' }}>Registration</Title>
                    </Body>

                </Header>
            )
        } else {
            return (
                <Header style={{ backgroundColor: MyColors.distributorColor }}>
                    <Grid>
                    <Col size={2} style={{ justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('LoginScreen')}>
                            {/* <Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingLeft: 10, }} /> */}
                            <Icon type="FontAwesome5" name="arrow-left" style={{ paddingLeft:10, fontSize: 16, color: MyColors.white, }} />
                        </TouchableOpacity>
                    </Col>
                    <Col size={10} style={{ justifyContent:'center' }}>
                        <Title style={{ color: '#FFFFFF', fontSize: 18, }}>Registration</Title>
                    </Col>
                    </Grid>
                </Header>
            )
        }
    }

    _validatePanNo() {
        let lPanNo = this.state.panNo;
        let res = '';
        res = utilities.checkPanNo(lPanNo);
        if (!res) {
            return false;
        } else {
            return true;
        }
    }

     signupDealer = () => {
        // console.log(utilities.checkEmail(this.state.email));
        // if (this.state.distributorCode == "") {
        //     this.setState({ distributorCodeError: "Distributor cannot be blank", pincodeError: "" })
        // } 
        // else if (this.state.shopName == "") {
            // this.setState({ distributorCodeError: "", shopNameError: "Shop name cannot be blank", pincodeError: "" })
        // } 
        if (this.state.name == "") {
            this.setState({ distributorCodeError: "", shopNameError: "", nameError: "Name cannot be blank", pincodeError: "" })
        } 
        else if (this.state.mobileNo == "" ) {
            this.setState({ distributorCodeError: "", shopNameError: "", nameError: "", mobileNoError: "Mobile No cannot be blank", pincodeError: "" })
        } 
        else if (!utilities.checkMobileNumber(this.state.mobileNo)) {
            this.setState({ distributorCodeError: "", shopNameError: "", nameError: "", mobileNoError: "Invalid Mobile Number", pincodeError: "" })
        } 
        else if (!utilities.checkEmail(this.state.email)){
            this.setState({ distributorCodeError: "", shopNameError: "", nameError: "", mobileNoError: "", pincodeError: "", emailError:"Invalid Email ID" })
        }
        // else if (this.state.address == "") {
        //     this.setState({ distributorCodeError: "", shopNameError: "", nameError: "", mobileNoError: "", addressError: "Address cannot be blank", pincodeError: "" })
        // }
         else if (this.state.state == "") {
            this.setState({ distributorCodeError: "", shopNameError: "", nameError: "", mobileNoError: "", addressError: "", stateError: "State cannot be blank", pincodeError: "" })
        } 
        else if (this.state.city == "") {
            this.setState({ distributorCodeError: "", shopNameError: "", nameError: "", mobileNoError: "", addressError: "", stateError: "", cityError: "City cannot be blank", pincodeError: "" })
        }
         else if (this.state.pincode == "") {
            this.setState({ distributorCodeError: "", shopNameError: "", nameError: "", mobileNoError: "", addressError: "", stateError: "", cityError: "", pincodeError: "Pincode cannot be blank" })
        }
        // else if (this.state.panNo == "" ) {
        //     this.setState({ distributorCodeError: "", shopNameError: "", nameError: "", mobileNoError: "", addressError: "", stateError: "", cityError: "", pincodeError: "",panNoError:"Invalid PAN Number" })
        // }
        else if (!this.state.panNo == "" && !this._validatePanNo()) {
            this.setState({ distributorCodeError: "", shopNameError: "", nameError: "", mobileNoError: "", addressError: "", stateError: "", cityError: "", pincodeError: "",panNoError:"Invalid PAN Number" })
        }
        else if (this.state.password == "" ) {
            this.setState({ distributorCodeError: "", shopNameError: "", nameError: "", mobileNoError: "", addressError: "", stateError: "", cityError: "", pincodeError: "",panNoError:"", passwordError:"Invalid Password" })
        }
        else if (this.state.password.length < 6) {
            this.setState({ distributorCodeError: "", shopNameError: "", nameError: "", mobileNoError: "", addressError: "", stateError: "", cityError: "", pincodeError: "",panNoError:"", passwordError:"Password should be of minimum 6 characters" })
        }
        else if (this.state.confirmpassword == "" ) {
            this.setState({ distributorCodeError: "", shopNameError: "", nameError: "", mobileNoError: "", addressError: "", stateError: "", cityError: "", pincodeError: "",panNoError:"", confirmpasswordError:"Invalid Confirm Password",passwordError:"" })
        }
        else if (this.state.password !== this.state.confirmpassword ) {
            this.setState({ distributorCodeError: "", shopNameError: "", nameError: "", mobileNoError: "", addressError: "", stateError: "", cityError: "", pincodeError: "",panNoError:"", passwordError:"",confirmpasswordError:"Passwords do not match, Please check" })
        }
         else {
            this.setState({ pincodeError: "", distributorCodeError: "", shopNameError: "", nameError: "", mobileNoError: "", addressError: "", stateError: "", cityError: "", loading: true, passwordError:"",confirmpasswordError:"",panNoError:"" }, () => {

                const formData = new FormData();
                formData.append('name', this.state.name);
                formData.append('shopName',"");
                formData.append('panNo', this.state.panNo);
                formData.append('mobileNo', this.state.mobileNo);
                formData.append('password', this.state.password);
                formData.append('emailId', this.state.email);
                // formData.append('address', this.state.address);
                formData.append('cityId', this.state.cityId);
                formData.append('stateId', this.state.stateId);
                formData.append('pinCode', this.state.pincode);

                console.log(formData);


                var lUrl = app.URL + 'registerCarpenter';
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
                    .then((responseJson) => {
                        this.setState({ loading: false })
                        if (responseJson.status == 200) {
                            // utilities.showToastMsg(responseJson.message);
                            //  AsyncStorage.setItem("LOGINEDUSERFLAG", "DEALER");
                            utilities.showToastMsg(responseJson.message);
                            AsyncStorage.setItem('OTPDATA', JSON.stringify(responseJson));
                            this.props.navigation.navigate('MechanicOtpVerification', 
                            { mobileNumber: this.state.mobileNo,
                                regId: responseJson.regId
                            });
                            // this.props.navigation.navigate("DealerSignUpVerification", { mobileNumber: this.state.mobileNo, regId: responseJson.regId });
                        } else if (responseJson.status == 400) {
                            utilities.showToastMsg(responseJson.message);
                        } else if (responseJson.status == 422) {
                            utilities.showToastMsg(responseJson.message);
                        } else if (responseJson.status == 409) {
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
            <KeyboardAvoidingView 
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            enabled>
            <ScrollView style={{ flex: 1, }}>
                {this._showHeader()}
                <StatusBar backgroundColor={MyColors.distributorColor} barStyle="light-content" />
                <Loader loading={this.state.loading} text={this.state.loaderText} />
                <View style={{ width: "100%", flex: 1,  justifyContent: "center", alignContent:'center' }}>
                    {/* <CardItem header style={{ borderBottomWidth: 1, borderBottomColor: '#E0E0E0', }}>
                        <Text style={{ marginLeft: -12, color: '#212121', fontWeight: 'normal', fontSize: 18 }}> {strings('login.signup_button')}</Text>
                    </CardItem> */}

                    
                    <Form style={{ margin: 5}}>
                        
                        {/* <Item stackedLabel style={{ marginTop: 10 }}>
                            <Label style={{ color: MyColors.distributorColor, fontSize: 18 }}>{strings('login.profile_screen_shopName_field')}:</Label>
                            <Input value={this.state.shopName} onChangeText={(e) => this.setState({ shopName: e })} />
                        </Item>
                        {this.state.shopNameError.length > 0 ? <Text style={{ color: "red", textAlign: "center", }}>{this.state.shopNameError}</Text> : <View />} */}

                        <Item stackedLabel style={{ marginTop: 5 }}>
                            <Label style={{ color: MyColors.distributorColor, fontSize: 16, }}>{strings('login.profile_screen_name_field')}*:</Label>
                            <Input placeholderTextColor="#ccc" maxLength={30} placeholder="Full Name" value={this.state.name} onChangeText={(e) => this.setState({ name: e })} />
                        </Item>
                        {this.state.nameError.length > 0 ? <Text style={{ color: "red", textAlign: "center", }}>{this.state.nameError}</Text> : <View />}

                        <Item stackedLabel style={{ marginTop: 5 }}>
                            <Label style={{ color: MyColors.distributorColor, fontSize: 16 }}>{strings('login.mobileN')}*:</Label>
                            <Input placeholderTextColor="#ccc"  placeholder="+254 Mobile Number" keyboardType="numeric" value={this.state.mobileNo} maxLength={10} onChangeText={(e) => this.setState({ mobileNo: e.replace(/[^0-9]/g, '') })} />
                        </Item>
                        {this.state.mobileNoError.length > 0 ? <Text style={{ color: "red", textAlign: "center", }}>{this.state.mobileNoError}</Text> : <View />}
                        
                        {/* <Item stackedLabel  style={{ marginTop: 5 }} >
                            <Label style={{ color: MyColors.distributorColor, fontSize: 16 }}>{strings('login.profile_distributor_distributor_code')}*:</Label>
                            <Input placeholderTextColor="#ccc"  placeholder="Distributor Code"  value={this.state.distributorCode} onChangeText={(e) => this.setState({ distributorCode: e })} />
                        </Item>
                        {this.state.distributorCodeError.length > 0 ? <Text style={{ color: "red", textAlign: "center", }}>{this.state.distributorCodeError}</Text> : <View />} */}


                        <Item stackedLabel style={{ marginTop: 5 }}>
                            <Label style={{ color: MyColors.distributorColor, fontSize: 16 }}>Email*:</Label>
                            <Input placeholderTextColor="#ccc"  placeholder="Email"  keyboardType="email-address" value={this.state.email} onChangeText={(e) => this.setState({ email: e })} /> 
                        </Item>
                        {this.state.emailError.length > 0 ? <Text style={{ color: "red", textAlign: "center", }}>{this.state.emailError}</Text> : <View />}

                        {/* <Item stackedLabel style={{ marginTop: 5 }}>
                            <Label style={{ color: MyColors.distributorColor, fontSize: 16 }}>{strings('login.profile_distributor_address')}*:</Label>
                            <Input placeholderTextColor="#ccc"  placeholder="Address"  value={this.state.address} onChangeText={(e) => this.setState({ address: e })} />
                        </Item>
                        {this.state.addressError.length > 0 ? <Text style={{ color: "red", textAlign: "center", }}>{this.state.addressError}</Text> : <View />} */}

                        <Label style={{ color: MyColors.distributorColor, fontSize: 16, paddingLeft: 15, marginTop: 20, fontSize: 16 }}>{strings('login.state')}*:</Label>
                        <View style={{ width: '100%', alignSelf: "center", marginTop: 10,paddingLeft: 15 }}>
                            <RNPicker
                                dataSource={this.state.stateList}
                                dummyDataSource={this.state.stateList}
                                // defaultValue={true}
                                pickerTitle={"Select State"}
                                pickerItemTextStyle={{
                                    borderBottomWidth: 0.5,
                                    borderBottomColor: 'grey',
                                    marginVertical: 10,
                                    marginHorizontal: 10,
                                    textAlign: "left"
                                }}
                                showSearchBar={true}
                                disablePicker={false}
                                changeAnimation={"none"}
                                searchBarPlaceHolder={"Search....."}
                                showPickerTitle={true}
                                selectedLabel={this.state.state}
                                placeHolderLabel={"Select State"}
                                selectedValue={(index, item) => { this.cityListApiCall(item.id), this.setState({ state: item.name }) }}
                            />
                            {this.state.stateError.length > 0 ? <Text style={{ color: "red", textAlign: "center", }}>{this.state.stateError}</Text> : <View />}
                        </View>

                        <Label style={{ color: MyColors.distributorColor, fontSize: 16, paddingLeft: 15, marginTop: 20, fontSize: 16 }}>{strings('login.city')}*:</Label>
                        <View style={{ width: '100%', alignSelf: "center", marginTop: 10,paddingLeft: 15 }}>
                            <RNPicker
                                dataSource={this.state.cityList}
                                dummyDataSource={this.state.cityList}
                                // defaultValue={true}
                                pickerTitle={"Select City"}
                                pickerItemTextStyle={{
                                    color: "#000",
                                    borderBottomWidth: 0.5,
                                    borderBottomColor: 'grey',
                                    marginVertical: 10,
                                    flex: 0.9,
                                    marginHorizontal: 10,
                                    textAlign: "left"
                                }}
                                showSearchBar={true}
                                disablePicker={false}
                                changeAnimation={"none"}
                                searchBarPlaceHolder={"Search....."}
                                showPickerTitle={true}
                                selectedLabel={this.state.city}
                                placeHolderLabel={"Select City"}
                                selectedValue={(index, item) => { this.setState({ cityId: item.id, city: item.name }) }}
                            />
                            {this.state.cityError.length > 0 ? <Text style={{ color: "red", textAlign: "center", }}>{this.state.cityError}</Text> : <View />}
                        </View>

                        <Item stackedLabel style={{ marginTop: 10 }}>
                            <Label style={{color: MyColors.distributorColor, fontSize: 16}}>{strings('login.profile_screen_pobox_field')}*:</Label>
                            <Input placeholderTextColor="#ccc"  placeholder="P.O. Box" keyboardType="numeric" value={this.state.pincode} onChangeText={(e) => this.setState({ pincode: e.replace(/[^0-9]/g, '') })} />
                        </Item>
                        {this.state.pincodeError.length > 0 ? <Text style={{ color: "red", textAlign: "center", }}>{this.state.pincodeError}</Text> : <View />}

                        {/* <Item stackedLabel  style={{ marginTop: 5 }} >
                            <Label style={{ color: MyColors.distributorColor, fontSize: 16 }}>{strings('login.profile_screen_panNo_field')}:</Label>
                            <Input placeholderTextColor="#ccc"  placeholder="PAN Number"  value={this.state.panNo} onChangeText={(e) => this.setState({ panNo: e })} />
                        </Item> */}
                            {/* <FileUpload/> */}
                            {/* <Input onChange={this.handleFileUpload} type="file" style={{display: "none"}} ref="fileInput"/> */}
                        {/* <Label style={{ color: MyColors.distributorColor, fontSize: 16, flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 15 }}>Upload bank passbook image:</Label> */}
                            {/* onPress={() => this.handleFileUpload.click()}  */}
                        {/* <Item>
                            <View>
                                <View style={{ flex: 1 , flexDirection: 'row', flexWrap: 'wrap' }}>
                                    <Button style={{marginBottom: 10, marginRight: 10, backgroundColor: MyColors.distributorColor }} onPress={() => this.handleFileUpload.click()} >
                                        <Text>Upload File</Text>
                                    </Button>
                                    <Button style={{marginBottom: 10, backgroundColor: MyColors.distributorColor }} onPress={() => this.handleFileUpload.click()} >
                                        <Text>Open Camera</Text>
                                    </Button>
                                </View>
                                {!!this.state.isShowImage ? (
                                    <Text>Hello</Text>
                                    ): null
                                }
                                
                            </View>
                        </Item> */}
                        {this.state.panNoError.length > 0 ? <Text style={{ color: "red", textAlign: "center", }}>{this.state.panNoError}</Text> : <View />}

                        <Item stackedLabel  style={{ marginTop: 5 }} >
                            
                            <View style={{ flexDirection:'row', alignSelf:'flex-start'}}><Label style={{ color: MyColors.distributorColor, fontSize: 16 }}>{strings('login.password')}*:</Label><Label style={{ color:'#ccc'}}>(Min 6 characters)</Label></View>
                            <View style={{ flex:1,flexDirection: "row", }}>
                            <Input placeholderTextColor="#ccc" secureTextEntry  placeholder="Password"  value={this.state.password} onChangeText={(e) => this.setState({ password: e })} />
                            {/* {this.state.showPW ?
                            <Icon onPress={() => this.setState({  showPW:  !this.state.showPW  })} type="FontAwesome" name="eye-slash" style={{ margin:20, fontSize: 16, color: 'red', }} />
                            :
                            <Icon onPress={() => this.setState({  showPW:  !this.state.showPW  })} type="FontAwesome" name="eye" style={{ fontSize: 20, color: 'red', }} /> */}
                        {/* } */}
                        </View>
                        </Item>
                        {this.state.passwordError.length > 0 ? <Text style={{ color: "red", textAlign: "center", }}>{this.state.passwordError}</Text> : <View />}
                        <Item stackedLabel  style={{ marginTop: 5 }} >
                        <View style={{ flexDirection:'row', alignSelf:'flex-start'}}><Label style={{ color: MyColors.distributorColor, fontSize: 16 }}>{strings('login.confirm_password')}*:</Label><Label style={{ color:'#ccc'}}>(Min 6 characters)</Label></View>

                            <Input placeholderTextColor="#ccc" secureTextEntry placeholder="Confirm Password"  value={this.state.confirmpassword} onChangeText={(e) => this.setState({ confirmpassword: e })} />
                        </Item>
                        {this.state.confirmpasswordError.length > 0 ? <Text style={{ color: "red", textAlign: "center", }}>{this.state.confirmpasswordError}</Text> : <View />}

                        <View style={{
                            flexDirection : 'row',   
                            marginTop: 10,
                            marginHorizontal : 10  
                        }}>
                            <CheckBox
                                style={{marginRight : 5}}
                                onClick={()=>{this.setState({isCheck : !this.state.isCheck})}}
                                isChecked={this.state.isCheck}
                            />
                            <Text>{'I agree with'}</Text>
                            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('TermsOfService')}}><Text style={{color: 'blue'}}>{' terms of service'}</Text></TouchableOpacity>
                        </View>

                        <Button disabled={!this.state.isCheck} backgroundColor={this.state.isCheck ? MyColors.distributorColor : 'lightgray'}  onPress={() => this.signupDealer()} style={{ width: '90%', alignSelf: "center", marginTop: 20, justifyContent: "center", borderRadius:25 }}>
                            <Text style={{ textAlign: "center", color: "white", }}>{strings('login.signup_button')}</Text>
                        </Button>
                        <Text />
                    </Form>

                    
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
        )
    }
}