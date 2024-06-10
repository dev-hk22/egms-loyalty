import React, { Component } from 'react';
import { Alert, AsyncStorage, BackHandler, Dimensions, Platform, StyleSheet, View, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, StatusBar, FlatList } from 'react-native';
import { Container, Header, Left, Body, Right, Content, Card, CardItem, Text, Title, Item, Icon, Toast, Tab, Tabs, ListItem } from 'native-base';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Loader from '../../Utility/Loader';
import HistoryService from '../../services/HistoryService/HistoryService';
import * as utilities from '../../Utility/utilities';
import { strings } from '../../locales/i18n';
import { connect } from 'react-redux';
import MyColors from '../../Utility/Colors';
import Tab1 from '../History/Tab1';
import { APIKEY, URL } from '../../App';

class CustomerOrderHistoryScreen extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			loaderText: '',
			historyCleared: false,
			redeemHistory: [],
			orderHistory: [],
			redeemHistoryCash: [],
			redeemHistoryScheme: [],
			loaderText: 'Please wait...',
			userType: '',
			accesstoken:'',
			userId: 0,
			noMoreDataError: '',
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
		this.props.navigation.navigate('CustomerHomeScreen');
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

	callApi = () => {
		this.setState({ loading: true })
		const formData = new FormData();

		formData.append('authUserId', this.state.userId);

		var lUrl = URL + 'getOrders';
		fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY,
				'accesstoken': this.state.accesstoken
			},
			body: formData,
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log(JSON.stringify(responseJson,null,2));
			this.setState({orderHistory : responseJson.orderData, loading: false })
		})
		.catch((error) => {
			this.setState({ loading: false })
			console.log(error);
		});
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
				this.setState({ userType: lData.data.userType , userId : lData.data.id} , ()=>{
					this.callApi();
				})
				// this.distributorId = lData.data.id;
				// this._getRedeemHistory(lData.data.id);
			}
		});
	}

	_showHeader() {
		if (Platform.OS == 'ios') {
			return (
				<Header style={{ backgroundColor:  MyColors.distributorColor }} hasTabs>
					<Left style={{ flex: 0.2 }}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('CustomerHomeScreen')}>
							<Icon type="FontAwesome5" name="arrow-left" style={{ fontSize: 20, color: '#FFFFFF', paddingRight: 10 }} />
						</TouchableOpacity>
					</Left>
					<Body style={{ flex: 0.6, alignItems: 'center' }}>
						<Title style={{ textAlign: 'center', color: '#FFFFFF' }}>{strings('login.sidemenu_orderhistory')}</Title>
					</Body>
					<Right style={{ flex: 0.2 }}>
					</Right>
				</Header>
			)
		} else {
			return (
				<Header style={{ backgroundColor:  MyColors.distributorColor }} hasTabs>
					<Left style={{ flex: 0.2 }}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('CustomerHomeScreen')}>
							<Icon type="FontAwesome5" name="arrow-left" style={{ fontSize: 20, color: '#FFFFFF', paddingRight: 10 }} />
						</TouchableOpacity>
					</Left>
					<Body style={{ flex: 0.6, alignItems: 'center' }}>
						<Title style={{ color: '#FFFFFF', fontSize: 16 }}>{strings('login.sidemenu_orderhistory')}</Title>
					</Body>
					<Right style={{ flex: 0.2 }}>

					</Right>
				</Header>
			)
		}
	}

	renderFooter = () => {
		return (
			<View>
				{this.state.noMoreDataError ?
					<Text style={{ color: 'red', textAlign: 'center', }}>{this.state.noMoreDataError}</Text>
					: <Text></Text>}
			</View>
		)
	};
	handleLoadMore = () => {
		if (!this.state.noMoreDataError) {
			// this.callApi();
		}
	};


	_displayList() {
		if (this.state.orderHistory.length == 0) {
			return (
				<View style={styles.noRecord}>
					<Text style={{ fontSize: 28, color: this.props.enableDarkTheme ? 'white' : '#BDBDBD' }}>{strings('login.NoHistory_Error')}</Text>
				</View>
			)
		} else {
			return (
				<View style={{ flex: 1, backgroundColor: this.props.enableDarkTheme ? '#1a1a1a' : 'white' }}>
					<FlatList
						data={this.state.orderHistory}
						extraData={this.state}
						renderItem={({ item, index }) => (
							<ListItem onPress={()=>{this.props.navigation.navigate('OrderDetailsScreen',{"data": item})}} key={index} style={{ flexDirection: 'column', alignItems: 'flex-start', }}>
								<View style={{ flex: 1, flexDirection: 'row', }}>
									<View style={{ flex: 0.8, flexDirection: 'row'}} >
										{/* <Text style={{ alignSelf: 'flex-start', fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.orderId')}: {item?.order_id}</Text> */}
										<Text style={{ fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black', paddingRight: 3,  fontWeight : '700'}}>{strings('login.orderId')}:</Text>
										<Text style={{ fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{item?.order_id}</Text>
									</View>
									<View style={{ flex: 0.2, flexDirection: 'row' }}>
										<Text style={{ fontSize: 14, color: 'green' }}>{item?.order_amount} </Text>
										<Text style={{ fontSize: 14, color: 'green', paddingRight: 3,  }}>KSh</Text>
									</View>
								</View>
								<View style={{ flex: 1,marginVertical : 10 ,flexDirection: 'row'}} >
									<Text style={{ fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black', paddingRight: 3,  fontWeight : '700'}}>{strings('login.orderdate')}:</Text>
									<Text style={{ fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{item?.created}</Text>
								</View>
								{/* <View style={{ flex: 1, }} >
									<Text style={{ fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.batch_no')} : gjdigjithjtihj</Text>
								</View> */}
								<View style={{ flex: 1,flexDirection: 'row' }}>
									<Text style={{ fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black', paddingRight: 3,  fontWeight : '700'}}>{strings('login.status')}:</Text>
									<Text style={{ fontSize: 14, color:'green' }}>{item?.order_status}</Text>
								</View>
							</ListItem>
						)}
						keyExtractor={(item, index) => index.toString()}
						ListFooterComponent={this.renderFooter.bind(this)}
						onEndReachedThreshold={0.1}
						onEndReached={this.handleLoadMore.bind(this)}
					/>
				</View>
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
						{/* <Tab1 props={this.props} redeemCash={this.state.redeemHistoryCash} /> */}
					{/* </Tab> */}

					{/* <Tab heading={strings('login.coupon_history_scheme')} tabStyle={{ backgroundColor: this.props.enableDarkTheme ? 'black' : 'blue' }} textStyle={{ color: '#fff' }} activeTabStyle={{ backgroundColor: this.props.enableDarkTheme ? '#1a1a1a' : 'blue' }} activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
						<Tab2 props={this.props} redeemScheme={this.state.redeemHistoryScheme} />
					</Tab> */}
				{/* </Tabs> */}
				{this._displayList()}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	noRecord: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	}
})
const mapStateToProps = (state) => {
	return {
		enableDarkTheme: state.VerifierReducer.enableDarkTheme,
		languageControl: state.VerifierReducer.languageEnglish,
	}
}
export default connect(mapStateToProps, null)(CustomerOrderHistoryScreen)