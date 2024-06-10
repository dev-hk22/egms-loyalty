import React, { Component, useRef } from 'react';
import { BackHandler, TouchableNativeFeedbackBase } from 'react-native';
import { WebView } from 'react-native-webview';

class MyWebView extends Component {
  WEBVIEW_REF = React.createRef();
constructor(props) {
  super(props);
 this.state = {
  canGoBack:false
 }
 this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
}


componentDidMount() {
  BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
}

componentWillUnmount() {
  BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
}

handleBackButtonClick() {
  if (this.state.canGoBack) {
    this.WEBVIEW_REF.current.goBack();
    return true;
 }
};
onNavigationStateChange = (navState) => {
  this.setState({
    canGoBack: true,
  });
}
   

  render() {
    return (
      <View style={{ flex: 1}}>  

      
      <WebView
        source={{uri: 'https://www.google.com'}}
        ref={this.WEBVIEW_REF}
        // ref={WEBVIEW_REF}
        style={{marginTop: 20, flex:1 }}
        allowsBackForwardNavigationGestures={true}
        javaScriptEnabled
        startInLoadingState
        onNavigationStateChange={this.onNavigationStateChange}
        // onNavigationStateChange={(navState)=>{
        //   this.webView.canGoBack = navState.canGoBack;
        //   // this.setState({
        //   //   canGoBack: navState.canGoBack
        //   // })
        // }
      // }
       
      />
      </View>
    );
  }
}
export default MyWebView;