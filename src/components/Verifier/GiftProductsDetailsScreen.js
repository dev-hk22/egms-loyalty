import React, { Component } from 'react';
import { AsyncStorage, BackHandler, Image, View, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Header, Left, Body, Right, Card, Toast, Text, Title, Button, Icon } from 'native-base';
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
import ImageSlideScreen from './ImageSlideScreen';
import Loader from '../../Utility/Loader';

// var quantityOfProduct = 1
class GiftProductsDetailsScreen extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.navigation.state.params);

        this.state = {
            amount: this.props.navigation.state.params.productDetails.productData.loyalty_points_required,
            productData: this.props.navigation.state.params.productDetails.productData,
            productImages: this.props.navigation.state.params.productDetails.productImages,
            mechanicId: "",
            categoryName: this.props.navigation.state.params.categoryName,
            isMax: false,
            valueOfQuantity: 1,
            loaderText: "Loading...",
            loading: false,
            productID: this.props.navigation.state.params.productDetails.productData.id,
            quantityOfProduct: 1
        };
    }
    componentDidMount() {
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
        this.props.navigation.navigate('GiftProductsScreen')
        return true;
    }
    async _getAsyncData() {
        await AsyncStorage.getItem('USERDATA', (err, result) => {
            var lData = JSON.parse(result);
            if (lData) {
                this.setState({ mechanicId: lData.data.id, userType: lData.data.userType }, () => {
                })
            }
        });
    }
    showToastMsg = (msg) => {
        Toast.show({
            text: msg,
            style: { position: 'absolute', bottom: 150, left: 30, right: 30, borderRadius: 5, margin: 20 },
            duration: 2000
        });
    }
    placeOrder = () => {
        this.setState({ loading: true })
        const formData = new FormData();
        formData.append('mechanicId', this.state.mechanicId);
        formData.append('productId', this.state.productID);
        formData.append('quantity', this.state.quantityOfProduct);
        console.log(formData);

        var lUrl = URL + 'orderProduct';
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
                    this.showToastMsg(responseJson.message);
                    this.props.navigation.navigate('ProductsHistoryScreen')
                } else if (responseJson.status == 409) {
                    this.showToastMsg(responseJson.message);
                } else if (responseJson.status == 422) {
                    this.showToastMsg(responseJson.message);
                } else if (responseJson.status == 400) {
                    this.showToastMsg(responseJson.message);
                } else if (responseJson.status == 403) {
                    this.showToastMsg(responseJson.message);
                    this.props.navigation.navigate('LoginScreen')
                } else if (responseJson.status == 405) {
                    this.showToastMsg(responseJson.message);
                } else if (responseJson.status == 404) {
                    this.showToastMsg(responseJson.message);
                    return;
                }
            }).catch((error) => {
                console.log(error);
            });
    }
    valueChangeFn = valu => {
        this.setState({ quantityOfProduct: valu })
        var amt = this.props.navigation.state.params.productDetails.productData.loyalty_points_required;
        if (this.state.valueOfQuantity < valu) {
            this.setState({ valueOfQuantity: valu, amount: parseInt(this.state.amount) + parseInt(amt) })
        } else if (this.state.valueOfQuantity > valu) {
            this.setState({ valueOfQuantity: valu, amount: parseInt(this.state.amount) - parseInt(amt) })
        }
    }
    render() {
        console.log(this.state.quantityOfProduct);
        
        return (
            <ScrollView style={{ flex: 1, backgroundColor: this.props.enableDarkTheme ? 'black' : 'white' }}>
                <Loader
                    loading={this.state.loading}
                    text={this.state.loaderText}
                />
                <Header style={{ backgroundColor: '#e43c22', borderBottomColor: 'gray', borderBottomWidth: 1 }}>
                    <Left style={{ flex: 0.1 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('GiftProductsScreen') }}>
                            <Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingRight: 10 }} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{ flex: 0.8, alignItems: 'center' }}>
                        <Title style={{ color: '#FFFFFF', fontSize: 16 }}>{strings('login.detailsPage')}</Title>
                    </Body>
                    <Right style={{ flex: 0.1 }}>
                    </Right>
                </Header>
                <View>
                    <Card style={{ marginLeft: 5, marginRight: 5, height: Dimensions.get('window').height / 1.20, marginTop: 20, backgroundColor: this.props.enableDarkTheme ? '#1a1a1a' : 'white' }}>
                        <ImageSlideScreen productDetails={this.state.productImages.length > 0 ? this.state.productImages : "yo bro"} />
                        <View style={{ margin: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 28, textAlign: 'center', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{this.state.productData.name}</Text>

                            <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 7, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.category')} :</Text>
                            <Text style={{ marginLeft: 5, marginTop: 2, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{this.state.categoryName}</Text>

                            <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 10, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.description')} :</Text>
                            <Text style={{ marginLeft: 5, marginTop: 2, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{this.state.productData.description}</Text>

                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.quantityRe')} :</Text>
                            </View>

                            <View style={{ marginTop: 10 }}>
                                <NumericInput
                                    value={this.state.quantityOfProduct}
                                    onChange={value => this.valueChangeFn(value)}
                                    onLimitReached={(isMax, msg) => {
                                        this.setState({ isMax: isMax })
                                    }}
                                    // initValue={1}
                                    maxValue={5}
                                    totalHeight={30}
                                    step={1}
                                    rounded
                                    editable={false}
                                    minValue={1}
                                    textColor='#B0228C'
                                    iconStyle={{ color: 'white' }}
                                    rightButtonBackgroundColor='#EA3788'
                                    leftButtonBackgroundColor='#E56B70' />
                            </View>

                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.lpsRe')} :</Text>
                                <Text style={{ fontSize: 18, marginLeft: 5, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{this.state.amount}</Text>
                            </View>
                        </View>
                        <Button success onPress={() => this.placeOrder()} style={{ width: '30%', alignSelf: 'center', borderRadius: 20, marginTop: 10 }}><Text style={{ textAlign: 'center', flex: 1 }}> {strings('login.order')} </Text></Button>
                    </Card>
                </View>
            </ScrollView>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        languageControl: state.VerifierReducer.languageEnglish,
        enableDarkTheme: state.VerifierReducer.enableDarkTheme
    }
}
export default connect(mapStateToProps, null)(GiftProductsDetailsScreen)