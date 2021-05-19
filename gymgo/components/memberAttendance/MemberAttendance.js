import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground, RefreshControl, Modal } from 'react-native';
import Header from '../common/Header'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import AttendanceCalendarWeekly from '../../utils/AttendanceWeeklyCalendar'
import AttendanceMonthlyCalendar from '../../utils/AttendanceMonthlyCalendar'
import { getMemberAttendance } from '../../utils/api/attendance'
import i18n from 'i18n-js';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'

export default class MemberAttendance extends React.Component {
    _isMounted = false
    state = {
        date: '',
        monthDate: '',
        valueSelected: 1,
        modalVisible: false,
        memberId: '',
        allAttendances: [],
        totalHrs: '',
        totalMin: ''
    }


    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            this.onWeekChanged()
            this.getMonth()
            AsyncStorage.getItem('authedToken').then((token) => {
                const memberId = jwtDecode(token).userId
                this.setState({
                    memberId,
                }, () => {
                    const obj = {
                        memberId: this.state.memberId,
                        from: this.state.date.firstDay,
                        to: this.state.date.lastDay
                    }
                    getMemberAttendance(obj).then(res => {
                        if (res) {
                            this.setState({
                                allAttendances: res.data.response,
                            }, () => {
                                this.calculateTotal()
                            })
                        }
                    })
                })
            })
        }

    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getMonth = () => {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        const dates = {
            firstDay: firstDay,
            lastDay: lastDay
        }
        this.setState({
            monthDate: dates
        })
    }

    onWeekChanged = () => {
        var week = []
        var date = new Date()
        if (week.length === 0) {
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

        const dates = {
            firstDay: week[0].date,
            lastDay: week[6].date
        }
        this.setState({
            date: dates

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


    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    onSelectMonthly = () => {
        this.setState({
            valueSelected: 2,
            modalVisible: false
        }, () => {
            this.onMonthChange()
        })
    }

    onSelectWeekly = () => {
        this.setState({
            valueSelected: 1,
            modalVisible: false
        }, () => {
            this.onWeekChange()
        })
    }

    onWeekChange = () => {
        const obj = {
            memberId: this.state.memberId,
            from: this.state.date.firstDay,
            to: this.state.date.lastDay
        }
        getMemberAttendance(obj).then(res => {
            if (res) {
                this.setState({
                    allAttendances: res.data.response
                }, () => {
                    this.calculateTotal()
                })
            }
        })
    }

    onMonthChange = () => {
        const obj = {
            memberId: this.state.memberId,
            from: this.state.monthDate.firstDay,
            to: this.state.monthDate.lastDay
        }
        getMemberAttendance(obj).then(res => {
            if (res) {
                this.setState({
                    allAttendances: res.data.response
                }, () => {
                    this.calculateTotal()
                })
            }
        })
    }

    calculateTotal = () => {
        const filter = this.state.allAttendances.filter(d => d.timeOut !== null)
        const hrs = filter.map(d => {
            var today = new Date(d.timeIn);
            var Christmas = new Date(d.timeOut);
            var diffMs = (Christmas - today); // milliseconds between now & Christmas
            return Math.floor((diffMs % 86400000) / 3600000); // hours    

        }).reduce((a, b) => {
            return a + b
        }, 0)
        const min = filter.map(d => {
            var today = new Date(d.timeIn);
            var Christmas = new Date(d.timeOut);
            var diffMs = (Christmas - today); // milliseconds between now & Christmas
            return Math.round(((diffMs % 86400000) % 3600000) / 60000);

        }).reduce((a, b) => {
            return a + b
        }, 0)

        this.setState({
            totalHrs: hrs,
            totalMin: min
        })
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#eeeeee', transform: transform() }}>
                <View style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: width / 80 }} >
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                        <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('myAttendance')}</Text>
                    </TouchableOpacity>
                </View>

                <View elevation={3} style={{ backgroundColor: 'white', width: w, paddingBottom: width / 30, }}>
                    <View style={{ width: w / 1.08, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto' }}>

                        <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: width / 50, paddingTop: width / 50, width: w / 3, backgroundColor: '#f5f5f5', borderRadius: 2, marginTop: width / 30 }}>
                                <Text style={{ fontSize: width / 28, color: '#333', marginLeft: width / 30, transform: transform(), textAlign: textAlign() }}>{this.state.valueSelected === 1 ? i18n.t('weekly') : i18n.t('monthly')}</Text>
                                <Icon name="down-arrow" size={width / 22} style={{ marginRight: width / 30, transform: transform() }} color="#333" />
                            </View>
                        </TouchableOpacity>
                        <View>
                            {this.state.valueSelected === 1 ?
                                <AttendanceCalendarWeekly getValue={(value) => this.setState({ date: value }, () => this.onWeekChange())} />
                                : <AttendanceMonthlyCalendar getValue={(value) => this.setState({ monthDate: value }, () => this.onMonthChange())} />
                            }
                        </View>
                    </View>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: height }}>
                    {this.state.allAttendances.map((data, i) => {

                        var shours = new Date(data.timeIn).getHours()
                        var sminutes = new Date(data.timeIn).getMinutes()
                        var sampm = shours >= 12 ? 'PM' : 'AM'
                        shours = shours % 12
                        shours = shours ? shours : 12  // the hour '0' should be '12'
                        var startTime = shours + ':' + `${("0" + sminutes).slice(-2)}` + ' ' + sampm

                        var ehours = new Date(data.timeOut).getHours()
                        var eminutes = new Date(data.timeOut).getMinutes()
                        var eampm = ehours >= 12 ? 'PM' : 'AM'
                        ehours = ehours % 12
                        ehours = ehours ? ehours : 12  // the hour '0' should be '12'
                        var endTime = ehours + ':' + `${("0" + eminutes).slice(-2)}` + ' ' + eampm

                        var today = new Date(data.timeIn);
                        var Christmas = new Date(data.timeOut);
                        var diffMs = (Christmas - today); // milliseconds between now & Christmas
                        var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
                        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                        const leftReminderHours = diffHrs
                        const leftReminderMinutes = diffMins
                        const final = `${leftReminderHours}.${leftReminderMinutes} hrs`
                        return (
                            <View style={{ width: w / 1.05, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20, paddingBottom: width / 30, borderRadius: 3 }}>
                                <Text style={{ fontSize: width / 22, fontWeight: 'bold', color: '#333', marginTop: width / 50, marginLeft: width / 50, transform: transform(), textAlign: textAlign() }}>{new Date(data.date).getDate()}/{new Date(data.date).getMonth() + 1}/{new Date(data.date).getFullYear()}</Text>
                                <View style={{ borderWidth: 1, borderColor: '#ddd', width: w / 1.09, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 50 }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.1, marginLeft: 'auto', marginRight: 'auto' }}>
                                    <View style={{ flexDirection: 'row', marginTop: width / 50 }}>
                                        <Icon name="checkin" size={width / 12} style={{ transform: transform(), marginTop: 'auto', marginBottom: 'auto' }} color="#64dd17" />
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text style={{ fontSize: width / 32, color: 'grey', transform: transform(), textAlign: textAlign(), marginLeft: width / 70 }}>{i18n.t('checkIn')}</Text>
                                            <Text style={{ fontSize: width / 25, color: '#64dd17', fontWeight: 'bold', transform: transform(), textAlign: textAlign(), marginLeft: width / 70 }}>{startTime}</Text>
                                        </View>
                                        <View style={{ borderRightWidth: 2, borderRightColor: '#ddd', marginLeft: width / 50 }} />

                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: width / 50 }}>
                                        <Icon name="checkout" size={width / 12} style={{ transform: transform(), marginTop: 'auto', marginBottom: 'auto' }} color="red" />
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text style={{ fontSize: width / 32, color: 'grey', transform: transform(), textAlign: textAlign(), marginLeft: width / 70 }}>{i18n.t('checkOut')}</Text>
                                            <Text style={{ fontSize: width / 25, color: 'red', fontWeight: 'bold', transform: transform(), textAlign: textAlign(), marginLeft: width / 70 }}>{data.timeOut !== null ? endTime : 'In Progress'}</Text>
                                        </View>
                                        <View style={{ borderRightWidth: 2, borderRightColor: '#ddd', marginLeft: width / 50 }} />

                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: width / 50 }}>
                                        <Icon name="time" size={width / 12} style={{ transform: transform(), marginTop: 'auto', marginBottom: 'auto' }} color="orange" />
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text style={{ fontSize: width / 32, color: 'grey', transform: transform(), textAlign: textAlign(), marginLeft: width / 70 }}>{i18n.t('totalHrs')}</Text>
                                            <Text style={{ fontSize: width / 25, color: 'orange', fontWeight: 'bold', transform: transform(), textAlign: textAlign(), marginLeft: width / 70 }}>{data.timeOut !== null ? final : 'Counting..'}</Text>
                                        </View>

                                    </View>
                                </View>
                            </View>
                        )
                    })}

                </ScrollView>

                <View style={{ borderTopWidth: 1, borderTopColor: '#ddd', width: w, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', bottom: 0, position: 'absolute', paddingBottom: width / 50, paddingTop: width / 50 }} >
                    <View style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: width / 30, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('total')}</Text>
                            <Text style={{ fontSize: width / 18, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.totalHrs === '' ? '00' : this.state.totalHrs}.{this.state.totalMin === '' ? '00' : this.state.totalMin} Hrs</Text>
                        </View>
                    </View>
                </View>
                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View elevation={10} style={{ backgroundColor: 'white', height: height / 4.8, width: width - 40, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width / 1.15, marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0.5, paddingBottom: width / 60, borderBottomColor: '#333' }}>
                            <Text style={{ fontSize: width / 20, color: '#333', marginLeft: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], textAlign: this.state.isRTL ? 'right' : 'left' }}>{i18n.t('days')}</Text>
                            <TouchableOpacity onPress={() => { this.setModalVisible(false) }}>
                                <Icon name="close" size={width / 20} style={{ marginRight: width / 30 }} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>
                            <TouchableOpacity onPress={() => this.onSelectWeekly()}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width - 50, marginLeft: 'auto', marginRight: 'auto' }}>
                                    <Text style={{ fontSize: width / 25, color: '#333', marginLeft: width / 30 }}>{i18n.t('weekly')}</Text>
                                    <Icon name="approve-icon" size={width / 22} style={{ marginRight: width / 30 }} color={this.state.valueSelected === 1 ? "#4caf50" : 'white'} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onSelectMonthly()}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width - 50, marginLeft: 'auto', marginRight: 'auto' }}>
                                    <Text style={{ fontSize: width / 25, color: '#333', marginLeft: width / 30 }}>{i18n.t('monthly')}</Text>
                                    <Icon name="approve-icon" size={width / 22} style={{ marginRight: width / 30 }} color={this.state.valueSelected === 2 ? "#4caf50" : 'white'} />
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </Modal>
            </View >
        )
    }
}