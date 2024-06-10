import React, { Component } from 'react';
import { Alert, StatusBar, AsyncStorage, BackHandler, Dimensions, Platform, StyleSheet, View, Image, TouchableOpacity, Linking } from 'react-native';
import { Container, Header, Left, Body, Right, Content, Card, CardItem, Text, Title, Item, Icon, Toast } from 'native-base';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import AndroidOpenSettings from 'react-native-android-open-settings';
// import Torch from 'react-native-torch';
import VerifierService from '../../../services/VerifierService/VerifierService';
import Loader from '../../../Utility/Loader';
import * as utilities from '../../../Utility/utilities';
import { connect } from 'react-redux';
import { scanSeQRData, scanQRData, ISNETCONNECTED } from '../../../App';

class VerifierScanScreen extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			userId: '',
			userName: '',
			flashEnabled: true,
			loading: false,
			loaderText: 'Scanning...',
			flash: false,
			showCamera: true,
		};
	}

	componentWillMount() {
		this._getAsyncData();
	}

	componentDidMount() {
		this.didFocusSubscription = this.props.navigation.addListener(
			'didFocus',
			payload => {
				this.setState({ showCamera: true });
				// this.scanSuccess = true;
			}
		);
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
		this.didFocusSubscription.remove();
	}

	handleBackPress = () => {
		this.props.navigation.navigate('VerifierMainScreen');
		return true;
	}


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

	closeActivityIndicator() {
		setTimeout(() => {
			this.setState({ loading: false });
		});
	}

	async _getAsyncData() {
		await AsyncStorage.getItem('USERDATA', (err, result) => {		// USERDATA is set on SignUP screen
			//  ;
			var lData = JSON.parse(result);
			console.log(result);
			if (lData) {
				this.setState({ userName: lData.username, userId: lData.id });
			}
		});
	}

	onSuccess(e) {
		this.setState({ showCamera: false });
		this._callForAPI(e);
	}

	async _callForAPI(e) {
		const formData = new FormData();
		let lUserName = this.state.userName;
		let lUserId = this.state.userId;
		formData.append('key', e.data);
		formData.append('device_type', Platform.OS);
		formData.append('scanned_by', lUserName);
		formData.append('user_id', lUserId);
		if (this.props.languageControl) {
			formData.append('language', 'en');
		} else {
			formData.append('language', 'hi');
		}

		var verifierApiObj = new VerifierService();

		this.setState({ loading: true });
		console.log(formData);
		await verifierApiObj.scanByPublicUser(formData);
		var lResponseData = verifierApiObj.getRespData();
		//  ;
		this.closeActivityIndicator();
		// console.log(lResponseData);

		if (!lResponseData) {
			utilities.showToastMsg('Something went wrong. Please try again later');
		} else if (lResponseData.status == '1' && lResponseData.publish == '1') {
			try {
				await AsyncStorage.setItem('CERTIFICATESCANNEDDATA', JSON.stringify(lResponseData));

				var lData = {};
				lData = lResponseData;
				scanSeQRData.unshift(lData);

				this.props.navigation.navigate('CertificateViewScreen');
			} catch (error) {
				console.warn(error);
			}
		} else if (lResponseData.status == '1' && lResponseData.publish == '0') {
			await utilities.showToastMsg('QR code part of the system. But certificate is inactive now');
			this.props.navigation.navigate('VerifierMainScreen')
		} else if (lResponseData.status == '2') {
			setTimeout(() => {
				Alert.alert(
					'Scanning Error',
					'Please scan proper QR Code',
					[
						{ text: strings('login.OK'), onPress: () => { this.props.navigation.navigate('VerifierMainScreen') }, style: 'destructive' },
					],
					{ cancelable: false }
				)
			}, 500);
		}

		else {
			utilities.showToastMsg('Something went wrong. Please try again later');
		}
	}

	_openFlash() {
		if (this.state.flashEnabled) {
			Torch.switchState(true);
			this.setState({ flashEnabled: false });
		} else {
			Torch.switchState(false);
			this.setState({ flashEnabled: true });
		}

	}

	_showHeader() {
		if (Platform.OS == 'ios') {
			return (
				<Header style={{ backgroundColor: '#e43c22' }}>
					<Left style={{ flex: 0.1 }}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('VerifierMainScreen')}>
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
						<TouchableOpacity onPress={() => this.props.navigation.navigate('VerifierMainScreen')}>
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

	_displayFlashIcon() {
		if (Platform.OS == 'ios') {
			if (this.state.flash) {
				return (
					<TouchableOpacity onPress={() => { this._openFlash(); this.setState({ flash: false }); }} style={{ position: 'absolute', bottom: 50, left: Dimensions.get('window').width * 0.8, zIndex: 1 }}>
						<Image
							style={{ width: 30, height: 30 }}
							source={require('../../../images/flash_on.png')}
						/>
					</TouchableOpacity>
				)
			} else {
				return (
					<TouchableOpacity onPress={() => { this._openFlash(); this.setState({ flash: true }); }} style={{ position: 'absolute', bottom: 50, left: Dimensions.get('window').width * 0.8, zIndex: 1 }}>
						<Image
							style={{ width: 30, height: 30 }}
							source={require('../../../images/flash_off.png')}
						/>
					</TouchableOpacity>
				)
			}
		} else {
			return (null);
		}
	}

	render() {
		return (
			<View style={styles.container}>
				{this._showHeader()}
				<StatusBar
				backgroundColor="#e43c22"
					barStyle="light-content"
				/>

				<Loader
					loading={this.state.loading}
					text={this.state.loaderText}
				/>

				{this.state.showCamera ?
					<QRCodeScanner
						onRead={this.onSuccess.bind(this)}
						cameraStyle={{ width: '100%', height: '100%' }}
						showMarker={true}
					/>
					:
					<View></View>
				}

				<View>
					<Text style={{ position: 'absolute', bottom: 50, left: Dimensions.get('window').width * 0.1, zIndex: 1, color: '#FFFFFF' }}>Point the camera at QR code.</Text>

				</View>

			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})
const mapStateToProps = (state) => {
	return {
		enableDarkTheme: state.VerifierReducer.enableDarkTheme,
		languageControl: state.VerifierReducer.languageEnglish,
	}
}
export default connect(mapStateToProps, null)(VerifierScanScreen)