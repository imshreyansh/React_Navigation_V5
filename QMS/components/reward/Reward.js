import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground, RefreshControl } from 'react-native';
import Header from '../common/Header'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { getCurrency, getMemberById } from '../../utils/api/authorization'
import { getAllPolicy } from '../../utils/api/rewards'
import i18n from 'i18n-js';
import curvedImage from '../../assets/images/curvedImage.png'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'

export default class Reward extends React.Component {
    _isMounted = false
    state = {
        refreshing: false,
        currency: '',
        policy: [],
        referPolicy: '',
        memberId: '',
        userDetails: '',
        walletPoints: 0
    }


    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            if (this._isMounted) {

                const unsubscribe = this.props.navigation.addListener('didFocus', () => {
                    this._onRefresh()
                })
                return unsubscribe


            }
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
                    currency: res.data.response,
                })
            }
        })

        getAllPolicy().then(res => {
            if (res) {
                this.setState({
                    policy: res.data.response.filter(d => d.memberDashBoard === 'Yes'),
                    referPolicy: res.data.response.filter(d => d.memberDashBoard === 'Yes' && d.policyCategory !== "Amount"),
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
                    {this.state.referPolicy.length > 0 ? <TouchableOpacity onPress={() => this.props.navigation.navigate('ReferAFriendPage', { id: this.state.referPolicy[0]._id, points: this.state.referPolicy[0].noOfPoints })}>
                        <View elevation={3} style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.1, backgroundColor: '#804BD1', marginTop: width / 30, paddingTop: width / 50, paddingBottom: width / 50, borderRadius: 3 }}>
                            <View style={{ flexDirection: 'row', width: w / 1.2, marginLeft: 'auto', marginRight: 'auto' }}>
                                <Icon name="refer" size={width / 18} style={{ marginTop: 'auto', marginBottom: 'auto' }} color="white" />

                                <Text style={{ fontSize: width / 20, color: 'white', fontWeight: 'bold', transform: transform(), marginLeft: width / 30 }}>{i18n.t('textToRefer')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                        :
                        <View elevation={3} style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.1, backgroundColor: '#ddd', marginTop: width / 30, paddingTop: width / 50, paddingBottom: width / 50, borderRadius: 3 }}>
                            <View style={{ flexDirection: 'row', width: w / 1.2, marginLeft: 'auto', marginRight: 'auto' }}>
                                <Icon name="refer" size={width / 18} style={{ marginTop: 'auto', marginBottom: 'auto' }} color="white" />

                                <Text style={{ fontSize: width / 20, color: 'white', fontWeight: 'bold', transform: transform(), marginLeft: width / 30 }}>{i18n.t('textToRefer')}</Text>
                            </View>
                        </View>
                    }
                    {this.state.policy.map((data, i) => {
                        return (
                            <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('RewardDetails', { id: data._id })}>
                                <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.1, backgroundColor: 'white', marginTop: width / 30, paddingBottom: width / 40, borderRadius: 3 }}>
                                    <Text style={{ width: w / 1.3, marginLeft: width / 30, marginTop: width / 30, fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign() }}>{data.policyName}</Text>
                                    <View style={{ width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', justifyContent: 'flex-end', flexDirection: 'row' }}>
                                        <View style={{ width: width / 15, height: width / 15, borderRadius: width / 24, backgroundColor: '#00c853', marginTop: width / 30 }}>
                                            <Icon name="right-arrow" size={width / 25} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} color="white" />

                                        </View>
                                    </View>

                                </View>
                            </TouchableOpacity>
                        )
                    })}

                </ScrollView>
            </View>
        )
    }
}