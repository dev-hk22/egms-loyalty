import React, { Component } from 'react';
import { BackHandler, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Header, Left, Body, Right, Card, Text, Title, Tab, Tabs, Icon } from 'native-base';
var _ = require('lodash');
import { strings } from '../../locales/i18n';
import { connect } from 'react-redux';
import AllScreen from './AllScreen';
import InScreen from './InScreen';
import OutScreen from './OutScreen';

class PassbookScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            points: 0
        }
    }
    componentDidMount() {
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
    getLoyaltyPointsWallet = points => {
        this.setState({ points: points })
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: this.props.enableDarkTheme ? 'black' : 'white' }}>
                <Header style={{ backgroundColor: '#e43c22', borderBottomColor: 'gray', borderBottomWidth: 1 }}>
                    <Left style={{ flex: 0.1 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('HomeScreen') }}>
                            <Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingRight: 10 }} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{ flex: 0.8, alignItems: 'center' }}>
                        <Title style={{ color: '#FFFFFF', fontSize: 16 }}>{strings('login.passBook')}</Title>
                    </Body>
                    <Right style={{ flex: 0.1 }}>
                    </Right>
                </Header>

                <Card style={{ marginLeft: 10, marginRight: 10, backgroundColor: this.props.enableDarkTheme ? '#1a1a1a' : 'white' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 30, textAlign: 'center', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{this.state.points}</Text>
                    <Text style={{ textAlign: 'center', color: 'red', fontWeight: 'bold' }}>{strings('login.currentPo')}</Text>
                </Card>
                <Tabs>
                    <Tab heading={strings('login.allScreen')} tabStyle={{ backgroundColor: this.props.enableDarkTheme ? 'black' : 'blue' }} textStyle={{ color: '#fff' }} activeTabStyle={{ backgroundColor: this.props.enableDarkTheme ? '#1a1a1a' : 'blue' }} activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                        <AllScreen getLoyaltyPointsWallet={this.getLoyaltyPointsWallet} />
                    </Tab>

                    <Tab heading={strings('login.inScreen')} tabStyle={{ backgroundColor: this.props.enableDarkTheme ? 'black' : 'blue' }} textStyle={{ color: '#fff' }} activeTabStyle={{ backgroundColor: this.props.enableDarkTheme ? '#1a1a1a' : 'blue' }} activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                        <InScreen />
                    </Tab>

                    <Tab heading={strings('login.outScreen')} tabStyle={{ backgroundColor: this.props.enableDarkTheme ? 'black' : 'blue' }} textStyle={{ color: '#fff' }} activeTabStyle={{ backgroundColor: this.props.enableDarkTheme ? '#1a1a1a' : 'blue' }} activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                        <OutScreen />
                    </Tab>
                </Tabs>
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
export default connect(mapStateToProps, null)(PassbookScreen)