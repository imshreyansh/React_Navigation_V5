import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, URL, dateToHHMM, dateToDDMMYYYY, AMPM } from '../../utils/api/helpers'
import { getCurrency, getUserDetailsById } from '../../utils/api/authorization'
import alnakheelInvoice from '../../assets/images/alnakheelInvoice.png'
import insta from '../../assets/images/insta.jpg'
import i18n from 'i18n-js'


class OrderInvoice extends Component {
    _isMounted = false

    state = {
        currency: '',
        rtl: null,
        packages: [],
        userDetails: '',
        userCredentials: '',
        orderDetails: '',
        branch: '',
        packageDetails: '',
        type: '',
        stocks: []
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
                                branch: this.props.navigation.getParam('orderDetails').branch,
                                userCredentials: res.data.response.credentialId,
                                orderDetails: this.props.navigation.getParam('orderDetails'),
                                packageDetails: this.props.navigation.getParam('packageDetails'),
                                stocks: this.props.navigation.getParam('packageDetails').purchaseStock,
                                type: this.props.navigation.getParam('type')
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


    render() {
        const image = this.state.branch ? `${URL}/${this.state.branch.avatar.path.replace(/\\/g, "/")}` : ''
        const userImage = JSON.parse(JSON.stringify({ uri: image }))
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: 'white' }}>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>
                    <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'orange', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="close" size={width / 20} style={{ top: width / 22, marginLeft: width / 30 }} color="white" />

