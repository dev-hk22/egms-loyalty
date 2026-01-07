import React, { Component } from 'react';
import { StatusBar,BackHandler,  View, Image, ScrollView } from 'react-native';
import { Button, Text, Icon } from 'native-base';
import * as app from '../../App';
import SplashScreen from 'react-native-splash-screen';
import MyColors from '../../Utility/Colors';
import AsyncStorage from '@react-native-community/async-storage';

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        SplashScreen.hide()
    }
    componentDidMount = () => {
        this.getUserData()
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

   
    componentWillUnmount() {
        
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
      
    }
    handleBackPress = () => {
        BackHandler.exitApp();
        return true;
    }

    
    async getUserData() {
        await AsyncStorage.getItem('USERDATA', (err, result) => {
            var lData = JSON.parse(result);
            if (lData) {
                if (lData.data.id) {
                    console.log("=-=-=-=-][][][][][][][][][][][][][][][][][][][][][][]=-=-=-=-=-=-=-=-=-=>>>>>>>>>??????????????????");
                    console.log(lData.data);
                    app.ACCESSTOKEN = lData.data.accesstoken;
                    this.props.navigation.navigate('HomeScreen');
                }
            }
        });
    }
    render() {
        return (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: "center" }}>
                <StatusBar backgroundColor={MyColors.distributorColor} barStyle="light-content" />
                {/* <Image style={{ width: 100, height: 100,margin: 10, alignSelf:'flex-start' }} resizeMode='contain' source={require('../../images/small_logo.jpg')} /> */}
                
                <Image style={{ width: "100%", height: 250, marginLeft:20,marginRight:20,marginTop:100 }} resizeMode='contain' source={require('../../images/wwe.png')} />
               
                <View style={{ flex: 1, justifyContent: "center", marginTop:100 }}>
                <Button onPress={() => this.props.navigation.navigate("LoginScreen")} style={{ alignSelf:'center' ,backgroundColor: MyColors.distributorColor, width: 320, marginTop: 25, borderRadius: 20, height: 50 }}>
                        <Text uppercase={false} style={{ fontSize: 16, }}>Login as Karigar</Text>
                        <Icon type="FontAwesome5" name="arrow-right" style={{ fontSize: 18, color: MyColors.white, }} />
                    </Button>

                    <Button onPress={() => this.props.navigation.navigate("DealerLoginScreen")} style={{ backgroundColor: MyColors.dealerColor, width: 320,marginTop: 25, borderRadius: 20, height: 50 }}>
                        <Text uppercase={false} style={{ fontSize: 16 }}>Register as New Karigar</Text>
                        <Icon type="FontAwesome5" name="arrow-right" style={{ fontSize: 18, color: MyColors.white, }} />
                    </Button>
                    
                </View>
                
            </ScrollView>
        )
    }
}