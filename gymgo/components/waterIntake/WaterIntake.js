import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, Image, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, URL, paddingLeftWater, paddingRightWater } from '../../utils/api/helpers'
import { getCurrency, getMemberById } from '../../utils/api/authorization'
import WaterIntakeCalendar from '../../utils/WaterIntakeCalendar'
import VerticalBarChartWater from './VerticalBarChartWater'
import ProgressCircle from 'react-native-progress-circle'
import four from '../../assets/images/four.png'
import Loader from '../../utils/resources/Loader'
import { addWaterInTake, getMemberWaterInTake, getMemberReminderByDate, updateMemberWaterInTake } from '../../utils/api/waterIntake'
import { showMessage, hideMessage } from "react-native-flash-message";
import i18n from 'i18n-js';
import alert from '../../assets/images/alert.png'
import loaderBg from '../../assets/images/loaderBg.png'


export default class WaterIntake extends React.Component {
    _isMounted = false

    state = {
        currency: '',
        rtl: null,
        userDetails: '',
        userCredentials: '',
        refreshing: false,
        SelectedDates: [],
        weekDays: [],
        week: [],
        currentDate: new Date().setHours(0, 0, 0, 0),
        toShow: true,
        modalVisible: false,
        toShowWater: true,
        modalVisibleTwo: false,
        age: '',
        height: '',
        weight: '',
        mlOfWater: '',
        userId: '',
        typeOfDate: 'increase',
        waterIntakeDetails: [],
        consume: 0,
        barGraphFilter: [],
        length: [],
        data: [],
        max: '',
        datas: [],
        percentage: 0,
        dailyTarget: 0,
        whichDay: true,
        target: 0,
        reminderDate: '',
        reminderData: '',
        leftReminder: '',
        loading: false,
        modalVisibleThree: false

    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            const unsubscribe = this.props.navigation.addListener('didFocus', () => {
                // this.onWeekChanged()
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
        this.setState({ modalVisible: visible });
    }

    setModalVisibleTwo(visible) {
        this.setState({ modalVisibleTwo: visible });
    }

    setModalVisibleThree(visible, type) {
        if (type === 'cancel') {
            this.setState({ modalVisibleThree: visible });
            this.props.navigation.navigate('EditProfile')
        } else {
            this.setState({ modalVisibleThree: visible });
        }
    }


    onWeekChanged = () => {
        var week = []
        var date = new Date()
        if (this.state.week.length === 0) {
            for (var i = 0; i < 7; i++) {
                week.push({ date: this.makeDateFormat(date.toISOString()), selected: false })
                date.setDate(date.getDate() + 1)
            }
        } else {
            for (var i = 0; i < 7; i++) {
                week.push({ date: this.makeDateFormate(date.toISOString()), selected: false })
                date.setDate(date.getDate() + 1)
            }
        }

        this.setState({
            weekDays: week,

        })
    }
    makeDateFormat = (date) => {
        let index = date.indexOf('T')
        let updateTime = "T00:00:00.000Z"
        let givenDate = date.slice(0, index)
        let newDate = givenDate + updateTime
        return newDate
    }
    makeDateFormate = (date) => {
        var myDate = new Date(date)
        myDate.setDate(myDate.getDate() + 1)
        var finalDate = new Date(myDate).toISOString()
        let index = finalDate.indexOf('T')
        let updateTime = "T00:00:00.000Z"
        let givenDate = finalDate.slice(0, index)
        let newDate = givenDate + updateTime
        return newDate
    }


    _onRefresh = () => {
        this.setState({
            refreshing: true,
            data: [],
            datas: [],
            barGraphFilter: [],
            waterIntakeDetails: [],
            consume: 0,
            percentage: 0,
            dailyTarget: 0,
            target: 0,
            leftReminder: '',
            reminderData: '',
            statusForDisbale: false
        })

        if (this.state.SelectedDates[0]) {
            const toShow = this.state.currentDate >= new Date(this.state.SelectedDates[0].date)
            const toShowWater = new Date(this.state.SelectedDates[0].date).setHours(0, 0, 0, 0) === this.state.currentDate
            const whichDay = new Date(this.state.SelectedDates[0].date).setHours(0, 0, 0, 0) === this.state.currentDate
            this.setState({
                toShow,
                toShowWater,
                whichDay,
                reminderDate: new Date(this.state.SelectedDates[0].date)
            }, () => {
                const obj = {
                    memberId: this.state.userId,
                    date: this.state.reminderDate
                }
                getMemberReminderByDate(obj).then(res => {
                    if (res) {
                        this.setState({
                            reminderData: res.data.response[0].to
                        }, () => {
                            var today = new Date();
                            var Christmas = new Date(this.state.reminderData);
                            var diffMs = (Christmas - today); // milliseconds between now & Christmas
                            var diffDays = Math.floor(diffMs / 86400000); // days
                            var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
                            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                            const leftReminder = diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes"
                            this.setState({ leftReminder: diffDays >= 0 && diffHrs >= 0 && diffMins > 0 ? leftReminder : '' })
                        })
                    }
                })
            })
        }

        getMemberById(this.state.userId).then(res => {
            if (res) {

                this.setState({
                    userDetails: res.data.response,
                    userCredentials: res.data.response.credentialId,
                    height: res.data.response.height === null ? '' : res.data.response.height,
                    weight: res.data.response.weight === null ? '' : res.data.response.weight,
                    refreshing: false
                }, () => {
                    var diff_ms = Date.now() - new Date(this.state.userDetails.dateOfBirth).getTime();
                    var age_dt = new Date(diff_ms);
                    var age = age_dt.getUTCFullYear() - 1970
                    this.checkHeightAndWeight()
                    this.setState({
                        age,
                    }, () => {
                        const lbs = (this.state.weight * 2.2046226218) / 2.2
                        if (this.state.age < 30) {
                            const ounces = (lbs * 40) / 28.3
                            const mlOfWater = Math.round(ounces * 29.5735)
                            this.setState({
                                mlOfWater
                            })
                        } else if (this.state.age >= 30 && this.state.age <= 55) {
                            const ounces = (lbs * 35) / 28.3
                            const mlOfWater = Math.round(ounces * 29.5735)
                            this.setState({
                                mlOfWater
                            })
                        } else if (this.state.age > 55) {
                            const ounces = (lbs * 30) / 28.3
                            const mlOfWater = Math.round(ounces * 29.5735)
                            this.setState({
                                mlOfWater
                            })
                        }
                    })

                    if (this.state.typeOfDate === 'decrease' && this.state.SelectedDates[0]) {

                        const obj = {
                            memberId: this.state.userId,
                            from: new Date(this.state.SelectedDates[0].date),
                            to: new Date(this.state.SelectedDates[0].date)

                        }

                        getMemberWaterInTake(obj).then(res => {
                            if (res) {
                                this.setState({
                                    waterIntakeDetails: res.data.response,
                                    consume: res.data.response[0].consume,
                                    target: res.data.response[0].target
                                }, () => {
                                    const percentage = Math.round((res.data.response[0].consume / res.data.response[0].target) * 100)

                                    this.setState({ percentage })

                                })
                            }
                        })
                        const objTwo = {
                            memberId: this.state.userId,
                            from: new Date(this.state.weekDays[6].date),
                            to: new Date(this.state.weekDays[0].date)

                        }

                        getMemberWaterInTake(objTwo).then(res => {
                            if (res) {
                                this.setState({
                                    barGraphFilter: this.state.weekDays.map(d => res.data.response.filter(data => new Date(d.date).setHours(0, 0, 0, 0) === new Date(data.date).setHours(0, 0, 0, 0)))
                                },
                                    () => {

                                        this.setState({
                                            data: [{ length: this.state.barGraphFilter[0][0] === undefined ? 0 : this.state.barGraphFilter[0][0].consume }
                                                , { length: this.state.barGraphFilter[1][0] === undefined ? 0 : this.state.barGraphFilter[1][0].consume },
                                            { length: this.state.barGraphFilter[2][0] === undefined ? 0 : this.state.barGraphFilter[2][0].consume },
                                            { length: this.state.barGraphFilter[3][0] === undefined ? 0 : this.state.barGraphFilter[3][0].consume },
                                            { length: this.state.barGraphFilter[4][0] === undefined ? 0 : this.state.barGraphFilter[4][0].consume },
                                            { length: this.state.barGraphFilter[5][0] === undefined ? 0 : this.state.barGraphFilter[5][0].consume },
                                            { length: this.state.barGraphFilter[6][0] === undefined ? 0 : this.state.barGraphFilter[6][0].consume }]
                                        }, () => {
                                            const max = Math.max(...this.state.data.map(d => d.length))
                                            if (max) {
                                                this.setState({
                                                    max,
                                                    datas: [{ length: this.state.data[0].length === 0 ? 0 : Math.round((height / 3.5) * (this.state.data[0].length / max)), progress: this.state.data[0].length === 0 ? 0 : this.state.data[0].length }
                                                        , { length: this.state.data[1].length === 0 ? 0 : Math.round((height / 3.5) * (this.state.data[1].length / max)), progress: this.state.data[1].length === 0 ? 0 : this.state.data[1].length },
                                                    { length: this.state.data[2].length === 0 ? 0 : Math.round((height / 3.5) * (this.state.data[2].length / max)), progress: this.state.data[2].length === 0 ? 0 : this.state.data[2].length },
                                                    { length: this.state.data[3].length === 0 ? 0 : Math.round((height / 3.5) * (this.state.data[3].length / max)), progress: this.state.data[3].length === 0 ? 0 : this.state.data[3].length },
                                                    { length: this.state.data[4].length === 0 ? 0 : Math.round((height / 3.5) * (this.state.data[4].length / max)), progress: this.state.data[4].length === 0 ? 0 : this.state.data[4].length },
                                                    { length: this.state.data[5].length === 0 ? 0 : Math.round((height / 3.5) * (this.state.data[5].length / max)), progress: this.state.data[5].length === 0 ? 0 : this.state.data[5].length },
                                                    { length: this.state.data[6].length === 0 ? 0 : Math.round((height / 3.5) * (this.state.data[6].length / max)), progress: this.state.data[6].length === 0 ? 0 : this.state.data[6].length }]
                                                })
                                            }
                                        })
                                    })

                            }
                        })

                    } else if (this.state.typeOfDate === 'increase' && this.state.SelectedDates[0]) {

                        const obj = {
                            memberId: this.state.userId,
                            from: new Date(this.state.SelectedDates[0].date),
                            to: new Date(this.state.SelectedDates[0].date)

                        }

                        getMemberWaterInTake(obj).then(res => {
                            if (res) {
                                this.setState({
                                    waterIntakeDetails: res.data.response,
                                    consume: res.data.response[0].consume,
                                    target: res.data.response[0].target
                                }, () => {
                                    const percentage = Math.round((res.data.response[0].consume / res.data.response[0].target) * 100)

                                    this.setState({ percentage })

                                })
                            }
                        })
                        const objTwo = {
                            memberId: this.state.userId,
                            from: new Date(this.state.weekDays[0].date),
                            to: new Date(this.state.weekDays[6].date)

                        }

                        getMemberWaterInTake(objTwo).then(res => {
                            if (res) {
                                this.setState({
                                    barGraphFilter: this.state.weekDays.map(d => res.data.response.filter(data => new Date(d.date).setHours(0, 0, 0, 0) === new Date(data.date).setHours(0, 0, 0, 0)))
                                },
                                    () => {

                                        this.setState({
                                            data: [{ length: this.state.barGraphFilter[0][0] === undefined ? 0 : this.state.barGraphFilter[0][0].consume }
                                                , { length: this.state.barGraphFilter[1][0] === undefined ? 0 : this.state.barGraphFilter[1][0].consume },
                                            { length: this.state.barGraphFilter[2][0] === undefined ? 0 : this.state.barGraphFilter[2][0].consume },
                                            { length: this.state.barGraphFilter[3][0] === undefined ? 0 : this.state.barGraphFilter[3][0].consume },
                                            { length: this.state.barGraphFilter[4][0] === undefined ? 0 : this.state.barGraphFilter[4][0].consume },
                                            { length: this.state.barGraphFilter[5][0] === undefined ? 0 : this.state.barGraphFilter[5][0].consume },
                                            { length: this.state.barGraphFilter[6][0] === undefined ? 0 : this.state.barGraphFilter[6][0].consume }]
                                        }, () => {
                                            const max = Math.max(...this.state.data.map(d => d.length))
                                            if (max) {
                                                this.setState({
                                                    max,
                                                    datas: [{ length: this.state.data[0].length === 0 ? 0 : Math.round((height / 3.5) * (this.state.data[0].length / max)), progress: this.state.data[0].length === 0 ? 0 : this.state.data[0].length }
                                                        , { length: this.state.data[1].length === 0 ? 0 : Math.round((height / 3.5) * (this.state.data[1].length / max)), progress: this.state.data[1].length === 0 ? 0 : this.state.data[1].length },
                                                    { length: this.state.data[2].length === 0 ? 0 : Math.round((height / 3.5) * (this.state.data[2].length / max)), progress: this.state.data[2].length === 0 ? 0 : this.state.data[2].length },
                                                    { length: this.state.data[3].length === 0 ? 0 : Math.round((height / 3.5) * (this.state.data[3].length / max)), progress: this.state.data[3].length === 0 ? 0 : this.state.data[3].length },
                                                    { length: this.state.data[4].length === 0 ? 0 : Math.round((height / 3.5) * (this.state.data[4].length / max)), progress: this.state.data[4].length === 0 ? 0 : this.state.data[4].length },
                                                    { length: this.state.data[5].length === 0 ? 0 : Math.round((height / 3.5) * (this.state.data[5].length / max)), progress: this.state.data[5].length === 0 ? 0 : this.state.data[5].length },
                                                    { length: this.state.data[6].length === 0 ? 0 : Math.round((height / 3.5) * (this.state.data[6].length / max)), progress: this.state.data[6].length === 0 ? 0 : this.state.data[6].length }]
                                                })
                                            }
                                        })
                                    })

                            }
                        })
                    }

                })
            }
        })


    }

    checkHeightAndWeight = () => {
        if (this.state.height === 0 || this.state.weight === 0) {
            this.setState({
                statusForDisbale: true
            }, () => {
                this.setModalVisibleThree(true, '')
            })
        }
    }

    onPressTargetUpdate = () => {
        if (this.state.consume < JSON.parse(this.state.customizeWaterLevel)) {
            this.setState({ loading: true }, () => {
                const obj = {
                    memberId: this.state.userId,
                    date: this.state.reminderDate,
                    target: JSON.parse(this.state.customizeWaterLevel)
                }

                updateMemberWaterInTake(obj).then(res => {
                    if (res) {
                        this.setState({
                            target: res.data.response.target,
                            loading: false,
                        }, () => {
                            this.setModalVisible(false)
                            this._onRefresh()
                        })
                        showMessage({
                            message: "Target Updated Successfully",
                            type: "success",
                        })
                    } else {
                        this.setState({
                            loading: false
                        }, () => {
                            this._onRefresh()

                        })
                        showMessage({
                            message: "Error while updating target",
                            type: "danger",
                        })
                    }
                })
            })
        } else {
            alert('Target should be greater than your consumption !!')
        }
    }
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarLabel: i18n.t('waterIntake'),
        }
    }
    render() {
        const days = [i18n.t("sun"), i18n.t("mon"), i18n.t("tue"), i18n.t("wed"), i18n.t("thu"), i18n.t("fri"), i18n.t("sat")]

        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                {!this.state.statusForDisbale ?
                    <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }} refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                            progressBackgroundColor='#1976d2'
                            colors={['white', 'yellow']}
                        />}>
                        <View style={{ marginTop: width / 50 }}>
                            <WaterIntakeCalendar getValue={(value, valueTwo, typ) => this.setState({ SelectedDates: value, weekDays: valueTwo, typeOfDate: typ }, () => this._onRefresh())} />
                        </View>
                        {this.state.SelectedDates.length !== 0 ?
                            <View>

                                <View elevation={5} style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.08, paddingBottom: width / 30, marginTop: width / 20, borderRadius: 3, backgroundColor: '#ef5350' }}>
                                    <View style={{ marginLeft: width / 30, marginTop: width / 30, flexDirection: 'row' }}>
                                        <ProgressCircle
                                            percent={this.state.percentage}
                                            radius={width / 7}
                                            borderWidth={width / 35}
                                            color="yellow"
                                            shadowColor="white"
                                            bgColor="#ef5350"
                                        >
                                            <Text style={{ fontSize: width / 28, color: 'white', transform: transform() }}>{this.state.whichDay === true ? i18n.t('today') : i18n.t('drunk')}</Text>
                                            <Text style={{ fontSize: width / 22, color: 'white', fontWeight: 'bold', transform: transform() }}>{this.state.consume}ml</Text>
                                        </ProgressCircle>
                                        <View style={{ flexDirection: 'column' }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: width / 24, color: 'white', width: w / 1.8, marginLeft: width / 30, marginTop: width / 30, transform: transform() }}>{i18n.t('drunk')} {this.state.consume}ml {i18n.t('outOf')} {this.state.target > 0 ? this.state.target : this.state.mlOfWater}ml {i18n.t('target')}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                {this.state.toShowWater !== true ?
                                                    <View style={{ flexDirection: 'row', borderRadius: 3, width: w / 3.8, marginLeft: width / 30, marginTop: width / 30, height: width / 12, backgroundColor: '#ddd' }}>
                                                        <Text numberOfLines={1} style={{ fontSize: width / 28, width: w / 5, color: 'white', fontWeight: 'bold', textAlign: 'center', transform: transform(), marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }}>{i18n.t('addWater')}</Text>
                                                        <Icon name="add-mobile" size={width / 20} style={{ marginTop: 'auto', marginBottom: 'auto', marginRight: width / 60 }} color="white" />
                                                    </View>
                                                    : <TouchableOpacity onPress={() => this.props.navigation.navigate('AddWater', { target: this.state.target > 0 ? this.state.target : this.state.mlOfWater, id: this.state.userId })}>
                                                        <View style={{ flexDirection: 'row', borderRadius: 3, width: w / 3.8, marginLeft: width / 30, marginTop: width / 30, height: width / 12, backgroundColor: '#9ccc65' }}>
                                                            <Text numberOfLines={1} style={{ width: w / 5, fontSize: width / 28, color: 'white', fontWeight: 'bold', textAlign: 'center', transform: transform(), marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }}>{i18n.t('addWater')}</Text>
                                                            <Icon name="add-mobile" size={width / 20} style={{ marginTop: 'auto', marginBottom: 'auto', marginRight: width / 60 }} color="white" />
                                                        </View>
                                                    </TouchableOpacity>
                                                }

                                                {this.state.toShowWater !== true || this.state.target <= 0 ?
                                                    <View style={{ flexDirection: 'row', borderRadius: 3, width: w / 3.8, marginLeft: width / 30, marginTop: width / 30, height: width / 12, backgroundColor: '#ddd' }}>
                                                        <Text numberOfLines={1} style={{ fontSize: width / 28, width: w / 4, color: 'white', fontWeight: 'bold', textAlign: 'center', transform: transform(), marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }}>{i18n.t('updateTarget')}</Text>
                                                    </View>
                                                    : <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                                                        <View style={{ flexDirection: 'row', borderRadius: 3, width: w / 3.8, marginLeft: width / 30, marginTop: width / 30, height: width / 12, backgroundColor: '#9ccc65' }}>
                                                            <Text numberOfLines={1} style={{ fontSize: width / 28, width: w / 4, color: 'white', fontWeight: 'bold', textAlign: 'center', transform: transform(), marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }}>{i18n.t('updateTarget')}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                }
                                            </View>


                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text style={{ color: 'white', fontSize: width / 30, transform: transform(), textAlign: 'center' }}>{i18n.t('dailyTarget')}</Text>
                                            <Text style={{ fontWeight: 'bold', color: 'yellow', fontSize: width / 25, transform: transform(), textAlign: 'center' }}>{this.state.target > 0 ? this.state.target : this.state.mlOfWater}ml</Text>
                                        </View>
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text style={{ color: 'white', fontSize: width / 30, transform: transform(), textAlign: 'center' }}>{i18n.t('progress')}</Text>
                                            <Text style={{ fontWeight: 'bold', color: 'yellow', fontSize: width / 25, transform: transform(), textAlign: 'center' }}>{this.state.percentage}%</Text>
                                        </View>

                                    </View>
                                </View>
                                <View elevation={5} style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.08, paddingBottom: width / 30, marginTop: width / 20, borderRadius: 3, backgroundColor: '#42a5f5' }}>
                                    <View style={{ marginLeft: width / 30, marginTop: width / 50 }}>
                                        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: width / 25, transform: transform() }}>{i18n.t('trackingWaterProgress')}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', marginTop: width / 60 }}>
                                        <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                            <VerticalBarChartWater data={this.state.datas} barMaxHeight={height / 3.5} barWidth={width / 15} style={{ width: w / 1.4, height: height / 2.5, borderBottomWidth: 1, borderColor: "white" }} />
                                        </View>
                                        <View style={{ flexDirection: 'row', width: w / 1.4, justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto' }}>
                                            {this.state.weekDays.map((data, i) => {

                                                return (
                                                    <View>
                                                        <Text style={{ color: new Date().setHours(0, 0, 0, 0) === new Date(data.date).setHours(0, 0, 0, 0) ? 'yellow' : 'white', fontSize: new Date().setHours(0, 0, 0, 0) === new Date(data.date).setHours(0, 0, 0, 0) ? width / 25 : width / 30, fontWeight: new Date().setHours(0, 0, 0, 0) === new Date(data.date).setHours(0, 0, 0, 0) ? 'bold' : 'normal', transform: transform() }}>{days[new Date(data.date).getDay()]}</Text>
                                                    </View>
                                                )
                                            })}


                                        </View>
                                    </View>
                                </View>
                                {this.state.toShow === true ? <View>

                                </View> :
                                    <View elevation={5} style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.08, paddingBottom: width / 30, marginTop: width / 20, borderRadius: 3, backgroundColor: '#00D99C' }}>
                                        <View>
                                            <Text style={{ fontSize: width / 22, fontWeight: 'bold', color: 'white', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, transform: transform() }}>{this.state.leftReminder !== '' ? this.state.leftReminder : i18n.t('reminder')}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flexDirection: 'row', marginLeft: width / 30, marginTop: width / 50 }}>
                                                <Icon name="clock" size={width / 8} color="white" />
                                            </View>

                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Reminder', { date: this.state.reminderDate })}>
                                                <View style={{ borderRadius: 3, width: w / 2, marginTop: width / 30, marginLeft: width / 10, paddingBottom: width / 30, backgroundColor: '#FF9900', paddingTop: width / 40 }}>
                                                    <Text style={{ fontSize: width / 25, color: 'white', fontWeight: 'bold', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', transform: transform() }}>{i18n.t('setAReminder')}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>}
                            </View>
                            :
                            <ImageBackground source={loaderBg} imageStyle={{ borderRadius: 5 }} style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.08, paddingBottom: width / 30, marginTop: width / 20 }}>
                                <View style={{ width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: width / 22, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 30, transform: transform() }}>{i18n.t('pleaseSelectADateToContinue')}</Text>
                                    <Icon name="ml4" size={width / 12} style={{ marginTop: width / 50 }} color="white" />
                                </View>
                            </ImageBackground>
                        }

                    </ScrollView>
                    : <View></View>}
                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View elevation={10} style={{ borderWidth: 1, borderColor: '#ddd', backgroundColor: 'white', height: height / 1.6, width: width - 80, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width - 85, marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0.5, paddingBottom: width / 60, borderBottomColor: '#333' }}>
                            <Text style={{ fontSize: width / 20, color: '#333', marginLeft: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], textAlign: this.state.isRTL ? 'right' : 'left' }}>{i18n.t('updateTarget')}</Text>
                            <TouchableOpacity onPress={() => { this.setModalVisible(false) }}>
                                <Icon name="close" size={width / 20} style={{ marginRight: width / 30 }} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: height / 15 }}>
                            <Image source={four} style={{ width: width / 5, height: width / 5, transform: transform() }} />
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto', width: width - 60, marginTop: height / 25, justifyContent: 'center' }}>


                            <View style={{ width: w / 2, backgroundColor: '#eeeeee', borderRadius: 3, transform: transform() }}>
                                <TextInput
                                    keyboardType='numeric'
                                    autoCapitalize='words'
                                    onChangeText={(text) => this.setState({ customizeWaterLevel: text })}
                                    value={this.state.customizeWaterLevel}
                                    style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 2.1, marginLeft: 'auto', marginRight: 'auto', height: width / 8, paddingLeft: paddingLeftWater(), paddingRight: paddingRightWater() }}
                                    placeholderTextColor='#333'
                                    placeholder={i18n.t('enterTarget')} />

                            </View>
                            <View style={{ width: w / 12, backgroundColor: '#eeeeee', borderRadius: 3, transform: transform(), marginLeft: width / 30 }}>

                                <Text style={{ fontSize: width / 25, color: 'grey', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', fontWeight: 'bold', transform: transform() }}>ml</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => this.onPressTargetUpdate()}>
                            <View style={{ width: w / 2, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10, marginTop: height / 15 }}>
                                <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50 }}>{i18n.t('submit')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <Modal
                    transparent={true}
                    visible={this.state.modalVisibleTwo}
                >
                    <View elevation={10} style={{ borderWidth: 1, borderColor: '#ddd', backgroundColor: 'white', height: height / 1.6, width: width - 40, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width / 1.15, marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0.5, paddingBottom: width / 60, borderBottomColor: '#333' }}>
                            <Text style={{ fontSize: width / 20, color: '#333', marginLeft: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], textAlign: this.state.isRTL ? 'right' : 'left' }}>Customize</Text>
                            <TouchableOpacity onPress={() => { this.setModalVisibleTwo(false) }}>
                                <Icon name="close" size={width / 20} style={{ marginRight: width / 30 }} color="#333" />
                            </TouchableOpacity>
                        </View>

                    </View>
                </Modal>
            </View >
        )
    }

}
