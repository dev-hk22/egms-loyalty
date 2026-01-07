import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage, FlatList } from 'react-native';
import { Container, Text, ListItem } from 'native-base';
import Loader from '../../Utility/Loader';
import * as utilities from '../../Utility/utilities';
import DateTimePicker from "react-native-modal-datetime-picker";
import { Col, Grid } from "react-native-easy-grid";
import moment from 'moment';
import HistoryService from '../../services/HistoryService/HistoryService';
import { URL, HEADER, APIKEY, ACCESSTOKEN } from '../../App';
import DatePicker from 'react-native-date-picker'
import { strings } from '../../locales/i18n';
import { connect } from 'react-redux';

class Tab2 extends Component {

	constructor(props) {
		super(props);
		this.state = {
			data: this.props.redeemScheme,
			loading: false,
			loaderText: '',
			isDateTimePickerVisible: false,
			isDateTimePickerVisible1: false,
			frmDate: moment().format('DD-MM-YYYY'),
			toDate: moment().format('DD-MM-YYYY'),
			fromDateError: '',
			toDateError: '',
			distributorId: '',
			lResponseData: '',
			redeemHistory: [],
			redeemHistoryCash: [],
			redeemHistoryScheme: [],
			loaderText: 'Please wait...',
			offset: 0,
			noMoreDataError: '',
			userType: ''
		};
	}

	showDateTimePicker = () => {
		this.setState({ isDateTimePickerVisible: true, isDateTimePickerVisible1: false });
	};
	showDateTimePicker1 = () => {
		this.setState({ isDateTimePickerVisible: false, isDateTimePickerVisible1: true });
	};

