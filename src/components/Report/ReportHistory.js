import React, { Component } from 'react';
import { StatusBar, ActivityIndicator, FlatList, Platform, StyleSheet, View, TextInput, Image, TouchableOpacity, Modal } from 'react-native';
import { Container, Header, Left, Body, Right, Button, ListItem, Card, CardItem, Text, Title, Item, Icon, Toast, Tab, Tabs } from 'native-base';
import { URL, HEADER, APIKEY, ACCESSTOKEN } from '../../App';
import Loader from '../../Utility/Loader';
import moment from 'moment';
import { Col, Grid, Row } from "react-native-easy-grid";
import { strings } from '../../locales/i18n';
import DatePicker from 'react-native-date-picker';
import { connect } from 'react-redux';
import ImageViewer from 'react-native-image-zoom-viewer';
import FastImage from 'react-native-fast-image';
import MyColors from '../../Utility/Colors';
import AsyncStorage from '@react-native-community/async-storage';
var img = [{
    url: "",
    props: {
        // source: require('../../images/lolo.jpg'),
        source: "",
        style: {}
    }
    // url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',
}]

class ReportHistory extends Component {
    constructor(props) {
        super(props);
        this.reportDataa = []
        this.state = {
            reportData: [],
            loading: false,
            loadingForImg: false,
            loadingForImgBack: false,
            loaderText: 'Loading',
            offset: 0,
            // frmDate: moment().format('DD-MM-YYYY'),
            frmDate: moment().locale('en').clone().startOf('month').format("DD-MM-YYYY"),
            toDate: moment().locale('en').format('DD-MM-YYYY'),
            // toDate: moment().clone().startOf('month').format("DD-MM-YYYY"),
            noMoreDataError: '',
            carpenterId: '',
            modalShowHide: false,
            couponImg: "",
            couponImgBack: "",
            widthOfImg: "",
            heightOfImg: "",
            reportDataaState: [],
            accesstoken:''
        }
    }
    async _getAsyncData() {
        await AsyncStorage.multiGet(['USERDATA','ACCESSTOKEN'], (err, result) => {		// USERDATA is set on SignUP screen
            var lData = JSON.parse(result[0][1]);
            this.setState({ accesstoken : result[1][1] });
            if (lData) {
                this.setState({ carpenterId: lData.data.id }, () => {
                    this._callApiForReportHistory(lData.data.id);
                })
            }
        });
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
        console.log(date);
        this.reportDataa = []
        this.setState({ offset: 0, reportDataaState: [] })
        // let a = date;
        // let b = this.state.toDate
        let a = moment(date, 'DD-MM-YYYY');
        let b = moment(this.state.toDate, 'DD-MM-YYYY');

        if (moment(a).isAfter(b)) {
            this.setState({ fromDateError: 'FromDate cannot be greater than toDate.', noMoreDataError: '',open1:false  })
        } else {
            this.forceUpdate();
            this.setState({ fromDateError: '', toDateError: '', frmDate: a.format("DD-MM-yyyy"),open1:false }, () => {
                this._callApiForReportHistory(this.state.distributorId);
            })
        }
        // this.setState({ frmDate: date })
        // this.hideDateTimePicker();
    };
    handleDatePicked1 = date => {
        this.reportDataa = []
        this.setState({ offset: 0, reportDataaState: [] })
        let a = moment(date, 'DD-MM-YYYY');
        // let b = this.state.frmDate;
        let b = moment(this.state.frmDate, 'DD-MM-YYYY');

        console.log(a);
        console.log(b);
        console.log(moment(a).isBefore(b));


        if (a < b) {
            this.setState({ toDateError: strings('login.FromDateError'), noMoreDataError: '',open2:false })
        } else {
            this.setState({ toDate: a.format("DD-MM-yyyy"), toDateError: '', fromDateError: '',open2:false }, () => {
                this._callApiForReportHistory(this.state.distributorId);
            })
        }
        // this.hideDateTimePicker();
    };

    componentDidMount = () => {
        this._getAsyncData();
    }

