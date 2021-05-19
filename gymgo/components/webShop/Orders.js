import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Image, Modal } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, URL, paddingRight } from '../../utils/api/helpers'
import { getCurrency, getUserDetailsById } from '../../utils/api/authorization'
import sample from '../../assets/images/sample.jpg'
import i18n from 'i18n-js';

class Orders extends Component {
    _isMounted = false

    state = {
        currency: '',
        rtl: null,
        userDetails: '',
        userCredentials: '',
        cartItems: [{}],
        modalVisible: false,
        numberOfProduct: ''

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

    onPressDecrement = () => {
        if (this.state.numberOfProduct > 1) {
            this.setState({
                numberOfProduct: this.state.numberOfProduct - 1
            })
        }

    }
    onPressIncrement = (qty) => {
        if (this.state.numberOfProduct < qty) {
            this.setState({
                numberOfProduct: this.state.numberOfProduct + 1
            })
        }
    }

    render() {
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>
                    <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                                <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('myOrders')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('OrderDetails')}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.1, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20, paddingBottom: width / 30, borderRadius: 3 }}>
                            <View style={{ flexDirection: 'column', marginTop: width / 30, marginLeft: width / 30 }}>
                                <Text style={{ fontSize: width / 22, color: 'grey', width: w / 1.5, transform: transform(), textAlign: textAlign(), }}>{i18n.t('order')} #0082435</Text>
                                <View style={{ flexDirection: 'column', marginTop: width / 30 }}>
                                    <Text style={{ fontSize: width / 28, color: '#333', width: w / 1.5, transform: transform(), textAlign: textAlign(), }}>{i18n.t('dateAndTime')}</Text>
                                    <Text style={{ fontSize: width / 30, color: '#333', width: w / 1.5, transform: transform(), textAlign: textAlign(), }}>7/1/2019, 2:00 PM</Text>
                                </View>
                            </View>
                            <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                <Icon name="right-arrow" size={width / 15} style={{ marginRight: width / 20, top: width / 80 }} color="grey" />
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }
}

export default Orders