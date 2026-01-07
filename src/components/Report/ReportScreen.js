import React, { Component } from 'react';
import { Alert, StatusBar, View, Image, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import CompressImage from 'react-native-compress-image';
import ImagePicker from 'react-native-image-picker';
import { Header, Left, Body, Title, Icon, Label, Text, Button } from 'native-base';
import { URL, APIKEY, ACCESSTOKEN } from '../../App';
import Loader from '../../Utility/Loader';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { strings } from '../../locales/i18n';
import { connect } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import MyColors from '../../Utility/Colors';
import AsyncStorage from '@react-native-community/async-storage';

import AndroidOpenSettings from 'react-native-android-open-settings';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PERMISSIONS, request } from 'react-native-permissions';

class ReportScreen extends Component {
    state = {
        // pickedImage: IMG,
        pickedImage: "",
        pickedImage1: "",
        isImage: false,
        SrNo: '',
        Description: '',
        distributorId: '',
        carpenterId:'',
        loaderText: 'Loading...',
        showHideLoading: false,
        accesstoken:'',
        isPermissionGranted : false,
    }
    getDataFromAPi = () => {
        AsyncStorage.multiGet(['USERDATA','ACCESSTOKEN'])
            .catch(err => { alert("Error") })
            .then(res => {
                var lData = JSON.parse(res[0][1]);
                this.setState({ accesstoken : res[1][1]})
                this._onPressSendButton(lData.data.id);
            })
    }

    componentDidMount() {
        this._requestPermission();
    }

    _requestPermission = async () =>{
        request(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA).then((result) => {
            if(result == "granted"){
                this.setState({isPermissionGranted : true})
            }
            // console.log(result)
        });
    }

