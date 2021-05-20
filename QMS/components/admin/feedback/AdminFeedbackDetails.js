import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, RefreshControl, Image, Animated } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, URL, paddingRightBMI, paddingLeftBMI } from '../../../utils/api/helpers'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { getUserByCredentials } from '../../../utils/api/authorization'
import { getFeedbackById, updateFeedback } from '../../../utils/api/feedback'
import Loader from '../../../utils/resources/Loader'
import { showMessage, hideMessage } from "react-native-flash-message";
import sq from '../../../assets/images/sq.jpg'
import boyImage from '../../../assets/images/boy.jpg'
import i18n from 'i18n-js';


class AdminFeedbackDetails extends Component {
    _isMounted = false

    state = {
        userDetails: '',
        userCredentials: '',
        refreshing: false,
        loading: false,
        description: '',
        feedbackId: '',
        feedbackDetails: '',
        statusBox: false
    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            const unsubscribe = this.props.navigation.addListener('didFocus', () => {
                AsyncStorage.getItem('authedToken').then((token) => {
                    const userId = jwtDecode(token).credential
                    this.setState({
                        userId,
                        feedbackId: this.props.navigation.getParam('id'),
                        statusBox: this.props.navigation.getParam('statusBox')
                    }, () => {
                        this._onRefresh()
                    })
                })
            })
        }
    }


    componentWillUnmount() {
        this._isMounted = false
    }

    _onRefresh = () => {
        this.setState({
            refreshing: true,

        })

        getUserByCredentials(this.state.userId).then(res => {
            if (res) {
                this.setState({
                    userDetails: res.data.response,
                    userCredentials: res.data.response.credentialId,
                    refreshing: false
                }, () => {
                    getFeedbackById(this.state.feedbackId).then(res => {
                        if (res) {
                            this.setState({
                                feedbackDetails: res.data.response
                            })
                        }
                    })
                })
            }
        })
    }

    onSubmit = () => {
        this.setState({
            loading: true
        })
        const obj = {
            status: 'Completed',
            adminComment: this.state.description
        }
        updateFeedback(obj, this.state.feedbackId).then(res => {
            if (res) {
                console.log(res.data.response)
                this.setState({
                    statusBox: false,
                    loading: false
                }, () => {
                    this._onRefresh()
                })
            }
        })
    }


    render() {
        var shours = new Date(this.state.feedbackDetails.time).getHours()
        var sminutes = new Date(this.state.feedbackDetails.time).getMinutes()
        var sampm = shours >= 12 ? 'PM' : 'AM'
        shours = shours % 12
        shours = shours ? shours : 12  // the hour '0' should be '12'
        var startTime = shours + ':' + `${("0" + sminutes).slice(-2)}` + ' ' + sampm
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: 'white' }}>
                <Loader loading={this.state.loading} text='Registering User' />


                <View elevation={3} style={{ width: w, height: width / 7, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />
                        </TouchableOpacity>

                        <Text style={{ marginLeft: width / 30, top: width / 30, fontSize: width / 18, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('feedbackDetails')}</Text>
                    </View>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        progressBackgroundColor='#1976d2'
                        colors={['white', 'yellow']}
                    />}>
                    <View style={{ marginTop: width / 30, width: w / 1.1, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto' }}>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: width / 28, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('date')}</Text>
                            <Text style={{ fontSize: width / 25, fontWeight: 'bold', color: 'grey', transform: transform(), textAlign: textAlign() }}>{new Date(this.state.feedbackDetails.date).getDate()}/{new Date(this.state.feedbackDetails.date).getMonth() + 1}/{new Date(this.state.feedbackDetails.date).getFullYear()}</Text>
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: width / 28, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('time')}</Text>
                            <Text style={{ fontSize: width / 25, fontWeight: 'bold', color: 'grey', transform: transform(), textAlign: textAlign() }}>{startTime}</Text>
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: width / 28, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('types')}</Text>
                            <Text style={{ fontSize: width / 25, fontWeight: 'bold', color: 'grey', transform: transform(), textAlign: textAlign() }}>{this.state.feedbackDetails.optionType}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: width / 30, marginLeft: width / 30 }}>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: width / 22, color: 'grey' }}>{i18n.t('description')}</Text>
                            <Text style={{ fontSize: width / 25, color: 'grey', width: w / 1.1, marginTop: width / 50, transform: transform(), textAlign: textAlign() }}>{this.state.feedbackDetails.description}</Text>
                        </View>
                    </View>
                    {this.state.statusBox ?
                        <View>
                            <View style={{ marginTop: width / 30, marginLeft: width / 30 }}>
                                <Text style={{ fontWeight: 'bold', color: 'grey', fontSize: width / 24, transform: transform(), textAlign: textAlign() }}>Write Your Comment</Text>
                            </View>
                            <View style={{ marginLeft: width / 30, marginTop: width / 30 }}>
                                <View style={{ transform: transform() }}>
                                    <TextInput
                                        multiline={true}
                                        style={{ width: w / 1.1, padding: width / 30, paddingBottom: width / 5, borderWidth: 1, backgroundColor: '#fafafa', borderRadius: 5, borderColor: '#cfd2d3', fontSize: width / 25, textAlign: textAlign() }}
                                        autoCapitalize='none'
                                        onChangeText={(text) => this.setState({ description: text })}
                                        value={this.state.description}
                                    />

                                </View>
                            </View>
                            <View style={{ marginTop: width / 20, width: w / 1.1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                {this.state.description !== '' ?

                                    <TouchableOpacity onPress={() => this.onSubmit()}>
                                        <View style={{ width: w / 3, borderRadius: 8, padding: width / 50, backgroundColor: '#00c853' }}>
                                            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: width / 26, color: 'white', transform: transform() }}>{i18n.t('submit')}</Text>
                                        </View>
                                    </TouchableOpacity> :
                                    <View style={{ width: w / 3, borderRadius: 8, padding: width / 50, backgroundColor: '#eee' }}>
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: width / 26, color: 'white', transform: transform() }}>{i18n.t('submit')}</Text>
                                    </View>
                                }
                            </View>
                        </View> :
                        <View>
                            <View style={{ marginTop: width / 30, marginLeft: width / 30 }}>
                                <Text style={{ fontWeight: 'bold', color: '#333', fontSize: width / 24, transform: transform(), textAlign: textAlign() }}>Your Comment</Text>
                            </View>
                            <View style={{ marginTop: width / 60, marginLeft: width / 30 }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ fontSize: width / 25, color: '#333', width: w / 1.1, marginTop: width / 50, transform: transform(), textAlign: textAlign() }}>{this.state.feedbackDetails.adminComment}</Text>
                                </View>
                            </View>
                        </View>}
                </ScrollView>
            </View >
        )
    }
}

export default AdminFeedbackDetails