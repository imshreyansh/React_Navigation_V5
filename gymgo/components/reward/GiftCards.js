import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground, RefreshControl } from 'react-native';
import Header from '../common/Header'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { getCurrency, getMemberById } from '../../utils/api/authorization'
import { getAllGiftCards } from '../../utils/api/rewards'
import i18n from 'i18n-js';
import curvedImage from '../../assets/images/curvedImage.png'
import gift1 from '../../assets/images/gift1.png'
import gift2 from '../../assets/images/gift2.png'
import gift3 from '../../assets/images/gift3.png'
import gift4 from '../../assets/images/gift4.png'
import gift5 from '../../assets/images/gift5.png'
import gift6 from '../../assets/images/gift6.png'
import gift7 from '../../assets/images/gift7.png'
import gift8 from '../../assets/images/gift8.png'
import gift9 from '../../assets/images/gift9.png'
import gift10 from '../../assets/images/gift10.png'

import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'

export default class GiftCards extends React.Component {
    _isMounted = false
    state = {
        refreshing: false,
        currency: '',
        giftCards: [],
        userDetails: '',
        walletPoints: 0
    }


    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            const unsubscribe = this.props.navigation.addListener('didFocus', () => {
                this._onRefresh()
            })
            return unsubscribe


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
            const memberId = jwtDecode(token).userId

            this.setState({
                memberId
            }, () => {
                getMemberById(this.state.memberId).then(res => {
                    if (res) {
                        this.setState({
                            userDetails: res.data.response,
                            walletPoints: res.data.response.walletPoints
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
        getAllGiftCards().then(res => {
            if (res) {
                this.setState({
                    giftCards: res.data.response,
                    refreshing: false
                })
            }
        })

    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: '#eeeeee', transform: transform() }}>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        progressBackgroundColor='#1976d2'
                        colors={['white', 'yellow']}
                    />}>
                    <ImageBackground source={curvedImage} style={{ width: w, height: height / 4 }} >
                        <Text style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: width / 22, color: 'white', marginTop: width / 30, fontWeight: 'bold', transform: transform() }}>{i18n.t('currentPoints')}</Text>
                        <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, width: w / 2, backgroundColor: 'white', paddingBottom: width / 50, borderRadius: 5 }}>
                            <Text style={{ fontSize: width / 8, textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', color: '#ff9800', fontWeight: 'bold', transform: transform() }}>{this.state.walletPoints}</Text>
                        </View>
                    </ImageBackground>
                    {this.state.giftCards.map((data, i) => {

                        function getImage() {
                            if (data.image === 1) {
                                return gift1
                            } else if (data.image === 2) {
                                return gift2
                            } else if (data.image === 3) {
                                return gift3
                            } else if (data.image === 4) {
                                return gift4
                            } else if (data.image === 5) {
                                return gift5
                            } else if (data.image === 6) {
                                return gift6
                            } else if (data.image === 7) {
                                return gift7
                            } else if (data.image === 8) {
                                return gift8
                            } else if (data.image === 9) {
                                return gift9
                            } else if (data.image === 10) {
                                return gift10
                            }
                        }
                        return (
                            <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('GiftCardDetails', { id: data._id })}>
                                <ImageBackground source={getImage()} imageStyle={{ borderRadius: 5 }} style={{ width: w / 1.08, paddingBottom: width / 15, marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto' }} >
                                    <Text numberOfLines={2} style={{ width: w / 1.2, marginLeft: width / 30, marginTop: width / 30, fontSize: width / 22, color: 'white', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{data.title}</Text>
                                    <Text numberOfLines={2} style={{ width: w / 1.2, marginLeft: width / 30, marginTop: width / 30, fontSize: width / 25, color: 'white', transform: transform(), textAlign: textAlign(), }}>{data.description}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                                        <View style={{ width: w / 3, height: height / 20 }}>
                                            <View style={{ backgroundColor: 'white', height: height / 20, opacity: 0.3, borderRadius: 3 }} />
                                            <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: w / 3.2, marginTop: height / 150 }}>
                                                <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: width / 25, color: 'white', transform: transform() }}>{data.points} {i18n.t('points')}</Text>

                                            </View>

                                        </View>


                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        )
                    })}

                </ScrollView>
            </View>
        )
    }
}