import { Body, Col, Grid, Header, Icon, Row } from 'native-base';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MyColors from '../../Utility/Colors';

const TermsOfService = (props) => {

    const showHeader = () => {
        if (Platform.OS == 'ios') {
            return (
                <Header style={{ backgroundColor: MyColors.distributorColor }}>
                    <Grid>
                        <Col size={1} style={{ justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => props.navigation.goBack(null)}>
                                <Icon type="FontAwesome5" name="arrow-left" style={{ fontSize: 18, color: '#FFFFFF' }} />
                            </TouchableOpacity>
                        </Col>
                        <Col size={10} style={{ justifyContent: 'center' }}>
                            <Text style={{ color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold' }}>Terms Of Service</Text>
                        </Col>
                        <Col size={1}>
                        </Col>
                    </Grid>
                </Header>
            )
        } else {
            return (
                <Header style={{ backgroundColor: MyColors.distributorColor}}>
                    <Grid>
                        <Col size={1} style={{ justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => props.navigation.goBack(null)}>
                                <Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF' }} />
                            </TouchableOpacity>
                        </Col>
                        <Col size={10} style={{ justifyContent: 'center' }}>
                            <Text style={{ color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold' }}>Terms Of Service</Text>
                        </Col>
                        <Col size={1}>
                        </Col>
                    </Grid>
                </Header>
            )
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {showHeader()}
            <ScrollView showsVerticalScrollIndicator={true}>
                <View style ={{ margin: 10}} >
                    <View style={{marginTop : 10}}>
                        <Text style={{fontWeight:"bold" , color : 'black',fontSize : 16}}>
                            Welcome to KEBS Verification!
                        </Text>
                        
                        <Text style={{marginVertical : 8 , fontSize : 14,lineHeight : 22}}>These Terms of Service ("Terms") govern your access to and use of the KEBS Verification mobile application ("App"). By registering for or using the App, you agree to be bound by these Terms. If you do not agree to all the Terms, you may not access or use the App.</Text>
                    </View>

                    <View style={{marginTop : 10}}>
                        <Text style={{fontWeight:"bold" , color : 'black',fontSize : 16}}>
                        1. User Data Collection
                        </Text>
                        
                        <Text style={{marginVertical : 8,lineHeight : 22}}>In order to provide the functionalities of the KEBS Verification App, we may collect certain information from you, including:</Text>

                        <View style={{marginHorizontal : 7}}>
                            <Text style={{textAlign:'justify',fontSize : 13,lineHeight : 22}}>{'\u2B24'}  𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻 𝗗𝗮𝘁𝗮: With your permission, we may collect your location data (GPS coordinates) to assist you in verifying the authenticity of products near you.</Text>
                            <Text style={{textAlign:'justify',fontSize : 13,lineHeight : 22,marginVertical : 8}}>{'\u2B24'} 𝗜𝗣 𝗔𝗱𝗱𝗿𝗲𝘀𝘀: We may collect your IP address for security and auditing purposes.</Text>
                            <Text style={{textAlign:'justify',fontSize : 13,lineHeight : 22}}>{'\u2B24'} 𝗗𝗲𝘃𝗶𝗰𝗲 𝗧𝘆𝗽𝗲: We may collect your device type (phone model, operating system) to ensure compatibility and improve the App's performance.</Text>
                        </View>
                    </View>

                    <View style={{marginTop : 10}}>
                        <Text style={{fontWeight:"bold" , color : 'black',fontSize : 16}}>
                        2. Use of User Data
                        </Text>
                        
                        <Text style={{marginVertical : 8,lineHeight : 22}}>We will use the collected information for the following purposes:</Text>

                        <View style={{marginHorizontal : 7}}>
                            <Text style={{textAlign:'justify',fontSize : 13,lineHeight : 22}}>{'\u2B24'}  To verify the authenticity of products using the KEBS Verification App</Text>
                            <Text style={{textAlign:'justify',fontSize : 13,lineHeight : 22,marginVertical : 8}}>{'\u2B24'} To improve the App's functionality and user experience.</Text>
                            <Text style={{textAlign:'justify',fontSize : 13,lineHeight : 22,marginBottom : 8}}>{'\u2B24'} To ensure security and prevent fraudulent activity.</Text>
                            <Text style={{textAlign:'justify',fontSize : 13,lineHeight : 22}}>{'\u2B24'} For auditing purposes to maintain a record of user activity within the App.</Text>
                        </View>
                    </View>

                    <View style={{marginTop : 10}}>
                        <Text style={{fontWeight:"bold" , color : 'black',fontSize : 16}}>
                        3. Data Storage
                        </Text>
                        
                        <Text style={{marginVertical : 8 , fontSize : 14,lineHeight : 22}}>We will store your information on secure servers. We take appropriate security measures to protect your information from unauthorized access, disclosure, alteration, or destruction.</Text>
                    </View>

                    <View style={{marginTop : 10}}>
                        <Text style={{fontWeight:"bold" , color : 'black',fontSize : 16}}>
                        4. Your Consent
                        </Text>
                        
                        <Text style={{marginVertical : 8 , fontSize : 14,lineHeight : 22}}>By using the App, you consent to the collection, use, and storage of your information as described in these Terms.</Text>
                    </View>

                    <View style={{marginTop : 10}}>
                        <Text style={{fontWeight:"bold" , color : 'black',fontSize : 16}}>
                        5. Third-Party Services
                        </Text>
                        
                        <Text style={{marginVertical : 8 , fontSize : 14,lineHeight : 22}}>The App may integrate with third-party services. These services may have their own privacy policies, which we encourage you to review. We are not responsible for the practices of any third-party service.</Text>
                    </View>

                    <View style={{marginTop : 10}}>
                        <Text style={{fontWeight:"bold" , color : 'black',fontSize : 16}}>
                        6. Changes to the Terms
                        </Text>
                        
                        <Text style={{marginVertical : 8 , fontSize : 14,lineHeight : 22}}>We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on the App. You are advised to review these Terms periodically for any changes. Your continued use of the App after the revised Terms are posted will mean you accept and agree to the changes.</Text>
                    </View>

                    <View style={{marginTop : 10}}>
                        <Text style={{fontWeight:"bold" , color : 'black',fontSize : 16}}>
                        7. Termination
                        </Text>
                        
                        <Text style={{marginVertical : 8 , fontSize : 14,lineHeight : 22}}>We may terminate your access to the App for any reason, at any time, without notice.</Text>
                    </View>

                    <View style={{marginTop : 10}}>
                        <Text style={{fontWeight:"bold" , color : 'black',fontSize : 16}}>
                        8. Governing Law
                        </Text>
                        
                        <Text style={{marginVertical : 8 , fontSize : 14,lineHeight : 22}}>These Terms shall be governed by and construed in accordance with the laws of Kenya.</Text>
                    </View>

                    <View style={{marginTop : 10}}>
                        <Text style={{fontWeight:"bold" , color : 'black',fontSize : 16}}>
                        9. Contact Us
                        </Text>
                        
                        <Text style={{marginVertical : 8 , fontSize : 14,lineHeight : 22}}>If you have any questions about these Terms, please contact us at info@devharshinfotech.com.</Text>
                    </View>

                    <View style={{marginTop : 10}}>
                        <Text style={{fontWeight:"bold" , color : 'black',fontSize : 15,lineHeight : 22}}>
                        By registering for or using the KEBS Verification App, you acknowledge that you have read, understood, and agree to be bound by these Terms.
                        </Text>
                    </View>
                    
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({})

export default TermsOfService;
