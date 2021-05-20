import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import loginBg from '../../assets/images/loginBg.png';
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { getAllPackage } from '../../utils/api/package'
import { getCurrency, getUserDetailsById, getDesignationById } from '../../utils/api/authorization'
import Loader from '../../utils/resources/Loader'
import i18n from 'i18n-js'

class Language extends Component {
    _isMounted = false

    state = {
        currency: '',
        rtl: null,
        packages: [],
        userDetails: '',
        userCredentials: '',
        modalVisible: false,
        appLang: '',
        role: '',
        loading: false

    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            this.setState({ loading: true })
            AsyncStorage.getItem('language').then(lang => {
                this.setState({
                    appLang: lang
                })
                if (this.state.appLang === 'ar') {
                    this.setState({
                        rtl: true
                    })
                }

            })
            AsyncStorage.getItem('authedToken').then((token) => {
                const userId = jwtDecode(token).credential
                const designation = jwtDecode(token).designation
                this.setState({
                    userId,

                }, () => {
                    getDesignationById(designation).then(res => {
                        this.setState({
                            role: res.data.response.designationName,
                            loading: false
                        })
                    })
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

    async saveItem(item, selectedValue) {
        try {
            await AsyncStorage.setItem(item, selectedValue);
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }
    }

    languageChanger = (lang) => {
        i18n.locale = lang
        this.saveItem('language', lang)
        this.setState({
            appLang: lang
        }, () => {
            const { role } = this.state
            if (role === 'Member') {
                this.props.navigation.navigate('AuthLoadingScreen', { role })

            } else if (role === 'Trainer') {
                this.props.navigation.navigate('AuthLoadingScreen', { role })

            } else if (role === 'System Admin') {
                this.props.navigation.navigate('AuthLoadingScreen', { role })

            }
        })
    }


    render() {
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <Loader loading={this.state.loading} text='Registering User' />

                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>
                    <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                            <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('languages')}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => this.languageChanger('en')}>
                        <View style={{ width: w / 1.1, padding: width / 30, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', borderBottomWidth: 0.8, borderBottomColor: '#ddd' }}>

                            <Text style={{ fontSize: width / 22, color: '#333', fontWeight: 'bold', marginLeft: width / 50, transform: transform(), textAlign: textAlign() }}>English</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.languageChanger('ar')}>
                        <View style={{ width: w / 1.1, padding: width / 30, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', borderBottomWidth: 0.8, borderBottomColor: '#ddd' }}>

                            <Text style={{ fontSize: width / 22, color: '#333', fontWeight: 'bold', marginLeft: width / 50, transform: transform(), textAlign: textAlign() }}>العَرَبِيَّة</Text>

                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View >
        )
    }
}

export default Language