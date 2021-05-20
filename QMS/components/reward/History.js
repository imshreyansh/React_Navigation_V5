import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import Header from '../common/Header'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { getCurrency, getMemberById } from '../../utils/api/authorization'
import { getUserTransactions } from '../../utils/api/rewards'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import i18n from 'i18n-js';


export default class History extends React.Component {
    _isMounted = false
    state = {
        refreshing: false,
        memberId: '',
        userDetails: '',
        currency: '',
        transactions: []
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
            const obj = {
                member: this.state.memberId
            }

            getUserTransactions(obj).then(res => {
                if (res) {
                    this.setState({
                        transactions: res.data.response,
                        refreshing: false
                    })
                }
            })

        })

        getCurrency().then(res => {
            if (res) {
                this.setState({
                    currency: res.data.response,
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
                    {this.state.transactions.map((data, i) => {
                        return (
                            <View key={i} style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.1, backgroundColor: 'white', marginTop: width / 30, paddingBottom: width / 40, borderRadius: 3 }}>
                                <View style={{ width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <Text style={{ width: w / 2, marginLeft: width / 30, marginTop: width / 30, fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign() }}>{data.policy ? data.policy.policyName : data.giftCard.title}</Text>
                                    <View style={{ flexDirection: 'column', marginTop: width / 30 }}>
                                        <Text style={{ transform: transform(), fontSize: width / 30, color: data.pointType === '-' ? 'red' : 'green' }}>{data.pointType} {data.point} points</Text>
                                        <View style={{ width: w / 4.5, padding: width / 50, backgroundColor: '#ddd', borderRadius: 15, marginTop: width / 50 }}>
                                            <Text style={{ transform: transform(), fontSize: width / 35, color: '#333', fontWeight: 'bold', textAlign: 'center' }}>{new Date(data.created_at).getDate()}/{new Date(data.created_at).getMonth() + 1}/{new Date(data.created_at).getFullYear()}</Text>

                                        </View>
                                    </View>
                                </View>

                            </View>
                        )
                    })}


                </ScrollView>
            </View>
        )
    }
}