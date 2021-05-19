import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, Image } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import pixel from '../../assets/images/pixel.png'
import gymLogo from '../../assets/images/gymLogo.png'
import i18n from 'i18n-js'


class About extends Component {

    state = {
        rtl: null,
    }


    render() {
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>
                    <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="home" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                            <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('aboutUs')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View elevation={3} style={{ width: w / 1.08, padding: width / 30, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', marginTop: width / 30, borderRadius: 3 }}>
                        <View elevation={3} style={{ paddingBottom: width / 50, backgroundColor: '#1e88e5', borderRadius: 3 }}>
                            <View style={{ width: w / 1.2, marginTop: width / 60, flexDirection: 'row', justifyContent: 'center' }}>
                                <Image resizeMode='stretch' source={gymLogo} style={{ width: width / 4, height: width / 10, transform: transform(), }} />
                            </View>
                        </View>
                        <Text style={{ fontSize: width / 24, color: '#333', marginTop: width / 30, transform: transform(), textAlign: textAlign() }}>We build creative ideas on mobile app technology to put the Gym Management System at your fingertips. With our app, you and Gym members can access the system anytime, anywhere. It is available in the App Store and Play store in different languages.</Text>
                        <View elevation={3} style={{ paddingBottom: width / 50, backgroundColor: '#1e88e5', marginTop: width / 30, borderRadius: 3 }}>
                            <View style={{ width: w / 1.2, marginTop: width / 60, flexDirection: 'row', justifyContent: 'center' }}>
                                <Image resizeMode='stretch' source={pixel} style={{ width: width / 4.5, height: width / 10, transform: transform() }} />
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </View >
        )
    }
}

export default About