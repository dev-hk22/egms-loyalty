// import React, {useState} from 'react';

// import {
//     SafeAreaView,
//     StyleSheet,
//     Text,
//     View,
//     PermissionsAndroid,
//     Alert,
//     Platform,
//     TouchableHighlight,
//     Image,
//   } from 'react-native';
  
// import * as ImagePicker from "react-native-image-picker"
// import { CameraScreen } from 'react-native-camera-kit';

// const FileUpload = () => {
//     const [isPermitted, setIsPermitted] = useState(false);
//     const [captureImages, setCaptureImages] = useState([]);
//     const [image,setImage] = useState("");

//     const requestCameraPermission = async () => {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.CAMERA,
//             {
//               title: 'Camera Permission',
//               message: 'App needs camera permission',
//             },
//           );
//           // If CAMERA Permission is granted
//           return granted === PermissionsAndroid.RESULTS.GRANTED;
//         } catch (err) {
//           console.warn(err);
//           return false;
//         }
//       };

//       const requestExternalWritePermission = async () => {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//             {
//               title: 'External Storage Write Permission',
//               message: 'App needs write permission',
//             },
//           );
//           // If WRITE_EXTERNAL_STORAGE Permission is granted
//           return granted === PermissionsAndroid.RESULTS.GRANTED;
//         } catch (err) {
//           console.warn(err);
//           alert('Write permission err', err);
//         }
//         return false;
//       };

//       const requestExternalReadPermission = async () => {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//             {
//               title: 'Read Storage Permission',
//               message: 'App needs Read Storage Permission',
//             },
//           );
//           // If READ_EXTERNAL_STORAGE Permission is granted
//           return granted === PermissionsAndroid.RESULTS.GRANTED;
//         } catch (err) {
//           console.warn(err);
//           alert('Read permission err', err);
//         }
//         return false;
//       };

//       const openCamera = async () => {
//         if (Platform.OS === 'android') {
//           if (await requestCameraPermission()) {
//             if (await requestExternalWritePermission()) {
//               if (await requestExternalReadPermission()) {
//                 setIsPermitted(true);
//               } else alert('READ_EXTERNAL_STORAGE permission denied');
//             } else alert('WRITE_EXTERNAL_STORAGE permission denied');
//           } else alert('CAMERA permission denied');
//         } else {
//           setIsPermitted(true);
//         }
//       };

//       const chooseImage = () => {
//         let options = {
//           title: 'Select Image',
//           customButtons: [
//             { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
//           ],
//           storageOptions: {
//             skipBackup: true,
//             path: 'images',
//           },
//         };
//         ImagePicker.launchImageLibrary(options,(response) =>{
//           console.log('Response1 = ', response);
//         // });
//         // ImagePicker.showImagePicker(options, (response) => {
//         //   console.log('Response = ', response);
    
//           if (response.didCancel) {
//             console.log('User cancelled image picker');
//           } else if (response.error) {
//             console.log('ImagePicker Error: ', response.error);
//           } else if (response.customButton) {
//             console.log('User tapped custom button: ', response.customButton);
//             alert(response.customButton);
//           } else {
//             const source = { uri: response.uri };
    
//             // You can also display the image using data:
//             // const source = { uri: 'data:image/jpeg;base64,' + response.data };
//             // alert(JSON.stringify(response));s
//             console.log('response', JSON.stringify(response));
//             // setImage({
//             //   filePath: response,
//             //   fileData: response.data,
//             //   fileUri: response.assets[0].uri,
//             // });
//             setImage(response.assets[0].uri);
//             // console.log(response.assets[0].uri);
//           }
//         });
//       }
    
//       const onBottomButtonPressed = (event) => {
//         const images = JSON.stringify(event.captureImages);
//         if (event.type === 'left') {
//           setIsPermitted(false);
//         } else if (event.type === 'right') {
//           setIsPermitted(false);
//           setCaptureImages(images);
//         } else {
//           Alert.alert(
//             event.type,
//             images,
//             [{text: 'OK', onPress: () => console.log('OK Pressed')}],
//             {cancelable: false},
//           );
//         }
//       };

//       return (
//         <SafeAreaView style={{flex: 1}}>
//           {isPermitted ? (
//              <View style={styles.container}>
//              <Text style={styles.titleText}>Profile Photo</Text>
//              <Image style={styles.image} 
//                source= {{ uri : image}}
//               />
//              <Text style={styles.textStyle}>{captureImages}</Text>
//              <View>
//                <TouchableHighlight
//                    onPress={openCamera}
//                    style={styles.buttonStyle}
//                >
//                    <Text style={styles.buttonTextStyle}>Open Camera</Text>
//                </TouchableHighlight>
//                <TouchableHighlight
//                    onPress={() => chooseImage()}
//                    style={styles.buttonStyle}
//                >
//                    <Text style={styles.buttonTextStyle}>Select Photo</Text>
//                </TouchableHighlight>
//              </View>
//            </View>
//             ) : (
//             <View style={{flex: 1}}>
//               <CameraScreen
//                 // Buttons to perform action done and cancel
//                 actions={{
//                   rightButtonText: 'Done',
//                   leftButtonText: 'Cancel'
//                 }}
//                 onBottomButtonPressed={
//                   (event) => onBottomButtonPressed(event)
//                 }
//                 flashImages={{
//                   // Flash button images
//                   on: require('../../images/flashon.png'),
//                   off: require('../../images/flashoff.png'),
//                   auto: require('../../images/flashauto.png'),
//                 }}
//                 cameraFlipImage={require('../../images/flip.png')}
//                 captureButtonImage={require('../../images/capture.png')}
//               />
//             </View>
//         //   ) : (
//         //     <View style={styles.container}>
//         //       <Text style={styles.titleText}>Profile Photo</Text>
//         //       <Image style={styles.image} 
//         //         source= {{ uri : image}}
//         //        />
//         //       <Text style={styles.textStyle}>{captureImages}</Text>
//         //       <View>
//         //         <TouchableHighlight
//         //             onPress={openCamera}
//         //             style={styles.buttonStyle}
//         //         >
//         //             <Text style={styles.buttonTextStyle}>Open Camera</Text>
//         //         </TouchableHighlight>
//         //         <TouchableHighlight
//         //             onPress={() => chooseImage()}
//         //             style={styles.buttonStyle}
//         //         >
//         //             <Text style={styles.buttonTextStyle}>Select Photo</Text>
//         //         </TouchableHighlight>
//         //       </View>
//         //     </View>
//           )}
//         </SafeAreaView>
//          );
//         };
        
//         const styles = StyleSheet.create({
//           container: {
//             flex: 1,
//             backgroundColor: 'white',
//             padding: 10,
//              alignItems: 'center',
//           },
//           titleText: {
//             fontSize: 22,
//             textAlign: 'center',
//             fontWeight: 'bold',
//           },
//           textStyle: {
//             color: 'black',
//             fontSize: 16,
//             textAlign: 'center',
//             padding: 10,
//           },
//           buttonStyle: {
//             fontSize: 16,
//             color: 'white',
//             backgroundColor: 'green',
//             padding: 5,
//             marginTop: 20,
//             minWidth: 250,
//           },
//           buttonTextStyle: {
//             padding: 5,
//             color: 'white',
//             textAlign: 'center',
//           },
//           image: {
//             marginTop: 20,
//             width: 200,
//             height: 200,
//             borderWidth: 2,
//             // borderColor: '#000000',
//           }
//         });

// export default FileUpload;