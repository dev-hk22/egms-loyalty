import React, { Component } from 'react';
import { StatusBar, Button, Alert,  BackHandler, Platform, StyleSheet, View, TextInput, Image, TouchableOpacity } from 'react-native';
import { Header, Left, Body, Content, Card, CardItem, Text, Title, Icon } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../Utility/Loader';
import * as utilities from '../../Utility/utilities';
import Modal from "react-native-modal";
import { URL, HEADER, APIKEY, ACCESSTOKEN } from '../../App';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setMechanicData } from '../../Redux/Actions/VerifierActions';
import { strings } from '../../locales/i18n';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

class MechanicLoginScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            mobileNumber: '',
            password: '',
            borderBottomColorPassword: '#757575',
            borderBottomColorUserName: '#757575',
            loading: false,
            loaderText: 'Loading...',
            isModalVisible: false,
            brandCode: '',
            brandCodeError: ''
        };
    }
    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };
    componentWillMount() {
        this.getUserData();
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
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
        BackHandler.exitApp();
        return true;
    }

    async closeActivityIndicator() {
        await setTimeout(() => {
            this.setState({ loading: false });
        });
    }

    async getUserData() {
        await AsyncStorage.getItem('USERDATA', (err, result) => {   // USERDATA is set on VerifierLoginScreen
            var lData = JSON.parse(result);
            if (lData) {
                // if (this.props.fingerPrintEnable) {
                //     this.props.navigation.navigate('FingerPrintScannerDemo');
                // } else {
                    this.props.navigation.navigate('HomeScreen');
                // }
            }
        });
    }

    _validateMobileNumber() {
        let lMobileNumber = this.state.mobileNumber;
        let res = '';
        res = utilities.checkMobileNumber(lMobileNumber);
        if (!res || lMobileNumber.trim().length < 10) {
            this.setState({ phoneNumberError: "This mobile number appears to be invalid." });
        }
        return res;
    }

    async callForAPI() {
        this.setState({ loading: true })
        let lMobileNumber = this.state.mobileNumber;
        const formData = new FormData();
        formData.append('mobileNo', lMobileNumber);

        console.log(formData);

        var lUrl = URL + 'loginMechanic';
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
                console.log("000");
                console.log(JSON.stringify(responseJson));
                if (responseJson.status == 200) {
                    this.props.navigation.navigate('MechanicOtpVerification', { mobileNumber: lMobileNumber })
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
        this.setState({ mobileNumber: '' })
    }

    async _onPressButton() {
        let lMobileNumber = this.state.mobileNumber;
        var isValidMobileNumber = '';

        if (lMobileNumber == '') {
            // this.setState({ loading: false })
            utilities.showToastMsg('Enter mobile number');
            return;
        }
        else if (lMobileNumber) {
            isValidMobileNumber = await this._validateMobileNumber();
            if (isValidMobileNumber) {
                this.callForAPI();
            } else {
                utilities.showToastMsg('Wrong login credentials! Please check and try again');
            }
        } else {
            alert('Server error');
        }
    }

    _showHeader() {
        if (Platform.OS == 'ios') {
            return (
                <Header style={{ backgroundColor: '#e43c22' }}>
                    <Left style={{ flex: 0.1 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('HomeScreen')}>
                            <Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingLeft: 10, paddingRight: 10 }} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{ flex: 0.9 }}>
                        <Title style={{ color: '#FFFFFF' }}>SeQR Loyalty Demo</Title>
                    </Body>
                </Header>
            )
        } else {
            return (
                <Header style={{ backgroundColor: '#e43c22' }}>
                    <Left style={{ flex: 0.1 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('HomeScreen')}>
                            <Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingLeft: 10, paddingRight: 10 }} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{ flex: 0.9, alignItems: 'center' }}>
                        <Title style={{ color: '#FFFFFF', fontSize: 16 }}>SeQR Loyalty Demo</Title>
                    </Body>

                </Header>
            )
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
            // <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} style={styles.container}>
            // <KeyboardAwareScrollView enableOnAndroid={Platform.OS === 'android' ? false : true} extraScrollHeight={150} keyboardShouldPersistTaps={'handled'} style={styles.container}>

           <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={150} keyboardShouldPersistTaps={'handled'} style={styles.container}> 
                <StatusBar
                backgroundColor="#e43c22"
                    barStyle="light-content"
                />

                <Loader
                    loading={this.state.loading}
                    text={this.state.loaderText}
                />

                <View style={styles.containerLevel1}>
                    <View style={{ marginTop: 30 }}>
                        <Image
                            style={{ width: 300, height: 300 }}
                            resizeMode='contain'
                            source={require('../../images/SeQRLoyalty.jpg')}
                        />
                    </View>
                </View>
                <View style={styles.loginViewContainer}>
                <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={150} keyboardShouldPersistTaps={'handled'}>
                        <Card style={styles.cardContainer}>

                            <CardItem header style={styles.cardHeader}>
                                <Text style={{ marginLeft: -12, color: '#212121', fontWeight: 'normal', fontSize: 18 }}>{strings('login.MechanicLogin')}</Text>
                            </CardItem>

                            <View style={{ paddingLeft: 0, paddingRight: 0, marginTop: 10 }}>
                                <View style={styles.inputContainer}>

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
                                </View>
                            </View>

                            <View>
                                <Content padder>
                                    <TouchableOpacity onPress={() => this._onPressButton()}>
                                        <View style={styles.buttonLogin}>

                                            <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.linearGradient}>
                                                <Text style={styles.buttonText}>
                                                    {strings('login.login_button')}
                                                </Text>
                                            </LinearGradient>

                                        </View>
                                    </TouchableOpacity>
                                    <Modal isVisible={this.state.isModalVisible}>
                                        <View style={{ height: 300 }}>
                                            <Card style={styles.cardContainer}>
                                                <CardItem header >
                                                    <Text style={{ textAlign: 'center', flex: 1, paddingLeft: 10 }}>{strings('login.brandCodeInsert')}</Text>
                                                    <TouchableOpacity onPress={(isModalVisible) => this.setState({ isModalVisible: false })}>
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
                                                        maxLength={10}
                                                        placeholder='Brand Code'
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
                                                        <Button title="Submit" disabled={this.state.brandCode ? false : true} onPress={this.verifyBrandID} />
                                                    </View>
                                                </View>
                                            </Card>
                                        </View>
                                    </Modal>
                                    <View>
                                        <TouchableOpacity style={{ marginTop: 15, paddingLeft: 10 }} >
                                            {/* <Text style={{ color: '#1784C7', fontSize: 12}}>Click here to sign up</Text> onPress={() => this.props.navigation.navigate('MechanicSignupForm')} */}
                                            <Text style={{ color: '#1784C7', fontSize: 12 }} onPress={() => this.props.navigation.navigate('MechanicSignupForm')}>{strings('login.clickHereToSignUp')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Content>
                            </View>
                        </Card>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('LoginScreen')} style={{ alignItems: 'center' }}>
                            <View style={styles.buttonLogin1}>
                                <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.linearGradient}>
                                    <Text style={styles.buttonText}>
                                        {strings('login.clickForDistributor')}
                                    </Text>
                                </LinearGradient>
                            </View>
                        </TouchableOpacity>
                    </KeyboardAwareScrollView>
                </View>
            </KeyboardAwareScrollView>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerLevel1: {
        flex: 0.7,
        justifyContent: 'space-around',
        alignItems: 'center',
        // paddingTop: Dimensions.get('window').width * 0.1,
        // paddingLeft: 50,
        // paddingRight: 50,

    },
    loginViewContainer: {
        flex: 1,
        alignItems: 'stretch',
    },
    cardContainer: {
        padding: 15,
        marginLeft: 20,
        marginRight: 20,
        flex: 1
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
        borderBottomWidth: 1,
        // backgroundColor: 'lightgreen'    
    },
    buttonLogin: {
        marginTop: 10,
        backgroundColor: '#e43c22',
        borderRadius: 5,
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
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
})
const mapStateToProps = (state) => {
    return {
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ setMechanicData: setMechanicData }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(MechanicLoginScreen)