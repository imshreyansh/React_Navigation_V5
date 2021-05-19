import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { getUserByCredentials } from '../../utils/api/authorization'
import { notificationOff } from '../../utils/api/notifications'
import i18n from 'i18n-js'
import Loader from '../../utils/resources/Loader'


class Notifications extends Component {
    _isMounted = false

    state = {
        userDetails: '',
        userId: '',
        notificationStatus: '',
        loading: false

    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            this.setState({ loading: true })
            AsyncStorage.getItem('authedToken').then((token) => {
                const userId = jwtDecode(token).credential

                this.setState({
                    userId,

                }, () => {
                    getUserByCredentials(this.state.userId).then(res => {
                        if (res) {
                            this.setState({
                                userDetails: res.data.response,
                                notificationStatus: res.data.response.notification,
                                loading: false
                            })
                        }
                    })
                })
            })


        }
    }


    componentWillUnmount() {
        this._isMounted = false
    }

    onNotification = () => {
        this.setState({
            notificationStatus: !this.state.notificationStatus
        }, () => {
            const obj = {
                id: this.state.userId,
                notification: this.state.notificationStatus
            }
            notificationOff(obj).then(res => {
                if (res) {
                    getUserByCredentials(this.state.userId).then(res => {
                        if (res) {
                            this.setState({
                                userDetails: res.data.response,
                                notificationStatus: res.data.response.notification

                            })
                        }
                    })
                } else {
                    this.setState({
                        notificationStatus: !this.state.notificationStatus
                    })
                }
            })
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

                            <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('notifications')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: 'white', marginTop: width / 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: w / 1.08, borderRadius: 3, marginLeft: 'auto', marginRight: 'auto', padding: width / 30, paddingRight: width / 100, paddingLeft: width / 100, borderBottomWidth: 1, borderColor: '#eeeeee', transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <View style={{ width: w / 1.2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontSize: width / 22, color: '#333', transform: transform(), textAlign: textAlign() }}>{i18n.t('allNotifications')}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.onNotification()}>
                                <View style={{ width: width / 9, height: width / 18, borderRadius: width / 36, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: this.state.notificationStatus === true ? 'flex-end' : 'flex-start' }}>
                                    <View style={{ width: width / 18, height: width / 18, borderRadius: width / 36, backgroundColor: this.state.notificationStatus === true ? '#039be5' : '#9e9e9e' }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View >
        )
    }
}

export default Notifications