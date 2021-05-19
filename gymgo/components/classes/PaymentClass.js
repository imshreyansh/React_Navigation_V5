import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, StyleSheet, Picker, Modal, Image, Linking } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, isTablet } from '../../utils/api/helpers'
import i18n from 'i18n-js'
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../utils/resources/Loader'
import { getPackagesByID, URL } from '../../utils/api/package'
import { getCurrency, updateMember, getUserDetailsById } from '../../utils/api/authorization'
import { payForClasses } from '../../utils/api/classes'




class PaymentClass extends Component {
    _isMounted = false

    state = {
        currency: '',
        online: true,
        gym: false, gymdata: '',
        modalVisible: false


    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {

            getCurrency().then(res => {
                if (res) {
                    this.setState({
                        currency: res.data.response
                    })
                }
            })




        }

    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    onPayOnline = () => {

    }


    onPayAtGym = () => {
        this.setState({
            loading: true
        })
        const obj = {
            member: this.props.navigation.getParam('essential').member,
            amount: this.props.navigation.getParam('essential').amount,
            classId: this.props.navigation.getParam('essential').classId,
            mode: 'Pay at Gym',
        }

        payForClasses(obj).then(res => {
            if (res) {

                this.setState({
                    loading: false,
                }, () => {
                    this.setModalVisible(true)
                })
            } else {
                this.setState({
                    loading: false,
                })
            }
        })

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
                <TouchableOpacity onPress={() => this.onPayAtGym()}>
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
        const totalAmount = this.props.navigation.getParam('data').totalAmount
        const VAT = this.props.navigation.getParam('data').VAT
        return (
            <View style={{ flex: 1, transform: transform(), backgroundColor: '#eeeeee' }}>
                <Loader loading={this.state.loading} text='Loading' />

                <ScrollView contentContainerStyle={{ paddingBottom: width / 10 }}>
                    <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                            <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('makePayment')}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* <View style={{ marginTop: width / 30, width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', paddingBottom: width / 20, borderRadius: 2 }}>
                        <Text style={{ marginLeft: width / 30, marginTop: width / 30, fontSize: width / 22, transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>{i18n.t('paymentMethod')}</Text>
                        {this.renderButtons()}

                    </View> */}
                    <View style={{ marginTop: width / 30, width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', paddingBottom: width / 20, borderRadius: 2 }}>
                        <Text style={{ marginLeft: width / 30, marginTop: width / 30, fontSize: width / 8, fontWeight: 'bold', textAlign: 'center', transform: transform(), color: '#9575cd' }}>{this.state.currency} {totalAmount === NaN ? '' : totalAmount + VAT}</Text>
                        <Text style={{ marginLeft: width / 30, marginTop: width / 30, fontSize: width / 22, textAlign: 'center', transform: transform(), color: 'grey' }}>{i18n.t('totalAmount')}</Text>
                        <View style={{ borderBottomWidth: 1, width: w / 1.15, borderBottomColor: '#ddd', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.15, marginTop: width / 30 }}>
                            <Text style={{ marginLeft: width / 30, marginTop: width / 30, fontSize: width / 25, textAlign: 'center', color: 'grey', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', width: w / 2 }}>{this.props.navigation.getParam('data').className}</Text>
                            <Text style={{ marginLeft: width / 30, marginTop: width / 30, fontSize: width / 25, textAlign: 'center', color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>{this.state.currency} {totalAmount}</Text>

                        </View>
                        <View style={{ width: w / 1.15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 50 }}>
                            <Text style={{ marginLeft: width / 30, marginTop: width / 80, fontSize: width / 25, textAlign: 'center', color: 'grey', transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>{i18n.t('VAT')}</Text>
                            <Text style={{ marginLeft: width / 30, marginTop: width / 80, fontSize: width / 25, textAlign: 'center', color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>{this.state.currency} {VAT}</Text>
                        </View>
                        {/* <View style={{ width: w / 1.15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 50 }}>
                            <Text style={{ marginLeft: width / 30, marginTop: width / 80, fontSize: width / 25, textAlign: 'center', color: 'grey', transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>{i18n.t('totalAmount')}</Text>
                            <Text style={{ marginLeft: width / 30, marginTop: width / 80, fontSize: width / 25, textAlign: 'center', color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>{this.state.currency} {totalAmount + VAT}</Text>
                        </View> */}

                    </View>
                    {/* {this.renderButtonsPay()} */}
                    <TouchableOpacity onPress={() => this.onPayOnline()}>
                        <View style={{ transform: transform(), width: w / 1.2, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                            <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50 }}>{i18n.t('makePayment')}</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View style={{ backgroundColor: '#f3e5f5', height: width / 1.8, width: width - 40, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width / 1.15, marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0.5, paddingBottom: width / 60, borderBottomColor: '#7e57c2' }}>
                            <Text style={{ fontSize: width / 20, color: '#7e57c2', marginLeft: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], textAlign: this.state.isRTL ? 'right' : 'left' }}>Congratulations !!</Text>
                            <TouchableOpacity onPress={() => { this.setModalVisible(false), this.props.navigation.navigate('HomePage') }}>
                                <Icon name="close" size={width / 20} style={{ marginRight: width / 30 }} color="#7e57c2" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: width / 20, marginLeft: width / 30 }}>
                            <Text style={{ fontSize: width / 22, color: '#7e57c2' }}>You have successfully requested a class for yourself</Text>
                        </View>

                    </View>
                </Modal>
            </View >
        )
    }
}

export default PaymentClass