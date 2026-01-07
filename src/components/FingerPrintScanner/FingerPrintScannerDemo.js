import React, { Component } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Alert, Image, Text, TouchableOpacity, View, Platform, BackHandler } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import * as utilities from '../../Utility/utilities';
import { strings } from '../../locales/i18n';

export default class FingerPrintScannerDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessageLegacy: undefined,
            biometricLegacy: undefined
        };
    }
    componentDidMount() {
        SplashScreen.hide()
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        // if (this.requiresLegacyAuthentication()) {
        //     this.authLegacy();
        // } else {
        this.authCurrent();
        // }
    }
    componentWillUnmount = () => {
        FingerprintScanner.release();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
    // requiresLegacyAuthentication() {
    //     return Platform.Version < 23;
    // }
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

    authCurrent() {
        console.log("1");
        FingerprintScanner
            .authenticate({ title: strings('login.bio') })
            .then(() => {
                console.log("tt");
                // console.log(this.props.navigation.state.routeName);
                var pg_url = this.props.navigation.dangerouslyGetParent().state.routes[this.props.navigation.dangerouslyGetParent().state.routes.length - 2]
                console.log(pg_url);

                // this.props.onAuthenticate();
                this.props.navigation.navigate(pg_url.routeName)
            }).catch((error) => {
                console.log("00");
                console.log(error.message);
                console.log(error.biometric);
                utilities.showToastMsg(error.message);
                this.handleBackPress()

                // this.props.handlePopupDismissed();
                // AlertIOS.alert(error.message);
            });
    }
    authLegacy() {
        console.log("2");

        FingerprintScanner
            .authenticate({ onAttempt: this.handleAuthenticationAttemptedLegacy })
            .then(() => {
                console.log("pp");

                // this.props.handlePopupDismissedLegacy();
                Alert.alert('Fingerprint Authentication', 'Authenticated successfully');
            })
            .catch((error) => {
                console.log("99");
                this.setState({ errorMessageLegacy: error.message, biometricLegacy: error.biometric });
            });
    }
    handleAuthenticationAttemptedLegacy = (error) => {
        this.setState({ errorMessageLegacy: error.message });
    };
    // renderLegacy() {
    //     const { style, handlePopupDismissedLegacy } = this.props;
    //     return (
    //         <View style={{ flex: 1 }}>
    //             <View style={style}>
    //                 {/* <Image style={{ width: 130, height: 130 }} source={require('../../images/finger-print-png-5.png')} /> */}
    //                 <Text style={{}}> Biometric{'\n'}Authentication </Text>
    //                 <TouchableOpacity style={{}} onPress={handlePopupDismissedLegacy} >
    //                     <Text style={styles.buttonText}> BACK TO MAIN </Text>
    //                 </TouchableOpacity>
    //             </View>
    //         </View>
    //     );
    // }
    render = () => {
        // if (this.requiresLegacyAuthentication()) {
        //     // return this.renderLegacy();
        // }
        return null;
    }
}