import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Image, Modal } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, URL, isTablet, paddingRight } from '../../utils/api/helpers'
import { getCurrency, getUserDetailsById } from '../../utils/api/authorization'
import sample from '../../assets/images/sample.jpg'
import { getStockById, addToCart, getMemberCartById } from '../../utils/api/webShop'
import { TapGestureHandler } from 'react-native-gesture-handler';
import Loader from '../../utils/resources/Loader'
import i18n from 'i18n-js';
import offerVer from '../../assets/images/offerVer.png'


class ItemDetails extends Component {
    _isMounted = false

    state = {
        currency: '',
        rtl: null,
        userDetails: '',
        userCredentials: '',
        numberOfProduct: 1,
        stockDetails: '',
        memberId: '',
        button: true,
        image: '',
        loading: false,
        cartDataStatus: [],
        cartData: [],
        offer: false
    }


    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            if (this.props.navigation.getParam('offerPerecntage')) {
                this.setState({
                    offer: true
                })
            }
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
                    getMemberCartById(this.state.memberId).then(res => {
                        if (res) {
                            this.setState({
                                cartDataStatus: res.data.response.filter(data => data.stockId._id === this.props.navigation.getParam('id')),
                                cartData: res.data.response
                            }, () => {
                                if (this.state.cartDataStatus.length > 0) {
                                    this.setState({
                                        button: false,
                                    })
                                }
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
            getStockById(this.props.navigation.getParam('id')).then(res => {
                if (res) {
                    this.setState({
                        stockDetails: res.data.response,
                        image: `${URL}/${res.data.response.image.path.replace(/\\/g, "/")}`
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

    onPressCart = () => {
        const data = {
            dateOfCart: new Date().setHours(0, 0, 0, 0),
            stockId: this.props.navigation.getParam('id'),
            member: this.state.memberId,
            addedQuantity: this.state.numberOfProduct
        }
        this.setState({
            loading: true
        })
        addToCart(data).then(res => {
            if (res) {
                this.setState({
                    button: false,
                    loading: false,
                    numberOfProduct: 1,

                }, () => {
                    getMemberCartById(this.state.memberId).then(res => {
                        if (res) {
                            this.setState({
                                cartDataStatus: res.data.response.filter(data => data.stockId._id === this.props.navigation.getParam('id')),
                                cartData: res.data.response
                            }, () => {
                                if (this.state.cartDataStatus.length > 0) {
                                    this.setState({
                                        button: false,
                                    })
                                }
                            })
                        }
                    })
                })
            }
        })
    }

    onPressBuy = () => {
        const data = {
            dateOfCart: new Date().setHours(0, 0, 0, 0),
            stockId: this.props.navigation.getParam('id'),
            member: this.state.memberId,
            addedQuantity: this.state.numberOfProduct
        }
        this.setState({
            loading: true
        })
        addToCart(data).then(res => {
            if (res) {
                this.setState({
                    button: false,
                    loading: false,
                    numberOfProduct: 1
                }, () => this.props.navigation.navigate('Cart'))
            }
        })
    }

    render() {
        const price = this.props.navigation.getParam('offerPerecntage') ? this.state.stockDetails.sellingPrice - ((this.props.navigation.getParam('offerPerecntage') / 100) * this.state.stockDetails.sellingPrice) : this.state.stockDetails.sellingPrice
        const userImage = JSON.parse(JSON.stringify({ uri: this.state.image }))
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <Loader loading={this.state.loading} text='Loading' />

                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>
                    <View elevation={5} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                                <Text numberOfLines={1} style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', width: w / 2 }}>{this.props.navigation.getParam('title')}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Cart')}>
                            <View style={{ marginRight: width / 30, transform: transform() }}>
                                <Icon name="cart-icon" size={width / 12} style={{ top: width / 30 }} color="#333" />
                                {this.state.cartData.length > 0 ? <View style={{ width: width / 22, height: width / 22, backgroundColor: 'orange', position: 'absolute', borderRadius: width / 44, top: 10, right: -2 }}><Text numberOfLines={1} style={{ textAlign: 'center', fontSize: width / 40, marginTop: 'auto', marginBottom: 'auto', color: 'white' }}>{this.state.cartData.length}</Text></View> : <View></View>}

                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: w, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', transform: transform() }}>
                        <Image resizeMode='stretch' style={{ width: w, height: height / 2.5, marginLeft: 'auto', marginRight: 'auto', }} source={userImage} />
                    </View>
                    <View style={{ flexDirection: 'row', width: w, marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto', justifyContent: 'space-between' }}>
                        {this.state.offer === false ? <View style={{ marginLeft: width / 30 }}>
                            <Text style={{ fontSize: width / 15, fontWeight: 'bold', color: '#e53935', width: w / 2, transform: transform(), textAlign: textAlign(), }}>{this.state.currency} {this.state.stockDetails.sellingPrice}</Text>

                        </View> :
                            <View style={{ marginLeft: width / 30, flexDirection: 'row' }}>
                                <Text style={{ fontSize: width / 15, fontWeight: 'bold', color: '#e53935', transform: transform(), textAlign: textAlign(), }}>{this.state.currency} {price}</Text>
                                <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', fontSize: width / 25, marginLeft: width / 50, fontWeight: 'bold', marginTop: 'auto', marginBottom: 'auto', color: 'grey', width: w / 5, transform: transform(), textAlign: textAlign(), }}>{this.state.currency} {this.state.stockDetails.sellingPrice}</Text>

                            </View>}
                        <View style={{ flexDirection: 'row', width: w / 2.8, marginRight: width / 30 }}>
                            <TouchableOpacity onPress={() => this.onPressDecrement()}>
                                <View style={{ width: width / 12, backgroundColor: '#9ccc65', borderRadius: 3, alignItems: 'center', height: height / 18 }}>
                                    <Text style={{ marginTop: 'auto', marginBottom: 'auto', fontSize: width / 12, color: 'white', bottom: 2 }}>-</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ width: width / 8, backgroundColor: 'orange', borderRadius: 3, alignItems: 'center', height: height / 18, marginLeft: width / 40 }}>
                                <Text style={{ marginTop: 'auto', marginBottom: 'auto', fontSize: width / 22, color: 'white', bottom: 2, transform: transform() }}>{this.state.numberOfProduct}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.onPressIncrement(this.state.stockDetails.quantity)}>
                                <View style={{ width: width / 12, backgroundColor: '#9ccc65', borderRadius: 3, alignItems: 'center', height: height / 18, marginLeft: width / 40 }}>
                                    <Text style={{ marginTop: 'auto', marginBottom: 'auto', fontSize: width / 12, color: 'white', bottom: 2 }}>+</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this.state.offer === true ? <View style={{ marginTop: width / 30, }}>
                        <ImageBackground source={offerVer} style={{ width: width / 4, height: width / 15 }} >
                            <Text style={{ fontSize: width / 28, fontWeight: 'bold', color: 'white', marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 80, transform: transform(), textAlign: textAlign() }}>{this.props.navigation.getParam('offerPerecntage')}% OFF</Text>
                        </ImageBackground>
                    </View> : <View></View>}
                    <View style={{ marginTop: width / 10, marginLeft: width / 20 }}>
                        <Text style={{ fontSize: width / 22, color: '#333', width: w / 2, fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('description')}</Text>

                    </View>
                    <View style={{ marginTop: width / 30, marginLeft: width / 20, width: w / 1.1, }}>
                        <Text style={{ fontSize: width / 28, color: '#333', width: w / 1.15, transform: transform(), textAlign: textAlign(), }}>{this.state.stockDetails.description}</Text>
                    </View>
                    {this.state.button === true ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 10, width: w / 1.1, marginLeft: isTablet ? width / 20 : width / 15 }}>
                        <TouchableOpacity style={{ transform: transform() }} onPress={() => this.onPressCart()}>
                            <View style={{ backgroundColor: '#f58020', width: width / 2.4, height: width / 8, borderRadius: 30, transform: transform() }}>
                                <Text style={{ textAlign: 'center', fontSize: width / 18, color: 'white', marginBottom: 'auto', marginTop: 'auto', transform: transform() }}>{i18n.t('addToCart')}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ transform: transform() }} onPress={() => this.onPressBuy()}>
                            <View style={{ backgroundColor: '#9ccc65', width: width / 2.4, height: width / 8, borderRadius: 30, transform: transform() }}>
                                <Text style={{ textAlign: 'center', fontSize: width / 18, color: 'white', marginBottom: 'auto', marginTop: 'auto', transform: transform() }}>{i18n.t('buyNow')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View> : <View style={{ marginTop: width / 20, marginLeft: 'auto', marginRight: 'auto', }}>

                        <View style={{ backgroundColor: '#ffccbc', width: width / 1.4, height: width / 8, borderRadius: 30 }}>
                            <Text style={{ textAlign: 'center', fontSize: width / 18, color: 'white', marginBottom: 'auto', marginTop: 'auto', transform: transform() }}>{i18n.t('addedToCart')}</Text>
                        </View>
                    </View>}


                </ScrollView>




            </View >
        )
    }
}

export default ItemDetails