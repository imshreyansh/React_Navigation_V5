import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Header from '../common/Header'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { getCurrency } from '../../utils/api/authorization'
import { getPolicyById } from '../../utils/api/rewards'
import i18n from 'i18n-js';
import curvedImage from '../../assets/images/curvedImage.png'

export default class Reward extends React.Component {
    _isMounted = false
    state = {
        currency: '',
        policy: ''
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

            getPolicyById(this.props.navigation.getParam('id')).then(res => {
                if (res) {
                    this.setState({
                        policy: res.data.response
                    })
                }
            })
        }


    }

    componentWillUnmount() {
        this._isMounted = false
    }


    render() {
        const { policy } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: '#eeeeee', transform: transform() }}>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>
                    <View style={{ width: w, height: width / 6.5, backgroundColor: '#eee', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Icon name="back-button" size={width / 20} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                                <Text style={{ marginLeft: width / 8, bottom: width / 60, fontSize: width / 22, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('rewardDetails')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.1, backgroundColor: 'white', marginTop: width / 30, paddingBottom: width / 30, borderRadius: 3 }}>
                        <Text style={{ width: w / 1.2, marginLeft: width / 30, marginTop: width / 30, fontSize: width / 22, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{policy.policyName}</Text>
                        <Text style={{ width: w / 1.2, marginLeft: width / 30, marginTop: width / 30, fontSize: width / 25, color: 'grey', transform: transform(), textAlign: textAlign(), }}>{policy.description}</Text>
                        <View style={{ width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'column', width: w / 2.5 }}>
                                    <Text style={{ textAlign: 'center', fontSize: width / 25, color: 'grey', transform: transform() }}>{i18n.t('start')}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon name="attendance" size={width / 15} color="orange" style={{ transform: transform() }} />
                                        <Text style={{ textAlign: 'center', fontSize: width / 22, marginLeft: width / 30, marginTop: width / 80, fontWeight: 'bold', color: '#00c853', transform: transform() }}>{new Date(policy.startDate).getDate()}/{new Date(policy.startDate).getMonth() + 1}/{new Date(policy.startDate).getFullYear()}</Text>

                                    </View>
                                </View>
                                <View style={{ flexDirection: 'column', width: w / 2.5 }}>
                                    <Text style={{ textAlign: 'center', fontSize: width / 25, color: 'grey', transform: transform() }}>{i18n.t('end')}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon name="attendance" size={width / 15} color="orange" style={{ transform: transform() }} />
                                        <Text style={{ textAlign: 'center', fontSize: width / 22, marginLeft: width / 30, marginTop: width / 80, fontWeight: 'bold', color: '#00c853', transform: transform() }}>{new Date(policy.endDate).getDate()}/{new Date(policy.endDate).getMonth() + 1}/{new Date(policy.endDate).getFullYear()}</Text>

                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginTop: width / 30, width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', width: w / 2.5 }}>
                                <Icon name="grade-mobile" size={width / 7} color="grey" style={{ transform: transform() }} />
                                <View style={{ flexDirection: 'column', marginLeft: width / 30, }}>
                                    <Text style={{ fontSize: width / 25, color: 'grey', transform: transform() }}>{i18n.t('totalPoints')}</Text>
                                    <Text style={{ fontSize: width / 12, fontWeight: 'bold', color: '#039be5', transform: transform() }}>{policy.noOfPoints}</Text>
                                </View>
                            </View>
                            {policy && policy.policyCategory === "Amount" ? <Text style={{ fontSize: width / 12, fontWeight: 'bold', color: 'orange', marginTop: width / 30, transform: transform() }}>{this.state.currency} {policy.amount}</Text> : <View></View>}

                        </View>

                    </View>
                </ScrollView>
            </View >
        )
    }
}