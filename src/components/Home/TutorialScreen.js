import React, { Component } from 'react';
import {  BackHandler, StyleSheet, View, ScrollView, TouchableOpacity, StatusBar,Dimensions } from 'react-native';
import { Card, Text, Container, Header, Left, Body, Icon, Title, Right } from 'native-base';
import Loader from '../../Utility/Loader';
import App, { URL, APIKEY, ACCESSTOKEN } from '../../App';
var moment = require('moment');
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import HomeScreen from './HomeScreen';
import HTMLView from 'react-native-htmlview';
import { strings } from '../../locales/i18n';
import { connect } from 'react-redux';
import MyColors from '../../Utility/Colors';
import AsyncStorage from '@react-native-community/async-storage';
// import Pdf from 'react-native-pdf';

export class TutorialScreen extends Component {

    constructor(props) {
		super(props);
		this.language = this.props.navigation.state.params.language;
		this.state = {
			data: [],
			loading: false,
			loaderText: 'Loading...',
			accesstoken:"",
			userType: '',
            carpenterId:''
		};

        
	}

    async getDataFromAPi() {
		await AsyncStorage.multiGet(['USERDATA','ACCESSTOKEN'])
			.catch(err => { alert("Error") })
			.then(res => {
				var lData = JSON.parse(res[0][1]);
				this.setState({ accesstoken : res[1][1]});
				this.setState({ carpenterId: lData.data.id, userType: lData.data.userType }, () => {
					const formData = new FormData();
					formData.append('carpenterId', this.state.carpenterId);
					if (this.props.languageControl) {
						formData.append('language', this.language);
					}
					//  else {
					// 	formData.append('language', 'hin');
					// }
					formData.append("userType",this.state.userType);
					console.log(formData);
					console.log(this.state.accesstoken+"====="+this.state.carpenterId+"===="+this.state.userType);
					this.getTutorial(formData);
				})
			})
	}

    async getTutorial(pFormData) {
		this.setState({ loading: true })
		var lUrl = URL + 'getTutorial';
		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY,
				'accesstoken': this.state.accesstoken
			},
			body: pFormData,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({ loading: false })
				console.log("url",responseJson);
				if(responseJson.status == 200)
				{
				this.setState({ data: responseJson.url, loading: false });
				console.log("url",responseJson);
				}
			})
			.catch((error) => {
				alert(error)
			});
	};

    componentDidMount() {
		
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
		this.getDataFromAPi();
	}
	componentWillUnMount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
	}
	handleBackPress = () => {
		this.props.navigation.navigate('HomeScreen');
		return true;
	}

    showNotfyScreen() {
		const source = { uri:encodeURI(this.state.data), cache:false };
		// const source = { uri: 'https://seqrloyalty.com/magicgrip/magicgrip_eng.pdf', cache:false };
		return (
			<ScrollView keyboardShouldPersistTaps={'handled'} style={{ backgroundColor: '#1a1a1a', }}>
				<Header style={{ backgroundColor:  MyColors.distributorColor  }}>
					<Left style={{ flex: 0.15, }}>
						<TouchableOpacity onPress={this.handleBackPress} style={{ marginLeft: 5 }}>
							<Icon type="FontAwesome5" name="arrow-left" style={{ fontSize: 18, color: '#FFFFFF', paddingRight: 15 }} />
						</TouchableOpacity>
					</Left>
					<Body style={{ flex: 1, paddingRight: 20 }}>
						<Title style={{ color: '#FFFFFF', fontSize: 18, }}>User Manual</Title>
					</Body>
				</Header>

				<Loader loading={this.state.loading} text={this.state.loaderText} />
				<View style={{ backgroundColor: "white", flex: 1, paddingTop: 5 }}>
					
						
							{/* <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: this.props.enableDarkTheme ? 'black' : 'white' }}>
								<Text style={{ fontSize: 28, color: '#BDBDBD' }}>{strings('login.NotificationScreen_Error')}</Text>
							</View> */}
							 <ScrollView >
                                {/* <Pdf
									source={ source }
									onLoadComplete={(numberOfPages, filePath) => {
										console.log(`number of pages: ${numberOfPages}`);
									}}
									onPageChanged={(page, numberOfPages) => {
										console.log(`current page: ${page}`);
									}}
									onError={(error) => {
										console.log(error);
									}}
									style={styles.pdf} /> */}
                    </ScrollView>
					
					
				</View>
			</ScrollView>
		)
	}


  render() {
    return (
        <View>
        { this.showNotfyScreen() } 
        <StatusBar backgroundColor={  MyColors.distributorColor  } barStyle="light-content" />
        
    </View>
    )
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f2f2f2'
	},
	cardContainer: {
		padding: 15,
		// marginTop: 20,
		marginLeft: 10,
		marginRight: 10
	},
	backGroundTextForNoti: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	pdf: {
        flex:1,
        // height: Dimensions.get('window').height - 200,
        // width: Dimensions.get('window').width
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height-100,
    }
});
const mapStateToProps = (state) => {
	return {
		// enableDarkTheme: state.VerifierReducer.enableDarkTheme,
		languageControl: state.VerifierReducer.languageEnglish,
	}
}
export default connect(mapStateToProps, null)(TutorialScreen)