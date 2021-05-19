import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Image, Modal } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, URL, paddingRight } from '../../utils/api/helpers'
import { getCurrency, getUserDetailsById } from '../../utils/api/authorization'
import sample from '../../assets/images/sample.jpg'
import i18n from 'i18n-js';

class OrderDetails extends Component {
    _isMounted = false

    state = {
        currency: '',
        rtl: null,
        userDetails: '',
        userCredentials: '',
        cartItems: [{}],
        modalVisible: false,


    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
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



    render() {
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>
                    <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />
                                <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('orderDetails')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.1 }}>
                        <View style={{ flexDirection: 'column', marginTop: width / 30, marginLeft: width / 30 }}>
                            <Text style={{ fontSize: width / 22, color: 'grey', width: w / 1.8, transform: transform(), textAlign: textAlign(), }}>{i18n.t('order')} #0082435</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: width / 30, color: '#333', transform: transform(), textAlign: textAlign(), }}>7/1/2019, 2:00 PM</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', marginTop: width / 20 }}>
                            <Text style={{ fontSize: width / 25, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('paymentMode')}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: width / 30, color: '#333', transform: transform(), textAlign: textAlign(), }}>Credit Card</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: w / 1.09, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20, paddingBottom: width / 30, borderRadius: 3 }}>
                        <View style={{ flexDirection: 'row', width: w / 1.15, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <View style={{ transform: transform() }}>
                                <Image resizeMode='stretch' style={{ width: width / 5, height: width / 5 }} source={sample} />

                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: width / 22, color: 'grey', width: w / 1.8, marginLeft: width / 30, transform: transform(), textAlign: textAlign(), }}>{i18n.t('order')} #0082435</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 3, marginLeft: width / 30, marginTop: width / 20 }}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ fontSize: width / 28, color: '#e53935', transform: transform(), textAlign: textAlign(), }}>{i18n.t('QTY')}</Text>
                                        <Text style={{ textAlign: 'center', fontSize: width / 30, color: '#333', transform: transform(), textAlign: textAlign(), }}>1</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ fontSize: width / 28, color: '#e53935', transform: transform(), textAlign: textAlign(), }}>{i18n.t('amount')}</Text>
                                        <Text style={{ textAlign: 'center', fontSize: width / 30, color: '#333', transform: transform(), textAlign: textAlign(), }}>$ 40.00</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ borderBottomWidth: 0.5, width: w / 1.15, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, borderBottomColor: '#ddd' }} />

                    </View>
                    <View style={{ width: w / 1.09, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20, paddingBottom: width / 30, borderRadius: 3 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.15, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: width / 25, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('paymentMode')}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: width / 30, color: '#333', transform: transform(), textAlign: textAlign(), }}>Credit Card</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: width / 25, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('invoice')}</Text>
                                <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                    <TouchableOpacity>
                                        <View style={{ width: width / 15, height: width / 15, backgroundColor: '#9ccc65', borderRadius: width / 24, alignItems: 'center', justifyContent: 'center' }}>
                                            <Icon name="eye" size={width / 22} color="white" />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: w / 1.1, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20, paddingBottom: width / 30, borderRadius: 3 }}>
                        <View style={{ width: w / 1.15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <Text style={{ fontSize: width / 24, color: '#333', transform: transform(), textAlign: textAlign(), }}>{i18n.t('subTotal')}:</Text>
                            <Text style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), }}>$ 40.00</Text>
                        </View>
                        <View style={{ width: w / 1.15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <Text style={{ fontSize: width / 24, color: '#333', transform: transform(), textAlign: textAlign(), }}>{i18n.t('discount')}:</Text>
                            <Text style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), }}>$ 0.00</Text>
                        </View>
                        <View style={{ width: w / 1.15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <Text style={{ fontSize: width / 24, color: '#333', transform: transform(), textAlign: textAlign(), }}>{i18n.t('VAT')}:</Text>
                            <Text style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), }}>$ 10.00</Text>
                        </View>
                        <View style={{ borderBottomWidth: 0.5, width: w / 1.15, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, borderBottomColor: '#ddd' }} />
                        <View style={{ width: w / 1.15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <Text style={{ fontSize: width / 18, color: 'black', transform: transform(), textAlign: textAlign(), }}>{i18n.t('total')}:</Text>
                            <Text style={{ fontSize: width / 18, color: '#e53935', transform: transform(), textAlign: textAlign(), }}>$ 50.00</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default OrderDetails