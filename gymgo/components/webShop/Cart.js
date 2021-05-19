import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Image, Modal, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, URL, isTablet, paddingRight } from '../../utils/api/helpers'
import { getCurrency, getUserDetailsById } from '../../utils/api/authorization'
import { getMemberCartById, removeFromCart } from '../../utils/api/webShop'
import sample from '../../assets/images/sample.jpg'
import i18n from 'i18n-js';

class Cart extends Component {
    _isMounted = false

    state = {
        currency: '',
        rtl: null,
        userDetails: '',
        userCredentials: '',
        cartItems: [{}],
        numberOfProduct: 1,
        memberId: '',
        cartData: [],
    }


    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            AsyncStorage.getItem('authedToken').then((token) => {
                const userId = jwtDecode(token).credential
                const memberId = jwtDecode(token).userId

                this.setState({
                    userId,
                    memberId
                }, () => {
                    getUserDetailsById(this.state.userId).then(res => {
                        if (res) {
                            this.setState({
                                userDetails: res.data.response,
                                userCredentials: res.data.response.credentialId,

                            })
                        }
                    })
                    this._onRefresh()
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
    onPressDecrement = (quantity, index, offerDetails, sellingPrice) => {
        if (quantity > 1) {
            this.state.cartData[index].addedQuantity = quantity - 1
            this.state.cartData[index].amount = (offerDetails && offerDetails.isOffer && offerDetails.offerDetails.status && new Date().setHours(0, 0, 0, 0) <= new Date(offerDetails.offerDetails.endDate)) ? (sellingPrice * (1 - offerDetails.offerDetails.offerPercentage / 100)) * this.state.cartData[index].addedQuantity : (this.state.cartData[index].amount / quantity) * this.state.cartData[index].addedQuantity
            this.setState({
                cartData: this.state.cartData
            })
        }
    }
    onPressIncrement = (quantity, index, qty, offerDetails, sellingPrice) => {
        if (quantity < qty) {
            this.state.cartData[index].addedQuantity = quantity + 1
            this.state.cartData[index].amount = (offerDetails && offerDetails.isOffer && offerDetails.offerDetails.status && new Date().setHours(0, 0, 0, 0) <= new Date(offerDetails.offerDetails.endDate)) ? (sellingPrice * (1 - offerDetails.offerDetails.offerPercentage / 100)) * this.state.cartData[index].addedQuantity : (this.state.cartData[index].amount / quantity) * this.state.cartData[index].addedQuantity
            this.setState({
                cartData: this.state.cartData
            })
        }
    }


    _onRefresh = () => {
        this.setState({
            refreshing: true
        })

        getMemberCartById(this.state.memberId).then(res => {
            if (res) {
                this.setState({
                    cartData: res.data.response,
                    refreshing: false
                }, () => {

                    this.state.cartData.map(d => {
                        const { offerDetails, sellingPrice } = d.stockId
                        d.amount = (offerDetails && offerDetails.isOffer && offerDetails.offerDetails.status && new Date().setHours(0, 0, 0, 0) <= new Date(offerDetails.offerDetails.endDate)) ? d.addedQuantity * (sellingPrice * (1 - offerDetails.offerDetails.offerPercentage / 100)) : d.addedQuantity * sellingPrice
                    })
                    this.setState({
                        cartData: this.state.cartData
                    })
                }
                )
            }
        })
    }

    onRemove = (id) => {
        const data = {
            cartId: id
        }
        removeFromCart(data).then(res => {
            if (res) {
                this.setState({
                    removed: true
                }, () => {
                    this._onRefresh()
                })
            }
        })
    }
    render() {
        let amount = 0
        this.state.cartData.forEach(data => {
            const { offerDetails, sellingPrice } = data.stockId
            amount += data.amount ? data.amount : ((offerDetails && offerDetails.isOffer && offerDetails.offerDetails.status && new Date().setHours(0, 0, 0, 0) <= new Date(offerDetails.offerDetails.endDate)) ? data.addedQuantity * (sellingPrice * (1 - offerDetails.offerDetails.offerPercentage / 100)) : data.addedQuantity * sellingPrice)
        })

        let VAT = 0
        this.state.cartData.forEach(data => {
            const { taxPercent } = data.stockId.vat ? data.stockId.vat : 0
            const { offerDetails, sellingPrice } = data.stockId
            VAT += data.amount ? ((data.amount) * taxPercent / 100) : (((offerDetails && offerDetails.isOffer && offerDetails.offerDetails.status && new Date().setHours(0, 0, 0, 0) <= new Date(offerDetails.offerDetails.endDate)) ? data.addedQuantity * (sellingPrice * (1 - offerDetails.offerDetails.offerPercentage / 100)) : data.addedQuantity * sellingPrice) * taxPercent / 100)
        })
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: this.state.cartData.length > 0 ? '#eeeeee' : 'white' }}>
                {this.state.cartData.length > 0 ?
                    <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }} refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                            progressBackgroundColor='#1976d2'
                            colors={['white', 'yellow']}
                        />}>
                        <View elevation={5} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('MenuItems')}>
                                    <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                                    <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('myCart')}</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <View style={{ width: w / 1.1, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20, paddingBottom: width / 30, borderRadius: 3 }}>
                            {this.state.cartData.map((data, i) => {
                                const image = `${URL}/${data.stockId.image.path.replace(/\\/g, "/")}`
                                const userImage = JSON.parse(JSON.stringify({ uri: image }))
                                const { offerDetails, sellingPrice } = data.stockId
                                console.log(data.amount)
                                return (
                                    <View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.15, marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto' }}>
                                            <View style={{ transform: transform() }}>
                                                <Image resizeMode='stretch' style={{ width: width / 4, height: width / 4 }} source={userImage} />

                                            </View>
                                            <View style={{ flexDirection: 'column' }}>
                                                <Text style={{ fontSize: width / 28, color: '#333', width: w / 3, textAlign: textAlign(), transform: transform() }}>{data.stockId.itemName}</Text>
                                                <View style={{ flexDirection: 'row', width: w / 3, marginTop: width / 30 }}>
                                                    <TouchableOpacity onPress={() => this.onPressDecrement(data.addedQuantity, i, offerDetails, sellingPrice)}>
                                                        <View style={{ width: width / 15, backgroundColor: '#9ccc65', borderRadius: 3, alignItems: 'center', height: height / 22 }}>
                                                            <Text style={{ marginTop: 'auto', marginBottom: 'auto', fontSize: width / 15, color: 'white', bottom: 2 }}>-</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <View style={{ width: width / 11, backgroundColor: 'orange', borderRadius: 3, alignItems: 'center', height: height / 22, marginLeft: width / 40 }}>
                                                        <Text style={{ marginTop: 'auto', marginBottom: 'auto', fontSize: width / 25, color: 'white', bottom: 2, transform: transform() }}>{data.addedQuantity}</Text>
                                                    </View>
                                                    <TouchableOpacity onPress={() => this.onPressIncrement(data.addedQuantity, i, data.stockId.quantity, offerDetails, sellingPrice)}>
                                                        <View style={{ width: width / 15, backgroundColor: '#9ccc65', borderRadius: 3, alignItems: 'center', height: height / 22, marginLeft: width / 40 }}>
                                                            <Text style={{ marginTop: 'auto', marginBottom: 'auto', fontSize: width / 15, color: 'white', bottom: 2 }}>+</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'column' }}>
                                                <TouchableOpacity onPress={() => this.onRemove(data._id)}>
                                                    <View style={{ width: width / 12, height: width / 12, backgroundColor: 'grey', borderRadius: width / 24, marginLeft: width / 10, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Icon name="delete" size={width / 18} color="white" />
                                                    </View>
                                                </TouchableOpacity>
                                                <Text style={{ fontSize: width / 24, color: '#e53935', width: w / 5, marginTop: width / 20, fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{this.state.currency} {data.amount ? (data.amount.toFixed(2)) : (offerDetails && offerDetails.isOffer && offerDetails.offerDetails.status) ? (data.addedQuantity * (sellingPrice * (1 - offerDetails.offerDetails.offerPercentage / 100)).toFixed(2)) : data.addedQuantity * sellingPrice.toFixed(2)}</Text>
                                            </View>
                                        </View>
                                        <View style={{ borderBottomWidth: 0.5, width: w / 1.15, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, borderBottomColor: '#ddd' }} />
                                    </View>
                                )
                            })}


                        </View>
                        <View style={{ width: w / 1.1, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20, paddingBottom: width / 30, borderRadius: 3 }}>
                            <View style={{ width: w / 1.15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                                <Text style={{ fontSize: width / 24, color: '#333', transform: transform(), textAlign: textAlign(), }}>{i18n.t('subTotal')}:</Text>
                                <Text style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), }}>{this.state.currency} {amount.toFixed(2)}</Text>
                            </View>
                            <View style={{ width: w / 1.15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                                <Text style={{ fontSize: width / 24, color: '#333', transform: transform(), textAlign: textAlign(), }}>{i18n.t('discount')}:</Text>
                                <Text style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), }}>{this.state.currency} 0.00</Text>
                            </View>
                            <View style={{ width: w / 1.15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                                <Text style={{ fontSize: width / 24, color: '#333', transform: transform(), textAlign: textAlign(), }}>{i18n.t('VAT')}:</Text>
                                <Text style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), }}>{this.state.currency} {VAT.toFixed(2)}</Text>
                            </View>
                            <View style={{ borderBottomWidth: 0.5, width: w / 1.15, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, borderBottomColor: '#ddd' }} />
                            <View style={{ width: w / 1.15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                                <Text style={{ fontSize: width / 18, color: 'black', transform: transform(), textAlign: textAlign(), }}>{i18n.t('total')}:</Text>
                                <Text style={{ fontSize: width / 18, color: '#e53935', transform: transform(), textAlign: textAlign(), }}>{this.state.currency} {(amount + VAT).toFixed(2)}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Payment')}>
                            <View style={{ width: w / 1.2, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                                <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50, transform: transform() }}>{i18n.t('checkout')}</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView >

                    :
                    <View>
                        <View elevation={5} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('MenuItems')}>
                                    <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                                    <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('myCart')}</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <View style={{ marginTop: height / 7, marginLeft: 'auto', marginRight: 'auto' }}>
                            <Icon name="groups" size={width / 5} style={{ marginLeft: 'auto', marginRight: 'auto' }} color="grey" />

                            <Text style={{ fontSize: width / 22, fontWeight: 'bold', color: '#333', transform: transform() }}>{i18n.t('yourCartIsEmpty')}</Text>
                            <Text style={{ fontSize: width / 30, fontWeight: 'bold', color: 'grey', textAlign: 'center', marginTop: width / 30, transform: transform() }}>{i18n.t('addItemsToItNow')}</Text>

                        </View>
                    </View>}





            </View >
        )
    }
}

export default Cart