import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Image, Modal, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, URL, paddingRight } from '../../utils/api/helpers'
import { getCurrency, getDesignationById, getUserDetailsById } from '../../utils/api/authorization'
import { getAndSearchStock, getMemberCartById } from '../../utils/api/webShop'
import offer from '../../assets/images/offer.png'
import offerVer from '../../assets/images/offerVer.png'
import i18n from 'i18n-js';

class MenuItems extends Component {
    _isMounted = false

    state = {
        currency: '',
        rtl: null,
        userDetails: '',
        branch: '',
        cartItems: [{}],
        modalVisible: false,
        designation: '',
        allStock: [],
        userId: '',
        memberId: '',
        cartData: [],
        refreshing: false
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            const willFocusSubscription = this.props.navigation.addListener(
                'willFocus',
                () => {
                    this._onRefresh()
                }
            )
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


    _onRefresh = () => {
        this.setState({
            refreshing: true
        })

        AsyncStorage.getItem('authedToken').then((token) => {
            const userId = jwtDecode(token).credential
            const designation = jwtDecode(token).designation
            const memberId = jwtDecode(token).userId

            this.setState({
                userId,
                memberId
            }, () => {
                getDesignationById(designation).then(res => {
                    this.setState({
                        designation: res.data.response.designationName
                    })
                })
                getUserDetailsById(this.state.userId).then(res => {
                    if (res) {
                        this.setState({
                            userDetails: res.data.response,
                            branch: res.data.response.branch._id,

                        }, () => {
                            const data = {
                                branch: this.state.branch
                            }
                            getAndSearchStock(data).then(res => {
                                if (res) {
                                    this.setState({
                                        allStock: res.data.response
                                    })
                                }
                            })
                            getMemberCartById(this.state.memberId).then(res => {
                                if (res) {
                                    this.setState({

                                        cartData: res.data.response,
                                        refreshing: false
                                    })
                                }
                            })
                        })
                    }
                })

            })
        })


    }

    render() {
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>

                <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('HomePage')}>
                            <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                            <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('webShop')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Cart')}>
                            <View style={{ transform: transform() }}>
                                <Icon name="cart-icon" size={width / 12} style={{ top: width / 30, marginLeft: width / 30 }} color="#333" />
                                {this.state.cartData.length > 0 ? <View style={{ width: width / 22, height: width / 22, backgroundColor: 'orange', position: 'absolute', borderRadius: width / 44, top: 10, right: -2 }}><Text numberOfLines={1} style={{ textAlign: 'center', fontSize: width / 40, marginTop: 'auto', marginBottom: 'auto', color: 'white' }}>{this.state.cartData.length}</Text></View> : <View></View>}

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setModalVisible(!this.state.modalVisible)}>
                            <Icon name="three-dots" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#ddd" />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        progressBackgroundColor='#1976d2'
                        colors={['white', 'yellow']}
                    />}>
                    <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>

                        {this.state.allStock.map((data, i) => {
                            const image = `${URL}/${data.image.path.replace(/\\/g, "/")}`
                            const userImage = JSON.parse(JSON.stringify({ uri: image }))
                            const { offerDetails, sellingPrice } = data
                            const offerStatus = (offerDetails && offerDetails.isOffer && offerDetails.offerDetails.status && new Date().setHours(0, 0, 0, 0) <= new Date(offerDetails.offerDetails.endDate)) ? true : false
                            return (
                                <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('ItemDetails', { id: data._id, title: data.itemName, offerPerecntage: (offerDetails && offerDetails.isOffer && offerDetails.offerDetails.status && new Date().setHours(0, 0, 0, 0) <= new Date(offerDetails.offerDetails.endDate)) ? offerDetails.offerDetails.offerPercentage : false })}>
                                    <View key={i} style={{ paddingBottom: width / 20, borderWidth: 1, width: width / 2.4, marginTop: width / 20, backgroundColor: 'white', borderColor: '#ddd', transform: transform() }}>
                                        {offerStatus === true ? <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                            <Image resizeMode='stretch' style={{ width: width / 12, height: width / 5 }} source={offer} />

                                            <Image resizeMode='stretch' style={{ width: width / 3.8, height: width / 2.8, marginTop: width / 30 }} source={userImage} />

                                        </View> :

                                            <Image resizeMode='stretch' style={{ width: width / 3, height: width / 2.8, marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto' }} source={userImage} />

                                        }

                                        <View style={{ marginTop: width / 50 }}>
                                            <Text numberOfLines={1} style={{ fontSize: width / 28, color: 'grey', paddingRight: paddingRight(), marginLeft: width / 30 }}>{data.itemName}</Text>
                                            {offerStatus === true ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width / 2.6, marginLeft: 'auto', marginRight: 'auto' }}>
                                                <View style={{ marginTop: width / 30, }}>
                                                    <ImageBackground source={offerVer} style={{ width: width / 5, height: width / 20 }} >
                                                        <Text style={{ fontSize: width / 35, fontWeight: 'bold', color: 'white', marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 80 }}>{offerDetails.offerDetails.offerPercentage}% OFF</Text>
                                                    </ImageBackground>
                                                </View>

                                                <Text style={{ fontSize: width / 28, fontWeight: 'bold', color: '#e53935', marginTop: width / 30, paddingRight: paddingRight() }}>{this.state.currency} {(offerDetails && offerDetails.isOffer && offerDetails.offerDetails.status) ? (sellingPrice * (1 - offerDetails.offerDetails.offerPercentage / 100)).toFixed(2) : sellingPrice.toFixed(2)}</Text>
                                            </View> : <Text style={{ fontSize: width / 22, marginLeft: width / 30, fontWeight: 'bold', color: '#e53935', marginTop: width / 30, paddingRight: paddingRight() }}>{this.state.currency} {data.sellingPrice}</Text>
                                            }
                                            {offerStatus === true ? <Text style={{ fontSize: width / 28, marginLeft: width / 30, color: 'grey', marginTop: width / 60, paddingRight: paddingRight(), textDecorationLine: 'line-through', textDecorationStyle: 'solid', }}>{this.state.currency} {data.sellingPrice}</Text> : <View></View>}

                                        </View>
                                    </View>
                                </TouchableOpacity>
                                // <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('ItemDetails', { id: data._id, title: data.itemName })}>
                                // <View key={i} style={{ paddingBottom: width / 20, borderWidth: 1, width: width / 2.4, marginTop: width / 20, backgroundColor: 'white', borderColor: '#ddd', transform: transform() }}>
                                //     <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                //         <Image resizeMode='stretch' style={{ width: width / 12, height: width / 5 }} source={offer} />

                                //         <Image resizeMode='stretch' style={{ width: width / 3.8, height: width / 2.8, marginTop: width / 30 }} source={userImage} />

                                //     </View>

                                //     <View style={{ marginTop: width / 50, marginLeft: width / 30 }}>
                                //         <Text numberOfLines={1} style={{ fontSize: width / 28, color: 'grey', paddingRight: paddingRight() }}>{data.itemName}</Text>
                                //         <Text style={{ fontSize: width / 22, fontWeight: 'bold', color: '#e53935', marginTop: width / 60, paddingRight: paddingRight() }}>{this.state.currency} {data.sellingPrice}</Text>
                                //         <Text style={{ fontSize: width / 28, color: 'grey', marginTop: width / 60, paddingRight: paddingRight(), textDecorationLine: 'line-through', textDecorationStyle: 'solid', }}>{this.state.currency} {data.sellingPrice}</Text>

                                //     </View>
                                // </View>
                                // </TouchableOpacity>


                            )
                        })}

                    </View>

                </ScrollView>


                {this.state.modalVisible === true ?
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', right: width / 25, marginTop: width / 5.5, position: 'absolute', transform: transform() }}>
                        <TouchableOpacity onPress={() => { this.setModalVisible(false), this.props.navigation.navigate('Orders') }}>
                            <View elevation={3} style={{ backgroundColor: 'white', height: width / 9, width: w / 3, transform: transform() }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 40, width: width / 1.15, marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 60, }}>
                                    <Text style={{ fontSize: width / 25, color: '#333', marginLeft: width / 30, transform: transform(), textAlign: textAlign(), }}>{i18n.t('myOrders')}</Text>
                                </View>


                            </View>
                        </TouchableOpacity>
                    </View> : <View></View>}


            </View>
        )
    }
}

export default MenuItems