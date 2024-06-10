import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './config/store';
import { PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Root } from "native-base";
import { MenuProvider } from 'react-native-popup-menu';
import Route from '../src/config/Route';
// import firebase from 'react-native-firebase';
import messaging from '@react-native-firebase/messaging';
// import { Notification, NotificationOpen, RemoteMessage } from 'react-native-firebase';
import 'react-native-gesture-handler';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import NotificationScreen from './components/Home/NotificationScreen';
import ProductsHistoryScreen from './components/Verifier/ProductsHistoryScreen';
import { RESULTS, checkNotifications, requestNotifications } from 'react-native-permissions';

const AppNavigator = createStackNavigator({
  DemoNotificationScreen: { screen: NotificationScreen, navigationOptions: { header: null } },
});
const AppNavigator1 = createStackNavigator({
  ProductsHistoryScreen: { screen: ProductsHistoryScreen, navigationOptions: { header: null } },
});
const AppContainer = createAppContainer(AppNavigator);
const AppContainer1 = createAppContainer(AppNavigator1);

var userTypeee = 0;
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHideNotifyScreen: false,
      showHideProductsHistoryScreen: false
    }
    this._getPermission()
    this.getAsyncData();
    AsyncStorage.setItem('ShowHideScreenWW', JSON.stringify({ "showScreen": false }));
  }

  getFireBaseToken = async () => {

    await messaging().getToken()
    .then(fcmToken => {
      FCMTOKEN = fcmToken;
      console.log('------fcmToken' ,fcmToken)
      AsyncStorage.setItem('FCMTOKEN', JSON.stringify({ fcmToken: fcmToken }));
    });
    
    await checkNotifications().then(async ({status, settings}) => {
      if (status !== RESULTS.GRANTED) {
        if(Platform.OS === 'android'){
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
        }else{
          requestNotifications(['alert', 'sound']).then(({status, settings}) => {
            console.log("====requestNotifications",status)
          });
        }
      }
    });

    // firebase.messaging().getToken()
    // .then(fcmToken => {
    //   FCMTOKEN = fcmToken;
    //   console.log('------fcmToken' ,fcmToken)
    //   AsyncStorage.setItem('FCMTOKEN', JSON.stringify({ fcmToken: fcmToken }));
    // });
    
    // await checkNotifications().then(async ({status, settings}) => {
    //   console.log("=======status",status)
    //   if (status !== RESULTS.GRANTED) {
    //     console.log("=======status if",status)
    //     await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    //     );
    //   }
    // });
  }

  _getPermission = () => {
    // firebase.messaging()
    //   .requestPermission()
    //   .catch(error => {
    //     // alert("No permission for firebase")
    //     console.log("No permission for firebase");
    //     this._getPermission();
    //   });
  }
  async getAsyncData() {
    await AsyncStorage.multiGet(['ACCESSTOKEN'], (err, result) => {
      // var lData = JSON.parse(result[0][1]);
      var lData = result[0][1];
      if (lData) {
        console.log(lData.ACCESSTOKEN);
        ACCESSTOKEN = lData;
      }
    });
    await AsyncStorage.getItem('USERDATA', (err, result) => {
      var lData = JSON.parse(result);
      if (lData) {
        console.log("lData of app.js");
        console.log(lData);
        if (lData.data) {
          userTypeee = lData.data.userType;
          // this.setState({ userType: lData.data.userType }, () => {
          // })
        }
      }
    });
  }
  componentWillUnmount() {
    // this.removeNotificationOpenedListener();
    // this.removeNotificationListener();
  }
  componentDidMount = async () => {
    // if (Platform.OS == 'ios') {
      // this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
      //   const notification = new firebase.notifications.Notification()
      //     .setNotificationId(message._messageId)
      //     .setTitle('KARIGAR Super Bond')
      //     .setBody('Notification')
      //     .setData({
      //       key1: 'value1',
      //       key2: 'value2',
      //     });
      //   firebase.notifications().displayNotification(notification)
      // });
    // }
    this.getFireBaseToken();

    // this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
    //   console.log("qwertyuiopasdfghjklzxcvbnm=-=-=-=-=-=-=-=-=-=-=-=-=-=-=>>>>>>>>>>>>>>>>>>>>>>");
    //   if (userTypeee === 0) {
    //     console.log("111111111111111111");
    //     console.log(ACCESSTOKEN);
    //     if (ACCESSTOKEN) {
    //       this.setState({ showHideNotifyScreen: true })
    //       console.log("aaya bannnn");
    //       this.navigator && this.navigator.dispatch({ type: 'Navigate', routeName: "DemoNotificationScreen", pramas: "bangdu" });
    //     } else {
    //       this.setState({ showHideNotifyScreen: false })
    //       return;
    //     }
    //   } else {
    //     console.log("1111111111111111155555555555");
    //     this.setState({ showHideProductsHistoryScreen: true })
    //     AsyncStorage.setItem('ShowHideScreenWW', JSON.stringify({ "showScreen": true }));
    //     this.navigator && this.navigator.dispatch({ type: 'Navigate', routeName: "ProductsHistoryScreen", pramas: "bangdu" });
    //   }
    // });

    // this.removeNotificationListener = firebase.notifications().onNotification((notification: Notification) => {
    //   console.log("ooooooooooooooooooooooooooooo");
    //   console.log(notification);

    //   // if (notification) {
    //   //   const { title, body } = notification;
    //   //   const channelId = new firebase.notifications.Android.Channel('Test Channel', 'Test Channel', firebase.notifications.Android.Importance.High);
    //   //   firebase.notifications().android.createChannel(channelId);
    //   //   console.log("notification.android._notification._data");
    //   //   console.log(notification.android._notification._data);

    //   //   let notification_to_be_displayed = new firebase.notifications.Notification({
    //   //     data: notification.android._notification._data,
    //   //     sound: 'default',
    //   //     show_in_foreground: true,
    //   //     lights: true,
    //   //     title: title,
    //   //     body: body,
    //   //   });
    //   //   if (Platform.OS == 'android') {
    //   //     notification_to_be_displayed
    //   //       .android.setPriority(firebase.notifications.Android.Priority.High)
    //   //       .android.setChannelId('Test Channel')
    //   //       .android.setVibrate(1000)
    //   //       // .android.setSmallIcon(require('../src/images/Logo.jpg'))
    //   //       // .android.setBigText()
           
    //   //   }
    //   //   firebase.notifications()
    //   //     .displayNotification(notification_to_be_displayed)
    //   //     .catch(err => console.log(err))
    //   // }
    // });
  }
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Root>
            <MenuProvider>
              {this.state.showHideNotifyScreen ?
                <AppContainer ref={nav => { this.navigator = nav; }} />
                :
                this.state.showHideProductsHistoryScreen ?
                  <AppContainer1 ref={nav => { this.navigator = nav; }} />
                  :
                  <Route />
              }
            </MenuProvider>
          </Root>
        </PersistGate>
      </Provider>
    );
  }
};


export const URL = "https://seqrloyalty.com/kebs/api/"; //live url


export const HEADER = {
  Accept: 'application\/json',
  'Content-Type': 'multipart\/form-data',
};
// export const APIKEY = 'pFqDf7vuaOQ[87yF6D:=2OqjE*wa:0';
export const APIKEY = 'iWM(E?dV4M^bNaZeGbJsB2V(0Cjs};';
export var ACCESSTOKEN = '';
export var FCMTOKEN = '';
export var scanQRData = [];
export var scanSeQRData = [];
export var redeemHistoryCash = [];
export var redeemHistoryScheme = [];
export var ISNETCONNECTED = true;
export var BADGECOUNT = 0;
export var notificationData = [];
export function setValue(newValue: Boolean) {
  ISNETCONNECTED = newValue;
}