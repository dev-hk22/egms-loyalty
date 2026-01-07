import { Body, Form, Header, Icon, Input, Item, Label, Left, Title } from 'native-base';
import React, { useEffect, useState } from 'react';
import { strings } from '../../locales/i18n';
import { BackHandler, Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../Utility/Colors';
import RNPicker from "rn-modal-picker";
import * as utilities from '../../Utility/utilities';
import LoginService from '../../services/LoginService/LoginService';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../Utility/Loader';
import Modal from "react-native-modal";
import WebView from 'react-native-webview';
import { APIKEY } from '../../App';

const deliveryType = [
    {id : "self_pickup" , name : "Self Pickup"},
    {id : "by_courier" , name : "By Courier"},
];

const {width : deviceWidth , height : deviceHeight} = Dimensions.get('screen');

const OrderMasterScreen = (props) => {

    const [productList , setProductList] = useState([]);
    const [selectedItem , setSelectedItem] = useState(null);
    const [selectedType , setSelectedType] = useState(null);
    const [isLoading , setIsLoading] = useState(false);
    const [pinCode , setPinCode] = useState(0);
    const [quantity , setQuantity] = useState(0);
    const [error , setError] = useState({});
    const [address , setAddress] = useState(null);
    const [cityList , setCityList] = useState(null);
    const [stateList , setStateList] = useState(null);
    const [selectedState , setSelectedState] = useState(null);
    const [selectedCity , setSelectedCity] = useState(null);
    const [stateId , setStateId] = useState(null);
    const [productAmount , setProductAmount] = useState(0);
    const [userData , setUserData] = useState(null);
    const [accessToken , setAccessToken] = useState('');
    const [orderDetails , setOrderDetails] = useState(null);
    const [isMakePayment , setIsMakePayment] = useState(false);
    // const [isModalVisible , setIsModalVisible] = useState(true);

    useEffect(()=>{
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
                stateListApiCall();
                productListApiCall(lData.data.id , lData.data.userType , result[1][1]);
                // console.log("=-=-=-=-][][][][][][][][][][][][][][][][][][][][][][]=-=-=-=-=-=-=-=-=-=>>>>>>>>>??????????????????");
                // console.log(lData.data);
            }
          }
        });
    }

    const handleBackPress = () => {
        props.navigation.navigate('CustomerHomeScreen');
        return true;
    }

    const stateListApiCall = async () => {
        var statesApiObj = new LoginService();
        const formData = new FormData();
        formData.append('countryId', 113);
        await statesApiObj.getStatesByCountry(formData);
        var lResponseData = await statesApiObj.getRespData();
        setStateList(lResponseData.states);
    }
    const cityListApiCall = async (stateId) => {
        var statesApiObj = new LoginService();
        const formData = new FormData();
        formData.append('stateId', stateId);
        await statesApiObj.getCitiesByState(formData);
        var lResponseData = statesApiObj.getRespData();
        setCityList(lResponseData.cities);
        setStateId(stateId);
    }

    const placeOrder = async ()=>{
        setIsLoading(true);
        var statesApiObj = new LoginService();
        const formData = new FormData();
        formData.append('authUserId', Number(userData.id));
        formData.append('productArray', JSON.stringify([{"id": Number(selectedItem.id) ,"qty": Number(quantity)}],null,2));
        // formData.append(,productAmount);
        // formData.append('deliveryInfo', selectedType?.name);

        // if(selectedType?.id == "by_courier"){
        //     formData.append(,selectedCity?.id);
        //     formData.append(,selectedState.id);
        //     formData.append(,address);
        //     formData.append(,pinCode);
        // }

        await statesApiObj.placeCustomerOrder(formData , accessToken);
        var lResponseData = await statesApiObj.getRespData();
        // console.log(JSON.stringify(lResponseData,null,2))

        if (!lResponseData) {
			utilities.showToastMsg('Something went wrong. Please try again later');
		} else if (lResponseData.status == 500 || lResponseData.status == 400) {
			utilities.showToastMsg(lResponseData.message);
		} else if (lResponseData.status == 403) {
			utilities.showToastMsg(lResponseData.message);
			props.navigation.navigate('CustomerLoginScreen');
			AsyncStorage.clear();
			return;
		}
		else if (lResponseData.status == 200) {
            setSelectedItem(null);
            setQuantity(0);
            await handleOrderDetails(lResponseData);
            setIsMakePayment(true);
			// utilities.showToastMsg('Order Place Successfully.');
		} else {
			utilities.showToastMsg('Something went wrong. Please try again later');
		}
        setIsLoading(false);
    }

    const productListApiCall = async (userId , userType , accessTokenAuth) => {
        setIsLoading(true);
        var statesApiObj = new LoginService();
        const formData = new FormData();
        formData.append('authUserId', userId);
        formData.append('userType', userType);
        await statesApiObj.getProductList(formData , accessTokenAuth);
        var lResponseData = await statesApiObj.getRespData();
        console.log(JSON.stringify(lResponseData,null,2))

        if (!lResponseData) {
			utilities.showToastMsg('Something went wrong. Please try again later');
		} else if (lResponseData.status == 500 || lResponseData.status == 400) {
			utilities.showToastMsg(lResponseData.message);
		} else if (lResponseData.status == 403) {
			utilities.showToastMsg(lResponseData.message);
			props.navigation.navigate('CustomerLoginScreen');
			AsyncStorage.clear();
			return;
		}
		else if (lResponseData.status == 200) {
			let proList = lResponseData?.productsData.map(data =>{
                return {id : data.id , name : data.product_name , ...data}
            });
            // console.log(JSON.stringify(proList,null,2))
            setProductList(proList)
		} else {
			utilities.showToastMsg('Something went wrong. Please try again later');
		}
        setIsLoading(false);
    }

    const handleOrderDetails = async (details) =>{
        let finalDetails = {...details.orderData , paymentUrl : details.paymentUrl};
        await setOrderDetails(finalDetails);
    }

    const showHeader = () => {
        if (Platform.OS == 'ios') {
            return (
                <Header style={{ backgroundColor: Colors.distributorColor }}>
                    <Left style={{ flex: 0.1 }}>
                        <TouchableOpacity onPress={() => props.navigation.navigate('CustomerHomeScreen')}>
                            <Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingLeft: 10, paddingRight: 10 }} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{ alignItems: "center" }}>
                        <Title style={{ color: '#FFFFFF', fontSize: 16, marginLeft: -10 }}>{strings('login.sidemenu_makeorder')}</Title>
                    </Body>
                </Header>
            )
        } else {
            return (
                <Header style={{ backgroundColor: Colors.distributorColor }}>
                    <Left style={{ flex: 0.1 }}>
                        <TouchableOpacity onPress={() => props.navigation.navigate('CustomerHomeScreen')}>
                            <Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingLeft: 10, }} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{ alignItems: "center" }}>
                        <Title style={{ color: '#FFFFFF', fontSize: 16, marginLeft: -10 }}>{strings('login.sidemenu_makeorder')}</Title>
                    </Body>
                </Header>
            )
        }
    }

    const onPressButton = async() =>{
        if (!selectedItem?.name) {
			setError({ nameError: strings('login.nameError') ,... error });
			return;
		} else {
			setError({});
		}

        if (quantity <= 0) {
			setError({qunError : 'Quantity cant be blank.',... error})
			return;
		} else {
			setError({});
		}

        if (!selectedType?.name) {
			setError({ typeError: "Delivery Type cant be blank." ,... error });
			return;
		} else {
			setError({});
		}

        if(selectedType?.id == "by_courier"){
            if (address == "" || address == null) {
                setError({ addressError: strings('login.addError') ,... error });
                return;
            } else {
                setError({});
            }

            if (!selectedState?.name) {
                setError({ stateError: strings('login.stateError') ,... error });
                return;
            } else {
                setError({});
            }

            if (!selectedCity?.name) {
                setError({ cityError: strings('login.cityError') ,... error });
                return;
            } else {
                setError({});
            }

            if (pinCode <= 0 || pinCode == null) {
                setError({ pincodeError: "P.O.Box cannot be blank" ,... error });
                return;
            } else {
                setError({});
            }
            
        }
        
        await placeOrder();
    }

    const handleWebViewNavigationStateChange = (newNavState) => {
		console.log("=-==-=-=-=-=-==-==-=-=-=-=-==-==-=-=-=-=-==-==-=-=-=-=-==-==-=-=-=-=-==-==-=-=-=-=-==-==-=-=-=-=-==-==-=-=-=-=-==-==-=-=-=-=-==-==-=-=-=-=-=");
		console.log(newNavState);
        setIsLoading(newNavState.loading);
	}

    const renderMakePayment =(paymentUrl) =>{
        return(
          <WebView 
              source={{
                  uri : paymentUrl,
                  headers: {
                    'Content-Type': 'multipart\/form-data',
                    'apikey': APIKEY,
                    'accesstoken': accessToken
                  }
              }}
              onNavigationStateChange={handleWebViewNavigationStateChange}
              renderLoading={() => (
                  <Loader
                      loading={isLoading}
                      text={"Loading..."}
                  />
              )}
              onMessage={event => {
                  console.log(" on message  " , event);
                  if(event?.nativeEvent?.data === "success"){
                    props.navigation.navigate('CustomerOrderHistoryScreen');
                  }
                  setProductAmount(0);
                  setIsMakePayment(false);
              }}
          />
        )
    }

    // const handlePlaceOrderResModal = () =>{
    //     return(
    //         <Modal
    //             isVisible={isModalVisible}
    //             deviceWidth={deviceWidth}
    //             deviceHeight={deviceHeight}
    //             onSwipeComplete={() => setIsModalVisible(false)}
    //             avoidKeyboard={true}
    //             // onSwipeCancel={handleModal}
    //             swipeDirection={['up', 'left', 'right', 'down']}
    //             style={{
    //                 margin : 0,
    //                 justifyContent : 'flex-end',
    //             }}
    //         >
    //             <View style={styles.modalContainer}>
    //                 <Label style={{ color: 'black' ,textAlign : 'center' , fontSize : 17,color : 'green',fontWeight : '700'}}>Order placed Successfully.</Label>
                    
    //                 <View style={{ marginVertical : 10 ,flexDirection: 'row'}} >
    //                     <Text style={{ fontSize: 14, color: 'black', paddingRight: 3,  fontWeight : '700'}}>Order ID :</Text>
    //                     <Text style={{ fontSize: 14, color: 'black' }}>{''}</Text>
    //                 </View>
                    
    //                 <View style={{
    //                     flexDirection : 'row',
    //                     justifyContent : 'space-between'
    //                 }}>
    //                     <TouchableOpacity onPress={() => {onPressButton()}} 
    //                         style={{
    //                             borderWidth : 1,
    //                             width : '48%'
    //                         }}
    //                     >
    //                         <Text style={{}}>ORDER AGAIN</Text>
    //                     </TouchableOpacity>
    //                     <TouchableOpacity onPress={() => {onPressButton()}} 
    //                         style={{
    //                             borderWidth : 1,
    //                             width : '48%'
    //                         }}
    //                     >
    //                         <Text style={{}}>CANCEL</Text>
    //                     </TouchableOpacity>

    //                 </View>

    //             </View>
    //         </Modal>
    //     )
    // }
    
    return (
        !isMakePayment ? 
        <ScrollView style={{ flex: 1, }} keyboardShouldPersistTaps={"handled"}>
            <Loader
                loading={isLoading}
                text={"Loading ..."}
            />
            {showHeader()}
            <Form>
                
                <Label style={{ color: 'black', fontSize: 16, paddingLeft: 15, marginTop: 15, fontSize: 16 }}>{strings('login.prodName')}*:</Label>
                <View style={{ width: '100%', alignSelf: "center", marginTop: 10,paddingHorizontal: 10 }}>
                    <RNPicker
                        dataSource={productList}
                        dummyDataSource={productList}
                        // defaultValue={true}
                        pickerTitle={"Select Product"}
                        pickerItemTextStyle={{
                            color: "#000",
                            borderBottomWidth: 0.5,
                            borderBottomColor: 'grey',
                            marginVertical: 10,
                            flex: 0.9,
                            marginHorizontal: 10,
                            textAlign: "left"
                        }}
                        showSearchBar={true}
                        disablePicker={false}
                        changeAnimation={"none"}
                        searchBarPlaceHolder={"Search....."}
                        showPickerTitle={true}
                        selectedLabel={selectedItem?.name || ''}
                        placeHolderLabel={"Select Product"}
                        selectedValue={(index, item) => { setSelectedItem(item);setError({}) }}
                    />
                    {error?.nameError ? <Text style={{ color: "red", textAlign: "center" }}>{error?.nameError}</Text> : <View />}
                </View>

                <Item stackedLabel style={{marginHorizontal : 15,marginTop : 15}}>
                    <Label style={{ color: 'black' }}>{strings('login.quantityRe')}*</Label>
                    <Input
                        autoFocus={true}
                        value={quantity}
                        keyboardType='numeric'
                        style={{ marginTop: 20,color: 'black', borderWidth : 1,borderRadius : 4 , height : 43}}
                        // onFocus={() => { this.setState({ borderBottomColorUserName: '#50CAD0' }) }}
                        // onBlur={() => { this.setState({ borderBottomColorUserName: '#757575' }); }}
                        onChangeText={(quantity) => {setQuantity(quantity);setError({});setProductAmount(quantity*Number(selectedItem?.cost_per_coupon || 0))}}
                    />
                </Item>
                {error?.qunError ? <Text style={{ color: "red", textAlign: "center" }}>{error?.qunError}</Text> : <View />}


                <Label style={{ color: 'black', fontSize: 16, paddingLeft: 15, marginTop: 15, fontSize: 16 }}>Delivery Type*:</Label>
                <View style={{ width: '100%', alignSelf: "center", marginTop: 10,paddingHorizontal: 10 }}>
                    <RNPicker
                        dataSource={deliveryType}
                        dummyDataSource={deliveryType}
                        // defaultValue={true}
                        pickerTitle={"Select Type"}
                        pickerItemTextStyle={{
                            color: "#000",
                            borderBottomWidth: 0.5,
                            borderBottomColor: 'grey',
                            marginVertical: 10,
                            flex: 0.9,
                            marginHorizontal: 10,
                            textAlign: "left"
                        }}
                        showSearchBar={true}
                        disablePicker={false}
                        changeAnimation={"none"}
                        searchBarPlaceHolder={"Search....."}
                        showPickerTitle={true}
                        selectedLabel={selectedType?.name || ''}
                        placeHolderLabel={"Select Type"}
                        selectedValue={(index, item) => { setSelectedType(item);setError({}) }}
                    />
                    {error?.typeError ? <Text style={{ color: "red", textAlign: "center" }}>{error?.typeError}</Text> : <View />}
                </View>

                <Label style={{ color: 'black' ,marginHorizontal : 15,marginTop : 15,color : 'red',fontSize : 14}}>{`Product Charges : ${productAmount} KES ${selectedType?.id == "by_courier" ? `+ Delivery Charges` : ''}`}</Label>

                { selectedType?.id == "by_courier" ? 
                <>
                    <Item stackedLabel style={{marginHorizontal : 15,marginTop : 15}}>
                        <Label style={{ color: 'black' }}>{strings('login.profile_distributor_address')}*</Label>
                        <Input
                            autoFocus={true}
                            value={address}
                            // keyboardType='numeric'
                            style={{ marginTop: 20,color: 'black', borderWidth : 1,borderRadius : 4 , height : 43}}
                            // onFocus={() => { this.setState({ borderBottomColorUserName: '#50CAD0' }) }}
                            // onBlur={() => { this.setState({ borderBottomColorUserName: '#757575' }); }}
                            onChangeText={(address) => {setAddress(address);setError({})}}
                        />
                    </Item>
                    {error?.addressError ? <Text style={{ color: "red", textAlign: "center" }}>{error?.addressError}</Text> : <View />}

                    <Label style={{ color: 'black', fontSize: 16, paddingLeft: 15, marginTop: 20, fontSize: 16 }}>{strings('login.state')}*:</Label>
                    <View style={{ width: '100%', alignSelf: "center", marginTop: 10,paddingHorizontal: 10 }}>
                        <RNPicker
                            dataSource={stateList}
                            dummyDataSource={stateList}
                            // defaultValue={true}
                            pickerTitle={"Select State"}
                            pickerItemTextStyle={{
                                borderBottomWidth: 0.5,
                                borderBottomColor: 'grey',
                                marginVertical: 10,
                                marginHorizontal: 10,
                                textAlign: "left"
                            }}
                            showSearchBar={true}
                            disablePicker={false}
                            changeAnimation={"none"}
                            searchBarPlaceHolder={"Search....."}
                            showPickerTitle={true}
                            selectedLabel={selectedState?.name}
                            placeHolderLabel={"Select State"}
                            selectedValue={(index, item) => { cityListApiCall(item.id), setSelectedState(item);setError({}); }}
                        />
                        {error?.stateError ? <Text style={{ color: "red", textAlign: "center", }}>{error?.stateError}</Text> : <View />}
                    </View>

                    <Label style={{ color: 'black', fontSize: 16, paddingLeft: 15, marginTop: 20, fontSize: 16 }}>{strings('login.city')}*:</Label>
                    <View style={{ width: '100%', alignSelf: "center", marginTop: 10,paddingHorizontal: 10 }}>
                        <RNPicker
                            dataSource={cityList}
                            dummyDataSource={cityList}
                            // defaultValue={true}
                            pickerTitle={"Select City"}
                            pickerItemTextStyle={{
                                color: "#000",
                                borderBottomWidth: 0.5,
                                borderBottomColor: 'grey',
                                marginVertical: 10,
                                flex: 0.9,
                                marginHorizontal: 10,
                                textAlign: "left"
                            }}
                            showSearchBar={true}
                            disablePicker={false}
                            changeAnimation={"none"}
                            searchBarPlaceHolder={"Search....."}
                            showPickerTitle={true}
                            selectedLabel={selectedCity?.name}
                            placeHolderLabel={"Select City"}
                            selectedValue={(index, item) => { setSelectedCity(item);setError({}); }}
                        />
                        {error?.cityError ? <Text style={{ color: "red", textAlign: "center", }}>{error?.cityError}</Text> : <View />}
                    </View>

                    <Item stackedLabel style={{marginHorizontal : 15,marginTop : 15}}>
                        <Label style={{ color: 'black' }}>{strings('login.profile_screen_pobox_field')}*</Label>
                        <Input
                            autoFocus={true}
                            value={pinCode}
                            keyboardType='numeric'
                            style={{ marginTop: 20,color: 'black', borderWidth : 1,borderRadius : 4 , height : 43}}
                            // onFocus={() => { this.setState({ borderBottomColorUserName: '#50CAD0' }) }}
                            // onBlur={() => { this.setState({ borderBottomColorUserName: '#757575' }); }}
                            onChangeText={(address) => {setAddress(address);setError({})}}
                        />
                    </Item>
                    {error?.pincodeError ? <Text style={{ color: "red", textAlign: "center" }}>{error?.pincodeError}</Text> : <View />}

                </> : null}
            

                <TouchableOpacity onPress={() => {onPressButton()}}>
                    <View style={styles.buttonSignUp}>
                        {/* <LinearGradient colors={[COLORS.distributorColor]} style={styles.linearGradient}> */}
                            <Text style={styles.buttonTextSignUp}>PAY</Text>
                        {/* </LinearGradient> */}
                    </View>
                </TouchableOpacity>
            </Form>

        </ScrollView>
        : 
        renderMakePayment(orderDetails?.paymentUrl) 
    );
}

const styles = StyleSheet.create({
    buttonSignUp: {
		marginTop: 40,
        marginHorizontal : 30,
		// marginBottom: 50,
		backgroundColor: Colors.distributorColor,
		borderRadius: 5,
		flex: 1
	},
    buttonTextSignUp: {
		padding: 10,
		color: 'white',
		textAlign: 'center',
		fontWeight: 'bold',
	},
    modalContainer : {
        backgroundColor : 'white',
        padding : 10,
        paddingVertical : 20,
        borderTopRightRadius : 8,
        borderTopLeftRadius : 8,
    },
})

export default OrderMasterScreen;
