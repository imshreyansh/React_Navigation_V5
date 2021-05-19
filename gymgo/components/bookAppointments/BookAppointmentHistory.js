import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Image, Modal, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, URL, paddingRight } from '../../utils/api/helpers'
import { getMemberAppointmentHistory } from '../../utils/api/bookAppointment'
import DateTimePicker from "react-native-modal-datetime-picker";
import boy from '../../assets/images/boy.jpg'
import i18n from 'i18n-js';

class BookAppointmentHistory extends Component {
    _isMounted = false

    state = {
        currency: '',
        userId: '',
        memberId: '',
        refreshing: false,
        visible: false,
        showDate: '',
        dateSelected: '',
        showTimeFrom: '',
        fromTimeSelected: '',
        showTimeTo: '',
        toTimeSelected: '',
        visibleTimeFrom: false,
        visibleTimeTo: false,
        data: []
    }



    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            const willFocusSubscription = this.props.navigation.addListener(
                'willFocus',
                () => {
                    this._onRefresh()
                }
            )



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
            const userId = jwtDecode(token).credential
            const memberId = jwtDecode(token).userId

            this.setState({
                userId,
                memberId
            }, () => {
                this.getData('', 'all')
            })
        })
    }

    getData = (e, type) => {
        if (type === 'date') {
            const obj = {
                date: e,
                memberId: this.state.memberId
            }
            getMemberAppointmentHistory(obj).then(res => {
                if (res) {
                    this.setState({
                        data: res.data.response,
                        refreshing: false,
                    })
                }
            })
        } else {
            const obj = {
                date: e,
                memberId: this.state.memberId
            }
            getMemberAppointmentHistory(obj).then(res => {
                if (res) {
                    this.setState({
                        data: res.data.response,
                        refreshing: false,
                        showDate: '',
                        dateSelected: ''
                    })
                }
            })
        }

    }
    handleDatePicked(date) {
        this.setState({
            dateSelected: date,
            showDate: date.toISOString().split('T')[0].split('-').reverse().join('/'),

        }, () => {
            this.getData(new Date(this.state.dateSelected), 'date')
        })
        this.hideDateTimePicker()
    }
    showDateTimePicker = () => {
        this.setState({ visible: true });
    }

    hideDateTimePicker = () => {
        this.setState({ visible: false });
    }

    handleTimePicked(date, type) {
        const propsDate = new Date()
        const propsDateSplit = JSON.stringify(propsDate).split('T')[0].split('"')[1]
        const paramDate = date
        const paramDateSplit = JSON.stringify(paramDate).split('T')[1].split('"')[0]
        const finalDate = `${propsDateSplit}T${paramDateSplit}`

        const dates = new Date(finalDate)
        var shours = new Date(finalDate).getHours()
        var sminutes = new Date(finalDate).getMinutes()
        var sampm = shours >= 12 ? 'PM' : 'AM'
        shours = shours % 12
        shours = shours ? shours : 12  // the hour '0' should be '12'
        var startTime = shours + ':' + `${("0" + sminutes).slice(-2)}` + ' ' + sampm
        if (type === 'from') {
            this.setState({
                showTimeFrom: startTime,
                fromTimeSelected: dates,
            })
        } else if (type === 'to') {
            this.setState({
                showTimeTo: startTime,
                toTimeSelected: dates,
            })
        }
        this.hideTimePicker(type)
    }
    showTimePicker = (type) => {
        this.setState({ [type]: true });
    }

    hideTimePicker = (type) => {
        this.setState({ [type]: false });
    }

    render() {
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>

                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        progressBackgroundColor='#1976d2'
                        colors={['white', 'yellow']}
                    />}>
                    <View style={{ flexDirection: 'row', width: w / 1.08, marginTop: width / 30, justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                            <Text style={{ fontSize: width / 28, color: '#333', transform: transform(), textAlign: textAlign() }}>{i18n.t('date')}</Text>
                            <View style={{ flexDirection: 'row', marginTop: width / 50 }}>
                                <TouchableOpacity onPress={() => this.getData('', 'all')}>
                                    <View elevation={3} style={{ width: w / 8, paddingTop: width / 80, paddingBottom: width / 80, backgroundColor: 'orange', borderRadius: 3 }}>
                                        <Text style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: width / 28, fontWeight: 'bold', color: 'white', transform: transform(), textAlign: 'center' }}>{i18n.t('all')}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.showDateTimePicker()}>
                                    <View style={{ width: w / 3.8, paddingTop: width / 80, paddingBottom: width / 80, backgroundColor: 'white', borderRadius: 3, marginLeft: width / 50 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 4 }}>
                                            <Text style={{ fontSize: width / 32, marginLeft: width / 50, color: '#0091ea', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.showDate}</Text>
                                            <Icon name="calender" size={width / 22} color="grey" />

                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={this.state.visible}
                                    mode='date'
                                    onConfirm={(date) => this.handleDatePicked(date)}
                                    onCancel={() => this.hideDateTimePicker()}
                                />
                            </View>
                        </View>
                        {/* <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                            <Text style={{ fontSize: width / 28, color: '#333', transform: transform(), textAlign: textAlign() }}>{i18n.t('fromTime')}</Text>
                            <View style={{ marginTop: width / 50 }}>
                                <TouchableOpacity onPress={() => this.showTimePicker('visibleTimeFrom')} >
                                    <View style={{ width: w / 4.5, paddingTop: width / 80, paddingBottom: width / 80, backgroundColor: 'white', borderRadius: 3 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 4.8 }}>
                                            <Text style={{ fontSize: width / 35, marginLeft: width / 50, color: '#0091ea', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.showTimeFrom}</Text>
                                            <Icon name="stop-watch" size={width / 22} color="grey" />

                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={this.state.visibleTimeFrom}
                                    mode='time'
                                    onConfirm={(date) => this.handleTimePicked(date, 'from')}
                                    onCancel={() => this.hideTimePicker('visibleTimeFrom')}
                                />
                            </View>
                        </View> */}
                        {/* <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                            <Text style={{ fontSize: width / 28, color: '#333', transform: transform(), textAlign: textAlign() }}>{i18n.t('toTime')}</Text>
                            <View style={{ marginTop: width / 50 }}>
                                <TouchableOpacity onPress={() => this.showTimePicker('visibleTimeTo')}>
                                    <View style={{ width: w / 4.5, paddingTop: width / 80, paddingBottom: width / 80, backgroundColor: 'white', borderRadius: 3 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 4.8 }}>
                                            <Text style={{ fontSize: width / 35, marginLeft: width / 50, color: '#0091ea', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.showTimeTo}</Text>
                                            <Icon name="stop-watch" size={width / 22} color="grey" />

                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={this.state.visibleTimeTo}
                                    mode='time'
                                    onConfirm={(date) => this.handleTimePicked(date, 'to')}
                                    onCancel={() => this.hideTimePicker('visibleTimeTo')}
                                />
                            </View>
                        </View> */}
                    </View>
                    {this.state.data.map((d, i) => {

                        const avatar = d.trainer ? `${URL}/${d.trainer.credentialId.avatar.path.replace(/\\/g, "/")}` : ''
                        const userImage = JSON.parse(JSON.stringify({ uri: avatar }))

                        var shours = new Date(d.fromTime).getHours()
                        var sminutes = new Date(d.fromTime).getMinutes()
                        var sampm = shours >= 12 ? 'PM' : 'AM'
                        shours = shours % 12
                        shours = shours ? shours : 12  // the hour '0' should be '12'
                        var startTime = shours + ':' + `${("0" + sminutes).slice(-2)}` + ' ' + sampm

                        var ehours = new Date(d.toTime).getHours()
                        var eminutes = new Date(d.toTime).getMinutes()
                        var eampm = ehours >= 12 ? 'PM' : 'AM'
                        ehours = ehours % 12
                        ehours = ehours ? ehours : 12  // the hour '0' should be '12'
                        var endTime = ehours + ':' + `${("0" + eminutes).slice(-2)}` + ' ' + eampm

                        function status() {
                            if (new Date(d.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
                                return 'Missed'
                            } else if (new Date(d.date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
                                if (new Date(d.toTime).getTime() < new Date().getTime()) {
                                    return 'Missed'
                                } else {
                                    return 'Yet to come'
                                }
                            } else {
                                return d.status ? d.status : 'Yet to come'
                            }

                        }
                        return (
                            <View elevation={3} style={{ width: w / 1.1, backgroundColor: 'white', paddingBottom: width / 30, borderRadius: 3, marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto' }}>
                                <View style={{ width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 50 }}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ fontSize: width / 25, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('date')}</Text>
                                        <Text style={{ fontSize: width / 22, color: 'orange', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{new Date(d.date).getDate()}/{new Date(d.date).getMonth() + 1}/{new Date(d.date).getFullYear()}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ fontSize: width / 25, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('status')}</Text>
                                        <Text style={{ fontSize: width / 22, color: d.status === 'Missed' ? 'red' : '#0091ea', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{status()}</Text>
                                    </View>
                                </View>
                                <View style={{ width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 50 }}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ fontSize: width / 25, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('fromTime')}</Text>
                                        <Text style={{ fontSize: width / 22, color: '#00c853', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{startTime}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ fontSize: width / 25, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('toTime')}</Text>
                                        <Text style={{ fontSize: width / 22, color: '#00c853', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{endTime}</Text>
                                    </View>
                                </View>
                                {d.trainer ?
                                    <View style={{ marginTop: width / 30, marginLeft: width / 30 }}>
                                        <Text style={{ fontSize: width / 25, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('trainer')}</Text>
                                        <View style={{ marginTop: width / 30, flexDirection: 'row' }}>
                                            <Image source={userImage} style={{ width: width / 7, height: width / 7, borderRadius: width / 14, transform: transform() }} />
                                            <Text style={{ fontSize: width / 25, color: '#333', marginLeft: width / 30, marginTop: 'auto', marginBottom: 'auto', width: w / 2, transform: transform(), textAlign: textAlign() }}>{d.trainer.credentialId.userName}</Text>
                                        </View>
                                    </View> : null}
                            </View>
                        )
                    })}

                </ScrollView>



            </View >
        )
    }
}

export default BookAppointmentHistory