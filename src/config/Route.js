
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import SideMenu from './SideMenu';
import LoginScreen from '../components/Login/LoginScreen';
import SignUpScreen from '../components/Login/SignUpScreen';
import OTPVerification from '../components/Login/OTPVerification';
import HomeScreen from '../components/Home/HomeScreen';
import NotificationScreen from '../components/Home/NotificationScreen';
import ScanScreen from '../components/Scan/ScanScreen';
import HistoryScreen from '../components/History/HistoryScreen';
import ProfileScreen from '../components/Profile/ProfileScreen';
import ReportScreen from '../components/Report/ReportScreen';
import MechanicSignupForm from '../components/Forms/MechanicSignupForm';
import MechanicLoginScreen from '../components/Login/MechanicLoginScreen';
import MechanicOtpVerification from '../components/Login/MechanicOtpVerification';
import MechanicProfileScreen from '../components/Profile/MechanicProfileScreen';
import PaymentDetailsScreen from '../components/Scan/PaymentDetailsScreen';
import ReportHistory from '../components/Report/ReportHistory';
import PassbookScreen from '../components/Verifier/PassbookScreen';
import GiftProductsScreen from '../components/Verifier/GiftProductsScreen';
import ProductsHistoryScreen from '../components/Verifier/ProductsHistoryScreen';
import AllScreen from '../components/Verifier/AllScreen';
import InScreen from '../components/Verifier/InScreen';
import OutScreen from '../components/Verifier/OutScreen';
import GiftProductsDetailsScreen from '../components/Verifier/GiftProductsDetailsScreen';
import ImageSlideScreen from '../components/Verifier/ImageSlideScreen';
import LanguageSelection from './LanguageSelection';
import FingerPrintScannerDemo from '../components/FingerPrintScanner/FingerPrintScannerDemo';
import CashBatchesScreen from '../components/CashBatchesScreen';
import SetPasswordScreen from '../components/Login/setPasswordScreen';
import LandingScreen from '../components/Login/LandingScreen';
import DealerLoginScreen from '../components/DealerComponent/DealerLoginScreen';
import DealerSignupScreen from '../components/DealerComponent/SignupScreen';
import DealerSignUpVerification from '../components/DealerComponent/DealerSignUpVerification';
import DealerOtpScreen from '../components/DealerComponent/DealerOtpScreen';
import DealerProfileScreen from '../components/DealerComponent/DealerProfileScreen';
import DealerScanScreen from '../components/DealerComponent/DealerScanScreen';
import DealerHistoryScreen from '../components/DealerComponent/DealerHistoryScreen';
import DistributorScreen from '../components/DistributoScreen';
import TutorialScreen from '../components/Home/TutorialScreen';
import MyWebView from './MyWebView';
import RemoveAccount from '../components/Profile/RemoveAccount';
import MainScreen from '../components/MainScreen';
import CustomerLoginScreen from '../components/Login/CustomerLoginScreen';
import CustomerSignUpScreen from '../components/CustomerComponent/CustomerSignUpScreen';
import CustomerOtpVerification from '../components/CustomerComponent/CustomerOtpVerification';
import CustomerHomeScreen from '../components/CustomerComponent/CustomerHomeScreen';
import OrderMasterScreen from '../components/CustomerComponent/OrderMasterScreen';
import CustomerProfileScreen from '../components/CustomerComponent/CustomerProfileScreen';
import CustomerOrderHistoryScreen from '../components/CustomerComponent/CustomerOrderHistoryScreen';
import CustomerScanScreen from '../components/CustomerComponent/CustomerScanScreen';
import OrderDetailsScreen from '../components/CustomerComponent/OrderDetailsScreen';



export const Drawer = createDrawerNavigator({
  HomeScreen: { screen: HomeScreen },
  ScanScreen: { screen: ScanScreen },
  HistoryScreen: { screen: HistoryScreen },
  CustomerOrderHistoryScreen: { screen: CustomerOrderHistoryScreen },
  ProfileScreen: { screen: ProfileScreen },
}, {
    ContentComponent: SideMenu,
    drawerWidth: 100,
    drawerPosition: 'right',
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
  });
