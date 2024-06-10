import React, { Component } from 'react';
import { BackHandler, Image, View, TouchableOpacity, ScrollView, AppState, StyleSheet, AsyncStorage } from 'react-native';
import { Header, Left, Body, Right, Card, CardItem, Text, Title, Button, Icon, Toast, Input } from 'native-base';
import { URL, APIKEY, ACCESSTOKEN } from '../../App';
import { Col, Grid, Row } from "react-native-easy-grid";
var _ = require('lodash');
import { strings } from '../../locales/i18n';
import { connect } from 'react-redux';
import Modal from "react-native-modal";
import CheckBox from "react-native-check-box";
import CircleCheckBox, { LABEL_POSITION } from 'react-native-circle-checkbox';
import Loader from '../../Utility/Loader';

var str = "";
class GiftProductsScreen extends Component {
    constructor(props) {
        super(props);
        this.distributorId;

        this.state = {
            isModalVisible: false,
            isModalVisibleForRange: false,
            appState: AppState.currentState,
            isModalVisibleForSort: false,
            appliances: false,
            automotiveAndAccessories: false,
            bagsAndLuggage: false,
            computersAndAccessories: false,
            electronicsAndDigital: false,
            eVouchers: false,
            fashionAndLifestyle: false,
            mechanicId: "",
            categoriesName: [],
            loaderText: "Loading...",
            loading: false,
            categoriesWithProducts: [],
            checkedCategory: '',
            checked: [],
            search: null,
            categoryIds: [],
            showHideGrid: false,
            searchedText: "",
            aToZ: false,
            mostPopular: false,
            lpLow: false,
            lpHigh: false
        };
    }
    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };
    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        if (this.props.fingerPrintEnable) {
            console.log("payment screen");
            this.props.navigation.navigate('FingerPrintScannerDemo')
            // this.authCurrent();
            setTimeout(() => {
                this._getAsyncData();
            }, 2000);
        } else {
            this._getAsyncData();
        }
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
            }
        );
    }
    _handleAppStateChange = (nextAppState) => {
        console.log("aaya andr");
        this.setState({ appState: nextAppState });
        console.log(nextAppState);

        if (nextAppState === 'background') {
            console.log("aaya andr---111");
            if (this.props.fingerPrintEnable) {
                this.props.navigation.navigate('FingerPrintScannerDemo')
                // this.authCurrent();
            }
        }
    };
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
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
                    this.getCategories();
                    this.getCategoriesWithProducts();
                })
            }
        });
    }
    getCategories = () => {
        this.setState({ loading: true })
        const formData = new FormData();
        formData.append('mechanicId', this.state.mechanicId);

        var lUrl = URL + 'getCategories';
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
                this.setState({ categoriesName: responseJson.data })
            })
            .catch((error) => {
                console.log(error);
            });
    }
    getCategoriesWithProducts = async () => {
        var range = [];
        var sort = 0;
        if (this.state.categoryIds.length > 0) {
            str = this.state.categoryIds.toString()
            str.replace(/[\[\]']/g, '');
        }
        if (this.state.appliances) {
            range.push('0-500')
        } if (this.state.automotiveAndAccessories) {
            range.push('501-750')
        } if (this.state.bagsAndLuggage) {
            range.push('751-1000')
        } if (this.state.computersAndAccessories) {
            range.push('1001-2000')
        } if (this.state.electronicsAndDigital) {
            range.push('2001-5000')
        } if (this.state.eVouchers) {
            range.push('5001-10000')
        } if (this.state.fashionAndLifestyle) {
            range.push('10001-1000000')
        }

        if (this.state.aToZ) {
            sort = 1;
        } else if (this.state.mostPopular) {
            sort = 2;
        } else if (this.state.lpLow) {
            sort = 3;
        } else if (this.state.lpHigh) {
            sort = 4;
        }

        this.setState({ loading: true })
        const formData = new FormData();
        formData.append('mechanicId', this.state.mechanicId);
        formData.append('categories', str);
        if (range.length > 0) {
            for (var i = 0; i < range.length; i++) {
                formData.append('priceRanges[]', range[i]);
            }
        } else {
            formData.append('priceRanges[]', "");
        }
        formData.append('sortingType', sort);
        formData.append('searchKey', this.state.searchedText.trim());
        console.log(formData);

        var lUrl = URL + 'getCategoryWiseProducts';
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
                    this.setState({ categoriesWithProducts: responseJson.data })
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
            })
            .catch((error) => {
                console.log(error);
            });
    }
    setTheCategories = data => {
        console.log(data);
        this.setState = ({ checkedCategory: data.id })
    }
    isItemChecked(abilityName) {
        console.log("data popo");
        return this.state.checked.indexOf(abilityName) > -1
    }

    manageToggle = (evt, abilityName, id) => {
        if (this.isItemChecked(abilityName)) {
            console.log("data popo1");
            const index = this.state.categoryIds.indexOf(id);
            if (index > -1) {
                this.state.categoryIds.splice(index, 1);
            }
            this.setState({
                checked: this.state.checked.filter(i => i !== abilityName)
            })
        } else {
            this.state.categoryIds.push(id)
            this.setState({ checked: [...this.state.checked, abilityName] })
        }
    }
    searchSpace = (event) => {
        console.log(event);

        let keyword = event;
        this.setState({ search: keyword })
    }
    render() {
        // const Information = [
        //     {
        //         "name": "Samule",
        //         "age": 21,
        //         "country": "USA"
        //     },
        //     {
        //         "name": "Sam",
        //         "age": 21,
        //         "country": "USA"
        //     },
        //     {
        //         "name": "Mark",
        //         "age": 21,
        //         "country": "Africa"
        //     },
        // ];
        // const items = Information.filter((data) => {
        //     if (this.state.search == null)
        //         return data
        //     else if (data.name.toLowerCase().includes(this.state.search.toLowerCase()) || data.country.toLowerCase().includes(this.state.search.toLowerCase())) {
        //         return data
        //     }
        // }).map(data => {
        //     return (
        //         <View>
        //             <Text>{data.name}</Text>
        //         </View>
        //     )
        // })
        return (
            <ScrollView style={{ flex: 1, backgroundColor: this.props.enableDarkTheme ? 'black' : 'white' }} keyboardShouldPersistTaps={'handled'}>
                <Loader
                    loading={this.state.loading}
                    text={this.state.loaderText}
                />
                <Header style={{ backgroundColor: '#e43c22', borderBottomColor: 'gray', borderBottomWidth: 1 }}>
                    <Left style={{ flex: 0.2 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('HomeScreen') }}>
                            <Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingRight: 10 }} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{ flex: 1, alignItems: 'center' }}>
                        <Title style={{ color: '#FFFFFF', fontSize: 16 }}>{strings('login.Products')}</Title>
                    </Body>
                    <Right style={{ flex: 0.2 }}>
                        <TouchableOpacity onPress={() => this.setState({ showHideGrid: !this.state.showHideGrid })} style={{ marginTop: 10, marginLeft: 20 }}>
                            {this.state.showHideGrid ?
                                <Icon type="FontAwesome" name="bars" style={{ fontSize: 25, color: 'yellow', paddingRight: 10 }} />
                                :
                                <Icon type="FontAwesome" name="th" style={{ fontSize: 25, color: 'yellow', paddingRight: 10 }} />
                            }
                        </TouchableOpacity>
                    </Right>
                </Header>

                <View style={{ margin: 10 }}>
                    <Grid>
                        <Col style={{ marginLeft: 5 }}>
                            {/* <Input type="text" placeholder="Enter item to be searched" style={{ borderBottomWidth: 1 }} onChangeText={(e) => this.searchSpace(e)} /> */}
                            <Input type="text" value={this.state.searchedText} placeholder={strings('login.enterItemToBeSearched')} style={{ borderBottomWidth: 1, color: this.props.enableDarkTheme ? 'white' : 'black' }} onChangeText={(e) => this.setState({ searchedText: e })} />
                        </Col>
                        <Col size={0.1} style={{ justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => this.setState({ searchedText: "" })}>
                                <Icon type="FontAwesome" name="times" style={{ fontSize: 25, color: 'red' }} />
                            </TouchableOpacity>
                        </Col>
                        <Col size={0.3}>
                            <Button onPress={() => { this.getCategoriesWithProducts() }} style={{ alignSelf: 'center', borderRadius: 20, backgroundColor: '#ff33cc' }}><Text style={{ textAlign: 'center', flex: 1, fontWeight: 'bold' }}> {strings('login.find')} </Text></Button>
                        </Col>
                    </Grid>
                    {/* {items} */}
                </View>

                <Grid>
                    <Row>
                        <Col size={1.1}>
                            <Button success onPress={() => this.setState({ isModalVisible: true })} style={{ width: '80%', alignSelf: 'center', borderRadius: 20 }}>
                                <Text> {strings('login.category')} </Text>
                                {this.state.categoryIds.length > 0 ?
                                    <View style={{ width: 15, height: 15, borderRadius: 60 / 2, backgroundColor: '#ff3355', alignSelf: 'flex-start', right: '50%' }} />
                                    : <View />
                                }
                            </Button>
                        </Col>
                        <Col>
                            <Button info onPress={() => this.setState({ isModalVisibleForRange: true })} style={{ width: '80%', alignSelf: 'center', borderRadius: 20 }}>
                                <Text style={{ textAlign: 'center', flex: 1 }}> {strings('login.range')} </Text>
                                {this.state.appliances || this.state.automotiveAndAccessories || this.state.bagsAndLuggage || this.state.computersAndAccessories || this.state.electronicsAndDigital || this.state.eVouchers || this.state.fashionAndLifestyle ?
                                    <View style={{ width: 15, height: 15, borderRadius: 60 / 2, backgroundColor: '#ff3355', alignSelf: 'flex-start', right: '30%' }} />
                                    : <View />
                                }
                            </Button>
                        </Col>
                        <Col>
                            <Button primary onPress={() => this.setState({ isModalVisibleForSort: true })} style={{ width: '80%', alignSelf: 'center', borderRadius: 20 }}>
                                <Text style={{ textAlign: 'center', flex: 1 }}> {strings('login.sort')} </Text>
                                {this.state.aToZ || this.state.mostPopular || this.state.lpLow || this.state.lpHigh ?
                                    <View style={{ width: 15, height: 15, borderRadius: 60 / 2, backgroundColor: '#ff3355', alignSelf: 'flex-start', right: '30%' }} />
                                    : <View />
                                }
                            </Button>
                        </Col>
                    </Row>
                </Grid>

                <Modal isVisible={this.state.isModalVisibleForSort}>
                    <View style={{ height: 310, }}>
                        <Card style={styles.cardContainer}>
                            <CardItem header >
                                <Text style={{ textAlign: 'center', flex: 1, paddingLeft: 10, fontWeight: 'bold', fontSize: 20 }}>{strings('login.sorting')}</Text>
                                <TouchableOpacity onPress={() => this.setState({ isModalVisibleForSort: false, brandCodeError: '' })}>
                                    <Icon type="FontAwesome" name="times" style={{ fontSize: 25, color: 'red', paddingLeft: 13 }} />
                                </TouchableOpacity>
                            </CardItem>

                            <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey' }} />
                            <View style={{ marginTop: 10 }}></View>
                            <CircleCheckBox
                                checked={this.state.aToZ}
                                onToggle={(checked) => this.setState({ aToZ: checked ? true : false, mostPopular: false, lpLow: false, lpHigh: false })}
                                labelPosition={LABEL_POSITION.RIGHT}
                                label={'A-Z'}
                                styleLabel={{ fontWeight: 'bold', fontSize: 18, }}
                                outerSize={30}
                                outerColor="#66ffff"
                                innerColor="#b3ffff"
                            />
                            <View style={{ marginTop: 5 }}></View>
                            <CircleCheckBox
                                checked={this.state.mostPopular}
                                onToggle={(checked) => this.setState({ mostPopular: checked ? true : false, aToZ: false, lpLow: false, lpHigh: false })}
                                labelPosition={LABEL_POSITION.RIGHT}
                                label={'Most Popular'}
                                styleLabel={{ fontWeight: 'bold', fontSize: 18, }}
                                outerSize={30}
                                outerColor="#66ffff"
                                innerColor="#b3ffff"
                            />
                            <View style={{ marginTop: 5 }}></View>
                            <CircleCheckBox
                                checked={this.state.lpLow}
                                onToggle={(checked) => this.setState({ lpLow: checked ? true : false, mostPopular: false, aToZ: false, lpHigh: false })}
                                labelPosition={LABEL_POSITION.RIGHT}
                                label={'LP: Low to High'}
                                styleLabel={{ fontWeight: 'bold', fontSize: 18, }}
                                outerSize={30}
                                outerColor="#66ffff"
                                innerColor="#b3ffff"
                            />
                            <View style={{ marginTop: 5 }}></View>
                            <CircleCheckBox
                                checked={this.state.lpHigh}
                                onToggle={(checked) => this.setState({ lpHigh: checked ? true : false, lpLow: false, mostPopular: false, aToZ: false })}
                                labelPosition={LABEL_POSITION.RIGHT}
                                label={'LP: High to Low'}
                                styleLabel={{ fontWeight: 'bold', fontSize: 18, }}
                                outerSize={30}
                                outerColor="#66ffff"
                                innerColor="#b3ffff"
                            />
                            <Grid style={{ bottom: 5 }}>
                                <Col>
                                    <Button success onPress={() => this.setState({ aToZ: false, mostPopular: false, lpLow: false, lpHigh: false })} style={{ width: '80%', alignSelf: 'center', borderRadius: 20, marginTop: 20 }}><Text style={{ textAlign: 'center', flex: 1 }}> {strings('login.reset')} </Text></Button>
                                </Col>
                                <Col>
                                    <Button success onPress={() => this.setState({ isModalVisibleForSort: false }, () => this.getCategoriesWithProducts())} style={{ width: '80%', alignSelf: 'center', borderRadius: 20, marginTop: 20 }}><Text style={{ textAlign: 'center', flex: 1 }}> {strings('login.done')} </Text></Button>
                                </Col>
                            </Grid>
                        </Card>
                    </View>
                </Modal>


                <Modal isVisible={this.state.isModalVisibleForRange}>
                    <View style={{ height: 450, }}>
                        <Card style={styles.cardContainer}>
                            <CardItem header >
                                <Text style={{ textAlign: 'center', flex: 1, paddingLeft: 10, fontWeight: 'bold', fontSize: 20 }}>{strings('login.price range')}</Text>
                                <TouchableOpacity onPress={() => this.setState({ isModalVisibleForRange: false, brandCodeError: '' })}>
                                    <Icon type="FontAwesome" name="times" style={{ fontSize: 25, color: 'red', paddingLeft: 13 }} />
                                </TouchableOpacity>
                            </CardItem>
                            <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey' }} />
                            <CheckBox
                                style={{ flex: 1 }}
                                checkedCheckBoxColor="#00ffff"
                                onClick={() => { this.setState({ appliances: !this.state.appliances }) }}
                                isChecked={this.state.appliances}
                                leftText={"0 to 500"}
                                leftTextStyle={{ fontSize: 17 }}
                            />
                            <View style={{ marginTop: 10 }}></View>
                            <CheckBox
                                style={{ flex: 1, }}
                                checkedCheckBoxColor="#00ffff"
                                onClick={() => { this.setState({ automotiveAndAccessories: !this.state.automotiveAndAccessories }) }}
                                isChecked={this.state.automotiveAndAccessories}
                                leftText={"501 to 750"}
                                leftTextStyle={{ fontSize: 17 }}
                            />
                            <CheckBox
                                style={{ flex: 1, }}
                                checkedCheckBoxColor="#00ffff"
                                onClick={() => { this.setState({ bagsAndLuggage: !this.state.bagsAndLuggage }) }}
                                isChecked={this.state.bagsAndLuggage}
                                leftText={"751 to 1000"}
                                leftTextStyle={{ fontSize: 17 }}
                            />
                            <CheckBox
                                style={{ flex: 1, }}
                                checkedCheckBoxColor="#00ffff"
                                onClick={() => { this.setState({ computersAndAccessories: !this.state.computersAndAccessories }) }}
                                isChecked={this.state.computersAndAccessories}
                                leftText={"1001 to 2000"}
                                leftTextStyle={{ fontSize: 17 }}
                            />
                            <CheckBox
                                style={{ flex: 1, }}
                                checkedCheckBoxColor="#00ffff"
                                onClick={() => { this.setState({ electronicsAndDigital: !this.state.electronicsAndDigital }) }}
                                isChecked={this.state.electronicsAndDigital}
                                leftText={"2001 to 5000"}
                                leftTextStyle={{ fontSize: 17 }}
                            />
                            <CheckBox
                                style={{ flex: 1, }}
                                checkedCheckBoxColor="#00ffff"
                                onClick={() => { this.setState({ eVouchers: !this.state.eVouchers }) }}
                                isChecked={this.state.eVouchers}
                                leftText={"5001 to 10,000"}
                                leftTextStyle={{ fontSize: 17 }}
                            />
                            <CheckBox
                                style={{ flex: 1, }}
                                checkedCheckBoxColor="#00ffff"
                                onClick={() => { this.setState({ fashionAndLifestyle: !this.state.fashionAndLifestyle }) }}
                                isChecked={this.state.fashionAndLifestyle}
                                leftText={"10,001 to more"}
                                leftTextStyle={{ fontSize: 17 }}
                            />
                            <Grid style={{ bottom: 5 }}>
                                <Col>
                                    <Button success onPress={() => this.setState({
                                        str: "", appliances: "", automotiveAndAccessories: "", bagsAndLuggage: "", computersAndAccessories: "",
                                        computersAndAccessories: "", electronicsAndDigital: "", eVouchers: "", fashionAndLifestyle: ""
                                    })} style={{ width: '70%', alignSelf: 'center', borderRadius: 20, marginTop: 10 }}><Text style={{ textAlign: 'center', flex: 1 }}> {strings('login.reset')} </Text></Button>
                                </Col>
                                <Col>
                                    <Button success onPress={() => this.setState({ isModalVisibleForRange: false }, () => this.getCategoriesWithProducts())} style={{ width: '70%', alignSelf: 'center', borderRadius: 20, marginTop: 10 }}><Text style={{ textAlign: 'center', flex: 1 }}> {strings('login.done')} </Text></Button>
                                </Col>
                            </Grid>
                        </Card>
                    </View>
                </Modal>

                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{ height: 500, }}>
                        <Card style={styles.cardContainer}>
                            <CardItem header >
                                <Text style={{ textAlign: 'center', flex: 1, paddingLeft: 10, fontWeight: 'bold', fontSize: 20 }}>{strings('login.categories')}</Text>
                                <TouchableOpacity onPress={() => this.setState({ isModalVisible: false, brandCodeError: '' })}>
                                    <Icon type="FontAwesome" name="times" style={{ fontSize: 25, color: 'red', paddingLeft: 13 }} />
                                </TouchableOpacity>
                            </CardItem>
                            <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey' }} />
                            {this.state.categoriesName.length > 0 ?
                                this.state.categoriesName.map((data) => (
                                    <CheckBox
                                        leftText={data.category}
                                        style={{ flex: 1 }}
                                        checkedCheckBoxColor="#00ffff"
                                        // onClick={() => this.setTheCategories(data)}
                                        // isChecked={this.state.checkedCategory}
                                        isChecked={this.isItemChecked(data.category)}
                                        onClick={evt => this.manageToggle(evt, data.category, data.id)}
                                    />
                                ))
                                : <Text style={{ textAlign: 'center', color: 'red' }}>{strings('login.noData')}</Text>
                            }
                            <Grid style={{ bottom: 5 }}>
                                <Col>
                                    <Button success onPress={() => this.setState({ checked: [], categoryIds: [] })} style={{ width: '70%', alignSelf: 'center', borderRadius: 20 }}><Text style={{ textAlign: 'center', flex: 1 }}> {strings('login.reset')} </Text></Button>
                                </Col>
                                <Col>
                                    <Button success onPress={() => this.setState({ isModalVisible: false }, () => this.getCategoriesWithProducts())} style={{ width: '70%', alignSelf: 'center', borderRadius: 20 }}><Text style={{ textAlign: 'center', flex: 1 }}> {strings('login.done')} </Text></Button>
                                </Col>
                            </Grid>
                        </Card>
                    </View>
                </Modal>

                {
                    this.state.categoriesWithProducts.length > 0 ?
                        this.state.categoriesWithProducts.map((data) => (
                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 10, textAlign: 'center', color: this.props.enableDarkTheme ? 'white' : 'black' }}>{data.category}</Text>
                                {this.state.showHideGrid ?
                                    <ScrollView keyboardShouldPersistTaps={'handled'} directionalLockEnabled={false} horizontal={true} showsHorizontalScrollIndicator={false}>
                                        {data.products.map((produ) => (
                                            <Card style={{ backgroundColor: this.props.enableDarkTheme ? '#1a1a1a' : 'white', width: 180, height: 240 }}>
                                                <Image source={{ uri: produ.productImages[0].imagePath }} style={{ width: 130, height: 110, alignSelf: 'center' }} resizeMode="contain" />
                                                <Text style={{ marginTop: 20, textAlign: 'center', fontSize: 18, color: this.props.enableDarkTheme ? 'white' : 'black' }}>
                                                    {/* {produ.productData.name} */}
                                                    {((produ.productData.name).length > 15) ?
                                                        (((produ.productData.name).substring(0, 15)) + '...') :
                                                        produ.productData.name}
                                                </Text>
                                                <Text style={{ textAlign: 'center', fontSize: 20, color: this.props.enableDarkTheme ? 'white' : 'black', fontWeight: 'bold' }}>{produ.productData.loyalty_points_required}</Text>
                                                <Button success onPress={() => this.props.navigation.navigate('GiftProductsDetailsScreen', { productDetails: produ, categoryName: data.category })} style={{ width: '70%', alignSelf: 'center', borderRadius: 20 }}><Text style={{ textAlign: 'center', flex: 1 }}> {strings('login.order')} </Text></Button>
                                            </Card>
                                        ))}
                                    </ScrollView>
                                    :
                                    <ScrollView >
                                        {data.products.map((produ) => (
                                            <Card style={{ backgroundColor: this.props.enableDarkTheme ? '#1a1a1a' : 'white', }}>
                                                {this.props.languageControl == 'Urdu - (اردو)' ?
                                                    <Grid>
                                                        <Col>
                                                            <Image source={{ uri: produ.productImages[0].imagePath }} style={{ width: 130, height: 110, alignSelf: 'center' }} resizeMode="contain" />
                                                        </Col>
                                                        <Col size={2}>
                                                            <Row>
                                                                <Col size={3}>
                                                                    <Text style={{ textAlign: 'right', fontSize: 22, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{produ.productData.name}</Text>
                                                                </Col>
                                                                <Col >
                                                                    <Text style={{ fontSize: 22, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.name')}:</Text>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col size={3}>
                                                                    <Text style={{ textAlign: 'right', fontSize: 22, color: this.props.enableDarkTheme ? 'white' : 'black', fontWeight: 'bold' }}>{produ.productData.loyalty_points_required}</Text>
                                                                </Col>
                                                                <Col>
                                                                    <Text style={{ fontSize: 22, color: this.props.enableDarkTheme ? 'white' : 'black' }}>{strings('login.price')}:</Text>
                                                                </Col>
                                                            </Row>
                                                            <Row style={{ justifyContent: 'center' }}>
                                                                <Button success onPress={() => this.props.navigation.navigate('GiftProductsDetailsScreen', { productDetails: produ, categoryName: data.category })} style={{ marginTop: 10, width: '40%', height: 40, borderRadius: 20, bottom: 5, alignSelf: 'center' }}><Text style={{ textAlign: 'center', flex: 1, }}> {strings('login.order')} </Text></Button>
                                                            </Row>
                                                        </Col>
                                                    </Grid>
                                                    :
                                                    <Grid>
                                                        <Col>
                                                            <Image source={{ uri: produ.productImages[0].imagePath }} style={{ width: 130, height: 110, alignSelf: 'center' }} resizeMode="contain" />
                                                        </Col>
                                                        <Col style={{}} size={2}>
                                                            <Row style={{ marginLeft: 5 }}>
                                                                <Col>
                                                                    <Text style={{ fontSize: 18, color: this.props.enableDarkTheme ? 'white' : 'black', color: "grey" }}>{strings('login.name')}:
                                                                     {" "}<Text style={{ fontSize: 18, color: this.props.enableDarkTheme ? 'white' : 'black', fontWeight: "bold" }}>
                                                                            {((produ.productData.name).length > 21) ?
                                                                                (((produ.productData.name).substring(0, 21)) + '...') :
                                                                                produ.productData.name}
                                                                        </Text></Text>
                                                                    {/* </Col>
                                                                <Col size={3.2}>
                                                                    <Text style={{ fontSize: 18, color: this.props.enableDarkTheme ? 'white' : 'black' }}>
                                                                        {((produ.productData.name).length > 20) ?
                                                                            (((produ.productData.name).substring(0, 20)) + '...') :
                                                                            produ.productData.name}
                                                                    </Text> */}
                                                                </Col>
                                                            </Row>
                                                            <Row style={{ marginLeft: 5 }}>
                                                                <Col>
                                                                    <Text style={{ fontSize: 18, color: this.props.enableDarkTheme ? 'white' : 'black', color: "grey" }}>{strings('login.price')}:
                                                                    {" "}<Text style={{ fontSize: 18, color: this.props.enableDarkTheme ? 'white' : 'black', fontWeight: 'bold' }}>{produ.productData.loyalty_points_required}</Text></Text>
                                                                    {/* </Col>
                                                                <Col size={2.8}> */}
                                                                    {/* <Text style={{ fontSize: 18, color: this.props.enableDarkTheme ? 'white' : 'black', fontWeight: 'bold' }}>{produ.productData.loyalty_points_required}</Text> */}
                                                                </Col>
                                                            </Row>
                                                            <Row style={{ justifyContent: 'center' }}>
                                                                <Button success onPress={() => this.props.navigation.navigate('GiftProductsDetailsScreen', { productDetails: produ, categoryName: data.category })} style={{ marginTop: 10, width: '40%', height: 40, borderRadius: 20, bottom: 5, alignSelf: 'center' }}><Text style={{ textAlign: 'center', flex: 1, }}> {strings('login.order')} </Text></Button>
                                                            </Row>
                                                        </Col>
                                                    </Grid>
                                                }
                                            </Card>
                                        ))}
                                    </ScrollView>
                                }
                                {data.products.length == 0 ?
                                    <Text style={{ textAlign: 'center', color: 'red' }}>{strings('login.noData')}</Text> : <View />
                                }
                            </View>
                        ))
                        : <Text />
                }
            </ScrollView >
        );
    }
}
const styles = StyleSheet.create({
    cardContainer: {
        padding: 15,
        marginLeft: 20,
        marginRight: 20,
        flex: 1
    },

})
const mapStateToProps = (state) => {
    return {
        languageControl: state.VerifierReducer.languageEnglish,
        enableDarkTheme: state.VerifierReducer.enableDarkTheme,
        fingerPrintEnable: state.VerifierReducer.enableFingerPrint
    }
}
export default connect(mapStateToProps, null)(GiftProductsScreen)