import React from 'react';
import { ActivityIndicator, Dimensions, Platform, StyleSheet, Text, View, Modal, ImageBackground, Image } from 'react-native';
import loaderBg from '../../assets/images/loaderBg.jpg'
import pixel from '../../assets/images/pixel.png'
let w = Dimensions.get('window').width
let h = Dimensions.get('window').height
const isTablet = (h / w) > 1.6
let width = isTablet ? w : 500
let height = isTablet ? h : 900

const AuthLoader = props => {
    const {
        loading,
        text } = props;
    if (loading) {
        if (Platform.OS === 'android') {
            return (
                <ImageBackground source={loaderBg} style={{ width: w, height: h }} >
                    <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }}>
                        <Image resizeMode='stretch' style={{ width: width / 2, height: width / 5, marginLeft: 'auto', marginRight: 'auto' }} source={pixel} />
                        <Text style={{ fontSize: width / 25, color: 'red', marginLeft: 'auto', marginRight: 'auto' }}>{text}</Text>
                        <ActivityIndicator
                            animating={loading}
                            color='red'
                            size='small' />
                    </View>

                </ImageBackground>
            )
        } else {
            return (
                <ImageBackground source={loaderBg} style={{ width: w, height: h }} >
                    <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }}>
                        <Image resizeMode='stretch' style={{ width: width / 2, height: width / 5, marginLeft: 'auto', marginRight: 'auto' }} source={pixel} />
                        <Text style={{ fontSize: width / 25, color: 'red', marginLeft: 'auto', marginRight: 'auto' }}>{text}</Text>
                        <ActivityIndicator
                            animating={loading}
                            color='red'
                            size='small' />
                    </View>

                </ImageBackground>
            )
        }
    } else {
        return (
            <View></View>
        )
    }
}


export default AuthLoader;