    imagePickerHandler = async(type) => {
        try{
            if(this.state.isPermissionGranted){
                if(type == "capture"){
                    await launchCamera({
                        saveToPhotos: true,
                        mediaType: 'photo',
                        includeBase64: false,
                        includeExtra: true,
                    } , res =>{ 
                        // console.log("===result res" , JSON.stringify(res , null,2))
                        if (res.didCancel) {
                            // alert("u have cancelled.")
                        } else if (res.error) {
                            // console.log("image pucker" , res.error)
                            alert("u have an error.")
                        } else {
                            this.setState({
                                isImage: true,
                                pickedImage: { uri: res?.assets[0].uri ,data : res?.assets[0]}
                            })
                        }
                    });
                }else{
                    await launchImageLibrary({
                        selectionLimit: 0,
                        mediaType: 'photo',
                        includeBase64: false,
                        includeExtra: true,
                    } , res =>{ 
                        // console.log("===result res" , JSON.stringify(res , null,2))
                        if (res.didCancel) {
                            // alert("u have cancelled.")
                        } else if (res.error) {
                            // console.log("image pucker" , res.error)
                            alert("u have an error.")
                        } else {
                            this.setState({
                                isImage: true,
                                pickedImage: { uri: res?.assets[0].uri ,data : res?.assets[0]}
                            })
                        }
                    });
                }
            }else{
                Alert.alert('Need Camera Persmission ', '', [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                    },
                    {
                      text: 'Open Setting',
                      onPress: () => {this._openSettings()},
                    },

                  ])
            }
        }catch(e){
            console.log(e)
        }
    }

    // imagePickerHandler1 = async(type) => {
    //     try{
    //         if(this.state.isPermissionGranted){
    //             if(type == "capture"){
    //                 await launchCamera({
    //                     saveToPhotos: true,
    //                     mediaType: 'photo',
    //                     includeBase64: false,
    //                     includeExtra: true,
    //                 } , res =>{ 
    //                     // console.log("===result res" , JSON.stringify(res , null,2))
    //                     if (res.didCancel) {
    //                         // alert("u have cancelled.")
    //                     } else if (res.error) {
    //                         // console.log("image pucker" , res.error)
    //                         alert("u have an error.")
    //                     } else {
    //                         this.setState({
    //                             isImage: true,
    //                             pickedImage1: { uri: res?.assets[0].uri ,data : res?.assets[0]}
    //                         })
    //                     }
    //                 });
    //             }else{
    //                 await launchImageLibrary({
    //                     selectionLimit: 0,
    //                     mediaType: 'photo',
    //                     includeBase64: false,
    //                     includeExtra: true,
    //                 } , res =>{ 
    //                     // console.log("===result res" , JSON.stringify(res , null,2))
    //                     if (res.didCancel) {
    //                         // alert("u have cancelled.")
    //                     } else if (res.error) {
    //                         // console.log("image pucker" , res.error)
    //                         alert("u have an error.")
    //                     } else {
    //                         this.setState({
    //                             isImage: true,
    //                             pickedImage1: { uri: res?.assets[0].uri , data : res?.assets[0]}
    //                         })
    //                     }
    //                 });
    //             }
    //         }else{
    //             Alert.alert('Need Camera Persmission ', '', [
    //                 {
    //                     text: 'Cancel',
    //                     onPress: () => console.log('Cancel Pressed'),
    //                 },
    //                 {
    //                   text: 'Open Setting',
    //                   onPress: () => {this._openSettings()},
    //                 },

    //               ])
    //         }

    //     }catch(e){
    //         console.log(e)
    //     }
    // }

    _openSettings() {
        if (Platform.OS == 'ios') {
            Linking.canOpenURL('app-settings:').then(supported => {
                if (!supported) {
                    console.log('Can\'t handle settings url');
                } else {
                    return Linking.openURL('app-settings:');
                }
            }).catch(err => console.error('An error occurred', err));
        } else {
            AndroidOpenSettings.generalSettings();
        }
    }
    _onPressSendButton = (carpenterId) => {
        this.setState({ showHideLoading: true })
        const photo = {
            uri:  this.state.pickedImage.uri,
            type: this.state.pickedImage.data.type ? this.state.pickedImage.data.type : "image/jpeg",
            name: Platform.OS == "ios" ? 'coupon_front.jpg' :this.state.pickedImage.data.fileName
        }
        // const photo1 = {
        //     uri: this.state.pickedImage1.uri,
        //     type: this.state.pickedImage1.data.type ? this.state.pickedImage1.data.type : "image/jpeg",
        //     name: Platform.OS == "ios" ? 'coupon_back.jpg' : this.state.pickedImage1.data.fileName
        // }
        const formData = new FormData();
        formData.append('srNo', this.state.SrNo);
        formData.append('description', this.state.Description);
        formData.append('carpenterId', carpenterId);
        formData.append('couponFile', photo);
        // formData.append('couponFileBack', photo1);
        if (this.props.languageControl) {
            formData.append('language', 'en');
        } else {
            formData.append('language', 'hi');
        }
        //console.log(photo);
        // console.log(photo1);
        // console.log(formData);
        // console.log(this.state.accesstoken);
        var lUrl = URL + 'reportCouponCarpenter';
        fetch(lUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application\/json',
                'Content-Type': 'multipart\/form-data',
                'apikey': APIKEY,
                'accesstoken': this.state.accesstoken
            },
            body: formData,
        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({ showHideLoading: false })
                // console.log(responseJson);
                if (responseJson.status == 403) {
                    utilities.showToastMsg(responseJson.message);
                    this.props.navigation.navigate('LoginScreen');
                    AsyncStorage.clear();
                    return;
                }
                else if (responseJson.message) {
                    // alert(JSON.stringify(responseJson.message))
                    Alert.alert(
                        strings('login.ScanScreenAlertTitle'),
                        responseJson.message,
                        [
                            // { text: 'NO', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                            { text: strings('login.OK'), onPress: () => { this.props.navigation.navigate('HomeScreen') } },
                        ],
                        { cancelable: false }
                    );
                }
                else {
                    alert(JSON.stringify(responseJson))
                }
            })
            .catch((error) => {
                this.setState({ showHideLoading: false })
                alert(error)
            });
    }
    _showHeader() {
        if (Platform.OS == 'ios') {
            return (
                <Header style={{ backgroundColor: MyColors.distributorColor, display: 'flex' }}>
                    <Grid>
                        <Col style={{ justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('HomeScreen')}>
                                <Icon type="FontAwesome5" name="arrow-left" style={{ fontSize: 20, color: '#FFFFFF' }} />
                            </TouchableOpacity>
                        </Col>
                        <Col size={15} style={{ justifyContent: 'center', paddingRight: 20 }}>
                            <Title style={{ color: '#FFFFFF' }}>{strings('login.report_screen_title')}</Title>
                        </Col>
                    </Grid>
                </Header>
            )
        } else {
            return (
                <Header style={{ backgroundColor: MyColors.distributorColor }}>
                    <Left style={{ flex: 0.1 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('HomeScreen')}>
                            <Icon type="FontAwesome5" name="arrow-left" style={{ fontSize: 20, color: '#FFFFFF', paddingLeft: 10, }} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{ flex: 0.9, alignItems: 'center', }}>
                        <Title style={{ color: '#FFFFFF', fontSize: 16, marginLeft: -10 }}>{strings('login.report_screen_title')}</Title>
                    </Body>
                </Header>
            )
        }
    }
    render() {
        return (
            <ScrollView keyboardShouldPersistTaps={'handled'} style={{ backgroundColor: this.props.enableDarkTheme ? 'black' : 'white' }}>
                {this._showHeader()}
                <StatusBar
                    backgroundColor={MyColors.distributorColor}
                    barStyle="light-content"
                />
                <View style={{ flexDirection: "row", flex: 1, margin: 10, marginTop: 20 }}>
                <TouchableOpacity onPress={()=>{
                    Alert.alert('Pick an image ', '', [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                        },
                        {
                            text: 'Take Photo..',
                            onPress: () => this.imagePickerHandler('capture'),
                        },
                        {
                            text: 'choose from Gallery...', 
                            onPress: () => this.imagePickerHandler('gellery')
                        },
                    ])
                }} style={{ overflow:'hidden',height: 200, width: 200, flex: 1, alignItems: 'center', marginLeft: 0, marginRight: 0, borderWidth: 1, }}>
                        {this.state.pickedImage ?
                            <Image source={this.state.pickedImage} style={{ width: 195, height: 198, }} resizeMode="stretch" />
                            :
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <Icon type="FontAwesome" name="camera-retro" style={{ fontSize: 25, alignSelf: "center", }} />
                                <Text style={{ textAlignVertical: "center", marginTop: 10, }}>{strings('login.uploadImage')}<Text style={{ color: "red", }}>*</Text></Text>
                            </View>
                        }
                    </TouchableOpacity>

                    {/* <TouchableOpacity onPress={()=>{
                        Alert.alert('Pick an image ', '', [
                            {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                            },
                            {
                              text: 'Take Photo..',
                              onPress: () => this.imagePickerHandler1('capture'),
                            },
                            {
                                text: 'choose from Gallery...', 
                                onPress: () => this.imagePickerHandler1('gellery')
                            },
                          ])
                    }} style={{ overflow:'hidden',height: 200, flex: 1, alignItems: 'center', marginLeft: 10, marginRight: 0, borderWidth: 1, }}>
                        {this.state.pickedImage1 ?
                            <Image source={this.state.pickedImage1} style={{ width: 195, height: 198, }} resizeMode="stretch" />
                            :
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <Icon type="FontAwesome" name="camera-retro" style={{ fontSize: 25, alignSelf: "center", }} />
                                <Text style={{ textAlignVertical: "center", marginTop: 10 }}>{strings('login.cou[ponBackSide')}
                                    <Text style={{ color: "red", }}>*</Text>
                                </Text>
                            </View>
                        }
                    </TouchableOpacity> */}
                </View>

                {this.state.showHideLoading ? <Loader loading={this.state.loading} text={this.state.loaderText} /> : null}
                <Label style={{ marginLeft: 10, marginTop: "15%", fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.report_screen_srNo')}
                    <Text style={{ color: "red", }}>* </Text>
                    :</Label>

                <TextInput
                    style={{ borderBottomColor: MyColors.distributorColor, borderBottomWidth: 1, marginBottom: 30, marginLeft: 20, marginRight: 20, marginTop: 10, color: this.props.enableDarkTheme ? 'white' : 'black' }}
                    placeholder={strings('login.report_screen_srNo')}
                    // autoFocus={true}
                    onChangeText={(SrNo) => this.setState({ SrNo })}
                />
                <Label style={{ marginLeft: 10, fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.report_screen_descr')}
                    <Text style={{ color: "red", }}>* </Text>
                    :</Label>
                <TextInput
                    style={{ borderBottomColor: MyColors.distributorColor, borderBottomWidth: 1, marginBottom: 30, marginLeft: 20, marginRight: 20, marginTop: 10, color: this.props.enableDarkTheme ? 'white' : 'black' }}
                    placeholder={strings('login.report_screen_descr')}
                    onChangeText={(Description) => this.setState({ Description })}
                />

                <View style={{ marginTop: 30, marginBottom: 0, flex: 1, alignSelf: "center" }}>
                    {/* <Button style={{ backgroundColor: "#e43c22" }} onPress={this.getDataFromAPi} title={strings('login.sendButton')} disabled={this.state.SrNo.trim().length > 0 && this.state.Description.trim().length > 0
                        && this.state.pickedImage.uri && this.state.pickedImage1.uri ? false : true} /> */}
                    <Button style={{ backgroundColor: MyColors.distributorColor, borderRadius: 20, width: 200 }} onPress={this.getDataFromAPi} disabled={this.state.SrNo.trim().length > 0 && this.state.Description.trim().length > 0
                        && this.state.pickedImage.uri ? false : true}>
                        <Text style={{ textAlign: 'center', flex: 1, fontWeight: 'bold', fontSize: 18 }}>{strings('login.sendButton')}</Text>
                    </Button>
                </View>
            </ScrollView>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        enableDarkTheme: state.VerifierReducer.enableDarkTheme,
        languageControl: state.VerifierReducer.languageEnglish,
    }
}
export default connect(mapStateToProps, null)(ReportScreen)