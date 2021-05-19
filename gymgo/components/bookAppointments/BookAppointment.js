import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Image, Modal, RefreshControl, ActionSheetIOS, Picker, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, URL, paddingRight, setTime } from '../../utils/api/helpers'
import { getCurrency, getAllBranch, getMemberById } from '../../utils/api/authorization'
import { getAllShiftByBranch, getAllEmployeeShiftByShiftAndBranchAndEmployee, bookAppointment, getMemberTraffic } from '../../utils/api/bookAppointment'
import BarChartTraffic from './BarChartTraffic'
import DateTimePicker from "react-native-modal-datetime-picker";
import { showMessage } from 'react-native-flash-message';
import Loader from '../../utils/resources/Loader'
import boy from '../../assets/images/boy.jpg'
import i18n from 'i18n-js';

class BookAppointment extends Component {
    _isMounted = false

    state = {
        currency: '',
        userId: '',
        memberId: '',
        refreshing: false,
        DataBranchSales: [],
        dataBar: '',
        dataBarPerStatus: false,
        dataBarText: '',
        appointmentDay: 0,
        appointmentDayText: 'Select',
        appointmentDays: [{ name: i18n.t("sunday"), id: 0 }, { name: i18n.t("monday"), id: 1 }, { name: i18n.t("tuesday"), id: 2 }, { name: i18n.t("wednesday"), id: 3 }, { name: i18n.t("thursday"), id: 4 },
        { name: i18n.t("friday"), id: 5 }, { name: i18n.t("saturday"), id: 6 }],
        visible: false,
        showDate: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
        dateSelected: new Date(),
        showTimeFrom: '',
        fromTimeSelected: '',
        showTimeTo: '',
        toTimeSelected: '',
        visibleTimeFrom: false,
        visibleTimeTo: false,
        typeOfBranches: [],
        branch: '',
        branchLabel: 'Select',
        packages: [],
        trainer: [],
        userId: '',
        memberBranch: '',
        appointmentSchedule: '',
        appointmentScheduleText: 'Select',
        appointmentSchedules: [],
        availableTimings: [],
        fromTimeShow: '',
        toTimeShow: '',
        loading: false,
        allTraffic: {},
        trafficSchedules: [],
        trafficSchedule: '',
        trafficScheduleLabel: 'Select',
        status: false
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
                                packages: res.data.response.packageDetails.filter(data => new Date().setHours(0, 0, 0, 0) <= new Date(data.extendDate ? data.extendDate : data.endDate)),
                                memberBranch: res.data.response.branch._id,
                                status: res.data.response.packageDetails.filter(data => new Date().setHours(0, 0, 0, 0) <= new Date(data.extendDate ? data.extendDate : data.endDate)).length > 0 ? true : false
                            }, () => {

                                this.getShiftOfBranch(true)
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
            getAllBranch().then(res => {
                if (res) {
                    this.setState({
                        typeOfBranches: res.data.response
                    })
                }
            })


        }
    }


    componentWillUnmount() {
        this._isMounted = false
    }


    getShiftOfBranch = (type) => {
        this.setState({
            appointmentSchedule: '',
            showTimeTo: '',
            showTimeFrom: '',
            trainer: []
        }, () => {
            const obj = {
                branch: this.state.memberBranch,
                notExpired: type
            }
            getAllShiftByBranch(obj).then(res => {
                if (res) {
                    this.setState({
                        appointmentSchedules: res.data.response,
                    }, () => {
                        let map = new Map();
                        const trainers = []
                        this.state.packages.forEach(packages => {
                            if (packages.trainer && !map.has(packages.trainer._id) &&
                                setTime(packages.trainerExtend ? packages.trainerExtend : (packages.trainerEnd ? packages.trainerEnd : new Date())) >= setTime(new Date())) {
                                map.set(packages.trainer._id, true);
                                trainers.push({ trainer: packages.trainer, availableTiming: '', select: false })
                            }
                        })
                        this.setState({ trainer: trainers }, () => {
                            this.getTrainerSchedule()
                        })
                    })
                }
            })
        })

    }
    onGetTraffic = () => {
        const obj = {
            branch: this.state.branch,
            day: this.state.appointmentDay,
            schedule: this.state.trafficSchedule
        }
        if (this.state.trafficSchedule !== '' && this.state.day !== '' && this.state.branch !== '') {
            getMemberTraffic(obj).then(res => {
                if (res) {
                    this.setState({
                        allTraffic: res.data.response
                    }, () => {
                        const arr = []
                        const hours = (H) => {
                            const duration = H < 12 ? 'AM' : 'PM';
                            return (H % 12 > 0 ? H % 12 + '' + duration : 12 + '' + duration)
                        }
                        Object.entries(this.state.allTraffic).map((d) => {
                            arr.push({ time: hours(d[0]), length: d[1] })
                        })
                        this.setState({
                            DataBranchSales: arr
                        })
                    })
                }
            })
        }

    }

    onBranchChange = () => {
        const obj = {
            branch: this.state.branch
        }
        getAllShiftByBranch(obj).then(res => {
            if (res) {
                this.setState({
                    trafficSchedules: res.data.response
                }, () => {
                    this.onGetTraffic()
                })
            }
        })
    }

    getTrainerSchedule() {
        const { appointmentSchedule, memberBranch, trainer, dateSelected } = this.state
        if (appointmentSchedule && memberBranch && dateSelected && trainer.length > 0) {
            const data = {
                shift: appointmentSchedule,
                branch: memberBranch,
                date: dateSelected,
                trainerIds: trainer.map(trainerData => trainerData.trainer._id)
            }
            getAllEmployeeShiftByShiftAndBranchAndEmployee(data).then(res => {
                if (res) {
                    this.setState({
                        availableTimings: res.data.response

                    })
                }
            })
        }
    }


    showBranchPicker = () => {
        const data = this.state.typeOfBranches.map(l => l.branchName)
        const len = data.length
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
        },
            (buttonIndex) => {
                this.setState({ branch: data[buttonIndex] });
                if (this.state.typeOfBranches[buttonIndex] !== undefined) {
                    this.setState({
                        branch: this.state.typeOfBranches[buttonIndex]._id,
                        branchLabel: this.state.typeOfBranches[buttonIndex].branchName
                    }, () => {
                        this.onBranchChange()
                    })
                } else {
                    this.setState({
                        branch: '',
                        branchLabel: ''
                    })
                }
            });
    }
    renderBranchPicker() {
        if (Platform.OS === 'android') {
            return (
                <View style={[styles.formSelling, { transform: transform(), }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: width / 50, width: w / 1.24, color: 'white' }}
                        selectedValue={this.state.branch}
                        onValueChange={(itemValue) => this.setState({ branch: itemValue }, () => this.onBranchChange()
                        )}>
                        {
                            this.state.typeOfBranches.map((v) => {
                                return <Picker.Item label={v.branchName} value={v._id} key={v._id} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showBranchPicker()}>
                    <View style={[styles.formSelling, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 20, color: 'white' }}>{this.state.branchLabel}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    showAppointmentDaysPicker = () => {
        const data = this.state.appointmentDays.map(l => l.name)
        const len = data.length
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
        },
            (buttonIndex) => {
                if (this.state.appointmentDays[buttonIndex] !== undefined) {
                    this.setState({
                        appointmentDay: this.state.appointmentDays[buttonIndex].id,
                        appointmentDayText: this.state.appointmentDays[buttonIndex].name
                    }, () => this.onGetTraffic()
                    )
                } else {
                    this.setState({
                        appointmentDay: '',
                    })
                }
            });
    }
    renderAppointmentDaysPicker() {
        if (Platform.OS === 'android') {
            return (
                <View style={[styles.form, { transform: transform(), }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: width / 30, width: w / 2.6 }}
                        selectedValue={this.state.appointmentDay}
                        onValueChange={(itemValue) => this.setState({ appointmentDay: itemValue }, () => this.onGetTraffic()
                        )}>
                        {
                            this.state.appointmentDays.map((v, i) => {
                                return <Picker.Item label={v.name} value={v.id} key={i} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showAppointmentDaysPicker()}>
                    <View style={[styles.form, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 20 }}>{this.state.appointmentDayText}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    showTrafficSchedulePicker = () => {
        const data = this.state.trafficSchedules.map(l => l.shiftName)
        const len = data.length
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
        },
            (buttonIndex) => {
                this.setState({ trafficSchedule: data[buttonIndex] });
                if (this.state.trafficSchedules[buttonIndex] !== undefined) {
                    this.setState({
                        trafficSchedule: this.state.trafficSchedules[buttonIndex]._id,
                        trafficScheduleLabel: this.state.trafficSchedules[buttonIndex].shiftName
                    }, () => {
                        this.onGetTraffic()

                    })
                } else {
                    this.setState({
                        trafficScheduleLabel: '',
                    })
                }
            });
    }
    renderTrafficSchedulePicker() {
        if (Platform.OS === 'android') {
            return (
                <View style={[styles.form, { transform: transform(), }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: width / 30, width: w / 2.6 }}
                        selectedValue={this.state.trafficSchedule}
                        onValueChange={(itemValue) => this.setState({ trafficSchedule: itemValue }, () => this.onGetTraffic()
                        )}>
                        {
                            this.state.trafficSchedules.map((v, i) => {
                                return <Picker.Item label={v.shiftName} value={v._id} key={i} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showTrafficSchedulePicker()}>
                    <View style={[styles.form, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 20 }}>{this.state.trafficScheduleLabel}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    showAppointmentSchedulePicker = () => {
        const data = this.state.appointmentSchedules.map(l => l.shiftName)
        const len = data.length
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
        },
            (buttonIndex) => {
                if (this.state.appointmentSchedules[buttonIndex] !== undefined) {
                    this.setState({
                        appointmentSchedule: this.state.appointmentSchedules[buttonIndex]._id,
                        appointmentScheduleText: this.state.appointmentSchedules[buttonIndex].shiftName
                    }, () => {
                        this.getTimeSchedule(this.state.appointmentSchedule)
                    })
                } else {
                    this.setState({
                        appointmentSchedule: '',
                    })
                }
            });
    }
    renderAppointmentSchedulePicker() {
        if (Platform.OS === 'android') {
            return (
                <View style={[styles.form, { transform: transform(), }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: width / 30, width: w / 2.6 }}
                        selectedValue={this.state.appointmentSchedule}
                        onValueChange={(itemValue) => this.setState({ appointmentSchedule: itemValue }, () => this.getTimeSchedule(this.state.appointmentSchedule))}>
                        <Picker.Item label='Select' value='' />
                        {
                            this.state.appointmentSchedules.map((v, i) => {
                                return <Picker.Item label={v.shiftName} value={v._id} key={i} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showAppointmentSchedulePicker()}>
                    <View style={[styles.form, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 20 }}>{this.state.appointmentScheduleText}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    getTimeSchedule = (itemValue) => {
        if (this.state.appointmentSchedule !== '') {
            const currentDateToFutureDate = new Date(this.state.dateSelected).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)

            const a = this.state.appointmentSchedules.filter(d => d._id === itemValue)

            const startHours = new Date()
            const fromHours = startHours.setHours(new Date(a[0].fromTime).getHours(), new Date(a[0].fromTime).getMinutes(), new Date(a[0].fromTime).getSeconds())
            const endHours = new Date()
            const toHours = endHours.setHours(new Date().getHours(), new Date().getMinutes(), new Date().getSeconds())

            var shours = !currentDateToFutureDate ? (toHours > fromHours ? new Date().getHours() : new Date(a[0].fromTime).getHours()) : (new Date(a[0].fromTime).getHours())
            var sminutes = !currentDateToFutureDate ? (toHours > fromHours ? new Date().getMinutes() : new Date(a[0].fromTime).getMinutes()) : (new Date(a[0].fromTime).getMinutes())
            var sampm = shours >= 12 ? 'PM' : 'AM'
            shours = shours % 12
            shours = shours ? shours : 12  // the hour '0' should be '12'
            var startTime = shours + ':' + `${("0" + sminutes).slice(-2)}` + ' ' + sampm

            var ehours = new Date(a[0].toTime).getHours()
            var eminutes = new Date(a[0].toTime).getMinutes()
            var eampm = ehours >= 12 ? 'PM' : 'AM'
            ehours = ehours % 12
            ehours = ehours ? ehours : 12  // the hour '0' should be '12'
            var endTime = ehours + ':' + `${("0" + eminutes).slice(-2)}` + ' ' + eampm

            this.setState({
                showTimeFrom: startTime,
                fromTimeShow: !currentDateToFutureDate ? (toHours > fromHours ? toHours : fromHours) : (fromHours),
                showTimeTo: endTime,
                toTimeShow: a[0].toTime
            }, () => {
                this.getTrainerSchedule()
            })
        }
    }

    handleDatePicked(date) {
        this.setState({
            dateSelected: new Date(date),
            showDate: date.toISOString().split('T')[0].split('-').reverse().join('/'),

        }, () => {
            this.getShiftOfBranch(new Date().setHours(0, 0, 0, 0) === new Date(this.state.dateSelected).setHours(0, 0, 0, 0) ? true : false)
        })
        this.hideDateTimePicker()
    }
    showDateTimePicker = () => {
        this.setState({ visible: true });
    }

    hideDateTimePicker = () => {
        this.setState({ visible: false });
    }

    showTimePicker = (type) => {
        this.setState({ [type]: true });
    }

    hideTimePicker = (type) => {
        this.setState({ [type]: false });
    }


    handleTimePicked(date, type) {
        const propsDate = new Date()
        const propsDateSplit = JSON.stringify(propsDate).split('T')[0].split('"')[1]
        const paramDate = date
        const paramDateSplit = JSON.stringify(paramDate).split('T')[1].split('"')[0]
        const finalDate = `${propsDateSplit}T${paramDateSplit}`

        const dates = finalDate
        var shours = new Date(finalDate).getHours()
        var sminutes = new Date(finalDate).getMinutes()
        var sampm = shours >= 12 ? 'PM' : 'AM'
        shours = shours % 12
        shours = shours ? shours : 12  // the hour '0' should be '12'
        var startTime = shours + ':' + `${("0" + sminutes).slice(-2)}` + ' ' + sampm
        if (type === 'visibleTimeFrom') {
            this.setState({
                showTimeFrom: startTime,
                fromTimeSelected: dates,
                fromTimeShow: dates
            })
        } else if (type === 'visibleTimeTo') {
            this.setState({
                showTimeTo: startTime,
                toTimeSelected: dates,
                toTimeShow: dates
            })
        }
        this.hideTimePicker(type)
    }

    onSelectTrainer = (index) => {
        this.state.trainer.map((d, i) => {
            if (index === i) {
                d.select = true
            } else {
                d.select = false
            }
        })
        this.setState({
            trainer: this.state.trainer
        })
    }


    onBookAppointment = () => {
        const filter = this.state.trainer.length > 0 ? this.state.trainer.filter(d => d.select === true) : []
        if (this.state.appointmentSchedule !== '' && this.state.schedule !== '') {
            this.setState({
                loading: true
            })
            const data = {
                appointmentFor: "member",
                member: this.state.userId,
                date: this.state.dateSelected,
                schedule: this.state.appointmentSchedule,
                branch: this.state.memberBranch,
                fromTime: new Date(this.state.fromTimeShow),
                toTime: new Date(this.state.toTimeShow),
                trainer: filter.length > 0 ? filter[0].trainer._id : null
            }
            bookAppointment(data).then(res => {
                if (res) {
                    this.setState({
                        loading: false
                    }, () => this.props.navigation.navigate('BookAppointmentHistory'))
                    showMessage({
                        message: "Appointment Added Successfully",
                        type: "success",
                    })
                } else {
                    this.setState({ loading: false })
                    showMessage({
                        message: "Error occured while adding an appointment",
                        type: "danger",
                    })
                }
            })
        } else {
            showMessage({
                message: "Some fields are missing",
                type: "danger",
            })
        }

    }

    onShowTrafficDetails = (i) => {
        this.setState({
            dataBar: this.state.DataBranchSales[i].length,
            dataBarPerStatus: true
        }, () => {
            if (this.state.dataBar >= 0 && this.state.dataBar <= 30) {
                this.setState({
                    dataBarText: i18n.t('usuallyNotBusy')
                })
            } else if (this.state.dataBar >= 31 && this.state.dataBar <= 50) {
                this.setState({
                    dataBarText: i18n.t('usuallyNotTooBusy')
                })
            } else if (this.state.dataBar >= 51 && this.state.dataBar <= 70) {
                this.setState({
                    dataBarText: i18n.t('usuallyALittleBusy')
                })
            } else if (this.state.dataBar >= 71 && this.state.dataBar <= 90) {
                this.setState({
                    dataBarText: i18n.t('usuallyAboutToBeBusy')
                })
            } else if (this.state.dataBar >= 91 && this.state.dataBar <= 100) {
                this.setState({
                    dataBarText: i18n.t('usuallyBusy')
                })
            }
        })
    }
    render() {
        const { fromTimeShow, toTimeShow } = this.state
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <Loader loading={this.state.loading} text='Registering User' />
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>
                    <View elevation={3} style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', paddingBottom: width / 30, marginTop: width / 30, borderRadius: 3 }}>
                        <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                            {this.renderBranchPicker()}
                        </View>
                        <View style={{ marginLeft: width / 30, marginTop: width / 30 }}>
                            <Text style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign() }}>{i18n.t('trafficOverview')}</Text>
                        </View>
                        <View style={{ marginTop: width / 30, width: w / 1.2, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                                <Text style={{ fontSize: width / 25, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('popularTimes')}</Text>
                                {this.renderAppointmentDaysPicker()}
                            </View>
                            <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                                <Text style={{ fontSize: width / 25, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('schedule')}</Text>
                                {this.renderTrafficSchedulePicker()}
                            </View>
                        </View>
                        {this.state.dataBarPerStatus ?
                            <View style={{ width: w / 2, borderRadius: 3, borderWidth: 1, borderColor: '#ddd', paddingBottom: width / 80, paddingTop: width / 80, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20, flexDirection: 'row' }}>
                                <Text style={{ fontSize: width / 25, fontWeight: 'bold', color: 'orange', marginLeft: width / 30, width: w / 8, transform: transform(), textAlign: textAlign() }}>{this.state.dataBar}%</Text>
                                <Text style={{ fontSize: width / 28, color: 'grey', marginLeft: width / 80, width: w / 3.2, transform: transform(), textAlign: textAlign() }}>{this.state.dataBarText}</Text>
                            </View> : null}
                        <View style={{ marginLeft: 'auto', marginRight: 'auto', transform: transform() }}>
                            <BarChartTraffic data={this.state.DataBranchSales} barMaxHeight={height / 6} barWidth={width / 15} getValue={(i) => this.onShowTrafficDetails(i)} />
                        </View>
                    </View>
                    {this.state.status === true ?
                        <View elevation={3} style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', paddingBottom: width / 30, marginTop: width / 30, borderRadius: 3 }}>
                            <Text style={{ marginTop: width / 30, marginLeft: width / 30, fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign() }}>{i18n.t('selectDateAndTime')}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2 }}>
                                <TouchableOpacity onPress={() => this.showDateTimePicker()} >
                                    <View style={{ marginTop: width / 30, marginLeft: width / 30, flexDirection: 'row' }}>
                                        <Icon name="calender" size={width / 12} color="grey" />
                                        <View style={{ marginLeft: width / 50, flexDirection: 'column' }}>
                                            <Text style={{ fontSize: width / 32, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('date')}</Text>
                                            <Text style={{ fontSize: width / 28, color: '#0091ea', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.showDate}</Text>
                                        </View>
                                        <Icon name="down-arrow" size={width / 18} style={{ marginLeft: width / 50, marginTop: 'auto', marginBottom: 'auto' }} color="#0091ea" />
                                    </View>
                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={this.state.visible}
                                    mode='date'
                                    onConfirm={(date) => this.handleDatePicked(date)}
                                    onCancel={() => this.hideDateTimePicker()}
                                />
                                <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                                    <Text style={{ fontSize: width / 25, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('schedule')}</Text>
                                    {this.renderAppointmentSchedulePicker()}
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', width: w / 1.2, marginTop: width / 30 }}>
                                <TouchableOpacity onPress={() => this.showTimePicker('visibleTimeFrom')} >
                                    <View style={{ marginTop: width / 30, marginLeft: width / 30, flexDirection: 'row' }}>
                                        <Icon name="stop-watch" size={width / 12} color="grey" />
                                        <View style={{ marginLeft: width / 50, flexDirection: 'column' }}>
                                            <Text style={{ fontSize: width / 32, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('fromTime')}</Text>
                                            <Text style={{ fontSize: width / 28, color: '#0091ea', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.showTimeFrom}</Text>
                                        </View>
                                        <Icon name="down-arrow" size={width / 18} style={{ marginLeft: width / 50, marginTop: 'auto', marginBottom: 'auto' }} color="#0091ea" />
                                    </View>
                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={this.state.visibleTimeFrom}
                                    mode='time'
                                    onConfirm={(date) => this.handleTimePicked(date, 'visibleTimeFrom')}
                                    onCancel={() => this.hideTimePicker('visibleTimeFrom')}
                                />
                                <TouchableOpacity onPress={() => this.showTimePicker('visibleTimeTo')} >
                                    <View style={{ marginTop: width / 30, marginLeft: width / 30, flexDirection: 'row' }}>
                                        <Icon name="stop-watch" size={width / 12} color="grey" />
                                        <View style={{ marginLeft: width / 50, flexDirection: 'column' }}>
                                            <Text style={{ fontSize: width / 32, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('toTime')}</Text>
                                            <Text style={{ fontSize: width / 28, color: '#0091ea', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.showTimeTo}</Text>
                                        </View>
                                        <Icon name="down-arrow" size={width / 18} style={{ marginLeft: width / 50, marginTop: 'auto', marginBottom: 'auto' }} color="#0091ea" />
                                    </View>
                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={this.state.visibleTimeTo}
                                    mode='time'
                                    onConfirm={(date) => this.handleTimePicked(date, 'visibleTimeTo')}
                                    onCancel={() => this.hideTimePicker('visibleTimeTo')}
                                />
                            </View>
                            {this.state.trainer.length > 0 ? <Text style={{ marginTop: width / 30, marginLeft: width / 30, fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign() }}>{i18n.t('selectTrainer')}</Text> : null}
                            <View style={{ marginTop: width / 30 }}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: width / 30 }}>
                                    {this.state.trainer.length > 0 ? this.state.trainer.map((d, i) => {
                                        const avatar = `${URL}/${d.trainer.credentialId.avatar.path.replace(/\\/g, "/")}`
                                        const userImage = JSON.parse(JSON.stringify({ uri: avatar }))
                                        const filter = this.state.availableTimings.filter(data => data.employee._id === d.trainer._id)

                                        var shours = filter.length > 0 ? new Date(filter[0].shift.fromTime).getHours() : ''
                                        var sminutes = filter.length > 0 ? new Date(filter[0].shift.fromTime).getMinutes() : ''
                                        var sampm = shours >= 12 ? 'PM' : 'AM'
                                        shours = shours % 12
                                        shours = shours ? shours : 12  // the hour '0' should be '12'
                                        var startTime = shours + ':' + `${("0" + sminutes).slice(-2)}` + ' ' + sampm

                                        var ehours = filter.length > 0 ? new Date(filter[0].shift.toTime).getHours() : ''
                                        var eminutes = filter.length > 0 ? new Date(filter[0].shift.toTime).getMinutes() : ''
                                        var eampm = ehours >= 12 ? 'PM' : 'AM'
                                        ehours = ehours % 12
                                        ehours = ehours ? ehours : 12  // the hour '0' should be '12'
                                        var endTime = ehours + ':' + `${("0" + eminutes).slice(-2)}` + ' ' + eampm

                                        if (filter.length > 0) {
                                            const startHours = new Date()
                                            const fromHours = startHours.setHours(new Date(filter[0].shift.fromTime).getHours(), new Date(filter[0].shift.fromTime).getMinutes(), new Date(filter[0].shift.fromTime).getSeconds())
                                            const endHours = new Date()
                                            const toHours = endHours.setHours(new Date(filter[0].shift.toTime).getHours(), new Date(filter[0].shift.toTime).getMinutes(), new Date(filter[0].shift.toTime).getSeconds())
                                            const compareStartHours = new Date()
                                            const fromCompare = compareStartHours.setHours(new Date(fromTimeShow).getHours(), new Date(fromTimeShow).getMinutes(), new Date(fromTimeShow).getSeconds())
                                            const compareEndHours = new Date()
                                            const toCompare = compareEndHours.setHours(new Date(toTimeShow).getHours(), new Date(toTimeShow).getMinutes(), new Date(toTimeShow).getSeconds())
                                            if ((fromCompare >= fromHours && fromCompare <= toHours) && (toCompare <= toHours && toCompare >= fromHours)) {
                                                return (
                                                    <TouchableOpacity key={i} onPress={() => this.onSelectTrainer(i)}>
                                                        <View style={{ width: w / 3.2, borderWidth: 1, paddingBottom: width / 30, borderColor: '#ddd', borderRadius: 3, marginLeft: width / 30 }}>
                                                            <View style={{ width: w / 3.4, flexDirection: 'row', justifyContent: 'flex-end', marginTop: width / 50 }}>
                                                                {d.select === false ?
                                                                    <View style={{ width: width / 18, height: width / 18, borderRadius: width / 36, borderWidth: 1, borderColor: '#ddd' }} />
                                                                    : <View style={{ width: width / 18, height: width / 18, borderRadius: width / 36, borderWidth: 1, borderColor: 'orange', backgroundColor: 'orange' }}>
                                                                        <Icon name="approve-icon" size={width / 25} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} color="white" />
                                                                    </View>}
                                                            </View>
                                                            <Image source={userImage} style={{ width: width / 7, height: width / 7, borderRadius: width / 14, marginLeft: 'auto', marginRight: 'auto', transform: transform() }} />
                                                            <Text style={{ fontSize: width / 30, textAlign: 'center', color: '#333', width: w / 3.5, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 80, transform: transform() }}>{d.trainer.credentialId.userName}</Text>
                                                            <Text style={{ fontSize: width / 45, marginLeft: width / 50, color: 'grey', marginTop: width / 50, transform: transform(), textAlign: textAlign() }}>{i18n.t('availableTimings')}</Text>
                                                            <Text style={{ fontSize: width / 40, marginLeft: width / 50, color: '#0091ea', fontWeight: 'bold', width: w / 3.5, transform: transform(), textAlign: textAlign() }}>{startTime} - {endTime}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            }

                                            else {
                                                return null
                                            }
                                        }
                                    }) : null}


                                </ScrollView>
                            </View>
                            <TouchableOpacity onPress={() => this.onBookAppointment()}>
                                <View style={{ width: w / 2, marginLeft: 'auto', marginRight: 'auto', paddingTop: width / 50, paddingBottom: width / 50, backgroundColor: '#00c853', marginTop: width / 30, borderRadius: 12 }}>
                                    <Text style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', fontSize: width / 22, color: 'white', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('submit')}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        : null}


                </ScrollView>



            </View>
        )
    }
}


const styles = StyleSheet.create({
    form: {
        marginTop: width / 50,
        width: w / 2.5,
        borderColor: '#eee',
        borderWidth: 1,
        backgroundColor: '#eee',
        borderRadius: 3,
        height: width / 12,
    },
    formSelling: {
        marginTop: width / 30,
        width: w / 1.24,
        backgroundColor: 'orange',
        borderRadius: 3,
        height: width / 10,
    }
})
export default BookAppointment