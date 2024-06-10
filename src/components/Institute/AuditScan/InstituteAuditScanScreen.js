import React, { Component } from 'react';
import { Vibration, Alert, AsyncStorage, BackHandler, Dimensions, Platform, StyleSheet, View, TextInput, Image, TouchableOpacity, StatusBar, Linking } from 'react-native';
import { Container, Header, Left, Body, Right, Content, Card, CardItem, Text, Title, Item, Icon, Toast } from 'native-base';
import QRCodeScanner from 'react-native-qrcode-scanner';
import AndroidOpenSettings from 'react-native-android-open-settings';
import InstituteService from '../../../services/InstituteService/InstituteService';
import Camera, { RNCamera } from 'react-native-camera';
// import Torch from 'react-native-torch';
import CustomHeader from '../../../Utility/CustomHeader';
import Loader from '../../../Utility/Loader';
import * as utilities from '../../../Utility/utilities';
import * as app from '../../../App';
import { connect } from 'react-redux';

class InstituteAuditScanScreen extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			flashEnabled: true,
			flash: false,
			loading: false,
			showCamera: true,
			loaderText: 'Scanning...',
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
			}
		);
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
		this.didFocusSubscription.remove();
	}

	handleBackPress = () => {
		this.props.navigation.navigate('InstituteMainScreen');
		return true;
	}

	closeActivityIndicator() {
		setTimeout(() => {
			this.setState({ loading: false });
		});
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

	async _getAsyncData() {
		await AsyncStorage.getItem('USERDATA', (err, result) => {		// USERDATA is set on SignUP screen
			var lData = JSON.parse(result);
			if (lData) {
				this.setState({ userName: lData.institute_username, userId: lData.id });
			}
		});
	}

	onBarCodeRead = (e) => {
		this.setState({ showCamera: false });
		Vibration.vibrate();
		this._callForAPI(e);
	}


	onSuccess(e) {
		this.setState({ showCamera: false });
		this._callForAPI(e);
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

	async _callForAPI(e) {
		const formData = new FormData();
		let lUserName = this.state.userName;
		let lUserId = this.state.userId;
		formData.append('key', e.data);
		formData.append('device_type', Platform.OS);
		formData.append('scanned_by', lUserName);
		if (this.props.languageControl) {
			formData.append('language', 'en');
		} else {
			formData.append('language', 'hi');
		}

		console.log(formData);
		var instituteApiObj = new InstituteService();

		this.setState({ loading: true });
		await instituteApiObj.instituteScan1DCertificate(formData);
		var lResponseData = instituteApiObj.getRespData();
		;
		this.closeActivityIndicator();
		console.log(lResponseData);

		if (!lResponseData) {
			utilities.showToastMsg('Something went wrong. Please try again later');
		} else if (lResponseData.status == '1') {
			try {
				await AsyncStorage.setItem('CERTIFICATESCANNEDDATA', JSON.stringify(lResponseData));
				this.props.navigation.navigate('InstituteAuditViewScreen');
			} catch (error) {
				console.warn(error);
			}
		} else if (lResponseData.status == '0') {
			try {
				await AsyncStorage.setItem('CERTIFICATESCANNEDDATA', JSON.stringify(lResponseData));
				this.props.navigation.navigate('InstituteAuditViewScreen');
			} catch (error) {
				console.warn(error);
			}
			utilities.showToastMsg('QR code part of the system. But certificate is inactive now');
		} else if (lResponseData.status == '2') {
			setTimeout(() => {
				Alert.alert(
					'Scanning Error',
					'Please scan proper 1D BarCode',
					[
						{ text: 'OK', onPress: () => { this.setState({ showCamera: true }) }, style: 'destructive' },
					],
					{ cancelable: false }
				)
			}, 500);
		}

		else {
			utilities.showToastMsg('Something went wrong. Please try again later');
		}
	}

	_showHeader() {

		if (Platform.OS == 'ios') {
			return (
				<Header style={{ backgroundColor: '#D34A44' }}>
					<Left>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('InstituteMainScreen')}>
							<Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingLeft: 10, paddingRight: 10 }} />
						</TouchableOpacity>
					</Left>
					<Body>
						<Title style={{ color: '#FFFFFF' }}>SSSL SeQR</Title>
					</Body>
					<Right />
				</Header>
			)
		} else {
			return (
				<Header style={{ backgroundColor: '#D34A44', marginBottom: 110 }}>
					<Left>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('InstituteMainScreen')}>
							<Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingLeft: 10, paddingRight: 10 }} />
						</TouchableOpacity>
					</Left>
					<Body>
						<Title style={{ color: '#FFFFFF', fontSize: 16 }}>SSSL SeQR</Title>
					</Body>
					<Right />
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
				{Platform.OS == 'ios' ?
					<CustomHeader prop={this.props} bodyTitle={'SeQR Loyalty Demo'} navigateTo='InstituteMainScreen' headerStyle={{ backgroundColor: '#D34A44' }} />
					:
					<CustomHeader prop={this.props} bodyTitle={'SeQR Loyalty Demo'} navigateTo='InstituteMainScreen' headerStyle={{ backgroundColor: '#D34A44' }} bodyStyle={{ alignItems: 'center' }} />
				}

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
						markerStyle={{ height: 100, borderColor: '#39FF14' }}
					/>
					:
					<View></View>
				}

				<View>
					<Text style={{ position: 'absolute', bottom: 50, left: Dimensions.get('window').width * 0.1, zIndex: 1, color: '#FFFFFF' }}>Point the camera at 1D Barcode.</Text>

				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	preview: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
})
const mapStateToProps = (state) => {
	return {
		enableDarkTheme: state.VerifierReducer.enableDarkTheme,
		languageControl: state.VerifierReducer.languageEnglish,
	}
}
export default connect(mapStateToProps, null)(InstituteAuditScanScreen)