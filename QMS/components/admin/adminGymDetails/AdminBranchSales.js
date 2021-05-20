import React from 'react';
import { View, Text, Platform, Image, ScrollView, TouchableOpacity, ImageBackground, Modal, ActionSheetIOS, Picker, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import report from '../../../assets/images/report.png'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../../utils/api/helpers'
import { DrawerActions } from 'react-navigation-drawer';
import { getUserByCredentials } from '../../../utils/api/authorization'
import i18n from 'i18n-js'

export default class AdminBranchSales extends React.Component {
    _isMounted = false

    state = {
        rtl: null,
        userDetails: "",
        userCredentials: "",
        avatar: '',
        employeeIdUser: '',
    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            AsyncStorage.getItem('authedToken').then((token) => {
                const employeeIdUser = jwtDecode(token).credential
                this.setState({
                    employeeIdUser
                }, () => {

                    getUserByCredentials(this.state.employeeIdUser).then(res => {
                        if (res) {
                            this.setState({
                                userDetails: res.data.response,
                                userCredentials: res.data.response,
                                avatar: `${URL}/${res.data.response.avatar.path.replace(/\\/g, "/")}`
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





    render() {

        return (
            <View style={{ transform: transform(), backgroundColor: 'white', flex: 1 }}>

                <View elevation={3} style={{ width: w, height: width / 7, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name='back-button' size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />
                        </TouchableOpacity>

                        <Text style={{ marginLeft: width / 20, top: width / 30, fontSize: width / 18, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>Branch Sales</Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={{ paddingBottom: width / 30, backgroundColor: 'white' }}>

                </ScrollView>

            </View>
        )
    }
}