    _callApiForReportHistory = (carpenterId) => {
        this.setState({ loading: true })
        const formData = new FormData();
        formData.append('carpenterId', carpenterId);
        formData.append('fromDate', this.state.frmDate);
        formData.append('toDate', this.state.toDate);
        formData.append('offset', this.state.offset);
        if (this.props.languageControl) {
            formData.append('language', 'en');
        } else {
            formData.append('language', 'hi');
        }
        console.log(formData);

        var lUrl = URL + 'getReportedCouponHistoryCarpenter';
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
            .then(async (lResponseData) => {
                console.log(lResponseData);

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
                }
                else if (lResponseData.status == 404) {
                    this.setState({ noMoreDataError: strings('login.noMoreData'), offset: 0 })
                    return;
                }
                else if (lResponseData.status == 200) {
                    // console.log(lResponseData);
                    this.setState({ noMoreDataError: "", offset: lResponseData.offset, reportDataaState: lResponseData.reportedCouponHistory })
                    this.reportDataa = lResponseData.reportedCouponHistory;

                    // console.log(this.reportDataa[0].coupon_image);
                    // console.log(this.reportDataa[1].coupon_image);

                    // await Image.getSize(this.reportDataa[1].coupon_image, (width, height) => { this.setState({ widthOfImg: width, heightOfImg: height }) });
                    // console.log("imgSize")
                    // console.log(this.state.widthOfImg)
                    // console.log(this.state.heightOfImg)

                    this.setState(this.state);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    _showHeader() {
        if (Platform.OS == 'ios') {
            return (
                <Header style={{ backgroundColor: MyColors.distributorColor }} hasTabs>
                    <Left style={{ flex: 0.2 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('HomeScreen')}>
                            <Icon type="FontAwesome5" name="arrow-left" style={{ fontSize: 20, color: '#FFFFFF', paddingRight: 10 }} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{ flex: 0.6, alignItems: 'center' }}>
                        <Title style={{ textAlign: 'center', color: '#FFFFFF' }}>{strings('login.report_history_title')}</Title>
                    </Body>
                    <Right style={{ flex: 0.2 }}>
                    </Right>
                </Header>
            )
        } else {
            return (
                <Header style={{ backgroundColor: MyColors.distributorColor }} hasTabs>
                    <Left style={{ flex: 0.2 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('HomeScreen')}>
                            <Icon type="FontAwesome5" name="arrow-left" style={{ fontSize: 20, color: '#FFFFFF', paddingRight: 10 }} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{ flex: 0.6, alignItems: 'center' }}>
                        <Title style={{ color: '#FFFFFF', fontSize: 16 }}>{strings('login.report_history_title')}</Title>
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
            this._callApiForReportHistory(this.state.distributorId);
        }
    };
    _displayList() {
        if (this.state.reportDataaState.length == 0) {
            return (
                <View style={styles.container}>
                    <Text style={{ fontSize: 28, color: '#BDBDBD' }}>{strings('login.NoHistory_Error')}</Text>
                </View>
            )
        } else if (this.state.reportDataaState.length > 0) {
            return (
                <View style={{ flex: 1, }}>
                    <FlatList
                        data={this.state.reportDataaState}
                        extraData={this.state}
                        renderItem={({ item, index }) => (
                            <ListItem key={index} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Grid style={{}}>
                                    <Col size={3} >
                                        <Text style={{ alignSelf: 'flex-start', fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.report_date')} : {moment(item.created).format('DD-MM-YYYY')}</Text>
                                        <Text style={{ alignSelf: 'flex-start', fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.serial_No')} : {item.sr_no}</Text>
                                        <Text style={{ alignSelf: 'flex-start', fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.description')}: {item.description}</Text>
                                        {item.is_approved != "Pending" ?
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={{ alignSelf: 'flex-start', fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black', }}>{strings('login.redemption_date')}:</Text>
                                                <Text style={{ alignSelf: 'flex-start', fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black', }}> {moment(item.approval_date_time).format("DD-MM-YYYY")}</Text>
                                            </View> : null}
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={{ alignSelf: 'flex-start', fontSize: 14, color: this.props.enableDarkTheme ? 'white' : 'black', }}>{strings('login.status')}:</Text>
                                            <Text style={{ alignSelf: 'flex-start', fontSize: 14, color: item.is_approved === "Pending" ? 'red' : 'green', opacity: 0.5 }}> {item.is_approved}</Text>
                                        </View>
                                    </Col>
                                    <Col style={{ justifyContent: "center", alignItems: "center" }}>
                                        {/* <TouchableOpacity onPress={() => { img[0].url = item.coupon_image, this.setState({ modalShowHide: !this.state.modalShowHide }) }}> */}
                                        <Button style={{ justifyContent: "center" }} onPress={() => {  this.setState({  loadingForImg: true, loadingForImgBack: true , modalShowHide: !this.state.modalShowHide, couponImg: item.coupon_image, couponImgBack: item.coupon_image_back }) }}>
                                            <Text style={{ textAlign: "center", fontSize: 10 }}>View Image</Text>
                                        </Button>
                                        {/* <FastImage style={{ width: 60, height: 60, marginRight: 5 }}
                                            source={{ uri: item.coupon_image, headers: { Authorization: 'someAuthToken' }, priority: FastImage.priority.normal, }}
                                            resizeMode={FastImage.resizeMode.stretch}
                                            onLoadStart={() => this.setState({ loadingForImg: true, })}
                                            onLoadEnd={() => this.setState({ loadingForImg: false, })}
                                        /> */}
                                        {/* {this.state.loadingForImg && <ActivityIndicator size="small" color="red" />} */}
                                    </Col>
                                    {/* <Col style={{ flexDirection: "row", justifyContent: "flex-end", }}>
                                        <TouchableOpacity onPress={() => { img[0].url = item.coupon_image, this.setState({ modalShowHide: !this.state.modalShowHide }) }}>
                                            <FastImage style={{ width: 60, height: 60, marginRight: 5 }}
                                                source={{ uri: item.coupon_image, headers: { Authorization: 'someAuthToken' }, priority: FastImage.priority.normal, }}
                                                resizeMode={FastImage.resizeMode.stretch}
                                                onLoadStart={() => this.setState({ loadingForImg: true, })}
                                                onLoadEnd={() => this.setState({ loadingForImg: false, })}
                                            />
                                            {this.state.loadingForImg && <ActivityIndicator size="small" color="red" />}
                                        </TouchableOpacity>
                                        {item.coupon_image_back ?
                                            <TouchableOpacity onPress={() => { img[0].url = item.coupon_image_back, this.setState({ modalShowHide: !this.state.modalShowHide }) }}>
                                                <FastImage style={{ width: 60, height: 60, marginRight: 5 }}
                                                    source={{ uri: item.coupon_image_back, headers: { Authorization: 'someAuthToken' }, priority: FastImage.priority.normal, }}
                                                    resizeMode={FastImage.resizeMode.stretch}
                                                    onLoadStart={() => this.setState({ loadingForImgBack: true, })}
                                                    onLoadEnd={() => this.setState({ loadingForImgBack: false, })}
                                                />
                                                {this.state.loadingForImgBack && <ActivityIndicator size="small" color="red" />}
                                            </TouchableOpacity>
                                            : null}
                                    </Col> */}
                                </Grid>
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
            <View style={{ flex: 1, backgroundColor: this.props.enableDarkTheme ? 'black' : 'white' }}>
                {this._showHeader()}
                <StatusBar
                    backgroundColor={MyColors.distributorColor}
                    barStyle="light-content"
                />
                <Loader
                    loading={this.state.loading}
                    text={this.state.loaderText}
                />
                <View style={{ flex: this.state.fromDateError || this.state.toDateError ? 0.2 : 0.1, marginTop: 10, justifyContent: "center", alignContent: "center", }}>
                    {this.props.languageControl == 'Urdu - (اردو)' ?
                        <Grid style={{ margin: 10 }}>
                            <Col style={{ bottom: 7 }} size={1.2}>
                                {/* <DatePicker
                                    date={this.state.frmDate}
                                    confirmBtnText="Select"
                                    cancelBtnText="Cancel"
                                    mode="date"
                                    locale={moment.locale('en')}
                                    format="DD-MM-YYYY"
                                    maxDate={moment().format('DD-MM-YYYY')}
                                    showIcon={false}
                                    onDateChange={(date) => { this.handleDatePicked(date) }}
                                    customStyles={{
                                        dateInput: {
                                            borderWidth: 0,
                                            alignItems: 'flex-start',
                                            // marginRight: this.props.enableDarkTheme ? 65 : 0,
                                            backgroundColor: 'white',
                                        }
                                    }}
                                    style={{ width: '100%' }}
                                /> */}

                            <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => { this.setState({ open1: true }) }}>
                             <Text onPress={() => { this.setState({ open1: true })} }  style={{ color:"#000000"}}>{this.state.frmDate}</Text>
                             </TouchableOpacity>
                            <DatePicker
                                modal
                                mode="date"
                                open={this.state.open1}
                                date={new Date()}
                                maximumDate={new Date()}
                                color="#000000"
                                textColor="#000000"
                                onConfirm={(date) => {
                                    this.handleDatePicked(date) 
                                }}
                                onCancel={() => {
                                // setOpen(false)
                                this.setState({ open1: false})
                                }}
                                
                            />
                            </Col>
                            <Col size={1.5}>
                                <Text style={{ textAlign: 'left', fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.report_history_fromDate')} : </Text>
                            </Col>

                            <Col style={{ bottom: 7 }}>
                                {/* <DatePicker
                                    date={this.state.toDate}
                                    confirmBtnText="Select"
                                    cancelBtnText="Cancel"
                                    mode="date"
                                    format="DD-MM-YYYY"
                                    locale={moment.locale('en')}
                                    maxDate={moment().format('DD-MM-YYYY')}
                                    showIcon={false}
                                    onDateChange={(date) => { this.handleDatePicked1(date) }}
                                    // style={{ width: 90, height: 25, justifyContent: 'center' }}
                                    customStyles={{
                                        dateInput: {
                                            borderWidth: 0,
                                            alignItems: 'flex-start',
                                            marginRight: this.props.enableDarkTheme ? 65 : 0,
                                            backgroundColor: 'white'
                                        }
                                    }}
                                    style={{ width: '190%' }}
                                /> */}

                                <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => { this.setState({ open2: true }) }}>
                             <Text style={{ color:"#000000"}}>{this.state.toDate}</Text>
                             </TouchableOpacity>
                              <DatePicker
                                modal
                                mode="date"
                                open={this.state.open2}
                                date={new Date()}
                                maximumDate={new Date()}
                                color="#000000"
                                textColor="#000000"
                                onConfirm={(date) => {

                                    this.handleDatePicked1(date) 
                                }}
                                onCancel={() => {
                                // setOpen(false)
                                this.setState({ open2: false})
                                }}
                            />
                            </Col>
                            <Col size={1}>
                                <Text style={{ fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.report_history_toDate')} : </Text>
                            </Col>
                        </Grid>
                        :
                        <View style={{ marginLeft: 10, flexDirection: "row", flex: 1, alignItems: "center", }}>
                            <View style={{  }}>
                                <Text style={{ fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.coupon_history_fromDate')} : </Text>
                            </View>
                            <View style={{ }}>
                                {/* <DatePicker
                                    date={this.state.frmDate}
                                    confirmBtnText="Select"
                                    cancelBtnText="Cancel"
                                    mode="date"
                                    format="DD-MM-YYYY"
                                    maxDate={moment().format('DD-MM-YYYY')}
                                    showIcon={false}
                                    onDateChange={(date) => { this.handleDatePicked(date) }}
                                    customStyles={{
                                        dateInput: {
                                            borderWidth: 0,
                                            alignItems: 'flex-start',
                                            // marginRight: this.props.enableDarkTheme ? 65 : 0,
                                            backgroundColor: 'white',
                                        }
                                    }}
                                    style={{ width: 100 }}
                                /> */}


                            <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => { this.setState({ open1: true }) }}>
                             <Text onPress={() => { this.setState({ open1: true })} }  style={{ color:"#000000"}}>{this.state.frmDate}</Text>
                             </TouchableOpacity>
                            <DatePicker
                                modal
                                mode="date"
                                open={this.state.open1}
                                date={new Date()}
                                maximumDate={new Date()}
                                color="#000000"
                                textColor="#000000"
                                onConfirm={(date) => {
                                    this.handleDatePicked(date) 
                                }}
                                onCancel={() => {
                                // setOpen(false)
                                this.setState({ open1: false})
                                }}
                                
                            />
                            </View>
                            <View >
                                <Text style={{ fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>  {strings('login.coupon_history_toDate')} : </Text>
                            </View>
                            <View style={{  }}>
                                {/* <DatePicker
                                    date={this.state.toDate}
                                    confirmBtnText="Select"
                                    cancelBtnText="Cancel"
                                    // date={moment().clone().startOf('month').format("DD-MM-YYYY")}
                                    mode="date"
                                    format="DD-MM-YYYY"
                                    maxDate={moment().format('DD-MM-YYYY')}
                                    showIcon={false}
                                    onDateChange={(date) => { this.handleDatePicked1(date) }}
                                    customStyles={{
                                        dateInput: {
                                            borderWidth: 0,
                                            alignItems: 'flex-start',
                                            // marginRight: this.props.enableDarkTheme ? 65 : 0,
                                            backgroundColor: 'white'
                                        }
                                    }}
                                    style={{ width: 100 }}
                                /> */}
                                 <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => { this.setState({ open2: true }) }}>
                             <Text style={{ color:"#000000"}}>{this.state.toDate}</Text>
                             </TouchableOpacity>
                              <DatePicker
                                modal
                                mode="date"
                                open={this.state.open2}
                                date={new Date()}
                                maximumDate={new Date()}
                                color="#000000"
                                textColor="#000000"
                                onConfirm={(date) => {

                                    this.handleDatePicked1(date) 
                                }}
                                onCancel={() => {
                                // setOpen(false)
                                this.setState({ open2: false})
                                }}
                            />
                            </View>
                        </View>
                        // <Grid style={{ marginTop: 10, margin: 10 }}>
                        //     <Col>
                        //         <Text style={{ fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.report_history_fromDate')} : </Text>
                        //     </Col>
                        //     <Col style={{ bottom: 7 }}>
                        //         <DatePicker
                        //             date={this.state.frmDate}
                        //             confirmBtnText="Select"
                        //             cancelBtnText="Cancel"
                        //             mode="date"
                        //             format="DD-MM-YYYY"
                        //             maxDate={moment().format('DD-MM-YYYY')}
                        //             showIcon={false}
                        //             onDateChange={(date) => { this.handleDatePicked(date) }}
                        //             customStyles={{
                        //                 dateInput: {
                        //                     borderWidth: 0,
                        //                     alignItems: 'flex-start',
                        //                     marginRight: this.props.enableDarkTheme ? 65 : 0,
                        //                     backgroundColor: 'white',
                        //                 }
                        //             }}
                        //         />
                        //     </Col>
                        //     <Col>
                        //         <Text style={{ fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.report_history_toDate')} : </Text>
                        //     </Col>
                        //     <Col style={{ bottom: 7 }}>
                        //         <DatePicker
                        //             date={this.state.toDate}
                        //             confirmBtnText="Select"
                        //             cancelBtnText="Cancel"
                        //             mode="date"
                        //             format="DD-MM-YYYY"
                        //             maxDate={moment().format('DD-MM-YYYY')}
                        //             showIcon={false}
                        //             onDateChange={(date) => { this.handleDatePicked1(date) }}
                        //             // style={{ width: 90, height: 25, justifyContent: 'center' }}
                        //             customStyles={{
                        //                 dateInput: {
                        //                     borderWidth: 0,
                        //                     alignItems: 'flex-start',
                        //                     marginRight: this.props.enableDarkTheme ? 65 : 0,
                        //                     backgroundColor: 'white'
                        //                 }
                        //             }}
                        //         />
                        //     </Col>
                        // </Grid>
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
                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', marginTop: 20, margin: 10 }} />
                </View>
                {this._displayList()}
                <Modal visible={this.state.modalShowHide} transparent={true}>
                    <View style={{ flex: 1, backgroundColor: "white" }}>
                        {/* <ImageViewer imageUrls={img} enableSwipeDown={true} onCancel={() => { img = [{ url: "", props: { source: "", style: {} } }], this.setState({ modalShowHide: !this.state.modalShowHide }) }} /> */}
                        
                            <FastImage style={{ width: null, height: null, flex: 1 }}
                                source={{ uri: this.state.couponImg, headers: { Authorization: 'someAuthToken' }, priority: FastImage.priority.high, }}
                                resizeMode={FastImage.resizeMode.stretch}
                                onLoadStart={() => this.setState({ loadingForImg: true, })}
                                onLoadEnd={() => this.setState({ loadingForImg: false, })}
                            />
                      
                        <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', marginTop: 0, margin: 10 }} />
                        {/* {this.state.loadingForImgBack ? <ActivityIndicator size="large" color="red" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} /> : */}
                            <FastImage style={{ width: null, height: null, flex: 1 }}
                                source={{ uri: this.state.couponImgBack, headers: { Authorization: 'someAuthToken' }, priority: FastImage.priority.high, }}
                                resizeMode={FastImage.resizeMode.stretch}
                                onLoadStart={() => this.setState({ loadingForImgBack: true, })}
                                onLoadEnd={() => this.setState({ loadingForImgBack: false, })}
                            />
                            {/* } */}
                        {/* <Icon onPress={() => this.setState({ modalShowHide: false })} type="FontAwesome" name="times" style={{ fontSize: 25, color: 'red', paddingRight: 10, marginTop: 10, alignSelf: "flex-end" }} /> */}
                        <Button bordered danger onPress={() => this.setState({ modalShowHide: false })} style={{ justifyContent: "center", alignSelf: "center", marginTop: 10 }}>
                            <Text style={{ textAlign: "center", color: "red", }}>Close</Text>
                        </Button>
                    </View>
                </Modal>
            </View>
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
export default connect(mapStateToProps, null)(ReportHistory)