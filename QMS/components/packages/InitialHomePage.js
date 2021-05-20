import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, RefreshControl, Image } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { DrawerActions } from 'react-navigation-drawer';
import { getDesignationById, getUserDetailsById } from '../../utils/api/authorization'
import gymHome from '../../assets/images/gymHome.jpg'
import i18n from 'i18n-js';

class InitialHomePage extends Component {
    _isMounted = false

    state = {
        role: '',
        rtl: null,
        userDetails: '',
    }



    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {

            AsyncStorage.getItem('authedToken').then(token => {
                const designation = jwtDecode(token).designation
                const userId = jwtDecode(token).credential
                console.log(userId, 'kbj')
                getDesignationById(designation).then(res => {
                    if (res) {
                        this.setState({
                            role: res.data.response.designationName
                        }, () => {
                            const { role } = this.state
                            if (role === 'Member') {
                                getUserDetailsById(userId).then(res => {
                                    if (res) {
                                        this.setState({
                                            userDetails: res.data.response.credentialId,
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            })
        }
    }


    componentWillUnmount() {
        this._isMounted = false
    }



    render() {
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <View elevation={3} style={{ width: w, height: width / 7, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}>
                            <Icon name="toggle" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />
                        </TouchableOpacity>

                        <Text style={{ marginLeft: width / 30, top: width / 30, fontSize: width / 18, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('dashboard')}</Text>

                    </View>

                </View>
                <View style={{ width: w / 1.05, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('PackageHome')}>
                        <View elevation={3} style={{ transform: transform(), flexDirection: 'row', width: w / 1.1, height: height / 9, marginTop: width / 50, justifyContent: 'space-between', backgroundColor: 'white', borderBottomWidth: 4, borderBottomColor: '#ffb74d', borderRadius: 3, marginLeft: 'auto', marginRight: 'auto', }}>
                            <View style={{ transform: transform(), width: w / 1.2, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: width / 8, height: width / 8, borderRadius: width / 16, backgroundColor: '#ffb74d', marginTop: 'auto', marginBottom: 'auto', justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon name='packages' color='white' size={width / 14} style={{ transform: transform() }} />
                                    </View>
                                    <Text style={{ fontSize: width / 22, fontWeight: 'bold', color: '#616161', transform: transform(), textAlign: textAlign(), marginTop: 'auto', marginBottom: 'auto', width: w / 2.5, marginLeft: width / 30 }}>{i18n.t('packages')}</Text>
                                </View>
                                <Icon name={i18n.locale === 'ar' ? 'back-button' : 'right-arrow'} color='#616161' size={width / 14} style={{ transform: transform(), marginTop: 'auto', marginBottom: 'auto' }} />
                            </View>
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ClassHome')}>
                        <View elevation={3} style={{ transform: transform(), flexDirection: 'row', width: w / 1.1, height: height / 9, marginTop: width / 30, justifyContent: 'space-between', backgroundColor: 'white', borderBottomWidth: 4, borderBottomColor: '#0277bd', borderRadius: 3, marginLeft: 'auto', marginRight: 'auto', }}>
                            <View style={{ transform: transform(), width: w / 1.2, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: width / 8, height: width / 8, borderRadius: width / 16, backgroundColor: '#0277bd', marginTop: 'auto', marginBottom: 'auto', justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon name='classes' color='white' size={width / 14} style={{ transform: transform() }} />
                                    </View>
                                    <Text style={{ fontSize: width / 22, fontWeight: 'bold', color: '#616161', transform: transform(), textAlign: textAlign(), marginTop: 'auto', marginBottom: 'auto', width: w / 2.5, marginLeft: width / 30 }}>{i18n.t('classes')}</Text>
                                </View>
                                <Icon name={i18n.locale === 'ar' ? 'back-button' : 'right-arrow'} color='#616161' size={width / 14} style={{ transform: transform(), marginTop: 'auto', marginBottom: 'auto' }} />
                            </View>

                        </View>

                    </TouchableOpacity>
                </View>


            </View>
        )
    }
}

export default InitialHomePage