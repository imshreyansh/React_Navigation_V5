import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import loginBg from '../../assets/images/loginBg.png';
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { getAllPackage } from '../../utils/api/package'
import { getCurrency, getUserDetailsById } from '../../utils/api/authorization'
import i18n from 'i18n-js'


class Invoice extends Component {
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

                            <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('invoices')}</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={{ transform: transform(), marginTop: width / 30, marginLeft: width / 30 }}>
                        <Text style={{ fontSize: width / 24, color: '#333', fontWeight: 'bold', textAlign: textAlign() }}>Current Packages</Text>
                    </View>
                    <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, paddingBottom: width / 30, borderRadius: 5, backgroundColor: '#7e57c2', transform: transform() }}>
                        <View style={{ flexDirection: 'row', marginTop: width / 30, marginLeft: width / 30, justifyContent: 'space-between', width: w / 1.2 }}>
                            <Text style={{ fontSize: width / 24, color: 'white', }}>Current Plan</Text>
                            <View style={{ paddingBottom: width / 80, paddingTop: width / 80, width: w / 5, backgroundColor: '#8bc34a', borderRadius: 5 }}>
                                <Text style={{ fontSize: width / 28, color: 'white', textAlign: 'center' }}>Active</Text>

                            </View>
                        </View>
                        <View style={{ marginTop: width / 50, marginLeft: width / 30 }}>
                            <Text numberOfLines={1} style={{ fontSize: width / 18, color: 'white', width: w / 1.5, fontWeight: 'bold', }}>Gold Plan Monthly</Text>
                        </View>
                        <View style={{ marginTop: width / 50, marginLeft: width / 30 }}>
                            <Text numberOfLines={2} style={{ fontSize: width / 28, color: 'white', width: w / 1.5, }}>Your current plan subscription is active through Jan 2 2020</Text>
                        </View>
                        <TouchableOpacity>
                            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', width: w / 1.15 }}>
                                <View style={{ paddingBottom: width / 80, paddingTop: width / 80, width: w / 5, backgroundColor: 'white', borderRadius: 5, }}>
                                    <Text style={{ fontSize: width / 28, color: '#333', textAlign: 'center' }}>Renew</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View> */}
                    <View style={{ transform: transform(), marginTop: width / 30, marginLeft: width / 30 }}>
                        <Text style={{ fontSize: width / 20, color: '#333', fontWeight: 'bold', textAlign: textAlign() }}>{i18n.t('orderHistory')}</Text>
                    </View>

                    <View style={{ width: w / 1.1, borderWidth: 1, backgroundColor: 'white', borderColor: '#ddd', paddingBottom: width / 50, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20, transform: transform() }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.15, marginTop: width / 60, marginLeft: 'auto', marginRight: 'auto' }}>
                            <View>
                                <Text numberOfLines={1} style={{ fontSize: width / 25, color: '#333', width: w / 2.2, fontWeight: 'bold' }}>Gold Plan Monthly</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text numberOfLines={1} style={{ fontSize: width / 28, color: '#333', width: w / 4, top: width / 90 }}>16/01/2020</Text>
                                <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                                    <Icon name="eye" size={width / 15} style={{ marginLeft: width / 60 }} color="#7e57c2" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <Modal
                        transparent={true}
                        visible={this.state.modalVisible}
                    >

                        <View style={{ backgroundColor: 'white', height: width / 1.4, borderWidth: 1, borderColor: '#ddd', width: width - 40, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width / 1.15, marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0.5, paddingBottom: width / 60, borderBottomColor: '#333' }}>
                                <Text style={{ fontSize: width / 20, color: '#333', marginLeft: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], textAlign: this.state.isRTL ? 'right' : 'left' }}>Invoice</Text>
                                <TouchableOpacity onPress={() => { this.setModalVisible(false) }}>
                                    <Icon name="close" size={width / 20} style={{ marginRight: width / 30 }} color="#333" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: width / 20, marginLeft: width / 30 }}>
                                <Text style={{ fontSize: width / 22, color: '#333' }}></Text>
                            </View>
                        </View>

                    </Modal>
                </ScrollView>
            </View >
        )
    }
}

export default Invoice