const MainNavigator = createStackNavigator({
  MainScreen: { screen: MainScreen, navigationOptions: {header: null}},
  LoginScreen: { screen: LoginScreen, navigationOptions: { header: null } },
  CustomerLoginScreen: {screen: CustomerLoginScreen, navigationOptions: {header : null}},
  SignUpScreen: { screen: SignUpScreen, navigationOptions: { header: null } },
  CustomerSignUpScreen: { screen: CustomerSignUpScreen, navigationOptions: { header: null } },
  OTPVerification: { screen: OTPVerification, navigationOptions: { header: null } },
  CustomerOtpVerification: { screen: CustomerOtpVerification, navigationOptions: { header: null } },
  HomeScreen: { screen: HomeScreen, navigationOptions: {
    header: null,
    gesturesEnabled: false, // Disable swipe gesture for HomeScreen
  }},
  CustomerHomeScreen: { screen: CustomerHomeScreen, navigationOptions: { header: null } },
  NotificationScreen: { screen: NotificationScreen, navigationOptions: { header: null } },
  ScanScreen: { screen: ScanScreen, navigationOptions: { header: null } },
  CustomerScanScreen: { screen: CustomerScanScreen, navigationOptions: { header: null } },
  OrderMasterScreen: {screen: OrderMasterScreen , navigationOptions:{header : null}},
  OrderDetailsScreen: {screen: OrderDetailsScreen , navigationOptions: {header : null}},
  HistoryScreen: { screen: HistoryScreen, navigationOptions: { header: null } },
  CustomerOrderHistoryScreen: {screen: CustomerOrderHistoryScreen , navigationOptions: {header: null}},
  ReportScreen: { screen: ReportScreen, navigationOptions: { header: null } },
  ProfileScreen: { screen: ProfileScreen, navigationOptions: { header: null } },
  CustomerProfileScreen: { screen: CustomerProfileScreen, navigationOptions: { header: null } },
  ReportHistory: { screen: ReportHistory, navigationOptions: { header: null } },
  MechanicSignupForm: { screen: MechanicSignupForm, navigationOptions: { header: null } },
  MechanicLoginScreen: { screen: MechanicLoginScreen, navigationOptions: { header: null } },
  MechanicOtpVerification: { screen: MechanicOtpVerification, navigationOptions: { header: null } },
  MechanicProfileScreen: { screen: MechanicProfileScreen, navigationOptions: { header: null } },
  PaymentDetailsScreen: { screen: PaymentDetailsScreen, navigationOptions: { header: null } },
  PassbookScreen: { screen: PassbookScreen, navigationOptions: { header: null } },
  GiftProductsScreen: { screen: GiftProductsScreen, navigationOptions: { header: null } },
  ProductsHistoryScreen: { screen: ProductsHistoryScreen, navigationOptions: { header: null } },
  AllScreen: { screen: AllScreen, navigationOptions: { header: null } },
  InScreen: { screen: InScreen, navigationOptions: { header: null } },
  OutScreen: { screen: OutScreen, navigationOptions: { header: null } },
  GiftProductsDetailsScreen: { screen: GiftProductsDetailsScreen, navigationOptions: { header: null } },
  ImageSlideScreen: { screen: ImageSlideScreen, navigationOptions: { header: null } },
  LanguageSelection: { screen: LanguageSelection, navigationOptions: { header: null } },
  FingerPrintScannerDemo: { screen: FingerPrintScannerDemo, navigationOptions: { header: null } },
  CashBatchesScreen: { screen: CashBatchesScreen, navigationOptions: { header: null } },
  SetPasswordScreen: { screen: SetPasswordScreen, navigationOptions: { header: null } },
  LandingScreen: { screen: LandingScreen, navigationOptions: { header: null } },
  DealerLoginScreen: { screen: DealerLoginScreen, navigationOptions: { header: null } },
  DealerSignupScreen: { screen: DealerSignupScreen, navigationOptions: { header: null } },
  DealerSignUpVerification: { screen: DealerSignUpVerification, navigationOptions: { header: null } },
  DealerOtpScreen: { screen: DealerOtpScreen, navigationOptions: { header: null } },
  DealerProfileScreen: { screen: DealerProfileScreen, navigationOptions: { header: null } },
  DealerScanScreen: { screen: DealerScanScreen, navigationOptions: { header: null } },
  DealerHistoryScreen: { screen: DealerHistoryScreen, navigationOptions: { header: null } },
  DistributorScreen: { screen: DistributorScreen, navigationOptions: { header: null } },
  TutorialScreen: {screen: TutorialScreen, navigationOptions:{ header:null }},
  MyWebView: {screen:MyWebView,navigationOptions:{header:null}},
  RemoveAccount: { screen: RemoveAccount, navigationOptions:{header:null}}


},
  {
    initialRouteName: "LanguageSelection",
    
    // initialRouteName: "LandingScreen",
  }
);
const Route = createAppContainer(MainNavigator);

export default Route;