import React, { Component } from 'react';
import { AsyncStorage, ScrollView } from 'react-native';
import { Card, Text, Toast } from 'native-base';
import { URL, APIKEY, ACCESSTOKEN } from '../../App';
import { Col, Grid, Row } from "react-native-easy-grid";
var _ = require('lodash');
import { strings } from '../../locales/i18n';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from '../../Utility/Loader';

class AllScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mechanicId: "",
            loaderText: "Loading...",
            loading: false,
            getAllData: []
        };
    }
    componentDidMount() { this._getAsyncData(); }
    async _getAsyncData() {
        await AsyncStorage.getItem('USERDATA', (err, result) => {
            var lData = JSON.parse(result);
            if (lData) {
                this.setState({ mechanicId: lData.data.id, userType: lData.data.userType }, () => {
                    this.getAllData();
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
    getAllData = () => {
        this.setState({ loading: true })
        const formData = new FormData();
        formData.append('mechanicId', this.state.mechanicId);
        console.log(formData);


        var lUrl = URL + 'getPassbook';
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
                    this.setState({ getAllData: responseJson.data })
                    this.props.getLoyaltyPointsWallet(responseJson.loyaltyPointsWallet)
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
    render() {
        return (
            <ScrollView style={{ flex: 1, backgroundColor: this.props.enableDarkTheme ? 'black' : 'white' }}>
                <Loader loading={this.state.loading} text={this.state.loaderText} />
                {this.state.getAllData.length > 0 ? this.state.getAllData.map((data) => (
                    <Card style={{ marginLeft: 5, marginRight: 5, height: 75, paddingLeft: 10, paddingRight: 10, paddingTop: 5 }}>
                        {this.props.languageControl == 'Urdu - (اردو)' ?
                            <Grid>
                                <Row>
                                    <Col size={0.5}>
                                        <Text style={{ color: data.flag == 0 ? 'red' : 'green', textAlign: "right", fontWeight: 'bold', fontSize: 18 }}>{data.flag == 0 ? '-' : '+'}{data.loyalty_points}</Text>
                                    </Col>
                                    <Col size={3}>
                                        <Text style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 18 }}>{data.reference_id}</Text>
                                    </Col>
                                    <Col size={0.8}>
                                        <Text style={{ color: 'grey', fontSize: 18, textAlign: "right" }}>{data.flag == 0 ? strings('login.orderNumber') : `: ${strings('login.couponSrNo')}`}</Text>
                                    </Col>
                                </Row>
                                <Col>
                                    <Text style={{ fontWeight: 'bold', color: 'grey' }}>{moment(data.created).format("DD-MMM-YYYY HH:mm:ss")}</Text>
                                </Col>
                            </Grid>
                            :
                            <Grid>
                                <Row>
                                    <Col size={data.flag == 0 ? 0.4 : 0.23}>
                                        <Text style={{ color: 'grey', fontSize: 18 }}>{data.flag == 0 ? strings('login.orderNumber') : strings('login.couponSrNo')}:</Text>
                                    </Col>
                                    <Col >
                                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{data.reference_id}</Text>
                                    </Col>
                                    <Col size={0.2}>
                                        <Text style={{ color: data.flag == 0 ? 'red' : 'green', textAlign: "right", fontWeight: 'bold', fontSize: 18 }}>{data.flag == 0 ? '-' : '+'}{data.loyalty_points}</Text>
                                    </Col>
                                </Row>
                                <Col style={{ marginTop: 15 }}>
                                    <Text style={{ fontWeight: 'bold', color: 'grey' }}>{moment(data.created).format("DD-MMM-YYYY HH:mm:ss")}</Text>
                                </Col>
                            </Grid>
                        }

                    </Card>
                )) : <Text style={{ color: 'grey', fontSize: 30, textAlign: 'center', }}>{strings('login.noData')}</Text>}
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
export default connect(mapStateToProps, null)(AllScreen)