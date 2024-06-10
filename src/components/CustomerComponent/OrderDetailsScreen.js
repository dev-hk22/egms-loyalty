import React, { useEffect, useState } from 'react';
import { BackHandler, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../config/colors';
import moment from 'moment';
import { FlatList } from 'react-native';
import { Body, Header, Icon, Left, ListItem, Title } from 'native-base';
import Colors from '../../Utility/Colors';
import { strings } from '../../locales/i18n';
import AsyncStorage from '@react-native-community/async-storage';

const dummyData = [
    {
        order_status : 'Accepted',
        created_at : '2024-05-29 18:16:23.182107',
        status_desc : 'Completed'
    },
    {
        order_status : 'Pending',
        created_at : '2024-05-28 18:16:23.182107',
        status_desc : 'Pending'
    }
];

const OrderDetailsScreen = (props) => {

    const [userData , setUserData] = useState(null);
    const [accessToken , setAccessToken] = useState('');

    useEffect(()=>{
        // console.log("========props",props.data);
        getUserData();
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        }; 
    },[])

    const getUserData = async ()=>{
        await AsyncStorage.multiGet(['USERDATA','ACCESSTOKEN'], (err, result) => {
          var lData = JSON.parse(result[0][1]);
          console.log(result[1][1]);
          if (lData) {
            if (lData.data) {
                setAccessToken(result[1][1]);
                setUserData(lData.data);
                // console.log("=-=-=-=-][][][][][][][][][][][][][][][][][][][][][][]=-=-=-=-=-=-=-=-=-=>>>>>>>>>??????????????????");
                // console.log(lData.data);
            }
          }
        });
    }

    const handleBackPress = () => {
        props.navigation.navigate('CustomerOrderHistoryScreen');
        return true;
    }

    const renderOrderStatus = () =>{
        return (
            <>
            <Text style={{ fontSize: 15, color: 'black',marginVertical: 20,fontWeight : '700'}}>Order Status:</Text>
            <View style={{backgroundColor : "#F8F8F8", padding : 10,borderRadius : 8,marginBottom: 10}}>
                <View style={styles.status}>
                    <View style={styles.verticalLine} />
                    <FlatList
                        data={dummyData}
                        keyExtractor={(item) => item.created_at.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.statusItem}>
                                <View style={[styles.circle , {backgroundColor : COLORS[item.order_status.toLowerCase()]}]} />
                                <View style={styles.content}>
                                    <View>
                                        <Text
                                            style={{
                                                fontSize : 14,
                                                lineHeight : 26,
                                                color : COLORS[item.order_status.toLowerCase()],
                                                // marginVertical : 10,
                                                fontWeight : 'normal'
                                            }}
                                        >{item.order_status}</Text>
                                        <Text
                                            style={{
                                                fontSize : 13,
                                                lineHeight : 22,
                                                color : '#000',
                                                // marginVertical : 10,
                                                fontWeight : 'normal'
                                            }}
                                        >{moment(item.created_at).format('LLL')}</Text>
                                        <Text
                                            style={{
                                                fontSize : 13,
                                                lineHeight : 22,
                                                color : '#000',
                                                // marginVertical : 10,
                                                fontWeight : 'bold'
                                            }}
                                        >{item.status_desc}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </View>
            </View>
            </>
        )
    }

    const showHeader = () => {
        if (Platform.OS == 'ios') {
            return (
                <Header style={{ backgroundColor: Colors.distributorColor }}>
                    <Left style={{ flex: 0.1 }}>
                        <TouchableOpacity onPress={() => props.navigation.navigate('CustomerOrderHistoryScreen')}>
                            <Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingLeft: 10, paddingRight: 10 }} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{ alignItems: "center" }}>
                        <Title style={{ color: '#FFFFFF', fontSize: 16, marginLeft: -10 }}>{strings('login.orderDetails')}</Title>
                    </Body>
                </Header>
            )
        } else {
            return (
                <Header style={{ backgroundColor: Colors.distributorColor }}>
                    <Left style={{ flex: 0.1 }}>
                        <TouchableOpacity onPress={() => props.navigation.navigate('CustomerOrderHistoryScreen')}>
                            <Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingLeft: 10, }} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{ alignItems: "center" }}>
                        <Title style={{ color: '#FFFFFF', fontSize: 16, marginLeft: -10 }}>{strings('login.orderDetails')}</Title>
                    </Body>
                </Header>
            )
        }
    }

    const renderOrderDetails = ()=>{
        return(
            <View style={{backgroundColor : '#F8F8F8',borderRadius : 8}}>
                <ListItem style={{ flexDirection: 'column', alignItems: 'flex-start', borderBottomWidth : 0}}>
                    <View style={{ flex: 1, flexDirection: 'row', }}>
                        <View style={{ flex: 0.8, flexDirection: 'row'}} >
                            <Text style={{ fontSize: 14, color: 'black', paddingRight: 3,  fontWeight : '700'}}>{strings('login.orderId')}:</Text>
                            <Text style={{ fontSize: 14, color: 'black' }}>{`ORDER_1717060115`}</Text>
                        </View>
                        <View style={{ flex: 0.2, flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, color: 'green' }}>{`200`} </Text>
                            <Text style={{ fontSize: 14, color: 'green', paddingRight: 3,  }}>KSh</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1,flexDirection: 'row',marginVertical : 10}} >
                        <Text style={{ fontSize: 14, color: 'black', paddingRight: 3,  fontWeight : '700'}}>{strings('login.prodName')}:</Text>
                        <Text style={{ fontSize: 14, color: 'black' }}>{`Import Standardization Mark`}</Text>
                    </View>
                    <View style={{ flex: 1 ,flexDirection: 'row'}} >
                        <Text style={{ fontSize: 14, color: 'black', paddingRight: 3,  fontWeight : '700'}}>Transaction ID:</Text>
                        <Text style={{ fontSize: 14, color: 'black' }}>{`1708031724431131`}</Text>
                    </View>
                    <View style={{ flex: 1,flexDirection: 'row',marginVertical : 10}} >
                        <Text style={{ fontSize: 14, color: 'black', paddingRight: 3,  fontWeight : '700'}}>{strings('login.orderdate')}:</Text>
                        <Text style={{ fontSize: 14, color: 'black' }}>{moment('2024-05-30 14:38:35').format('LLL')}</Text>
                    </View>
                    <View style={{ flex: 1,flexDirection: 'row' }}>
                        <Text style={{ fontSize: 14, color: 'black', paddingRight: 3,  fontWeight : '700'}}>{strings('login.status')}:</Text>
                        <Text style={{ fontSize: 14, color:'green' }}>{`Approved`}</Text>
                    </View>
                </ListItem>
            </View>
        )
    }

    return (
        <SafeAreaView>
            {showHeader()}
            <ScrollView style={{paddingBottom : 60, paddingVertical : 10,paddingHorizontal : 20}}>
                {renderOrderDetails()}
                {renderOrderStatus()}
                
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    status: {
        position: "relative",
    },
    verticalLine: {
        position: "absolute",
        backgroundColor: "lightgray",
        width: 1,
        height: "100%",
        left: 30,
        zIndex: -1,
    },
    statusItem: {
        flexDirection: "row",
        // alignItems: "center",
        marginBottom: 20,
        marginLeft: 10,
        paddingLeft: 10,
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 20,
        backgroundColor: "lightgray",
        justifyContent: "center",
        alignItems: "center",
        marginTop : 4,
        marginRight: 15,
    },
    content: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
})

export default OrderDetailsScreen;
