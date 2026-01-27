import React, { Component } from 'react';
import { Alert, AsyncStorage, BackHandler, Dimensions, Platform, StyleSheet, View, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, StatusBar } from 'react-native';
import { Container, Header, Left, Body, Right, Content, Card, CardItem, Text, Title, Item, Icon, Toast, Tab, Tabs } from 'native-base';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Loader from '../../Utility/Loader';
import HistoryService from '../../services/HistoryService/HistoryService';
import * as utilities from '../../Utility/utilities';
import Tab1 from './Tab1';
import Tab2 from './Tab2';
import { strings } from '../../locales/i18n';
import { connect } from 'react-redux';
import MyColors from '../../Utility/Colors';

class CustomerHistoryScreen extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			loaderText: '',
			historyCleared: false,
			redeemHistory: [],
			redeemHistoryCash: [],
			redeemHistoryScheme: [],
			loaderText: 'Please wait...',
			userType: '',
			accesstoken:''
		};
	}

	componentWillMount() {

	}
	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
		this._getAsyncData();
	}
	componentWillUnMount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
	}

	handleBackPress = () => {
		this.props.navigation.navigate('HomeScreen');
		return true;
	}

	_clearHistory() {
		Alert.alert(
			'Delete history?',
			'This will delete all the scan history.',
			[
				{ text: 'CANCEL' },
				{
					text: 'DELETE', onPress: () => {
						redeemHistory.length = 0;
						this.setState({ historyCleared: true });
					}
				},
			],
			{ cancelable: true }
		);
	}

	closeActivityIndicator() {
		setTimeout(() => {
			this.setState({ loading: false });
		});
	}

	async _getAsyncData() {
		await AsyncStorage.multiGet(['USERDATA','ACCESSTOKEN'], (err, result) => {		// USERDATA is set on SignUP screen
			var lData = JSON.parse(result[0][1]);
			this.setState({ accesstoken : result[1][1]});
			if (lData) {
				this.setState({ userType: lData.data.userType })
				// this.distributorId = lData.data.id;
				// this._getRedeemHistory(lData.data.id);
			}
		});
	}

	async _getRedeemHistory(distributorId) {
		const formData = new FormData();

		formData.append('officerId', distributorId);
		formData.append('fromDate', '05-06-2019');
		formData.append('toDate', '05-06-2019');
		formData.append('userType', this.state.userType);
		if (this.props.languageControl) {
			formData.append('language', 'en');
		} else {
			formData.append('language', 'hi');
		}

		var historyApiObj = new HistoryService();

		this.setState({ loading: true });
		await historyApiObj.getRedeemHistory(formData,this.state.accesstoken);
		var lResponseData = historyApiObj.getRespData();
		await this.closeActivityIndicator();

		if (!lResponseData) {
			utilities.showToastMsg('Something went wrong. Please try again later');
		} else if (lResponseData.status == 500 || lResponseData.status == 400) {
			utilities.showToastMsg(lResponseData.message);
		} else if (lResponseData.status == 403) {
			utilities.showToastMsg(lResponseData.message);
			this.props.navigation.navigate('LoginScreen');
			AsyncStorage.clear();
			return;
		} else if (lResponseData.status == 200) {
			debugger
			if (lResponseData.redeemHistory.length == 0) {
				this.setState({ redeemHistory: lResponseData.redeemHistory });
			} else if (lResponseData.redeemHistory.length > 0) {
				var redeemCashArr = [];
				var redeemSchemeArr = [];
				for (var i = 0; i < lResponseData.redeemHistory.length; i++) {
					if (lResponseData.redeemHistory[i].distributor_redeemed_type == '0') {
						var redeemCashObj = {};
						redeemCashObj.redeemHistoryCash = lResponseData.redeemHistory[i];
						redeemCashArr.push(redeemCashObj);

					} else {
						var redeemSchemeObj = {};
						redeemSchemeObj.redeemHistoryScheme = lResponseData.redeemHistory[i];
						redeemSchemeArr.push(redeemSchemeObj);
					}
				}
				this.setState({ redeemHistory: lResponseData.redeemHistory, redeemHistoryCash: redeemCashArr, redeemHistoryScheme: redeemSchemeArr });
			}
		} else {
			utilities.showToastMsg('Something went wrong. Please try again later');
		}
	}

	_showHeader() {
		if (Platform.OS == 'ios') {
			return (
				<Header style={{ backgroundColor:  MyColors.distributorColor }} hasTabs>
					<Left style={{ flex: 0.2 }}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('HomeScreen')}>
							<Icon type="FontAwesome5" name="arrow-left" style={{ fontSize: 20, color: '#FFFFFF', paddingRight: 10 }} />
						</TouchableOpacity>
					</Left>
					<Body style={{ flex: 0.6, alignItems: 'center' }}>
						<Title style={{ textAlign: 'center', color: '#FFFFFF' }}>{strings('login.coupon_history_title')}</Title>
					</Body>
					<Right style={{ flex: 0.2 }}>
					</Right>
				</Header>
			)
		} else {
			return (
				<Header style={{ backgroundColor:  MyColors.distributorColor }} hasTabs>
					<Left style={{ flex: 0.2 }}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('HomeScreen')}>
							<Icon type="FontAwesome5" name="arrow-left" style={{ fontSize: 20, color: '#FFFFFF', paddingRight: 10 }} />
						</TouchableOpacity>
					</Left>
					<Body style={{ flex: 0.6, alignItems: 'center' }}>
						<Title style={{ color: '#FFFFFF', fontSize: 16 }}>{strings('login.coupon_history_title')}</Title>
					</Body>
					<Right style={{ flex: 0.2 }}>

					</Right>
				</Header>
			)
		}
	}

	render() {
		return (
			<View style={styles.container}>
				{this._showHeader()}
				<StatusBar
				backgroundColor= { MyColors.distributorColor }
					barStyle="light-content"
				/>
				<Loader
					loading={this.state.loading}
					text={this.state.loaderText}
				/>
				{/* <Tabs> */}
					{/* <Tab heading={strings('login.coupon_history_cash')} tabStyle={{ backgroundColor: this.props.enableDarkTheme ? 'black' : 'blue' }} textStyle={{ color: '#fff' }} activeTabStyle={{ backgroundColor: this.props.enableDarkTheme ? '#1a1a1a' : 'blue' }} activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}> */}
						<Tab1 props={this.props} redeemCash={this.state.redeemHistoryCash} />
					{/* </Tab> */}

					{/* <Tab heading={strings('login.coupon_history_scheme')} tabStyle={{ backgroundColor: this.props.enableDarkTheme ? 'black' : 'blue' }} textStyle={{ color: '#fff' }} activeTabStyle={{ backgroundColor: this.props.enableDarkTheme ? '#1a1a1a' : 'blue' }} activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
						<Tab2 props={this.props} redeemScheme={this.state.redeemHistoryScheme} />
					</Tab> */}
				{/* </Tabs> */}

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
export default connect(mapStateToProps, null)(CustomerHistoryScreen)