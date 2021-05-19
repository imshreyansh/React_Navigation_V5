import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground, RefreshControl } from 'react-native';
import Header from '../common/Header'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { getGiftcardById, redeemOffer, getRedeemOffer, cancelRedeem } from '../../utils/api/rewards'
import { getCurrency } from '../../utils/api/authorization'
import i18n from 'i18n-js';
import bar from '../../assets/images/bar.png'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import Loader from '../../utils/resources/Loader'

export default class GiftCardDetails extends React.Component {
    _isMounted = false
    state = {
        giftCard: '',
        currency: '',
        refreshing: false,
        memberId: '',
        redeem: null,
        loading: false
    }


    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            this._onRefresh()

        }


    }

    componentWillUnmount() {
        this._isMounted = false
    }

    onGetGiftCard = () => {
        getGiftcardById(this.props.navigation.getParam('id')).then(res => {
            if (res) {
                this.setState({
                    giftCard: res.data.response
                })
            }
        })
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
                this.onGetGiftCard()
                const obj = {
                    member: this.state.memberId,
                    giftCard: this.props.navigation.getParam('id')
                }
                getRedeemOffer(obj).then(res => {
                    if (res) {
                        this.setState({
                            redeem: res.data.response,
                            refreshing: false
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

    redeemOffer = () => {

        const obj = {
            member: this.state.memberId,
            giftCard: this.props.navigation.getParam('id')
        }
        redeemOffer(obj).then(res => {
            if (res) {
                this._onRefresh()
            }
        })
    }

    onUnredeem = () => {
        const obj = {
            transactionId: this.state.redeem._id
        }
        cancelRedeem(obj).then(res => {
            if (res) {
                this._onRefresh()
            }
        })
    }

    renderButton = () => {
        if (this.state.redeem !== null) {
            const uri = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${this.state.redeem.redeemCode}`
            // const uri = `http://barcodes4.me/barcode/c128b/${this.state.redeem.redeemCode}.png`
            return (
                <View>
                    <Image source={{ uri }} resizeMode='stretch' style={{ width: w / 1.8, height: width / 5, marginTop: width / 20, marginLeft: 'auto', marginRight: 'auto', transform: transform() }} />
                    <TouchableOpacity onPress={() => this.onUnredeem()}>

                        <View style={{ width: width / 12, height: width / 12, borderRadius: width / 24, backgroundColor: 'orange', marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto', }}>
                            <Icon name="reject-icon" size={width / 20} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} color="white" />

                        </View>
                    </TouchableOpacity>
                </View>

            )
        } else {
            return (

                <TouchableOpacity onPress={() => this.redeemOffer()}>
                    <View style={{ width: w / 3, height: height / 19, backgroundColor: '#00c853', borderRadius: 3, marginTop: width / 20, marginLeft: 'auto', marginRight: 'auto' }}>
                        <Text style={{ fontSize: width / 22, color: 'white', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', transform: transform() }}>{i18n.t('redeem')}</Text>

                    </View>
                </TouchableOpacity>

            )
        }
    }

    render() {
        const { giftCard } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: '#eeeeee', transform: transform() }}>

                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        progressBackgroundColor='#1976d2'
                        colors={['white', 'yellow']}
                    />}>
                    <View style={{ width: w, height: width / 6.5, backgroundColor: '#eee', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Icon name="back-button" size={width / 20} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                                <Text style={{ marginLeft: width / 8, bottom: width / 60, fontSize: width / 22, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('giftCardDetails')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.1, backgroundColor: 'white', marginTop: width / 30, paddingBottom: width / 30, borderRadius: 3 }}>
                        <Text style={{ width: w / 1.2, marginLeft: width / 30, marginTop: width / 30, fontSize: width / 22, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{giftCard.title}</Text>
                        <Text style={{ width: w / 1.2, marginLeft: width / 30, marginTop: width / 30, fontSize: width / 25, color: 'grey', transform: transform(), textAlign: textAlign(), }}>{giftCard.description}</Text>
                        <View style={{ width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'column', width: w / 2.5 }}>
                                    <Text style={{ textAlign: 'center', fontSize: width / 25, color: 'grey', transform: transform() }}>{i18n.t('start')}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon name="attendance" size={width / 15} color="orange" style={{ transform: transform() }} />
                                        <Text style={{ textAlign: 'center', fontSize: width / 22, marginLeft: width / 30, marginTop: width / 80, fontWeight: 'bold', color: '#00c853', transform: transform() }}>{new Date(giftCard.startDate).getDate()}/{new Date(giftCard.startDate).getMonth() + 1}/{new Date(giftCard.startDate).getFullYear()}</Text>

                                    </View>
                                </View>
                                <View style={{ flexDirection: 'column', width: w / 2.5 }}>
                                    <Text style={{ textAlign: 'center', fontSize: width / 25, color: 'grey', transform: transform() }}>{i18n.t('end')}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon name="attendance" size={width / 15} color="orange" style={{ transform: transform() }} />
                                        <Text style={{ textAlign: 'center', fontSize: width / 22, marginLeft: width / 30, marginTop: width / 80, fontWeight: 'bold', color: '#00c853', transform: transform() }}>{new Date(giftCard.endDate).getDate()}/{new Date(giftCard.endDate).getMonth() + 1}/{new Date(giftCard.endDate).getFullYear()}</Text>

                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginTop: width / 30, width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', width: w / 2.5 }}>
                                <Icon name="grade-mobile" size={width / 7} color="grey" style={{ transform: transform() }} />
                                <View style={{ flexDirection: 'column', marginLeft: width / 30, }}>
                                    <Text style={{ fontSize: width / 25, color: 'grey', transform: transform() }}>{i18n.t('totalPoints')}</Text>
                                    <Text style={{ fontSize: width / 12, fontWeight: 'bold', color: '#039be5', transform: transform() }}>{giftCard.points}</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: width / 12, fontWeight: 'bold', color: 'orange', marginTop: width / 30, transform: transform() }}>{this.state.currency} {giftCard.amount}</Text>

                        </View>
                        {this.renderButton()}
                    </View>
                </ScrollView>
            </View >
        )
    }
}