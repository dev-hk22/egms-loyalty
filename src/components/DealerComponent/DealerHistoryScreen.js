import React, { Component } from 'react';
import { FlatList, StyleSheet, BackHandler, View, TouchableOpacity, StatusBar } from 'react-native';
import { Text, ListItem, Header, Left, Body, Right, Title, Icon } from 'native-base';
import Loader from '../../Utility/Loader';
import * as utilities from '../../Utility/utilities';
import moment from 'moment';
import { URL, HEADER, APIKEY, ACCESSTOKEN } from '../../App';
import { Col, Grid } from "react-native-easy-grid";
import DatePicker from 'react-native-date-picker'
import { strings } from '../../locales/i18n';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import MyColors from '../../Utility/Colors';
import AsyncStorage from '@react-native-community/async-storage';

class DealerHistoryScreen extends Component {
    constructor(props) {
        super(props);
        this.redeemHistoryCash = this.props.redeemCash;
        this.state = {
            data: this.props.redeemCash,
            // data: redeemHistoryCash,
            deleteItem: false,
            loading: false,
            isDateTimePickerVisible: false,
            isDateTimePickerVisible1: false,
            // frmDate: moment().format('DD-MM-YYYY'),
            frmDate: moment().locale('en').clone().startOf('month').format("DD-MM-YYYY"),
            // toDate: moment().clone().startOf('month').format("DD-MM-YYYY"),
            toDate: moment().locale('en').format('DD-MM-YYYY'),
            fromDateError: '',
            toDateError: '',
            distributorId: '',
            lResponseData: '',
            redeemHistory: [],
            redeemHistoryCash: [],
            redeemHistoryScheme: [],
            redeemHistoryCashArr: [],
            loaderText: 'Please wait...',
            offset: 0,
            noMoreDataError: '',
            userType: '',
            datewwe: ""
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
        this.setState({ offset: 0, redeemHistoryCash: [] })
        // let a = date;
        // let b = this.state.toDate
        console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
        let a = moment(date, 'DD-MM-YYYY');
        let b = moment(this.state.toDate, 'DD-MM-YYYY');

        if (moment(a).isAfter(b)) {
            this.setState({ fromDateError: 'FromDate cannot be greater than toDate.', noMoreDataError: '' })
        } else {
            this.forceUpdate();
            this.setState({ fromDateError: '', toDateError: '', frmDate: date }, () => {
                this.callApi();
            })
        }
        // this.setState({ frmDate: moment(a).format("DD-MM-YYYY") })
        this.hideDateTimePicker();
    };
    handleDatePicked1 = date => {
        this.setState({ offset: 0, redeemHistoryCash: [] })
        // let a = date;
        // let b = this.state.frmDate;
        // let c = moment().format('DD-MM-YYYY')
        let a = moment(date, 'DD-MM-YYYY');
        // let b = this.state.frmDate;
        let b = moment(this.state.frmDate, 'DD-MM-YYYY');

        if (a < b) {
            this.setState({ toDateError: strings('login.FromDateError'), noMoreDataError: '' })
        } else {
            this.setState({ toDate: date, toDateError: '', fromDateError: '' }, () => {
                this.callApi();
            })
        }
        // this.setState({ toDate: a })
        this.hideDateTimePicker();
    };
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this._getAsyncData();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.props.navigation.navigate('HomeScreen');
        return true;
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
        console.log(this.state.userType);

        formData.append('dealerId', this.state.distributorId);
        formData.append('fromDate', this.state.frmDate);
        formData.append('toDate', this.state.toDate);
        formData.append('offset', this.state.offset);
        formData.append('userType', this.state.userType);
        if (this.props.languageControl) {
            formData.append('language', 'en');
        } else {
            formData.append('language', 'hi');
        }

        console.log(formData);
        var lUrl = URL + 'getScannedHistory';
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

                this.setState({ loading: false, offset: responseJson.offset, noMoreDataError: "" }, () => {
                    this.dataVerify(responseJson)
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }
    _showHeader() {
        if (Platform.OS == 'ios') {
            return (
                <Header style={{ backgroundColor: this.state.userType == 2 ? MyColors.dealerColor : MyColors.distributorColor }}>
                    <Left style={{ flex: 0.1 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('HomeScreen')}>
                            <Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingLeft: 10, }} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{ alignItems: "center", }}>
                        <Title style={{ color: '#FFFFFF', fontSize: 16, textAlign: 'center' }}>{strings('login.coupon_history_title')}</Title>
                    </Body>
                </Header>
            )
        } else {
            return (
                <Header style={{ backgroundColor: MyColors.dealerColor }}>
                    <Left style={{ flex: 0.1 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('HomeScreen')}>
                            <Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingLeft: 10, }} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{ alignItems: "center", }}>
                        <Title style={{ color: '#FFFFFF', fontSize: 16, textAlign: 'center' }}>{strings('login.coupon_history_title')}</Title>
                    </Body>
                </Header>
            )
        }
    }
    dataVerify = (lResponseData) => {
        this.setState({ loading: false })
        if (!lResponseData) {
            utilities.showToastMsg('Something went wrong. Please try again later');
        } else if (lResponseData.status == 500 || lResponseData.status == 400) {
            this.setState({ noMoreDataError: "" })
            utilities.showToastMsg(lResponseData.message);
            this.setState({ noMoreDataError: "" })
        } else if (lResponseData.status == 403) {
            utilities.showToastMsg(lResponseData.message);
            this.props.navigation.navigate('LoginScreen');
            AsyncStorage.clear();
            return;
        } else if (lResponseData.status == 404) {
            this.setState({ noMoreDataError: strings('login.noMoreData') });
            return;
        }
        else if (lResponseData.status == 200) {
            this.setState({ noMoreDataError: "" })
            this.setState({ redeemHistoryCash: lResponseData.scannedHistory })
        } else {
            utilities.showToastMsg('Something went wrong. Please try again later');
            this.setState({ redeemHistoryCash: [] })
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
            this.callApi();
        }
    };

    _displayList() {
        if (this.state.redeemHistoryCash.length == 0) {
            return (
                <View style={styles.noRecord}>
                    <Text style={{ fontSize: 28, color: this.props.enableDarkTheme ? 'white' : '#BDBDBD' }}>{strings('login.NoHistory_Error')}</Text>
                </View>
            )
        } else {
            return (
                <View style={{ flex: 1, backgroundColor: this.props.enableDarkTheme ? '#1a1a1a' : 'white' }}>
                    <FlatList
                        data={this.state.redeemHistoryCash}
                        extraData={this.state}
                        renderItem={({ item, index }) => (
                            <ListItem key={index} style={{ flexDirection: 'column', alignItems: 'flex-start', }}>
                                <View style={{ flex: 1, flexDirection: 'row', }}>
                                    <View style={{ flex: 0.9, }} >
                                        <Text style={{ alignSelf: 'flex-start', fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black' }}>Serial No : {item.id}</Text>
                                    </View>
                                    <View style={{ flex: 0.1, flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 12, color: 'green', paddingRight: 3, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{'\u20B9'}</Text>
                                        <Text style={{ fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{item.value}</Text>
                                    </View>
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
            <View style={{ flex: 1, backgroundColor: this.props.enableDarkTheme ? '#1a1a1a' : 'white' }}>
                <Loader loading={this.state.loading} text={this.state.loaderText} />
                {this._showHeader()}
                <StatusBar backgroundColor={MyColors.dealerColor} barStyle="light-content" />
                <View style={{ flex: this.state.fromDateError || this.state.toDateError ? 0.2 : 0.1, marginTop: 10, justifyContent: "center", alignContent: "center", }}>
                    {this.props.languageControl == 'Urdu - (اردو)' ?
                        <Grid style={{  }}>
                            <Col style={{ bottom: 7 }} size={1.2}>
                                <DatePicker
                                    date={this.state.frmDate}
                                    confirmBtnText="Select"
                                    cancelBtnText="Cancel"
                                    mode="date"
                                    format="DD-MM-YYYY"
                                    maxDate={moment().format('DD-MM-YYYY')}
                                    showIcon={false}
                                    onDateChange={(date) => { this.handleDatePicked(date) }}
                                    customStyles={{
                                        dateInput: { borderWidth: 0, alignItems: 'center', backgroundColor: 'white' }
                                    }}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col size={1.5}>
                                <Text style={{ textAlign: 'left', fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.coupon_history_fromDate')} : </Text>
                            </Col>

                            <Col style={{ bottom: 7, }}>
                                <DatePicker
                                    date={this.state.toDate}
                                    confirmBtnText="Select"
                                    cancelBtnText="Cancel"
                                    mode="date"
                                    format="DD-MM-YYYY"
                                    maxDate={moment().format('DD-MM-YYYY')}
                                    showIcon={false}
                                    onDateChange={(date) => { this.handleDatePicked1(date) }}
                                    customStyles={{
                                        dateInput: {
                                            borderWidth: 0,
                                            alignItems: 'center',
                                            // marginRight: this.props.enableDarkTheme ? 65 : 0,
                                            backgroundColor: 'white'
                                        }
                                    }}
                                    style={{ width: '130%' }}
                                />
                            </Col>
                            <Col size={1}>
                                <Text style={{ fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>  {strings('login.coupon_history_toDate')} : </Text>
                            </Col>
                        </Grid>
                        :
                        // <View style={{ margin: 10, flexDirection: "row", flex: 1, alignItems: "center", }}>
                        // 	<View style={{}}>
                        // 		<Text style={{ fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.coupon_history_fromDate')} : </Text>
                        // 	</View>
                        // 	<View style={{ marginTop: 5 }}>
                        // 		<DatePicker
                        // 			date={this.state.frmDate}
                        // 			confirmBtnText="Select"
                        // 			cancelBtnText="Cancel"
                        // 			mode="date"
                        // 			format="DD-MM-YYYY"
                        // 			maxDate={moment().format('DD-MM-YYYY')}
                        // 			showIcon={false}
                        // 			onDateChange={(date) => { this.handleDatePicked(date) }}
                        // 			customStyles={{
                        // 				dateInput: {
                        // 					borderWidth: 0,
                        // 					alignItems: 'flex-start',
                        // 					// marginRight: this.props.enableDarkTheme ? 65 : 0,
                        // 					backgroundColor: 'white',
                        // 				}
                        // 			}}
                        // 			style={{ width: 100 }}
                        // 		/>
                        // 	</View>
                        // 	<View >
                        // 		<Text style={{ fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>  {strings('login.coupon_history_toDate')} : </Text>
                        // 	</View>
                        // 	<View style={{ marginTop: 5 }}>
                        // 		<DatePicker
                        // 			date={this.state.toDate}
                        // 			confirmBtnText="Select"
                        // 			cancelBtnText="Cancel"
                        // 			// date={moment().clone().startOf('month').format("DD-MM-YYYY")}
                        // 			mode="date"
                        // 			format="DD-MM-YYYY"
                        // 			maxDate={moment().format('DD-MM-YYYY')}
                        // 			showIcon={false}
                        // 			onDateChange={(date) => { this.handleDatePicked1(date) }}
                        // 			customStyles={{
                        // 				dateInput: {
                        // 					borderWidth: 0,
                        // 					alignItems: 'flex-start',
                        // 					// marginRight: this.props.enableDarkTheme ? 65 : 0,
                        // 					backgroundColor: 'white'
                        // 				}
                        // 			}}
                        // 			style={{ width: 100 }}
                        // 		/>
                        // 	</View>
                        // </View>
                        <Grid style={{   }}>
                            <Col>
                                <Text style={{  fontSize: this.props.languageControl == 'Marathi - (मराठी)' ? 12 : 16, fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.report_history_fromDate')} : </Text>
                            </Col>
                            <Col style={{ bottom: 7 }}>
                                <DatePicker
                                    date={this.state.frmDate}
                                    confirmBtnText="Select"
                                    cancelBtnText="Cancel"
                                    mode="date"
                                    format="DD-MM-YYYY"
                                    locale={moment.locale('en')}
                                    maxDate={moment().format('DD-MM-YYYY')}
                                    showIcon={false}
                                    onDateChange={(date) => { this.handleDatePicked(date) }}
                                    customStyles={{
                                        dateInput: {
                                            borderWidth: 0,
                                            alignItems: 'flex-start',
                                            marginRight: this.props.enableDarkTheme ? 65 : 0,
                                            backgroundColor: 'white',
                                        }
                                    }}
                                />
                            </Col>
                            <Col>
                                <Text style={{ fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.report_history_toDate')} : </Text>
                            </Col>
                            <Col style={{ bottom: 7 }}>
                                <DatePicker
                                    date={this.state.toDate}
                                    confirmBtnText="Select"
                                    cancelBtnText="Cancel"
                                    mode="date"
                                    format="DD-MM-YYYY"
                                    locale={moment.locale('en')}
                                    maxDate={moment().format('DD-MM-YYYY')}
                                    showIcon={false}
                                    onDateChange={(date) => { this.handleDatePicked1(date) }}
                                    customStyles={{
                                        dateInput: {
                                            borderWidth: 0,
                                            alignItems: 'flex-start',
                                            marginRight: this.props.enableDarkTheme ? 65 : 0,
                                            backgroundColor: 'white'
                                        }
                                    }}
                                />
                            </Col>
                        </Grid>
                    }
                    {this.state.fromDateError ?
                        <View style={{ marginTop: 15, marginLeft: 20 }}>
                            <Text style={{ color: 'red', }}>{this.state.fromDateError}</Text>
                        </View>
                        : <View></View>}
                    {this.state.toDateError ?
                        <View style={{ marginTop: 15, marginLeft: 20 }}>
                            <Text style={{ color: 'red', }}>{this.state.toDateError}</Text>
                        </View>
                        : <View></View>}
                    {/* <Text style={{ borderBottomWidth: 1, borderBottomColor: 'grey' }} /> */}
                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', marginTop: 20, margin: 10 }} />
                </View>
                {this._displayList()}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    noRecord: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
const mapStateToProps = (state) => {
    return {
        enableDarkTheme: state.VerifierReducer.enableDarkTheme,
        languageControl: state.VerifierReducer.languageEnglish,
    }
}
export default connect(mapStateToProps, null)(DealerHistoryScreen)