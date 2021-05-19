import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import loginBg from '../../assets/images/loginBg.png';
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { getAllPackage } from '../../utils/api/package'
import { getCurrency, getUserDetailsById } from '../../utils/api/authorization'
import i18n from 'i18n-js'


class Settings extends Component {
    _isMounted = false

    state = {
        currency: '',
        rtl: null,
        packages: [],
        userDetails: '',
        userCredentials: '',
        modalVisible: false,
    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            AsyncStorage.getItem('authedToken').then((token) => {
                const userId = jwtDecode(token).credential

                this.setState({
                    userId,

                }, () => {
                    getUserDetailsById(this.state.userId).then(res => {
                        if (res) {
                            this.setState({
                                userDetails: res.data.response,
                                userCredentials: res.data.response.credentialId,

                            })
                        }
                    })
                })
            })
            getCurrency().then(res => {
                if (res) {
                    this.setState({
                        currency: res.data.response
                    })
                }
            })

        }
    }


    componentWillUnmount() {
        this._isMounted = false
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    render() {
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>
                    <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="home" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                            <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('settings')}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Language')}>
                        <View elevation={3} style={{ width: w / 1.08, padding: width / 50, backgroundColor: 'white', borderWidth: 0.5, borderColor: '#ddd', marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto', borderRadius: 2 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2, marginLeft: 'auto', marginRight: 'auto' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: width / 10, padding: width / 50, backgroundColor: 'orange', borderRadius: 2 }}>
                                        <Icon name="languageSettings" size={width / 18} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} color="white" />
                                    </View>
                                    <Text style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', fontSize: width / 25, fontWeight: 'bold', color: '#333', transform: transform(), marginLeft: width / 50 }}>{i18n.t('languages')}</Text>
                                </View>
                                <Icon name="right-arrow" size={width / 18} style={{ marginTop: 'auto', marginBottom: 'auto' }} color="#333" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ChangePassword')}>
                        <View elevation={3} style={{ width: w / 1.08, padding: width / 50, backgroundColor: 'white', borderWidth: 0.5, borderColor: '#ddd', marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto', borderRadius: 2 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2, marginLeft: 'auto', marginRight: 'auto' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: width / 10, padding: width / 50, backgroundColor: '#1565c0', borderRadius: 2 }}>
                                        <Icon name="passwordSettings" size={width / 18} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} color="white" />
                                    </View>
                                    <Text style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', fontSize: width / 25, fontWeight: 'bold', color: '#333', transform: transform(), marginLeft: width / 50 }}>{i18n.t('changePassword')}</Text>
                                </View>
                                <Icon name="right-arrow" size={width / 18} style={{ marginTop: 'auto', marginBottom: 'auto' }} color="#333" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Notifications')}>
                        <View elevation={3} style={{ width: w / 1.08, padding: width / 50, backgroundColor: 'white', borderWidth: 0.5, borderColor: '#ddd', marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto', borderRadius: 2 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2, marginLeft: 'auto', marginRight: 'auto' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: width / 10, padding: width / 50, backgroundColor: '#e91e63', borderRadius: 2 }}>
                                        <Icon name="notificationSettings" size={width / 18} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} color="white" />
                                    </View>
                                    <Text style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', fontSize: width / 25, fontWeight: 'bold', color: '#333', transform: transform(), marginLeft: width / 50 }}>{i18n.t('notifications')}</Text>
                                </View>
                                <Icon name="right-arrow" size={width / 18} style={{ marginTop: 'auto', marginBottom: 'auto' }} color="#333" />
                            </View>
                        </View>
                    </TouchableOpacity>

                </ScrollView>
            </View >
        )
    }
}

export default Settings