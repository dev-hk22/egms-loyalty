import React, { Component } from 'react';
import { AsyncStorage, BackHandler, Image, View, TouchableOpacity, ScrollView } from 'react-native';
import { Header, Left, Body, Right, Card, Text, Title, Toast, Icon } from 'native-base';
import * as utilities from '../../Utility/utilities';
import { URL, APIKEY, ACCESSTOKEN } from '../../App';
import { Col, Grid, Row } from "react-native-easy-grid";
var _ = require('lodash');
import { strings } from '../../locales/i18n';
import I18n from 'react-native-i18n';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import NumericInput from 'react-native-numeric-input'
import Loader from '../../Utility/Loader';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import HomeScreen from '../Home/HomeScreen';

const AppNavigator = createStackNavigator({
    AppJSScreen: { screen: HomeScreen, navigationOptions: { header: null } },
});
const AppContainer = createAppContainer(AppNavigator);

class ProductsHistoryScreen extends Component {
    constructor(props) {
        super(props);
        this.distributorId;

        this.state = {
            mechanicId: "",
            loaderText: "Loading...",
            loading: false,
            productHistoryData: [],
            showHideHomeScreen: false,
            redirecT: false,
            isNoti: false
        };
        console.log("ououououououoouououououoououououououououoouou");
        console.log(this.props.navigation.state);
    }
    showHideHomeScrn = () => {
        if (!this.state.isNoti) {
            this.props.navigation.navigate('HomeScreen')
        } else {
            this.setState({
                showHideHomeScreen: true
            }, () => {
                this.navigator && this.navigator.dispatch({ type: 'Navigate', routeName: "AppJSScreen", params: "hii" });
            })
        }
    }
    componentDidMount() {
        console.log(this.props);
        if (this.props.navigation.state.routeName === "ProductsHistoryScreen") {
            console.log("inside notify prop");
            this.setState({ redirecT: true })
        } else {
            this.setState({ redirecT: false })
        }
        this._getAsyncData();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
            }
        );
    }
    componentWillUnmount() {
        this.willFocusSubscription.remove();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
    handleBackPress = () => {
        this.props.navigation.navigate('HomeScreen')
        return true;
    }
    async _getAsyncData() {
        await AsyncStorage.getItem('USERDATA', (err, result) => {
            var lData = JSON.parse(result);
            if (lData) {
                this.setState({ mechanicId: lData.data.id, userType: lData.data.userType }, () => {
                    this.getProductsHistory();
                })
            }
        });
        await AsyncStorage.getItem('ShowHideScreenWW', (err, result) => {
            console.log("kullu bhai----");
            if (result == null) {
                this.setState({ isNoti: false })
                return;
            }
            var lData = JSON.parse(result);
            console.log(lData.showScreen);
            console.log("kullu bhai1111");
            this.setState({ isNoti: lData.showScreen })

        })
    }
    showToastMsg = (msg) => {
        Toast.show({
            text: msg,
            style: { position: 'absolute', bottom: 150, left: 30, right: 30, borderRadius: 5, margin: 20 },
            duration: 2000
        });
    }
    getProductsHistory = () => {
        this.setState({ loading: true })
        const formData = new FormData();
        formData.append('mechanicId', this.state.mechanicId);

        var lUrl = URL + 'orderHistory';
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
                console.log("=-=-=-=-=-=-");
                console.log(responseJson);
                this.setState({ loading: false })
                if (responseJson.status == 200) {
                    this.setState({ productHistoryData: responseJson.data })
                } else if (responseJson.status == 409) {
                    this.showToastMsg(responseJson.message);
                }
                else if (responseJson.status == 422) {
                    this.showToastMsg(responseJson.message);
                }
                else if (responseJson.status == 400) {
                    this.showToastMsg(responseJson.message);
                }
                else if (responseJson.status == 403) {
                    this.showToastMsg(responseJson.message);
                    this.props.navigation.navigate('LoginScreen')
                }
                else if (responseJson.status == 405) {
                    this.showToastMsg(responseJson.message);
                }
            }).catch((error) => {
                console.log(error);
            });
    }
    showHomeScreen() {
        return (
            <AppContainer ref={nav => { this.navigator = nav; }} />
        )
    }
    showNotfyScreen = () => {
        return (
            <ScrollView style={{ flex: 1, backgroundColor: this.props.enableDarkTheme ? 'black' : 'white' }}>
                <Header style={{ backgroundColor: '#e43c22', borderBottomColor: 'gray', borderBottomWidth: 1 }}>
                    <Left style={{ flex: 0.1 }}>
                        <TouchableOpacity onPress={() => { this.showHideHomeScrn() }}>
                            <Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingRight: 10 }} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{ flex: 0.8, alignItems: 'center' }}>
                        <Title style={{ color: '#FFFFFF', fontSize: 16 }}>{strings('login.productsHistory')}</Title>
                    </Body>
                    <Right style={{ flex: 0.1 }}>
                    </Right>
                </Header>
                <Loader loading={this.state.loading} text={this.state.loaderText} />
                {this.state.productHistoryData.length > 0 ? this.state.productHistoryData.map((data) => (
                    <Card style={{ marginLeft: 10, marginRight: 10, padding: 5, justifyContent: 'center', backgroundColor: this.props.enableDarkTheme ? '#1a1a1a' : 'white' }}>
                        {this.props.languageControl == 'Urdu - (اردو)' ?
                            <Grid>
                                <Row>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Image source={{ uri: data.productImages[0].imagePath }} style={{ width: 95, height: 100, alignSelf: 'center', }} resizeMode="contain" />
                                    </Col>
                                    <Col size={2.8}>
                                        <Grid>
                                            <Row>
                                                <Col>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 20.5, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{data.productData.name}</Text>
                                                </Col>
                                                <Col>
                                                    <Text style={{ flex: 1, textAlign: 'right', color: 'green', fontWeight: 'bold' }}>{data.productData.order_status.toUpperCase()}</Text>
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: 10 }}>
                                                <Col size={3}>
                                                    <Text style={{ textAlign: 'right', fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{data.productData.order_id}</Text>
                                                </Col>
                                                <Col>
                                                    <Text style={{ color: this.props.enableDarkTheme ? 'white' : 'grey' }}>{strings('login.orderNo')} :</Text>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col size={1.5}>
                                                    <Text style={{ textAlign: 'right', fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{data.productData.loyalty_points_required}</Text>
                                                </Col>
                                                <Col>
                                                    <Text style={{ color: this.props.enableDarkTheme ? 'white' : 'grey' }}>{strings('login.pointsConsumed')} :</Text>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col size={2.5}>
                                                    <Text style={{ fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{moment(data.productData.created).format("DD-MMM-YYYY HH:mm:ss")}</Text>
                                                </Col>
                                                <Col>
                                                    <Text style={{ color: this.props.enableDarkTheme ? 'white' : 'grey' }}>{strings('login.orderedOn')} :</Text>
                                                </Col>
                                            </Row>
                                            <View style={{ marginTop: 5 }} />
                                            {/* <Row>
                                        <Text style={{ color: '#33ccff', textAlign: 'right', flex: 1, marginTop: 5, }}>View Details -></Text>
                                    </Row> */}
                                        </Grid>
                                    </Col>
                                </Row>
                            </Grid>
                            :
                            <Grid>
                                <Row>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Image source={{ uri: data.productImages[0].imagePath }} style={{ width: 95, height: 100, alignSelf: 'center', }} resizeMode="contain" />
                                    </Col>
                                    <Col size={2.8}>
                                        <Grid>
                                            <Row>
                                                <Col>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 20.5, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{data.productData.name}</Text>
                                                </Col>
                                                <Col>
                                                    <Text style={{ flex: 1, textAlign: 'right', color: 'green', fontWeight: 'bold' }}>{data.productData.order_status.toUpperCase()}</Text>
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: 10 }}>
                                                <Col>
                                                    <Text style={{ color: this.props.enableDarkTheme ? 'white' : 'grey' }}>{strings('login.orderNo')}<Text style={{ fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>: {data.productData.order_id}</Text></Text>
                                                    {/* </Col>
                                                <Col size={2.7}>
                                                    <Text style={{ fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>: {data.productData.order_id}</Text> */}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Text style={{ color: this.props.enableDarkTheme ? 'white' : 'grey' }}>{strings('login.pointsConsumed')} <Text style={{ fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>: {data.productData.loyalty_points_required}</Text></Text>
                                                    {/* </Col>
                                                <Col size={1}> */}
                                                    {/* <Text style={{ fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>: {data.productData.loyalty_points_required}</Text> */}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Text style={{ color: this.props.enableDarkTheme ? 'white' : 'grey' }}>{strings('login.orderedOn')}<Text style={{ fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>: {moment(data.productData.created).format("DD-MMM-YYYY HH:mm:ss")}</Text></Text>
                                                    {/* </Col>
                                                <Col size={2}>
                                                    <Text style={{ fontWeight: 'bold', color: this.props.enableDarkTheme ? 'white' : 'black' }}>: {moment(data.productData.created).format("DD-MMM-YYYY HH:mm:ss")}</Text> */}
                                                </Col>
                                            </Row>
                                            <View style={{ marginTop: 5 }} />
                                        </Grid>
                                    </Col>
                                </Row>
                            </Grid>
                        }
                    </Card>
                ))
                    : <Text style={{ color: 'grey', fontSize: 30, textAlign: 'center', }}>{strings('login.noData')}</Text>}
            </ScrollView >
        )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.state.showHideHomeScreen ? (this.state.redirecT ? this.showHomeScreen() : this.handleBackPress()) : this.showNotfyScreen()}
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        languageControl: state.VerifierReducer.languageEnglish,
        enableDarkTheme: state.VerifierReducer.enableDarkTheme
    }
}
export default connect(mapStateToProps, null)(ProductsHistoryScreen)