import React, {Component} from 'react';
import {
  BackHandler,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  Card,
  Text,
  Container,
  Header,
  Left,
  Body,
  Icon,
  Title,
  Right,
} from 'native-base';
import Loader from '../../Utility/Loader';
import App, {URL, APIKEY, ACCESSTOKEN} from '../../App';
var moment = require('moment');
import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
} from 'react-navigation';
import HomeScreen from './HomeScreen';
import HTMLView from 'react-native-htmlview';
import {strings} from '../../locales/i18n';
import {connect} from 'react-redux';
import MyColors from '../../Utility/Colors';
import AsyncStorage from '@react-native-community/async-storage';

const AppNavigator = createStackNavigator({
  AppJSScreen: {screen: HomeScreen, navigationOptions: {header: null}},
});
const AppContainer = createAppContainer(AppNavigator);

class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      deleteItem: false,
      loading: false,
      loaderText: 'Loading...',
      showHideHomeScreen: false,
      carpenterId: '',
      redirecT: false,
      accesstoken: '',
      userType: '',
    };
  }
  showHideHomeScrn = () => {
    // const {userType} = this.state;

    this.setState({showHideHomeScreen: true});

    this.props.navigation.navigate(
      this.state.userType === 6 ? 'CustomerHomeScreen' : 'HomeScreen',
    );
  };

  async getDataFromAPi() {
    await AsyncStorage.multiGet(['USERDATA', 'ACCESSTOKEN'])
      .catch(err => {
        alert('Error');
      })
      .then(res => {
        var lData = JSON.parse(res[0][1]);
        this.setState({accesstoken: res[1][1]});
        this.setState(
          {carpenterId: lData.data.id, userType: lData.data.userType},
          () => {
            const formData = new FormData();
            formData.append('distributorId', this.state.carpenterId);
            if (this.props.languageControl) {
              formData.append('language', 'en');
            } else {
              formData.append('language', 'hi');
            }
            formData.append('userType', this.state.userType);
            this.getNotifications(formData);
          },
        );
      });
  }
  async getNotifications(pFormData) {
    console.log('getNotifications called');

    console.log('getNotifications params', pFormData);

    console.log('accesstoken', this.state.accesstoken);

    console.log('APIKEY', APIKEY);

    this.setState({loading: true});
    var lUrl = URL + 'getNotifications';

    console.log('getNotifications url', lUrl);
    await fetch(lUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        apikey: APIKEY,
        accesstoken: this.state.accesstoken,
      },
      body: pFormData,
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({data: responseJson.notifications, loading: false});
        console.log('notificaton api response', responseJson);
      })
      .catch(error => {
        alert(error);
      });
  }
  componentDidMount() {
    if (this.props.navigation.state.routeName === 'DemoNotificationScreen') {
      console.log('inside notify prop');
      this.setState({redirecT: true});
    } else {
      this.setState({redirecT: false});
    }

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.getDataFromAPi();
  }
  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  handleBackPress = () => {
  this.props.navigation.navigate(
      this.state.userType === 6 ? 'CustomerHomeScreen' : 'HomeScreen',
    );
    return true;
  };
  showNotfyScreen() {
    return (
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        style={{backgroundColor: '#1a1a1a'}}>
        <Header style={{backgroundColor: MyColors.distributorColor}}>
          <Left style={{flex: 0.15}}>
            <TouchableOpacity
              onPress={this.showHideHomeScrn}
              style={{marginLeft: 5}}>
              <Icon
                type="FontAwesome5"
                name="arrow-left"
                style={{fontSize: 18, color: '#FFFFFF', paddingRight: 15}}
              />
            </TouchableOpacity>
          </Left>
          <Body style={{flex: 1, paddingRight: 20}}>
            <Title style={{color: '#FFFFFF', fontSize: 16}}>
              {strings('login.NotificationScreen_title')}
            </Title>
          </Body>
        </Header>

        <Loader loading={this.state.loading} text={this.state.loaderText} />
        <View style={{backgroundColor: 'white', flex: 1, paddingTop: 5}}>
          {this.state.data.length > 0 ?
						this.state.data.map((data, i) => {
							return <Card style={styles.cardContainer} key={i}>
								<Text style={{ fontWeight: 'normal', color: "grey", }}>{moment(data.created_date).format('DD-MMM-YYYY')}</Text>
								<Text style={{ fontWeight: "bold", marginTop: 5, fontSize: 18 }}>{data.title}</Text>
								<HTMLView stylesheet={{ div: { fontSize: 16, } }} value={`<div>${data.notification}</div>`} />
							</Card>
						})
						:
						<Container>
							<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: this.props.enableDarkTheme ? 'black' : 'white' }}>
								<Text style={{ fontSize: 28, color: '#BDBDBD' }}>{strings('login.NotificationScreen_Error')}</Text>
							</View>
						</Container>
					}
        </View>
      </ScrollView>
    );
  }
  showHomeScreen() {
    return (
      <AppContainer
        ref={nav => {
          this.navigator = nav;
        }}
      />
    );
  }
  render() {
    // console.log(this.state.data.length > 0 ? this.state.data[1].notification : []);
    return (
      <View>
        {this.state.showHideHomeScreen
          ? this.state.redirecT
            ? this.showHomeScreen()
            : this.handleBackPress()
          : this.showNotfyScreen()}
        <StatusBar
          backgroundColor={MyColors.distributorColor}
          barStyle="light-content"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  cardContainer: {
    padding: 15,
    // marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  backGroundTextForNoti: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const mapStateToProps = state => {
  return {
    enableDarkTheme: state.VerifierReducer.enableDarkTheme,
    languageControl: state.VerifierReducer.languageEnglish,
  };
};
export default connect(mapStateToProps, null)(NotificationScreen);
