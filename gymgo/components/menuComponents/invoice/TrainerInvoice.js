import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../../utils/api/helpers'
import { getCurrency, getMemberById } from '../../../utils/api/authorization'
import i18n from 'i18n-js'


class TrainerInvoice extends Component {
    _isMounted = false

    state = {
        currency: '',
        rtl: null,
        packages: [],
        userDetails: '',
        userCredentials: '',
        modalVisible: false,
        installmentData: [],
        selectedOrder: '',
        paidAmount: 0,
        toBePaid: 0,
        remainAmount: 0,
        totalAmount: 0,
        packageName: '',
        trainers: [],
        branchData: ''
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
                                packages: res.data.response.packageDetails
                            }, () => {
                                let map = new Map();
                                let trainers = []
                                this.state.packages.forEach(d => {
                                    d.trainerDetails.forEach(k => {
                                        if (k !== undefined && !map.has(k._id)) {
                                            trainers.push({ trainer: k, branch: d.salesBranch })
                                        }
                                    })
                                })
                                this.setState({
                                    trainers
                                })
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

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    onViewInvoice = (data, branch) => {
        if (data.Installments.length > 0) {
            let paidAmount = 0, toBePaid = 0
            if (data.Installments && data.Installments.length) {
                data.Installments.forEach((installment) => {
                    if (installment.paidStatus === 'Paid') {
                        paidAmount += installment.totalAmount
                        toBePaid += installment.actualAmount
                    }
                })
            }
            let remainAmount = parseFloat(data.trainerFees.amount) - parseFloat(toBePaid)

            this.setState({
                installmentData: data.Installments,
                selectedOrder: data,
                branchData: branch,
                paidAmount,
                toBePaid,
                remainAmount,
                packageName: data.trainer.credentialId.userName,
                totalAmount: data.trainerFees.amount
            }, () => {
                this.setModalVisible(true)
            })
        } else {
            this.setModalVisible(false)
            this.props.navigation.navigate('InvoiceDetails', { orderDetails: data, packageDetails: data, type: 'trainer', branch })
        }

    }

    navigateByInstallment = (data) => {
        this.setModalVisible(false)
        this.props.navigation.navigate('InvoiceDetails', { orderDetails: data, packageDetails: this.state.selectedOrder, type: 'trainer', branch: this.state.branchData })
    }

    render() {
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>

                    <View style={{ transform: transform(), marginTop: width / 30, marginLeft: width / 30, width: w / 1.1 }}>
                        <Text style={{ fontSize: width / 20, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('orderHistory')}</Text>
                    </View>
                    {this.state.trainers.map((d, i) => {
                        return (
                            <View key={i} style={{ width: w / 1.1, borderWidth: 1, backgroundColor: 'white', borderColor: '#ddd', paddingBottom: width / 50, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20, transform: transform() }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.15, marginTop: width / 60, marginLeft: 'auto', marginRight: 'auto' }}>
                                    <View>
                                        <Text numberOfLines={1} style={{ fontSize: width / 25, color: '#333', width: w / 2.2, fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{d.trainer.trainer ? d.trainer.trainer.credentialId.userName : ''}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text numberOfLines={1} style={{ fontSize: width / 28, color: '#333', width: w / 4, top: width / 90, transform: transform(), textAlign: textAlign() }}>{new Date(d.trainer.trainerStart).getDate()}/{new Date(d.trainer.trainerStart).getMonth() + 1}/{new Date(d.trainer.trainerStart).getFullYear()}</Text>
                                        {d.trainer.Installments.length > 0 || d.trainer.paidStatus === 'Paid' ?
                                            <TouchableOpacity onPress={() => this.onViewInvoice(d.trainer, d.branch)}>
                                                <Icon name="eye" size={width / 15} style={{ marginLeft: width / 60 }} color="#1976d2" />
                                            </TouchableOpacity> :
                                            <Icon name="eye" size={width / 15} style={{ marginLeft: width / 60 }} color="white" />
                                        }
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                    <Modal
                        transparent={true}
                        visible={this.state.modalVisible}
                    >

                        <View style={{ backgroundColor: 'white', height: height / 1.8, borderWidth: 1, borderColor: '#ddd', width: width - 20, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                            <View style={{ backgroundColor: 'orange' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 50, width: width / 1.15, marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 60 }}>
                                    <Text style={{ fontSize: width / 20, color: 'white', marginLeft: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], textAlign: this.state.isRTL ? 'right' : 'left' }}>{i18n.t('paymentDetails')}</Text>
                                    <TouchableOpacity onPress={() => { this.setModalVisible(false) }}>
                                        <Icon name="close" size={width / 20} style={{ marginRight: width / 30, top: 5 }} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>
                                <View style={{ marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 50, }}>
                                        <Text style={{ fontSize: width / 30, color: '#333', fontWeight: 'bold', width: w / 4.5, textAlign: 'center' }}>{i18n.t('trainerName')}</Text>
                                        <Text style={{ fontSize: width / 30, color: '#333', fontWeight: 'bold', width: w / 4.5, textAlign: 'center' }}>{i18n.t('totalAmount')}</Text>
                                        <Text style={{ fontSize: width / 30, color: '#333', fontWeight: 'bold', width: w / 4.5, textAlign: 'center' }}>{i18n.t('toBePaid')}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 50, }}>
                                        <Text style={{ fontSize: width / 32, color: '#dc3545', width: w / 4.5, marginTop: width / 50, textAlign: 'center' }}>{this.state.packageName}</Text>
                                        <Text style={{ fontSize: width / 32, color: '#dc3545', width: w / 4.5, marginTop: width / 50, fontWeight: 'bold', textAlign: 'center' }}>{this.state.currency} {(this.state.totalAmount).toFixed(3)}</Text>
                                        <Text style={{ fontSize: width / 32, color: '#dc3545', width: w / 4.5, marginTop: width / 50, fontWeight: 'bold', textAlign: 'center' }}>{this.state.currency} {(this.state.toBePaid).toFixed(3)}</Text>
                                    </View>
                                </View>
                                <View style={{ marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 50, }}>
                                        <Text style={{ fontSize: width / 30, color: '#333', fontWeight: 'bold', width: w / 4.5, textAlign: 'center' }}>{i18n.t('paidAmount')}</Text>
                                        <Text style={{ fontSize: width / 30, color: '#333', fontWeight: 'bold', width: w / 4.5, textAlign: 'center' }}>{i18n.t('remainingAmount')}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 50, }}>
                                        <Text style={{ fontSize: width / 32, color: '#dc3545', width: w / 4.5, marginTop: width / 50, fontWeight: 'bold', textAlign: 'center' }}>{this.state.currency} {(this.state.paidAmount).toFixed(3)}</Text>
                                        <Text style={{ fontSize: width / 32, color: '#dc3545', width: w / 4.5, marginTop: width / 50, fontWeight: 'bold', textAlign: 'center' }}>{this.state.currency} {this.state.remainAmount}</Text>
                                    </View>
                                </View>
                                <View style={{ marginTop: width / 30, marginLeft: width / 30 }}>
                                    <Text style={{ fontSize: width / 25, color: '#333', fontWeight: 'bold' }}>{i18n.t('installmentHistory')}</Text>
                                </View>

                                < ScrollView horizontal showsHorizontalScrollIndicator={true} >
                                    <View>
                                        <View style={{ flexDirection: 'row', marginTop: width / 30, backgroundColor: '#dcdcdc', padding: width / 80, borderBottomWidth: 2, borderBottomColor: '#dee2e6' }}>
                                            <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                                <Text style={{ width: w / 4, textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('installmentType')}</Text>
                                            </View>
                                            <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                                <Text style={{ width: w / 4, textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('amount')}</Text>
                                            </View>
                                            <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                                <Text style={{ width: w / 4, textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('dueDate')}</Text>
                                            </View>
                                            <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                                <Text style={{ width: w / 4, textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('paidDate')}</Text>
                                            </View>
                                            <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                                <Text style={{ width: w / 4, textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('status')}</Text>
                                            </View>
                                            <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                                <Text style={{ width: w / 4, textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('action')}</Text>
                                            </View>
                                        </View>
                                        {this.state.installmentData.map((d, i) => {
                                            return (
                                                <View key={i} style={{ flexDirection: 'row', backgroundColor: '#f5f5f5', padding: width / 40, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                                    <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                                        <Text style={{ width: w / 4, textAlign: 'center', color: '#333', fontSize: width / 28 }}>Installment {i + 1}</Text>
                                                    </View>
                                                    <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                                        <Text style={{ width: w / 4, textAlign: 'center', color: '#dc3545', fontWeight: 'bold', fontSize: width / 28 }}>{this.state.currency} {d.actualAmount}</Text>
                                                    </View>
                                                    <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                                        <Text style={{ width: w / 4, textAlign: 'center', color: '#333', fontSize: width / 28 }}>{new Date(d.dueDate).getDate()}/{new Date(d.dueDate).getMonth() + 1}/{new Date(d.dueDate).getFullYear()}</Text>
                                                    </View>
                                                    <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                                        <Text style={{ width: w / 4, textAlign: 'center', color: '#333', fontSize: width / 28 }}>{d.dateOfPaid ? `${new Date(d.dueDate).getDate()}/${new Date(d.dueDate).getMonth() + 1}/${new Date(d.dueDate).getFullYear()}` : ''}</Text>
                                                    </View>
                                                    <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                                        <Text style={{ width: w / 4, textAlign: 'center', color: d.paidStatus === 'Paid' ? '#28A745' : '#dc3545', fontWeight: 'bold', fontSize: width / 28 }}>{d.paidStatus}</Text>
                                                    </View>
                                                    { d.paidStatus === 'Paid' ? <TouchableOpacity onPress={() => this.navigateByInstallment(d)}>
                                                        <View style={{ width: w / 4, marginTop: 'auto', marginBottom: 'auto' }}>
                                                            <Icon name="eye" size={width / 15} style={{ marginLeft: 'auto', marginRight: 'auto' }} color="#28A745" />
                                                        </View>
                                                    </TouchableOpacity> : null}
                                                </View>
                                            )
                                        })}

                                    </View>
                                </ScrollView>

                            </ScrollView>
                        </View>
                    </Modal>
                </ScrollView >
            </View >
        )
    }
}

export default TrainerInvoice