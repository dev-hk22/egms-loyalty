import React, { useEffect } from 'react';
import { BackHandler, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../Utility/Colors';
import AsyncStorage from '@react-native-community/async-storage';
import * as app from '../../App';

const {width: deviceWidth , height: deviceHeight} = Dimensions.get('screen');

const MainScreen = (props) => {

    useEffect(()=>{
        getUserData();
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        }; 
    },[])

    const handleBackPress = () => {
        BackHandler.exitApp();
        return true;
    }

    const getUserData = async ()=>{
        await AsyncStorage.getItem('USERDATA', (err, result) => {
          var lData = JSON.parse(result);
          if (lData) {
            if (lData.data) {
              console.log("=-=-=-=-][][][][][][][][][][][][][][][][][][][][][][]=-=-=-=-=-=-=-=-=-=>>>>>>>>>??????????????????");
              console.log(lData.data);
            //   this.props.setLoginData(lData.data)
              app.ACCESSTOKEN = lData.data.accesstoken;
              if(lData.data?.userType == 5){
                props.navigation.navigate('CustomerHomeScreen');
              }else{
                props.navigation.navigate('HomeScreen');
              }
            }
          }
        });
      }

    return (
        <View style={{
            flex : 1,
            justifyContent : 'center',
            alignContent : 'center',
            alignItems : 'center'
        }}>
            <View style={styles.container}>
                <Image
                    style={{ width: 'auto', height: 400 }}
                    resizeMode="contain"
                    source={require("../images/wwe.png")}
                />
                <View style={{marginTop: 20 }}>
                    <TouchableOpacity
                        onPress={() => {props.navigation.navigate('CustomerLoginScreen')}}
                    >
                        <View style={styles.buttonVerifier}>
                        <Text style={styles.buttonText}>OFFICER LOGIN</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {props.navigation.navigate('LoginScreen')}}
                    >
                        <View style={styles.buttonInstitute}>
                        <Text style={styles.buttonText}>PUBLIC VERIFIER </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
    },
    buttonVerifier: {
        width: 300,
        alignItems: "center",
        backgroundColor: Colors.distributorColor,
        borderRadius: 30
    },
    buttonStudent: {
        marginTop: 10,
        width: 300,
        alignItems: "center",
        borderRadius: 30,
        backgroundColor: Colors.distributorColor
    },
    buttonInstitute: {
        marginTop: 10,
        marginBottom: 30,
        width: 300,
        alignItems: "center",
        borderRadius: 30,
        backgroundColor: Colors.distributorColor
    },
    buttonText: {
        padding: 15,
        color: "white",
        fontWeight: "bold",
        fontSize: 15
    }
})

export default MainScreen;