	hideDateTimePicker = () => {
		this.setState({ isDateTimePickerVisible: false, isDateTimePickerVisible1: false });
	};
	handleDatePicked = date => {
		let a = date;
		let b = this.state.toDate
		if (a > b) {
			this.setState({ fromDateError: 'FromDate cannot be greater than toDate.' })
		} else {
			this.forceUpdate();
			this.setState({ fromDateError: '', toDateError: '' })
			this.setState({ frmDate: date })
			this.callApi();
		}
		this.setState({ frmDate: a })
		this.hideDateTimePicker();
	};
	handleDatePicked1 = date => {
		let a = date;
		let b = this.state.frmDate;
		let c = moment().format('DD-MM-YYYY')
		if (a > c) {
			this.setState({ toDateError: strings('login.ToDateError') })
		} else if (a < b) {
			this.setState({ toDateError: strings('login.FromDateError') })
		} else {
			this.setState({ toDateError: '', fromDateError: '' })
			this.setState({ toDate: date })
			this.callApi();
		}
		this.setState({ toDate: a })
		this.hideDateTimePicker();
	};
	componentDidMount = () => {
		this._getAsyncData();
	}
	async _getAsyncData() {
		await AsyncStorage.getItem('USERDATA', (err, result) => {		// USERDATA is set on SignUP screen
			var lData = JSON.parse(result);
			if (lData) {
				// this.distributorId = lData.data.id;
				this.setState({ distributorId: lData.data.id, userType: lData.data.userType }, () => {
					this.callApi()
				})
			}
		});
	}
	callApi = () => {
		this.setState({ loading: true })
		const formData = new FormData();
		formData.append('distributorId', this.state.distributorId);
		formData.append('fromDate', this.state.frmDate);
		formData.append('toDate', this.state.toDate);
		formData.append('offset', this.state.offset);
		formData.append('redeemType', 'FOC');
		formData.append('userType', this.state.userType);
		if (this.props.languageControl) {
			formData.append('language', 'en');
		} else {
			formData.append('language', 'hi');
		}

		console.log(formData);
		var lUrl = URL + 'getRedeemHistory';
		fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY,
				'accesstoken': ACCESSTOKEN
			},
			body: formData,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				this.setState({ offset: responseJson.offset })
				this.dataVerify(responseJson)
			})
			.catch((error) => {
				console.log(error);
			});
	}
	dataVerify = (lResponseData) => {
		this.setState({ loading: false })
		if (!lResponseData) {
			utilities.showToastMsg('Something went wrong. Please try again later');
		} else if (lResponseData.status == 500 || lResponseData.status == 400) {
			this.setState({ noMoreDataError: "" })
			utilities.showToastMsg(lResponseData.message);
		} else if (lResponseData.status == 403) {
			utilities.showToastMsg(lResponseData.message);
			this.props.navigation.navigate('LoginScreen');
			AsyncStorage.clear();
			return;
		} else if (lResponseData.status == 404) {
			this.setState({ noMoreDataError: strings('login.noMoreData') })
			return;
		}
		else if (lResponseData.status == 200) {
			this.setState({ noMoreDataError: "" })
			if (lResponseData.redeemHistory.length == 0) {
				this.setState({ redeemHistory: lResponseData.redeemHistory, redeemHistoryScheme: [] });
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
			this.setState({ redeemHistoryScheme: [] })
		}
	}
	renderFooter = () => {
		return (
			<View>
				{this.state.noMoreDataError ?
					<Text style={{ color: 'red', textAlign: 'center', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{this.state.noMoreDataError}</Text>
					: <Text></Text>}
			</View>
		)
	};
	handleLoadMore = () => {
		if (!this.state.noMoreDataError) {
			this.callApi();
		}
	};
	_displayList() {
		// var items = this.props.redeemScheme;
		var items1 = this.state.redeemHistoryScheme
		if (items1.length == 0) {
			return (
				<View style={styles.container}>
					<Text style={{ fontSize: 28, color: '#BDBDBD', color: this.props.enableDarkTheme ? 'white' : '#BDBDBD' }}>{strings('login.NoHistory_Error')}</Text>
				</View>
			)
		} else if (this.state.redeemHistoryScheme.length > 0) {
			return (
				<View style={{ flex: 1, backgroundColor: 'white' }}>
					<View style={{ marginTop: -10 }} >
						<FlatList
							data={this.state.redeemHistoryScheme}
							extraData={this.state}
							key={(item, index) => item.index}
							keyExtractor={(item, index) => item.index}
							renderItem={({ item, index }) =>
								<ListItem key={index} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
									<View style={{ flex: 1, flexDirection: 'row', }}>
										<View style={{ flex: 0.9, }} >
											<Text style={{ alignSelf: 'flex-start', fontSize: 14 }}>Serial No : {item.redeemHistoryScheme.id}</Text>
										</View>
										<View style={{ flex: 0.1, flexDirection: 'row' }}>
											<Text style={{ fontSize: 12, color: 'green', paddingRight: 3 }}>{'\u20B9'}</Text>
											<Text style={{ fontSize: 14 }}>{item.redeemHistoryScheme.value}</Text>
										</View>
									</View>
									<View style={{ flex: 0.9, }} >
										<Text style={{ alignSelf: 'flex-start', fontSize: 14 }}>Item Code : {item.redeemHistoryScheme.item_code}</Text>
									</View>

									<View style={{ flex: 1, }} >
										<Text style={{ fontSize: 14 }}>Redemtion Date : {item.redeemHistoryScheme.distributor_redemption_date}</Text>
									</View>
									<View style={{ flex: 1 }}>
										<Text style={{ fontSize: 14 }}>Status : {item.redeemHistoryScheme.sap_interface_flag}</Text>
									</View>

								</ListItem>
							}
							keyExtractor={(item, index) => index.toString()}
							ListFooterComponent={this.renderFooter.bind(this)}
							onEndReachedThreshold={0.1}
							onEndReached={this.handleLoadMore.bind(this)}
						/>


						{/* <FlatList
							data={this.state.redeemHistoryScheme}
							extraData={this.state}
							renderItem={({ item, index }) => (
								<ListItem key={index} style={{ flexDirection: 'column', alignItems: 'flex-start', backgroundColor:"white" }}>
									<View style={{ flex: 1, flexDirection: 'row', }}>
										<View style={{ flex: 0.9, }} >
											<Text style={{ alignSelf: 'flex-start', fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black' }}>Serial No : {item.redeemHistoryScheme.id}</Text>
										</View>
										<View style={{ flex: 0.1, flexDirection: 'row' }}>
											<Text style={{ fontSize: 12, color: 'green', paddingRight: 3, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{'\u20B9'}</Text>
											<Text style={{ fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{item.redeemHistoryScheme.value}</Text>
										</View>
									</View>
									<View style={{ flex: 0.9, }} >
										<Text style={{ alignSelf: 'flex-start', fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black' }}>Item Code : {item.redeemHistoryScheme.item_code}</Text>
									</View>

									<View style={{ flex: 1, }} >
										<Text style={{ fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black' }}>Redemtion Date : {item.redeemHistoryScheme.distributor_redemption_date}</Text>
									</View>
									<View style={{ flex: 1 }}>
										<Text style={{ fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black' }}>Status : {item.redeemHistoryScheme.sap_interface_flag}</Text>
									</View>

								</ListItem>
							)}
							keyExtractor={(item, index) => index.toString()}
							ListFooterComponent={this.renderFooter.bind(this)}
							onEndReachedThreshold={0.1}
							onEndReached={this.handleLoadMore.bind(this)}
						/> */}
					</View>
				</View>
			)
		}
	}

	render() {
		return (
			<Container style={{ backgroundColor: this.props.enableDarkTheme ? '#1a1a1a' : 'white' }}>
				<Loader
					loading={this.state.loading}
					text={this.state.loaderText}
				/>
				<View style={{ flex: this.state.fromDateError || this.state.toDateError ? 0.2 : 0.1, marginTop: 10 }}>
					{/* <Grid style={{ marginTop: 10, margin: 10 }}>
						<Col size={1.9}>
							<Text style={{ fontWeight: 'bold' }}>From Date : </Text>
						</Col>
						<Col size={2} >
							<Text onPress={this.showDateTimePicker}>{this.state.frmDate}</Text>
						</Col>
						<Col size={1.5}>
							<Text style={{ fontWeight: 'bold' }}>To Date : </Text>
						</Col>
						<Col size={2}>
							<Text onPress={this.showDateTimePicker1}>{this.state.toDate}</Text>
						</Col>
					</Grid> */}
					{this.props.languageControl == 'Urdu - (اردو)' ?
						<Grid style={{ margin: 10 }}>
							<Col style={{ bottom: 7 }} size={1.2}>
								<DatePicker
									date={this.state.frmDate}
									mode="date"
									format="DD-MM-YYYY"
									maxDate={moment().format('DD-MM-YYYY')}
									showIcon={false}
									onDateChange={(date) => { this.handleDatePicked(date) }}
									// style={{ width: 90, height: 25, justifyContent: 'center', color: this.props.enableDarkTheme ? 'white' : 'black' }}
									customStyles={{
										dateInput: {
											borderWidth: 0,
											alignItems: 'center',
											// marginRight: this.props.enableDarkTheme ? 65 : 0,
											backgroundColor: 'white',
											// color: this.props.enableDarkTheme ? 'white' : 'black',
										}
									}}
									style={{ width: '100%' }}
								/>
							</Col>
							<Col size={1.5}>
								<Text style={{ textAlign: 'left', fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.coupon_history_fromDate')} : </Text>
							</Col>

							<Col style={{ bottom: 7 }}>
								<DatePicker
									date={this.state.toDate}
									mode="date"
									format="DD-MM-YYYY"
									maxDate={moment().format('DD-MM-YYYY')}
									showIcon={false}
									onDateChange={(date) => { this.handleDatePicked1(date) }}
									// style={{ width: 90, height: 25, justifyContent: 'center', color: this.props.enableDarkTheme ? 'white' : 'black' }}
									customStyles={{
										dateInput: {
											borderWidth: 0,
											alignItems: 'center',
											// marginRight: this.props.enableDarkTheme ? 65 : 0,
											backgroundColor: 'white'
											// color: this.props.enableDarkTheme ? 'white' : 'black'
										}
									}}
									style={{ width: '130%' }}
								/>
							</Col>
							<Col size={1}>
								<Text style={{ fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.coupon_history_toDate')} : </Text>
							</Col>
						</Grid>
						:
						<Grid style={{ margin: 10 }}>
							<Col>
								<Text style={{ fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.coupon_history_fromDate')} : </Text>
							</Col>
							<Col style={{ bottom: 7 }}>
								<DatePicker
									date={this.state.frmDate}
									mode="date"
									format="DD-MM-YYYY"
									maxDate={moment().format('DD-MM-YYYY')}
									showIcon={false}
									onDateChange={(date) => { this.handleDatePicked(date) }}
									// style={{ width: 90, height: 25, justifyContent: 'center', color: this.props.enableDarkTheme ? 'white' : 'black' }}
									customStyles={{
										dateInput: {
											borderWidth: 0,
											alignItems: 'flex-start',
											marginRight: this.props.enableDarkTheme ? 65 : 0,
											backgroundColor: 'white'
											// color: this.props.enableDarkTheme ? 'white' : 'black'
										}
									}}
								/>
							</Col>
							<Col>
								<Text style={{ fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.coupon_history_toDate')} : </Text>
							</Col>
							<Col style={{ bottom: 7 }}>
								<DatePicker
									date={this.state.toDate}
									mode="date"
									format="DD-MM-YYYY"
									maxDate={moment().format('DD-MM-YYYY')}
									showIcon={false}
									onDateChange={(date) => { this.handleDatePicked1(date) }}
									// style={{ width: 90, height: 25, justifyContent: 'center', color: this.props.enableDarkTheme ? 'white' : 'black' }}
									customStyles={{
										dateInput: {
											borderWidth: 0,
											alignItems: 'flex-start',
											marginRight: this.props.enableDarkTheme ? 65 : 0,
											backgroundColor: 'white'
											// color: this.props.enableDarkTheme ? 'white' : 'black'
										}
									}}
								/>
							</Col>
						</Grid>
					}


					{this.state.fromDateError ?
						<View style={{ marginTop: 15, marginLeft: 20 }}>
							<Text style={{ color: 'red' }}>{this.state.fromDateError}</Text>
						</View>
						: <View></View>}
					{this.state.toDateError ?
						<View style={{ marginTop: 15, marginLeft: 20 }}>
							<Text style={{ color: 'red' }}>{this.state.toDateError}</Text>
						</View>
						: <View></View>}
					{/* <DateTimePicker
						isVisible={this.state.isDateTimePickerVisible}
						onConfirm={this.handleDatePicked}
						onCancel={this.hideDateTimePicker}
					/>
					<DateTimePicker
						isVisible={this.state.isDateTimePickerVisible1}
						onConfirm={this.handleDatePicked1}
						onCancel={this.hideDateTimePicker}
					/> */}
					<Text style={{ borderBottomWidth: 1, borderBottomColor: 'grey' }} />
					{/* <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', marginTop: 20, margin: 10 }} /> */}
				</View>
				{this._displayList()}
			</Container>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
})
const mapStateToProps = (state) => {
	return {
		enableDarkTheme: state.VerifierReducer.enableDarkTheme,
		languageControl: state.VerifierReducer.languageEnglish,
	}
}
export default connect(mapStateToProps, null)(Tab2)