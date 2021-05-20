import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, Image, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, URL, paddingLeftWater, paddingRightWater } from '../../utils/api/helpers'
import { getCurrency, getMemberById } from '../../utils/api/authorization'
import * as Progress from 'react-native-progress';
import Loader from '../../utils/resources/Loader'
import bg from '../../assets/images/curvedImage.png'
import alarm from '../../assets/images/alarm.png'
import DateTimePicker from "react-native-modal-datetime-picker";
import { addMemberReminder } from '../../utils/api/waterIntake'
import { showMessage, hideMessage } from "react-native-flash-message";
import i18n from 'i18n-js';
import { TouchableHighlight } from 'react-native';

export default class Reminder extends React.Component {
    _isMounted = false

    state = {
        currency: '',
        rtl: null,
        selection: 'every',
        from: false,
        to: false,
        fromTime: '',
        toTime: '',
        modalVisible: false,
        modalVisibleTwo: false,
        intervals: [{ id: 1, isSelected: false, name: '10 Minutes', value: 10, type: 'minute' }, { id: 2, isSelected: false, name: '15 Minutes', value: 15, type: 'minute' }, { id: 3, isSelected: false, name: '30 Minutes', value: 30, type: 'minute' }, { id: 4, isSelected: false, name: '45 Minutes', value: 45, type: 'minute' }, { id: 5, isSelected: false, name: '1 Hours', value: 1, type: 'hour' }, { id: 6, isSelected: false, name: '2 Hours', value: 2, type: 'hour' }, { id: 7, isSelected: false, name: '3 Hours', value: 3, type: 'hour' }, { id: 8, isSelected: false, name: '4 Hours', value: 4, type: 'hour' }
            , { id: 9, isSelected: false, name: '5 Hours', value: 5, type: 'hour' }, { id: 10, isSelected: false, name: '6 Hours', value: 6, type: 'hour' }, { id: 11, isSelected: false, name: '7 Hours', value: 7, type: 'hour' }, { id: 12, isSelected: false, name: '8 Hours', value: 8, type: 'hour' }, { id: 13, isSelected: false, name: '9 Hours', value: 9, type: 'hour' }, { id: 14, isSelected: false, name: '10 Hours', value: 10, type: 'hour' }, { id: 15, isSelected: false, name: '11 Hours', value: 11, type: 'hour' }, { id: 16, isSelected: false, name: '12 Hours', value: 12, type: 'hour' }, { id: 17, isSelected: false, name: '13 Hours', value: 13, type: 'hour' },
        { id: 18, isSelected: false, name: '14 Hours', value: 14, type: 'hour' }, { id: 19, isSelected: false, name: '15 Hours', value: 15, type: 'hour' }, { id: 20, isSelected: false, name: '16 Hours', value: 16, type: 'hour' }, { id: 21, isSelected: false, name: '17 Hours', value: 17, type: 'hour' }, { id: 22, isSelected: false, name: '18 Hours', value: 18, type: 'hour' }, { id: 23, isSelected: false, name: '19 Hours', value: 19, type: 'hour' }, { id: 24, isSelected: false, name: '20 Hours', value: 20, type: 'hour' }, { id: 25, isSelected: false, name: '21 Hours', value: 21, type: 'hour' },
        { id: 26, isSelected: false, name: '22 Hours', value: 22, type: 'hour' }, { id: 27, isSelected: false, name: '23 Hours', value: 23, type: 'hour' }, { id: 28, isSelected: false, name: '24 Hours', value: 24, type: 'hour' }],
        numberOfReminders: [{ id: 1, isSelected: false, name: '1 Time', value: 1 }, { id: 2, isSelected: false, name: '2 Times', value: 2 }, { id: 3, isSelected: false, name: '3 Times', value: 3 }, { id: 4, isSelected: false, name: '4 Times', value: 4 }, { id: 5, isSelected: false, name: '5 Times', value: 5 }, { id: 6, isSelected: false, name: '6 Times', value: 6 }, { id: 7, isSelected: false, name: '7 Times', value: 7 }
            , { id: 8, isSelected: false, name: '8 Times', value: 8 }, { id: 9, isSelected: false, name: '9 Times', value: 9 }, { id: 10, isSelected: false, name: '10 Times', value: 10 }],
        selectedInterval: '10 Minutes',
        selectednumberOfReminders: '1 Time',
        userId: '',
        fromTimeSelected: new Date(),
        toTimeSelected: new Date(),
        intervalTimeValue: 10,
        intervalTimeType: 'minute',
        intervalValue: 1,
        loading: false,
        intervalTimeArray: [],
        intervalTimeArrayTime: [],


    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            const propsDate = this.props.navigation.getParam('date')
            const propsDateSplit = JSON.stringify(propsDate).split('T')[0].split('"')[1]
            const paramDate = new Date()
            const paramDateSplit = JSON.stringify(paramDate).split('T')[1].split('"')[0]
            const finalDate = `${propsDateSplit}T${paramDateSplit}`
            const date = new Date(finalDate)
            var ehours = new Date(finalDate).getHours()
            var eminutes = new Date(finalDate).getMinutes()
            var eampm = ehours >= 12 ? 'PM' : 'AM'
            ehours = ehours % 12
            ehours = ehours ? ehours : 12  // the hour '0' should be '12'
            var endTime = ehours + ':' + `${("0" + eminutes).slice(-2)}` + ' ' + eampm

            this.setState({
                fromTime: endTime,
                toTime: endTime,
                fromTimeSelected: date,
                toTimeSelected: date,
            })
            const unsubscribe = this.props.navigation.addListener('didFocus', () => {
                AsyncStorage.getItem('authedToken').then((token) => {
                    const userId = jwtDecode(token).userId

                    this.setState({
                        userId,

                    }, () => {
                        this._onRefresh()
                    })
                })
                getCurrency().then(res => {
                    if (res) {
                        this.setState({
                            currency: res.data.response
                        })
                    }
                })
            })

        }
    }


    componentWillUnmount() {
        this._isMounted = false
    }


    setModalVisible(visible) {
        this.setState({ modalVisible: visible, forgotPass: '' });
    }

    _onRefresh = () => {
        this.setState({
            refreshing: true
        })

        getMemberById(this.state.userId).then(res => {
            if (res) {

                this.setState({
                    userDetails: res.data.response,
                    userCredentials: res.data.response.credentialId,
                    refreshing: false
                })
            }
        })


    }


    showDateTimePicker = (type) => {
        this.setState({ [type]: true });
    }

    hideDateTimePicker = (type) => {
        this.setState({ [type]: false });
    }


    handleDatePicked(date, type) {
        const propsDate = this.props.navigation.getParam('date')
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
                fromTime: startTime,
                fromTimeSelected: dates,
            })
        } else if (type === 'to') {
            this.setState({
                toTime: startTime,
                toTimeSelected: dates,
            })
        }
        this.hideDateTimePicker(type)
    }


    setModalVisible(type, visible) {
        if (type === 'first') {
            this.setState({ modalVisible: visible, });
        } else if (type === 'second') {
            this.setState({ modalVisibleTwo: visible, });
        }

    }

    onPressCheck = (type, i) => {
        if (type === 'first') {
            //this.state.orders[i].isChecked = !this.state.orders[i].isChecked
            this.state.intervals.map((interval, index) => {
                if (index === i) {
                    interval.isSelected = true
                } else {
                    interval.isSelected = false
                }
            })
            this.setState({
                intervals: this.state.intervals,
                selectedInterval: this.state.intervals.filter(d => d.isSelected === true)[0].name,
                intervalTimeValue: this.state.intervals.filter(d => d.isSelected === true)[0].value,
                intervalTimeType: this.state.intervals.filter(d => d.isSelected === true)[0].type
            })
        } else if (type === 'second') {
            this.state.numberOfReminders.map((r, index) => {
                if (index === i) {
                    r.isSelected = true
                } else {
                    r.isSelected = false
                }
            })
            this.setState({
                numberOfReminders: this.state.numberOfReminders,
                selectednumberOfReminders: this.state.numberOfReminders.filter(d => d.isSelected === true)[0].name,
                intervalValue: this.state.numberOfReminders.filter(d => d.isSelected === true)[0].value
            })
        }

    }

    getAllEqualTime = (date, date1, interval) => {
        let newDate = new Date(date).getTime();
        let newDate1 = new Date(date1).getTime();
        let diff = parseInt((newDate1 - newDate) / interval);
        let arr = [new Date(new Date(newDate).setSeconds(0))]
        for (let i = 1; i < interval; i++) {
            newDate += diff;
            arr.push(new Date(new Date(newDate).setSeconds(0)));
        }
        this.setState({
            intervalTimeArray: arr
        }, () => {
            this.setState({
                loading: true
            }, () => {

                const obj = {

                    memberId: this.state.userId,

                    from: this.state.fromTimeSelected,

                    to: this.state.toTimeSelected,

                    remindType: 'interval',

                    date: this.props.navigation.getParam('date'),

                    intervalTime: this.state.intervalTimeArray,

                    interval: this.state.intervalValue,
                }

                addMemberReminder(obj).then(res => {
                    if (res) {
                        this.setState({
                            loading: false
                        }, () => this.props.navigation.goBack())
                        showMessage({
                            message: "Reminder Added Successfully",
                            type: "success",
                        })
                    } else {
                        this.setState({
                            loading: false
                        })
                    }
                })
            })
        })
    }

    convertHourInMinute = (type, value) => {

        if (type === 'hour') {
            this.setState({
                intervalTimeValue: value * 60
            }, () => {

                const date = this.state.fromTimeSelected
                const date1 = this.state.toTimeSelected
                const interval = this.state.intervalTimeValue
                let from = new Date(new Date(date).setMilliseconds(0)).setSeconds(0);
                let to = new Date(new Date(date1).setMilliseconds(0)).setSeconds(0);
                let arr = [];
                while (from < to) {
                    let data = new Date(new Date(from).setMinutes(new Date(from).getMinutes() + interval)).getTime()
                    from = data
                    arr.push(new Date(data))
                }
                this.setState({
                    intervalTimeArrayTime: arr
                }, () => {
                    this.setState({
                        loading: true
                    }, () => {
                        const obj = {

                            memberId: this.state.userId,

                            from: this.state.fromTimeSelected,

                            to: this.state.toTimeSelected,

                            date: this.props.navigation.getParam('date'),

                            remindType: 'time',

                            reminderArray: this.state.intervalTimeArrayTime


                        }

                        addMemberReminder(obj).then(res => {
                            if (res) {
                                this.setState({
                                    loading: false
                                }, () => this.props.navigation.goBack()
                                )
                                showMessage({
                                    message: "Reminder Added Successfully",
                                    type: "success",
                                })
                            } else {
                                this.setState({
                                    loading: false
                                })
                            }
                        })
                    })
                })

            })
        } else {
            this.setState({
                intervalTimeValue: value
            }, () => {

                const date = this.state.fromTimeSelected
                const date1 = this.state.toTimeSelected
                const interval = this.state.intervalTimeValue
                let from = new Date(new Date(date).setMilliseconds(0)).setSeconds(0);
                let to = new Date(new Date(date1).setMilliseconds(0)).setSeconds(0);
                let arr = [];
                while (from < to) {
                    let data = new Date(new Date(from).setMinutes(new Date(from).getMinutes() + interval)).getTime()
                    from = data
                    arr.push(new Date(data))
                }
                this.setState({
                    intervalTimeArrayTime: arr
                }, () => {
                    this.setState({
                        loading: true
                    }, () => {
                        const obj = {

                            memberId: this.state.userId,

                            from: this.state.fromTimeSelected,

                            to: this.state.toTimeSelected,

                            date: this.props.navigation.getParam('date'),

                            remindType: 'time',

                            reminderArray: this.state.intervalTimeArrayTime


                        }

                        addMemberReminder(obj).then(res => {
                            if (res) {
                                this.setState({
                                    loading: false
                                }, () => this.props.navigation.goBack())
                                showMessage({
                                    message: "Reminder Added Successfully",
                                    type: "success",
                                })

                            } else {
                                this.setState({
                                    loading: false
                                })
                            }
                        })
                    })
                })

            })
        }
    }

    onPressSubmit = () => {
        if (new Date().getHours() <= this.state.fromTimeSelected.getHours() && this.state.fromTimeSelected.getHours() <= this.state.toTimeSelected.getHours()) {
            if (this.state.selection === 'once') {
                this.getAllEqualTime(this.state.fromTimeSelected, this.state.toTimeSelected, this.state.intervalValue)

            } else {
                this.convertHourInMinute(this.state.intervalTimeType, this.state.intervalTimeValue)
            }
        } else {
            alert('Time should be in a proper range')
        }

    }
    render() {

        return (


            <View style={{ transform: transform(), flex: 1, backgroundColor: 'white' }}>

                <Loader loading={this.state.loading} text='Registering User' />

                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        progressBackgroundColor='#1976d2'
                        colors={['white', 'yellow']}
                    />}>

                    <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                                <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('reminder')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ImageBackground style={{ width: '100%', height: height / 3 }} source={bg}>
                        <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', justifyContent: 'center' }}>
                            <Image source={alarm} style={{ width: width / 5, height: width / 5, transform: transform(), marginLeft: 'auto', marginRight: 'auto' }} />
                            <Text style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', marginTop: width / 30, fontWeight: 'bold', fontSize: width / 22, color: 'white', width: w / 1.5, transform: transform() }}>{i18n.t('setReminderToDrinkWater')}</Text>
                            <Text style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 70, fontSize: width / 27, color: 'white', width: w / 1.5, transform: transform() }}>{i18n.t('input')}</Text>

                        </View>
                    </ImageBackground>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.15, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 15 }}>
                        <TouchableOpacity onPress={() => this.showDateTimePicker('from')}>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon name="clock" size={width / 10} style={{ marginTop: 'auto', marginBottom: 'auto' }} color="grey" />
                                <View style={{ flexDirection: 'column', marginLeft: width / 80 }}>
                                    <Text style={{ fontSize: width / 30, color: 'grey', transform: transform() }}>{i18n.t('from')}</Text>
                                    <Text style={{ fontSize: width / 18, color: '#f57c00', fontWeight: 'bold', transform: transform() }}>{this.state.fromTime}</Text>

                                </View>
                            </View>
                        </TouchableOpacity>
                        <DateTimePicker
                            isVisible={this.state.from}
                            mode='time'
                            onConfirm={(date) => this.handleDatePicked(date, 'from')}
                            onCancel={() => this.hideDateTimePicker('from')}
                        />
                        <TouchableOpacity onPress={() => this.showDateTimePicker('to')}>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon name="clock" size={width / 10} style={{ marginTop: 'auto', marginBottom: 'auto' }} color="grey" />
                                <View style={{ flexDirection: 'column', marginLeft: width / 80 }}>
                                    <Text style={{ fontSize: width / 30, color: 'grey', transform: transform() }}>{i18n.t('to')}</Text>
                                    <Text style={{ fontSize: width / 18, color: '#f57c00', fontWeight: 'bold', transform: transform(), }}>{this.state.toTime}</Text>

                                </View>
                            </View>

                        </TouchableOpacity>
                        <DateTimePicker
                            isVisible={this.state.to}
                            mode='time'
                            onConfirm={(date) => this.handleDatePicked(date, 'to')}
                            onCancel={() => this.hideDateTimePicker('to')}
                        />
                    </View>
                    <TouchableOpacity onPress={() => this.setState({ selection: 'every' })}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 10, backgroundColor: '#1de9b6', height: height / 12, borderRadius: 3 }}>
                            <View style={{ flexDirection: 'row' }}>
                                {this.state.selection === 'every' ? <View style={{ width: width / 18, height: width / 18, borderRadius: width / 36, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30, backgroundColor: 'white' }} >
                                    <Icon name="approve-icon" size={width / 28} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto', transform: transform() }} color="#333" />

                                </View>

                                    : <View style={{ width: width / 18, height: width / 18, borderColor: 'grey', borderWidth: 1.5, borderRadius: width / 36, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30 }} />}
                                <Text style={{ fontSize: width / 25, color: 'white', marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 40, fontWeight: 'bold', transform: transform() }}>{i18n.t('remindMeEvery')}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.setModalVisible('first', true)}>
                                <Text style={{ fontSize: width / 25, color: 'yellow', marginTop: 'auto', marginBottom: 'auto', fontWeight: 'bold', marginRight: width / 30, transform: transform() }}>{this.state.selectedInterval}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ selection: 'once' })}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 10, backgroundColor: '#ef5350', height: height / 12, borderRadius: 3 }}>
                            <View style={{ flexDirection: 'row' }}>
                                {this.state.selection === 'once' ? <View style={{ width: width / 18, height: width / 18, borderRadius: width / 36, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30, backgroundColor: 'white' }} >
                                    <Icon name="approve-icon" size={width / 28} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto', transform: transform() }} color="#333" />

                                </View>

                                    : <View style={{ width: width / 18, height: width / 18, borderColor: 'grey', borderWidth: 1.5, borderRadius: width / 36, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30 }} />}
                                <Text style={{ fontSize: width / 25, color: 'white', marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 40, fontWeight: 'bold', transform: transform(), }}>{i18n.t('remindMe')}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.setModalVisible('second', true)}>
                                <Text style={{ fontSize: width / 25, color: 'yellow', marginTop: 'auto', marginBottom: 'auto', fontWeight: 'bold', marginRight: width / 30, transform: transform() }}>{this.state.selectednumberOfReminders}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onPressSubmit()}>
                        <View style={{ width: w / 2, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10, marginTop: height / 20 }}>
                            <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50, transform: transform() }}>{i18n.t('save')}</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View elevation={10} style={{ borderWidth: 1, borderColor: '#ddd', backgroundColor: 'white', height: height / 1.6, width: width - 40, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width / 1.15, marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0.5, paddingBottom: width / 60, borderBottomColor: '#333' }}>
                            <Text style={{ fontSize: width / 20, color: '#333', marginLeft: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], textAlign: this.state.isRTL ? 'right' : 'left' }}>{i18n.t('setYourTimeIntervals')}</Text>
                            <TouchableOpacity onPress={() => { this.setModalVisible('first', false) }}>
                                <Icon name="close" size={width / 20} style={{ marginRight: width / 30 }} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: width / 30, height: height / 2, }}>
                            <ScrollView>
                                {this.state.intervals.map((data, i) => {
                                    return (
                                        <TouchableOpacity onPress={() => this.onPressCheck('first', i)}>
                                            <View key={i} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: width / 40, marginTop: width / 30 }}>
                                                {data.isSelected === true ? <View style={{ width: width / 18, height: width / 18, borderRadius: width / 36, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30, backgroundColor: '#ddd' }} >
                                                    <Icon name="approve-icon" size={width / 28} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} color="white" />

                                                </View>

                                                    : <View style={{ width: width / 18, height: width / 18, borderColor: 'grey', borderWidth: 1.5, borderRadius: width / 36, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30 }} />}
                                                <Text style={{ marginLeft: width / 30, fontSize: width / 22, color: '#333', fontWeight: 'bold', }}>{data.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}

                            </ScrollView>
                        </View>
                    </View>
                </Modal>
                <Modal
                    transparent={true}
                    visible={this.state.modalVisibleTwo}
                >
                    <View elevation={10} style={{ borderWidth: 1, borderColor: '#ddd', backgroundColor: 'white', height: height / 1.6, width: width - 40, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width / 1.15, marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0.5, paddingBottom: width / 60, borderBottomColor: '#333' }}>
                            <Text style={{ fontSize: width / 20, color: '#333', marginLeft: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], textAlign: this.state.isRTL ? 'right' : 'left' }}>{i18n.t('setNumberOfReminders')}</Text>
                            <TouchableOpacity onPress={() => { this.setModalVisible('second', false) }}>
                                <Icon name="close" size={width / 20} style={{ marginRight: width / 30 }} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: width / 30, height: height / 2, }}>
                            <ScrollView>
                                {this.state.numberOfReminders.map((data, i) => {
                                    return (
                                        <TouchableOpacity onPress={() => this.onPressCheck('second', i)}>
                                            <View key={i} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: width / 40, marginTop: width / 30 }}>
                                                {data.isSelected === true ? <View style={{ width: width / 18, height: width / 18, borderRadius: width / 36, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30, backgroundColor: '#ddd' }} >
                                                    <Icon name="approve-icon" size={width / 28} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} color="white" />

                                                </View>

                                                    : <View style={{ width: width / 18, height: width / 18, borderColor: 'grey', borderWidth: 1.5, borderRadius: width / 36, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30 }} />}
                                                <Text style={{ marginLeft: width / 30, fontSize: width / 22, color: '#333', fontWeight: 'bold', }}>{data.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}

                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </View >

        )
    }

}
