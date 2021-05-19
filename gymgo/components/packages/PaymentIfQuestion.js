import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, StyleSheet, Picker, Modal, Image, Linking } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, isTablet } from '../../utils/api/helpers'
import i18n from 'i18n-js'
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../utils/resources/Loader'
import { getPackagesByID, URL } from '../../utils/api/package'
import { getCurrency, updateMember, getUserDetailsById } from '../../utils/api/authorization'
import { payAtGymMobile, payOnline, getDefaultVat } from '../../utils/api/package'



class PaymentIfQuestion extends Component {
    _isMounted = false

    state = {
        currency: '',
        online: true,
        gym: false, gymdata: '',
        data: '',
        packageDetails: '',
        period: '',
        trainerAmount: '',
        tax: 12.47,
        gymPaymentStatus: '',
        loading: false,
        modalVisible: false,
        doneFingerAuth: '',
        navigation: '',
        branch: ''

    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {

            this.setState({
                trainerAmount: this.props.navigation.getParam('flag') === true ? this.props.navigation.getParam('id').trainerFees : '',
            })
            getCurrency().then(res => {
                if (res) {
                    this.setState({
                        currency: res.data.response
                    })
                }
            })

            this.setState({
                data: this.props.navigation.getParam('flag') === true ? this.props.navigation.getParam('id') : this.props.navigation.getParam('idNoTrainer')
            }, () => {
                getPackagesByID(this.state.data.packageId).then(res => {
                    if (res) {
                        this.setState({
                            packageDetails: res.data.response,
                            period: res.data.response.period
                        })
                    }
                })

                getUserDetailsById(this.state.data.credId).then(res => {
                    if (res) {
                        this.setState({
                            branch: res.data.response.branch._id,
                            doneFingerAuth: res.data.response.doneFingerAuth
                        }, () => {
                            const data = {
                                branch: this.state.branch
                            }
                            getDefaultVat(data).then(res => {
                                if (res) {
                                    this.setState({
                                        tax: res.data.response[0].taxPercent
                                    })
                                }
                            })
                            if (this.state.doneFingerAuth !== false) {
                                this.setState({ navigation: 'RenewPackage' })
                            } else {
                                this.setState({ navigation: 'PackageHome' })
                            }
                        })

                    }
                })

            })




        }

    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    onPayOnline = () => {
        if (this.props.navigation.getParam('flag') === true) {
            const id = this.props.navigation.getParam('id')
            if (this.props.navigation.getParam('oldPackageId') !== undefined) {
                const datas = {
                    totalAmount: (this.props.navigation.getParam('id').trainerFees + this.state.packageDetails.amount + (this.state.packageDetails.amount * (this.state.tax / 100))).toFixed(2),
                    memberId: this.props.navigation.getParam('id').id,
                    packages: id.packageId,
                    trainerFees: id.trainerFeesId,
                    trainer: id.trainerId,
                    paidType: "Online",
                    paidStatus: "Paid",
                    oldPackageId: this.props.navigation.getParam('oldPackageId')

                }


                this.setState({
                    loading: true
                })
                payOnline(datas).then(res => {
                    if (res) {
                        Linking.openURL(res.data.response)

                        this.setState({ loading: false }, () => this.props.navigation.navigate(this.state.navigation))
                    }
                })
            } else {
                const datas = {
                    totalAmount: (this.props.navigation.getParam('id').trainerFees + this.state.packageDetails.amount + (this.state.packageDetails.amount * (this.state.tax / 100))).toFixed(2),
                    memberId: this.props.navigation.getParam('id').id,
                    packages: id.packageId,
                    trainerFees: id.trainerFeesId,
                    trainer: id.trainerId,
                    paidType: "Online",
                    paidStatus: "Paid",

                }


                this.setState({
                    loading: true
                })
                payOnline(datas).then(res => {
                    if (res) {
                        Linking.openURL(res.data.response)

                        this.setState({ loading: false }, () => this.props.navigation.navigate(this.state.navigation))
                    }
                })
            }

        } else {
            const id = this.props.navigation.getParam('idNoTrainer')
            if (this.props.navigation.getParam('oldPackageId') !== undefined) {
                const datas = {
                    totalAmount: (this.state.packageDetails.amount + (this.state.packageDetails.amount * (this.state.tax / 100))).toFixed(2),
                    memberId: this.props.navigation.getParam('id').id,
                    packages: id.packageId,
                    paidType: "Online",
                    paidStatus: "Paid",
                    oldPackageId: this.props.navigation.getParam('oldPackageId')

                }


                this.setState({
                    loading: true
                })
                payOnline(datas).then(res => {
                    if (res) {
                        Linking.openURL(res.data.response)

                        this.setState({ loading: false }, () => this.props.navigation.navigate(this.state.navigation))
                    }
                })
            } else {
                const datas = {
                    totalAmount: (this.state.packageDetails.amount + (this.state.packageDetails.amount * (this.state.tax / 100))).toFixed(2),
                    memberId: this.props.navigation.getParam('id').id,
                    packages: id.packageId,
                    paidType: "Online",
                    paidStatus: "Paid",

                }


                this.setState({
                    loading: true
                })
                payOnline(datas).then(res => {
                    if (res) {
                        Linking.openURL(res.data.response)

                        this.setState({ loading: false }, () => this.props.navigation.navigate(this.state.navigation))
                    }
                })
            }

        }


    }

    onPayAtGymRenew = () => {
        if (this.props.navigation.getParam('flag') === true) {
            const id = this.props.navigation.getParam('id')
            const totalAmount = (id.trainerFees + this.state.packageDetails.amount + (this.state.packageDetails.amount * (this.state.tax / 100))).toFixed(2)
            if (this.props.navigation.getParam('oldPackageId') !== undefined) {
                const data = {

                    packageDetails: [{
                        packages: id.packageId,
                        trainer: id.trainerId,
                        totalAmount,
                        paidType: "Pay At Gym",
                        paidStatus: "UnPaid",
                        trainerFees: id.trainerFeesId
                    }],
                    oldPackageId: this.props.navigation.getParam('oldPackageId')

                }
                this.setState({
                    loading: true
                })
                payAtGymMobile(data, id.id).then(res => {
                    if (res) {
                        this.setState({
                            gymPaymentStatus: res.data.response
                        }, () => this.setModalVisible(true)
                        )
                    }
                })
            } else {
                const data = {

                    packageDetails: [{
                        packages: id.packageId,
                        trainer: id.trainerId,
                        totalAmount,
                        paidType: "Pay At Gym",
                        paidStatus: "UnPaid",
                        trainerFees: id.trainerFeesId,
                    }]
                }
                this.setState({
                    loading: true
                })
                payAtGymMobile(data, id.id).then(res => {
                    if (res) {
                        this.setState({
                            gymPaymentStatus: res.data.response
                        }, () => this.setModalVisible(true)
                        )
                    }
                })
            }

        } else {
            if (this.props.navigation.getParam('oldPackageId') !== undefined) {
                const id = this.props.navigation.getParam('idNoTrainer')
                const totalAmount = (this.state.packageDetails.amount + (this.state.packageDetails.amount * (this.state.tax / 100))).toFixed(2)
                const data = {

                    packageDetails: [{
                        packages: id.packageId,
                        totalAmount,
                        paidType: "Pay At Gym",
                        paidStatus: "UnPaid"

                    }],
                    oldPackageId: this.props.navigation.getParam('oldPackageId')


                }
                this.setState({
                    loading: true
                })
                payAtGymMobile(data, id.id).then(res => {
                    if (res) {
                        this.setState({
                            gymPaymentStatus: res.data.response
                        }, () => this.setModalVisible(true)
                        )
                    }
                })
            } else {
                const id = this.props.navigation.getParam('idNoTrainer')
                const totalAmount = (this.state.packageDetails.amount + (this.state.packageDetails.amount * (this.state.tax / 100))).toFixed(2)
                const data = {

                    packageDetails: [{
                        packages: id.packageId,
                        totalAmount,
                        paidType: "Pay At Gym",
                        paidStatus: "UnPaid",
                    }]

                }
                this.setState({
                    loading: true
                })
                payAtGymMobile(data, id.id).then(res => {
                    if (res) {
                        this.setState({
                            gymPaymentStatus: res.data.response
                        }, () => this.setModalVisible(true)
                        )
                    }
                })
            }

        }

    }

    onPayAtGym = () => {
        if (this.props.navigation.getParam('flag') === true) {
            const id = this.props.navigation.getParam('id')
            const totalAmount = (id.trainerFees + this.state.packageDetails.amount + (this.state.packageDetails.amount * (this.state.tax / 100))).toFixed(2)
            if (this.props.navigation.getParam('oldPackageId') !== undefined) {
                const data = {

                    packageDetails: [{
                        packages: id.packageId,
                        trainer: id.trainerId,
                        totalAmount,
                        paidType: "Pay At Gym",
                        paidStatus: "UnPaid",
                        trainerFees: id.trainerFeesId
                    }],
                    oldPackageId: this.props.navigation.getParam('oldPackageId')

                }
                this.setState({
                    loading: true
                })
                payAtGymMobile(data, id.id).then(res => {
                    if (res) {
                        this.setState({
                            gymPaymentStatus: res.data.response
                        }, () => this.setModalVisible(true)
                        )
                    }
                })
            } else {
                const data = {

                    packageDetails: [{
                        packages: id.packageId,
                        trainer: id.trainerId,
                        totalAmount,
                        paidType: "Pay At Gym",
                        paidStatus: "UnPaid",
                        trainerFees: id.trainerFeesId,
                    }]
                }
                this.setState({
                    loading: true
                })
                payAtGymMobile(data, id.id).then(res => {
                    if (res) {
                        this.setState({
                            gymPaymentStatus: res.data.response
                        }, () => this.setModalVisible(true)
                        )
                    }
                })
            }

        } else {
            if (this.props.navigation.getParam('oldPackageId') !== undefined) {
                const id = this.props.navigation.getParam('idNoTrainer')
                const totalAmount = (this.state.packageDetails.amount + (this.state.packageDetails.amount * (this.state.tax / 100))).toFixed(2)
                const data = {

                    packageDetails: [{
                        packages: id.packageId,
                        totalAmount,
                        paidType: "Pay At Gym",
                        paidStatus: "UnPaid"

                    }],
                    oldPackageId: this.props.navigation.getParam('oldPackageId')


                }
                this.setState({
                    loading: true
                })
                payAtGymMobile(data, id.id).then(res => {
                    if (res) {
                        this.setState({
                            gymPaymentStatus: res.data.response
                        }, () => this.setModalVisible(true)
                        )
                    }
                })
            } else {
                const id = this.props.navigation.getParam('idNoTrainer')
                const totalAmount = (this.state.packageDetails.amount + (this.state.packageDetails.amount * (this.state.tax / 100))).toFixed(2)
                const data = {

                    packageDetails: [{
                        packages: id.packageId,
                        totalAmount,
                        paidType: "Pay At Gym",
                        paidStatus: "UnPaid",
                    }]

                }
                this.setState({
                    loading: true
                })
                payAtGymMobile(data, id.id).then(res => {
                    if (res) {
                        this.setState({
                            gymPaymentStatus: res.data.response
                        }, () => this.setModalVisible(true)
                        )
                    }
                })
            }

        }

    }
    componentWillUnmount() {
        this._isMounted = false
    }
    renderButtons = () => {
        return (

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20 }}>
                <TouchableOpacity onPress={() => this.setState({ online: true, gym: false })}>
                    <View style={{ flexDirection: 'row' }}>
                        {this.state.online === true ? <Icon name='transport-status' size={width / 15} style={{ transform: transform() }} color="#7e57c2" /> : <View style={{ width: width / 15, height: width / 15, borderRadius: width / 30, borderWidth: 1, borderColor: 'grey' }} />}
                        <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 24, color: '#333', marginLeft: width / 30 }}>{i18n.t('payOnline')}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({ online: false, gym: true })}>
                    <View style={{ flexDirection: 'row' }}>
                        {this.state.gym === true ? <Icon name='transport-status' size={width / 15} style={{ transform: transform() }} color="#7e57c2" /> : <View style={{ width: width / 15, height: width / 15, borderRadius: width / 30, borderWidth: 1, borderColor: 'grey' }} />}
                        <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 24, color: '#333', marginLeft: width / 30 }}>{i18n.t('payAtGym')}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderButtonsPay = () => {
        if (this.state.gym === true) {
            return (
                <TouchableOpacity onPress={() => { this.props.navigation.getParam('flag') === true ? this.props.navigation.getParam('id').didFingerAuth === true ? this.onPayAtGymRenew() : this.onPayAtGym() : this.props.navigation.getParam('idNoTrainer').didFingerAuth === true ? this.onPayAtGymRenew() : this.onPayAtGym() }}>
                    <View style={{ transform: transform(), width: w / 1.2, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                        <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50 }}>{i18n.t('submit')}</Text>
                    </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.onPayOnline()}>
                    <View style={{ transform: transform(), width: w / 1.2, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                        <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50 }}>{i18n.t('makePayment')}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    }
    render() {
        const totalAmount = this.props.navigation.getParam('flag') === true ? (this.props.navigation.getParam('id').trainerFees + this.state.packageDetails.amount + (this.state.packageDetails.amount * (this.state.tax / 100))).toFixed(3) : (this.state.packageDetails.amount + (this.state.packageDetails.amount * (this.state.tax / 100))).toFixed(3)
        return (
            <View style={{ flex: 1, transform: transform(), backgroundColor: '#eeeeee' }}>
                <Loader loading={this.state.loading} text='Loading' />

                <ScrollView contentContainerStyle={{ paddingBottom: width / 10 }}>
                    <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                            <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('packageDetails')}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginTop: width / 30, width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', paddingBottom: width / 20, borderRadius: 2 }}>
                        <Text style={{ marginLeft: width / 30, marginTop: width / 30, fontSize: width / 22, transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>{i18n.t('paymentMethod')}</Text>
                        {this.renderButtons()}

                    </View>
                    <View style={{ marginTop: width / 30, width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', paddingBottom: width / 20, borderRadius: 2 }}>
                        <Text style={{ marginLeft: width / 30, marginTop: width / 30, fontSize: width / 8, fontWeight: 'bold', textAlign: 'center', transform: transform(), color: '#9575cd' }}>{this.state.currency} {totalAmount === NaN ? '' : totalAmount}</Text>
                        <Text style={{ marginLeft: width / 30, marginTop: width / 30, fontSize: width / 22, textAlign: 'center', transform: transform(), color: 'grey' }}>{i18n.t('totalAmount')}</Text>
                        <View style={{ borderBottomWidth: 1, width: w / 1.15, borderBottomColor: '#ddd', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.15, marginTop: width / 30 }}>
                            <Text style={{ marginLeft: width / 30, marginTop: width / 30, fontSize: width / 25, textAlign: 'center', color: 'grey', transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>{this.state.packageDetails.packageName}</Text>
                            <Text style={{ marginLeft: width / 30, marginTop: width / 30, fontSize: width / 25, textAlign: 'center', color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>{this.state.currency} {this.state.packageDetails.amount ? (this.state.packageDetails.amount).toFixed(3) : ''}</Text>

                        </View>
                        {this.props.navigation.getParam('flag') === true ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.15, marginTop: width / 30 }}>
                            <Text style={{ marginLeft: width / 30, marginTop: width / 30, fontSize: width / 25, textAlign: 'center', color: 'grey', transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>{i18n.t('trainerFees')}</Text>
                            <Text style={{ marginLeft: width / 30, marginTop: width / 30, fontSize: width / 25, textAlign: 'center', color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>{this.state.currency} {this.state.trainerAmount ? (this.state.trainerAmount).toFixed(3) : ''}</Text>

                        </View> : <View></View>}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.15, marginTop: width / 30 }}>
                            <Text style={{ marginLeft: width / 30, marginTop: width / 30, fontSize: width / 25, textAlign: 'center', color: 'grey', transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>{i18n.t('VAT')}</Text>
                            <Text style={{ marginLeft: width / 30, marginTop: width / 30, fontSize: width / 25, textAlign: 'center', color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>{this.state.currency} {this.state.packageDetails.amount ? (this.state.packageDetails.amount * (this.state.tax / 100)).toFixed(3) : ''}</Text>

                        </View>
                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.15, marginTop: width / 30 }}>
                            <Text style={{ marginLeft: width / 30, marginTop: width / 30, fontSize: width / 25, textAlign: 'center', color: 'grey', transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>Total Fees</Text>
                            <Text style={{ marginLeft: width / 30, marginTop: width / 30, fontSize: width / 25, textAlign: 'center', color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>{this.state.currency} 120</Text>

                        </View> */}
                    </View>
                    {this.renderButtonsPay()}
                </ScrollView>
                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View style={{ backgroundColor: '#f3e5f5', height: width / 1.8, width: width - 40, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width / 1.15, marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0.5, paddingBottom: width / 60, borderBottomColor: '#7e57c2' }}>
                            <Text style={{ fontSize: width / 20, color: '#7e57c2', marginLeft: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], textAlign: this.state.isRTL ? 'right' : 'left' }}>Congratulations !!</Text>
                            <TouchableOpacity onPress={() => { this.setModalVisible(false), this.props.navigation.navigate('AuthLoadingScreen') }}>
                                <Icon name="close" size={width / 20} style={{ marginRight: width / 30 }} color="#7e57c2" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: width / 20, marginLeft: width / 30 }}>
                            <Text style={{ fontSize: width / 22, color: '#7e57c2' }}>{this.state.doneFingerAuth === true ? 'You have successfully requested a package for yourself !' : 'You have successfully requested a package for yourself, now proceed to gym for furthere process !'}</Text>
                        </View>

                    </View>
                </Modal>
            </View >
        )
    }
}

export default PaymentIfQuestion