                            <Text style={{ marginLeft: width / 8, bottom: width / 60, fontSize: width / 22, color: 'white', textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('receipt')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: width / 30 }}>
                        <Image resizeMode='contain' style={{ width: width / 5, height: width / 5, marginLeft: 'auto', marginRight: 'auto', }} source={userImage} />
                    </View>
                    <View style={{ marginTop: width / 30 }}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#333', fontSize: width / 22 }}>{i18n.t('taxInvoice')}</Text>
                    </View>
                    <View style={{ borderWidth: 1, marginTop: width / 60, width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', borderColor: '#333' }} />

                    <View>
                        <View style={{ marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.08 }}>
                                <Text style={{ fontSize: width / 28, color: '#333', fontWeight: 'bold', width: w / 3.8, textAlign: 'center' }}>{i18n.t('vatRegNumber')}</Text>
                                <Text style={{ fontSize: width / 28, color: '#333', fontWeight: 'bold', width: w / 3.8, textAlign: 'center' }}>{i18n.t('taxInvoiceNumber')}</Text>
                                <Text style={{ fontSize: width / 28, color: '#333', fontWeight: 'bold', width: w / 3.8, textAlign: 'center' }}>{i18n.t('receiptTotal')}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.08 }}>
                                <Text style={{ fontSize: width / 30, color: '#333', width: w / 3.8, marginTop: width / 50, textAlign: 'center' }}>{this.state.branch ? this.state.branch.vatRegNo : ''}</Text>
                                <Text style={{ fontSize: width / 30, color: '#333', width: w / 3.8, marginTop: width / 50, textAlign: 'center' }}>{this.state.orderDetails.orderNo ? this.state.orderDetails.orderNo : ''}</Text>
                                <Text style={{ fontSize: width / 30, color: '#333', width: w / 3.8, marginTop: width / 50, fontWeight: 'bold', textAlign: 'center' }}>{this.state.currency} {this.state.orderDetails ? (this.state.orderDetails.totalAmount).toFixed(3) : ''}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.08 }}>
                                <Text style={{ fontSize: width / 28, color: '#333', fontWeight: 'bold', width: w / 3.8, textAlign: 'center' }}>{i18n.t('address')}</Text>
                                <Text style={{ fontSize: width / 28, color: '#333', fontWeight: 'bold', width: w / 3.8, textAlign: 'center' }}>{i18n.t('dateAndTime')}</Text>
                                <Text style={{ fontSize: width / 28, color: '#333', fontWeight: 'bold', width: w / 3.8, textAlign: 'center' }}>{i18n.t('telephone')}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.08 }}>
                                <Text style={{ fontSize: width / 30, color: '#333', width: w / 3.8, marginTop: width / 50, textAlign: 'center' }}>{this.state.branch ? this.state.branch.address : ''}</Text>
                                <Text style={{ fontSize: width / 30, color: '#333', width: w / 3.8, marginTop: width / 50, textAlign: 'center' }}>{this.state.orderDetails ? dateToDDMMYYYY(this.state.orderDetails.dateOfPurchase) : ''} {this.state.orderDetails ? AMPM(this.state.orderDetails.created_at) : ''}</Text>
                                <Text style={{ fontSize: width / 30, color: '#333', width: w / 3.8, marginTop: width / 50, textAlign: 'center' }}>{this.state.branch ? this.state.branch.telephone : ''}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.08, padding: width / 30, backgroundColor: '#ddd', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <Text style={{ fontSize: width / 32, color: '#333', fontWeight: 'bold', width: w / 6 }}>{i18n.t('id')}: {this.state.userDetails.memberId}</Text>
                            <Text style={{ fontSize: width / 32, color: '#333', fontWeight: 'bold', width: w / 3.8 }}> {this.state.userCredentials.userName}</Text>
                            <Text style={{ fontSize: width / 32, color: '#333', fontWeight: 'bold', width: w / 3.8 }}>{i18n.t('mob')}: {this.state.userDetails.mobileNo}</Text>
                        </View>
                        <View style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ width: w / 1.2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: width / 25, color: '#333', fontWeight: 'bold', width: width / 3 }}>{i18n.t('name')}</Text>
                                <Text style={{ fontSize: width / 25, color: '#333', fontWeight: 'bold', width: w / 3.5 }}>{i18n.t('amount')}</Text>
                            </View>
                        </View>
                        <View style={{ borderWidth: 1, marginTop: width / 60, width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', borderColor: '#ddd' }} />
                        {this.state.stocks.map((d, i) => {
                            return (
                                <View key={i} style={{ width: w / 1.08, padding: width / 50, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 60, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ width: w / 1.2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: width / 25, color: '#333', width: w / 3 }}>{d.stockId.itemName}</Text>
                                        <Text style={{ fontSize: width / 28, color: '#333', width: w / 3.5 }}>{this.state.currency} {(d.amount).toFixed(3)}</Text>
                                    </View>
                                </View>
                            )
                        })}

                        <View style={{ borderWidth: 1, marginTop: width / 60, width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', borderColor: '#ddd' }} />
                        <View style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 60, justifyContent: 'flex-end', flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: width / 32, color: '#333', marginTop: width / 70 }}>{i18n.t('amountTotal')}: {this.state.currency} {this.state.orderDetails ? (this.state.orderDetails.actualAmount).toFixed(3) : ''}</Text>
                                {this.state.orderDetails.vatAmount > 0 ? <Text style={{ fontSize: width / 32, color: '#333', marginTop: width / 70 }}>{i18n.t('vat')}:  {this.state.orderDetails ? (this.state.orderDetails.vatAmount).toFixed(3) : ''}</Text> : null}
                                {this.state.orderDetails.digitalAmount > 0 ? <Text style={{ fontSize: width / 32, color: '#333', marginTop: width / 70 }}>{i18n.t('digital')}:  {this.state.orderDetails ? (this.state.orderDetails.digitalAmount).toFixed(3) : ''}</Text> : null}
                                {this.state.orderDetails.chequeAmount > 0 ? <Text style={{ fontSize: width / 32, color: '#333', marginTop: width / 70 }}>{i18n.t('cheque')}:  {this.state.orderDetails ? (this.state.orderDetails.chequeAmount).toFixed(3) : ''}</Text> : null}
                                {this.state.orderDetails.chequeAmount > 0 ? <Text style={{ fontSize: width / 32, color: '#333', marginTop: width / 70 }}>{i18n.t('chequeDate')}: {dateToDDMMYYYY(this.state.orderDetails.chequeDate)}</Text> : null}
                                {this.state.orderDetails.chequeNumber > 0 ? <Text style={{ fontSize: width / 32, color: '#333', marginTop: width / 70 }}>{i18n.t('chequeNo')}: {this.state.orderDetails.chequeNumber}</Text> : null}
                                {this.state.orderDetails.bankName ? <Text style={{ fontSize: width / 32, color: '#333', marginTop: width / 70 }}>{i18n.t('bank')}:  {this.state.orderDetails ? this.state.orderDetails.bankName : ''}</Text> : null}
                                {this.state.orderDetails.cardAmount > 0 ? <Text style={{ fontSize: width / 32, color: '#333', marginTop: width / 70 }}>{i18n.t('card')}:  {this.state.orderDetails ? (this.state.orderDetails.cardAmount).toFixed(3) : ''}</Text> : null}
                                {this.state.orderDetails.cardNumber > 0 ? <Text style={{ fontSize: width / 32, color: '#333', marginTop: width / 70 }}>{i18n.t('cardLast')}:  {this.state.orderDetails ? this.state.orderDetails.cardNumber : ''}</Text> : null}
                                {this.state.orderDetails.cashAmount > 0 ? <Text style={{ fontSize: width / 32, color: '#333', marginTop: width / 70 }}>{i18n.t('cash')}:  {this.state.orderDetails ? (this.state.orderDetails.cashAmount).toFixed(3) : ''}</Text> : null}
                                <Text style={{ fontSize: width / 32, color: '#333', marginTop: width / 70 }}>{i18n.t('discount')}:  {this.state.orderDetails ? (this.state.orderDetails.discount).toFixed(3) : ''}</Text>
                                <Text style={{ fontSize: width / 32, color: '#333', marginTop: width / 70 }}>{i18n.t('grandTotal')}: {this.state.currency} {this.state.orderDetails ? (this.state.orderDetails.totalAmount).toFixed(3) : ''}</Text>
                                <Text style={{ fontSize: width / 32, color: '#333', marginTop: width / 70 }}>{i18n.t('paidAmount')}: {this.state.currency} {this.state.orderDetails ? (this.state.orderDetails.totalAmount).toFixed(3) : ''}</Text>
                            </View>
                        </View>
                        <View style={{ borderWidth: 1, marginTop: width / 40, width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', borderColor: '#ddd' }} />
                    </View>
                    <View style={{ marginTop: width / 30, flexDirection: 'row', width: w / 1.1, justifyContent: 'flex-end', marginLeft: 'auto', marginRight: 'auto' }}>
                        <Text style={{ fontSize: width / 32, color: '#333', marginTop: width / 70, fontWeight: 'bold' }}>{i18n.t('servedBy')}- {this.state.orderDetails ? this.state.orderDetails.doneBy.userName : ''}</Text>
                    </View>
                    <View style={{ marginTop: width / 30, marginLeft: width / 30, flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'column' }}>
                            <Image resizeMode='contain' style={{ width: width / 12, height: width / 12, marginLeft: 'auto', marginRight: 'auto' }} source={insta} />
                            <Text style={{ fontSize: width / 35, color: '#333', marginTop: width / 50 }}>{i18n.t('followUs')}</Text>
                        </View>
                        <Image
                            source={{ uri: `https://quickchart.io/qr?text=https://www.instagram.com/alnakheelfitness/?hl=en` }}
                            resizeMode='stretch'
                            style={{ height: width / 7, width: width / 7, marginLeft: width / 30 }}
                        />
                    </View>

                </ScrollView>

            </View >
        )
    }
}

export default OrderInvoice