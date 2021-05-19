import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { getAllPackage } from '../../utils/api/package'
import { getCurrency, getMemberById } from '../../utils/api/authorization'
import { getPackagesByID } from '../../utils/api/package'
import sq from '../../assets/images/sq.jpg'
import blue from '../../assets/images/blue.jpg'
import alert from '../../assets/images/alert.png'
import red from '../../assets/images/red.jpg'
import green from '../../assets/images/green.jpg'
import i18n from 'i18n-js';

export default class RenewPackage extends React.Component {
    _isMounted = false

    state = {
        currency: '',
        rtl: null,
        packages: [],
        userDetails: '',
        userCredentials: '',
        renewPackages: [],
        packageInfo: [],
        modalVisible: false,
        comparePackage: []
    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            AsyncStorage.getItem('authedToken').then((token) => {
                const userId = jwtDecode(token).userId

                this.setState({
                    userId,

                }, () => {
                    getMemberById(this.state.userId).then(res => {
                        if (res) {

                            this.setState({
                                userDetails: res.data.response,
                                userCredentials: res.data.response.credentialId,
                                renewPackages: res.data.response.packageDetails,
                                comparePackage: res.data.response.packageDetails
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
            getAllPackage().then(res => {
                if (res) {
                    this.setState({
                        packages: res.data.response === null ? [] : res.data.response.filter(data => new Date().setHours(0, 0, 0, 0) <= new Date(data.endDate)),
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

    compare = (data) => {
        const packages = this.state.comparePackage.filter(id => id.packages._id === data)
        const Renewpackages = this.state.renewPackages.filter(id => id.packages._id === data)
        if (packages.length > 0) {

            if (packages[0].endDate !== undefined) {
                if (Renewpackages.length > 0) {
                    this.setModalVisible(true)
                } else {
                    this.props.navigation.navigate('PackageDetails', { id: data })

                }
            }

            else {
                if (packages.length > 0) {
                    this.setModalVisible(true)
                } else {
                    this.props.navigation.navigate('PackageDetails', { id: data })

                }
            }
        } else {
            this.props.navigation.navigate('PackageDetails', { id: data })

        }
    }

    renderRenewButton = (e, data, pId, rn) => {
        const packages = this.state.packages.filter(id => id._id === data)
        if (new Date(e).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) && packages.length >= 1 && rn === false) {
            return (
                <TouchableOpacity onPress={() => this.props.navigation.navigate('PackageDetails', { id: data, pId })}>
                    <View style={{ justifyContent: 'flex-end', flexDirection: 'row', width: w / 1.15 }}>
                        <View style={{ paddingBottom: width / 80, paddingTop: width / 80, width: w / 5, backgroundColor: 'white', borderRadius: 5, }}>
                            <Text style={{ fontSize: width / 28, color: '#333', textAlign: 'center' }}>{i18n.t('renew')}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    render() {
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>
                    <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                            <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('packages')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ transform: transform(), marginTop: width / 30, marginLeft: width / 30 }}>
                        <Text style={{ fontSize: width / 24, color: '#333', fontWeight: 'bold', textAlign: textAlign() }}>{i18n.t('currentPackages')}</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: width / 20 }}>
                        {this.state.renewPackages.map((data, i) => {
                            const allDate = new Date(data.extendDate ? data.extendDate : data.endDate).getDate()
                            const dates = allDate
                            const monthNames = [i18n.t('Jan'), i18n.t('Feb'), i18n.t('Mar'), i18n.t('Apr'), i18n.t('May'), i18n.t('Jun'),
                            i18n.t('Jul'), i18n.t('Aug'), i18n.t('Sep'), i18n.t('Oct'), i18n.t('Nov'), i18n.t('Dec')
                            ]
                            const months = monthNames[parseInt(new Date(data.extendDate ? data.extendDate : data.endDate).getMonth())]
                            const year = new Date(data.extendDate ? data.extendDate : data.endDate).getFullYear()
                            function getImage(e) {
                                if (e !== undefined) {
                                    if (e % 3 === 0) {
                                        return blue
                                    } else if (e % 3 === 1) {
                                        return red
                                    } else {
                                        return green
                                    }
                                }

                            }

                            return (
                                <ImageBackground source={getImage(i)} imageStyle={{ borderRadius: 5 }} key={i} style={{ width: w / 1.1, marginTop: width / 30, paddingBottom: width / 30, transform: transform(), marginLeft: width / 30 }}>
                                    <View style={{ flexDirection: 'row', marginTop: width / 30, marginLeft: width / 30, justifyContent: 'space-between', width: w / 1.2 }}>
                                        {data.endDate ? new Date(data.extendDate ? data.extendDate : data.endDate).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0) ? <Text style={{ fontSize: width / 24, color: 'white', }}>{i18n.t('currentPlan')}</Text> :
                                            <Text style={{ fontSize: width / 24, color: 'white', }}>{i18n.t('previousPlan')}</Text> : <Text style={{ fontSize: width / 24, color: 'white', }}>{i18n.t('currentPlan')}</Text>}
                                        {data.endDate ? new Date(data.extendDate ? data.extendDate : data.endDate).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0) ?
                                            data.reactivationDate && new Date().setHours(0, 0, 0, 0) < new Date(data.reactivationDate).setHours(0, 0, 0, 0) ?
                                                <View style={{ paddingBottom: width / 80, paddingTop: width / 80, width: w / 5, backgroundColor: '#01579b', borderRadius: 5 }}>
                                                    <Text style={{ fontSize: width / 28, color: 'white', textAlign: 'center' }}>{i18n.t('freeze')}</Text>
                                                </View> :
                                                <View style={{ paddingBottom: width / 80, paddingTop: width / 80, width: w / 5, backgroundColor: '#8bc34a', borderRadius: 5 }}>
                                                    <Text style={{ fontSize: width / 28, color: 'white', textAlign: 'center' }}>{i18n.t('active')}</Text>

                                                </View>
                                            : <View style={{ paddingBottom: width / 80, paddingTop: width / 80, width: w / 5, backgroundColor: 'grey', borderRadius: 5 }}>
                                                <Text style={{ fontSize: width / 28, color: 'white', textAlign: 'center' }}>{i18n.t('inActive')}</Text>

                                            </View> : <View style={{ paddingBottom: width / 80, paddingTop: width / 80, width: w / 5, backgroundColor: '#8bc34a', borderRadius: 5 }}>
                                                <Text style={{ fontSize: width / 28, color: 'white', textAlign: 'center' }}>{i18n.t('active')}</Text>

                                            </View>}
                                    </View>
                                    <View style={{ marginTop: width / 50, marginLeft: width / 30 }}>
                                        <Text numberOfLines={1} style={{ fontSize: width / 18, color: 'white', width: w / 1.5, fontWeight: 'bold', }}>{data.packages.packageName}</Text>
                                    </View>
                                    {data.endDate ? new Date(data.extendDate ? data.extendDate : data.endDate).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0) ? <View style={{ marginTop: width / 50, marginLeft: width / 30 }}>
                                        <Text numberOfLines={2} style={{ fontSize: width / 28, color: 'white', width: w / 1.5, }}>{i18n.t('yourCurrentPlanSubscriptionIsActiveThrough')} {months} {dates} {year}</Text>
                                    </View> : <View style={{ marginTop: width / 50, marginLeft: width / 30 }}>
                                            <Text numberOfLines={2} style={{ fontSize: width / 28, color: 'white', width: w / 1.5, }}>{i18n.t('yourPreviousPlanSubscriptionWasActiveThrough')} {months} {dates} {year}</Text>
                                        </View> : <View style={{ marginTop: width / 50, marginLeft: width / 30 }}>
                                            <Text numberOfLines={2} style={{ fontSize: width / 28, color: 'white', width: w / 1.5, }}>{i18n.t('yourCurrentPlanSubscriptionIsActiveThrough')} {months} {dates} {year}</Text>
                                        </View>}

                                    {this.renderRenewButton(data.extendDate ? data.extendDate : data.endDate, data.packages._id, data._id, data.packageRenewal)}
                                </ImageBackground>

                            )
                        })}

                    </ScrollView>
                    <View style={{ transform: transform(), marginTop: width / 30, marginLeft: width / 30 }}>
                        <Text style={{ fontSize: width / 24, color: '#333', fontWeight: 'bold', textAlign: textAlign() }}>{i18n.t('newPackages')}</Text>
                    </View>
                    {this.state.packages.map((data, i) => {
                        const img = `${URL}/${data.image.path.replace(/\\/g, "/")}`
                        const packageImage = JSON.parse(JSON.stringify({ uri: img }))
                        return (
                            <TouchableOpacity key={i} onPress={() => this.compare(data._id)}>
                                <Image resizeMode='stretch' style={{ width: w / 1.1, height: height / 3, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20 }} source={packageImage} />
                                <View key={i} style={{ backgroundColor: data.color, width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', borderRadius: 3, paddingBottom: width / 20 }}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ width: w / 1.7, fontSize: width / 21, fontWeight: 'bold', color: 'white', marginLeft: width / 30, transform: transform(), textAlign: textAlign(), marginTop: width / 60 }}>{data.packageName}</Text>
                                        <Text numberOfLines={2} style={{ width: w / 1.2, color: 'white', fontSize: width / 32, marginLeft: width / 30, transform: transform(), textAlign: textAlign(), marginTop: width / 80 }}>{data.description}.</Text>

                                    </View>
                                    <View style={{ width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon name="attendance" size={width / 22} color="white" />
                                            <Text style={{ fontSize: width / 25, color: 'white', transform: transform(), textAlign: 'center', marginLeft: width / 50 }}>{data.period.periodName}</Text>
                                        </View>
                                        <Text style={{ fontSize: width / 18, color: 'white', textAlign: 'center', fontWeight: 'bold', transform: transform(), width: w / 4, bottom: 5 }}>{this.state.currency} {(data.amount).toFixed(3)}</Text>
                                    </View>

                                </View>
                            </TouchableOpacity>
                        )
                    })}


                </ScrollView>
                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                    animationType='slide'
                >
                    <View elevation={3} style={{ backgroundColor: '#ffebee', height: height / 2.5, width: width - 80, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <Image style={{ width: w / 5, height: width / 5, marginLeft: 'auto', marginRight: 'auto', marginTop: height / 30 }} source={alert} />
                        <Text style={{ fontSize: width / 22, color: '#333', textAlign: 'center', marginTop: height / 30, width: width - 100, marginLeft: 'auto', marginRight: 'auto' }}>{i18n.t('youCantBuyTheSamePackageTwice')}</Text>
                        <TouchableOpacity onPress={() => { this.setModalVisible(false) }}>
                            <View style={{ width: width / 8, height: width / 8, borderRadius: width / 16, backgroundColor: '#03a9f4', marginLeft: 'auto', marginRight: 'auto', marginTop: height / 30 }}>
                                <Icon name="close" size={width / 20} style={{ marginRight: 'auto', marginLeft: 'auto', marginTop: 'auto', marginBottom: 'auto' }} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }
}