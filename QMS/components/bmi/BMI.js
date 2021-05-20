import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, RefreshControl, Image, Animated } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, URL, paddingRightBMI, paddingLeftBMI, paddingRight } from '../../utils/api/helpers'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import VerticalBarChart from './VerticalBarChart'
import { getCurrency, getUserDetailsById, updateMemberProfile } from '../../utils/api/authorization'
import { addMemberWeight, getMemberWeight } from '../../utils/api/bmi'
import BMICalendar from '../../utils/BMICalendar'
import Loader from '../../utils/resources/Loader'
import { showMessage, hideMessage } from "react-native-flash-message";
import i18n from 'i18n-js';


class BMI extends Component {
    _isMounted = false


    constructor() {
        super();
        this.state = {
            currency: '',
            height: '',
            weight: '',
            SelectedDates: [],
            Schedule: '',
            percent: [70, 80, 90, 100],
            week: [],
            modalVisible: false,
            goal: 0,
            BMI: 0,
            category: '',
            userDetails: '',
            userCredentials: '',
            age: '',
            weightUpdate: 0,
            startWeight: '',
            refreshing: false,
            loading: false,
            memberWeights: [],
            memberWeightsFiltered: [],
            data: [],
            datas: [],
            max: '',
            typeOfDate: 'increase'

        };
        this.onPressIncrementGoalTimer = null;
        this.onPressIncrementGoal = this.onPressIncrementGoal.bind(this);
        this.onPressIncrementGoalStopTimer = this.onPressIncrementGoalStopTimer.bind(this);
        this.onPressDecrementGoalTimer = null;
        this.onPressDecrementGoal = this.onPressDecrementGoal.bind(this);
        this.onPressDecrementGoalStopTimer = this.onPressDecrementGoalStopTimer.bind(this);

        this.onPressIncrementWeightTimer = null;
        this.onPressIncrementWeight = this.onPressIncrementWeight.bind(this);
        this.onPressIncrementWeightStopTimer = this.onPressIncrementWeightStopTimer.bind(this);
        this.onPressDecrementWeightTimer = null;
        this.onPressDecrementWeight = this.onPressDecrementWeight.bind(this);
        this.onPressDecrementWeightStopTimer = this.onPressDecrementWeightStopTimer.bind(this);
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible, forgotPass: '' });
    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            const unsubscribe = this.props.navigation.addListener('didFocus', () => {
                this.onWeekChanged()
                AsyncStorage.getItem('authedToken').then((token) => {
                    const userId = jwtDecode(token).credential
                    const memberId = jwtDecode(token).userId
                    this.setState({
                        userId,
                        memberId
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

                //Setting up data array

                // this.setState({
                //     data: [{ length: this.state.arr[0] === undefined ? 0 : this.state.arr[0].d }
                //         , { length: this.state.arr[1] === undefined ? 0 : this.state.arr[1].d }, { length: this.state.arr[2] === undefined ? 0 : this.state.arr[2].d },
                //     { length: this.state.arr[3] === undefined ? 0 : this.state.arr[3].d }, { length: this.state.arr[4] === undefined ? 0 : this.state.arr[4].d },
                //     { length: this.state.arr[5] === undefined ? 0 : this.state.arr[5].d },
                //     { length: this.state.arr[6] === undefined ? 0 : this.state.arr[6].d }]
                // }, () => {
                // })
            })
            return unsubscribe

        }
    }


    componentWillUnmount() {
        this._isMounted = false
    }

    static navigationOptions = ({ navigation }) => {
        return {
            tabBarLabel: i18n.t('BMI')
        }
    }

    _onRefresh = () => {
        this.setState({
            refreshing: true,
            data: [],
            datas: [],
            memberWeightsFiltered: [],
            memberWeights: []
        })

        getUserDetailsById(this.state.userId).then(res => {
            if (res) {
                this.setState({
                    userDetails: res.data.response,
                    userCredentials: res.data.response.credentialId,
                    height: res.data.response.height === null ? '' : res.data.response.height,
                    weight: res.data.response.weight === null ? '' : res.data.response.weight,
                    weightUpdate: res.data.response.weight === null ? '' : res.data.response.weight,
                    startWeight: res.data.response.startWeight === null ? '' : res.data.response.startWeight,
                    goal: res.data.response.goal ? res.data.response.goal : res.data.response.weight
                }, () => {

                    var diff_ms = Date.now() - new Date(this.state.userDetails.dateOfBirth).getTime();
                    var age_dt = new Date(diff_ms);
                    var age = age_dt.getUTCFullYear() - 1970
                    this.setState({
                        age

                    })

                    if (this.state.weight !== '' && this.state.height !== '') {
                        this.calculateBMI()
                        this.setState({
                            refreshing: false
                        })
                    }

                    if (this.state.typeOfDate === 'decrease') {
                        const obj = {
                            memberId: this.state.memberId,
                            from: new Date(this.state.SelectedDates[6].date),
                            to: new Date(this.state.SelectedDates[0].date)

                        }
                        getMemberWeight(obj).then(res => {
                            if (res) {
                                this.setState({
                                    memberWeights: res.data.response,
                                    memberWeightsFiltered: this.state.SelectedDates.map(d => res.data.response.filter(data => new Date(d.date).setHours(0, 0, 0, 0) === new Date(data.date).setHours(0, 0, 0, 0)))
                                },
                                    () => {

                                        this.setState({
                                            data: [{ length: this.state.memberWeightsFiltered[0][0] === undefined ? 0 : this.state.memberWeightsFiltered[0][0].weight }
                                                , { length: this.state.memberWeightsFiltered[1][0] === undefined ? 0 : this.state.memberWeightsFiltered[1][0].weight },
                                            { length: this.state.memberWeightsFiltered[2][0] === undefined ? 0 : this.state.memberWeightsFiltered[2][0].weight },
                                            { length: this.state.memberWeightsFiltered[3][0] === undefined ? 0 : this.state.memberWeightsFiltered[3][0].weight },
                                            { length: this.state.memberWeightsFiltered[4][0] === undefined ? 0 : this.state.memberWeightsFiltered[4][0].weight },
                                            { length: this.state.memberWeightsFiltered[5][0] === undefined ? 0 : this.state.memberWeightsFiltered[5][0].weight },
                                            { length: this.state.memberWeightsFiltered[6][0] === undefined ? 0 : this.state.memberWeightsFiltered[6][0].weight }]
                                        }, () => {
                                            const max = Math.max(...this.state.data.map(d => d.length))
                                            if (max) {
                                                this.setState({
                                                    max,
                                                    datas: [{ length: this.state.data[0].length === 0 ? 0 : Math.round((height / 2.5) * (this.state.data[0].length / max)), weight: this.state.data[0].length === 0 ? 0 : this.state.data[0].length }
                                                        , { length: this.state.data[1].length === 0 ? 0 : Math.round((height / 2.5) * (this.state.data[1].length / max)), weight: this.state.data[1].length === 0 ? 0 : this.state.data[1].length },
                                                    { length: this.state.data[2].length === 0 ? 0 : Math.round((height / 2.5) * (this.state.data[2].length / max)), weight: this.state.data[2].length === 0 ? 0 : this.state.data[2].length },
                                                    { length: this.state.data[3].length === 0 ? 0 : Math.round((height / 2.5) * (this.state.data[3].length / max)), weight: this.state.data[3].length === 0 ? 0 : this.state.data[3].length },
                                                    { length: this.state.data[4].length === 0 ? 0 : Math.round((height / 2.5) * (this.state.data[4].length / max)), weight: this.state.data[4].length === 0 ? 0 : this.state.data[4].length },
                                                    { length: this.state.data[5].length === 0 ? 0 : Math.round((height / 2.5) * (this.state.data[5].length / max)), weight: this.state.data[5].length === 0 ? 0 : this.state.data[5].length },
                                                    { length: this.state.data[6].length === 0 ? 0 : Math.round((height / 2.5) * (this.state.data[6].length / max)), weight: this.state.data[6].length === 0 ? 0 : this.state.data[6].length }]
                                                })
                                            }
                                        })
                                    })

                            }
                        })
                    } else {

                        const obj = {
                            memberId: this.state.memberId,
                            from: new Date(this.state.SelectedDates[0].date),
                            to: new Date(this.state.SelectedDates[6].date)

                        }
                        getMemberWeight(obj).then(res => {
                            if (res) {
                                this.setState({
                                    memberWeights: res.data.response,
                                    memberWeightsFiltered: this.state.SelectedDates.map(d => res.data.response.filter(data => new Date(d.date).setHours(0, 0, 0, 0) === new Date(data.date).setHours(0, 0, 0, 0)))
                                },
                                    () => {

                                        this.setState({
                                            data: [{ length: this.state.memberWeightsFiltered[0][0] === undefined ? 0 : this.state.memberWeightsFiltered[0][0].weight }
                                                , { length: this.state.memberWeightsFiltered[1][0] === undefined ? 0 : this.state.memberWeightsFiltered[1][0].weight },
                                            { length: this.state.memberWeightsFiltered[2][0] === undefined ? 0 : this.state.memberWeightsFiltered[2][0].weight },
                                            { length: this.state.memberWeightsFiltered[3][0] === undefined ? 0 : this.state.memberWeightsFiltered[3][0].weight },
                                            { length: this.state.memberWeightsFiltered[4][0] === undefined ? 0 : this.state.memberWeightsFiltered[4][0].weight },
                                            { length: this.state.memberWeightsFiltered[5][0] === undefined ? 0 : this.state.memberWeightsFiltered[5][0].weight },
                                            { length: this.state.memberWeightsFiltered[6][0] === undefined ? 0 : this.state.memberWeightsFiltered[6][0].weight }]
                                        }, () => {
                                            const max = Math.max(...this.state.data.map(d => d.length))
                                            if (max) {
                                                this.setState({
                                                    max,
                                                    datas: [{ length: this.state.data[0].length === 0 ? 0 : Math.round((height / 2.5) * (this.state.data[0].length / max)), weight: this.state.data[0].length === 0 ? 0 : this.state.data[0].length }
                                                        , { length: this.state.data[1].length === 0 ? 0 : Math.round((height / 2.5) * (this.state.data[1].length / max)), weight: this.state.data[1].length === 0 ? 0 : this.state.data[1].length },
                                                    { length: this.state.data[2].length === 0 ? 0 : Math.round((height / 2.5) * (this.state.data[2].length / max)), weight: this.state.data[2].length === 0 ? 0 : this.state.data[2].length },
                                                    { length: this.state.data[3].length === 0 ? 0 : Math.round((height / 2.5) * (this.state.data[3].length / max)), weight: this.state.data[3].length === 0 ? 0 : this.state.data[3].length },
                                                    { length: this.state.data[4].length === 0 ? 0 : Math.round((height / 2.5) * (this.state.data[4].length / max)), weight: this.state.data[4].length === 0 ? 0 : this.state.data[4].length },
                                                    { length: this.state.data[5].length === 0 ? 0 : Math.round((height / 2.5) * (this.state.data[5].length / max)), weight: this.state.data[5].length === 0 ? 0 : this.state.data[5].length },
                                                    { length: this.state.data[6].length === 0 ? 0 : Math.round((height / 2.5) * (this.state.data[6].length / max)), weight: this.state.data[6].length === 0 ? 0 : this.state.data[6].length }]
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
            SelectedDates: week,

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



    onPressIncrementGoal() {
        this.setState({ goal: this.state.goal + 0.50 })
        this.onPressIncrementGoalTimer = setTimeout(this.onPressIncrementGoal, 200);
    }

    onPressIncrementGoalStopTimer() {
        clearTimeout(this.onPressIncrementGoalTimer);
    }

    onPressDecrementGoal() {
        if (this.state.goal > 0) {
            this.setState({ goal: this.state.goal - 0.50 })
            this.onPressDecrementGoalTimer = setTimeout(this.onPressDecrementGoal, 200);
        }

    }

    onPressDecrementGoalStopTimer() {
        clearTimeout(this.onPressDecrementGoalTimer);
    }



    onPressIncrementWeight() {
        this.setState({ weightUpdate: this.state.weightUpdate + 0.50 })
        this.onPressIncrementWeightTimer = setTimeout(this.onPressIncrementWeight, 200);
    }

    onPressIncrementWeightStopTimer() {
        clearTimeout(this.onPressIncrementWeightTimer);
    }

    onPressDecrementWeight() {
        if (this.state.weightUpdate > 0) {
            this.setState({ weightUpdate: this.state.weightUpdate - 0.50 })
            this.onPressDecrementWeightTimer = setTimeout(this.onPressDecrementWeight, 200);
        }

    }

    onPressDecrementWeightStopTimer() {
        clearTimeout(this.onPressDecrementWeightTimer);
    }

    calculateBMI = () => {
        if ((this.state.height !== '' && this.state.weight !== '') && (this.state.height !== 0 && this.state.weight !== 0)) {
            const heightInMetre = this.state.height / 100
            const heightInMetreSquare = heightInMetre * heightInMetre
            const weight = this.state.weight
            const BMIFull = JSON.stringify(weight / heightInMetreSquare)
            const afterDecimal = (JSON.parse(BMIFull) % 1) !== 0 ? BMIFull.split('.')[1].split('') : BMIFull
            const BMI = JSON.parse(`${Math.round(Math.floor(BMIFull))}.${afterDecimal[0]}`)
            if (BMI < 18.5) {
                this.setState({
                    category: 'UnderWeight',
                    categoryName: i18n.t('underWeight')
                })
            } else if (BMI >= 18.5 && BMI <= 25) {
                this.setState({
                    category: 'Normal',
                    categoryName: i18n.t('normal')
                })
            } else if (BMI >= 25 && BMI <= 30) {
                this.setState({
                    category: 'OverWeight',
                    categoryName: i18n.t('overWeight')
                })
            } else if (BMI >= 30 && BMI <= 35) {
                this.setState({
                    category: 'Obese',
                    categoryName: i18n.t('obese')
                })
            } else if (BMI >= 35 && BMI <= 40) {
                this.setState({
                    category: 'Severely Obese',
                    categoryName: i18n.t('severelyObese')
                })
            } else if (BMI >= 40) {
                this.setState({
                    category: 'Very Severely Obese',
                    categoryName: i18n.t('verySeverelyObese')
                })
            }
            this.setState({
                BMI
            })
        }
    }

    updateWeight = () => {
        this.setState({
            loading: true
        })
        const obj = {
            goal: this.state.goal,
            weight: this.state.weightUpdate
        }

        const objTwo = {
            memberId: this.state.memberId,
            date: new Date(),
            weight: this.state.weightUpdate
        }

        const formData = new FormData()
        formData.append('data', JSON.stringify(obj))

        updateMemberProfile(this.state.userId, formData).then(res => {
            if (res) {
                this.setState({
                    loading: true
                }, () => {
                    addMemberWeight(objTwo).then(res => {
                        if (res) {
                            this.setState({
                                loading: false
                            }, () => {
                                this._onRefresh()
                                this.setModalVisible(false)
                            })
                            showMessage({
                                message: "Added Successfully",
                                type: "success",
                            })
                        }
                    })
                })
            }
        })
    }

    render() {
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <Loader loading={this.state.loading} text='Registering User' />

                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        progressBackgroundColor='#1976d2'
                        colors={['white', 'yellow']}
                    />}>
                    <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.08, paddingBottom: width / 30, marginTop: width / 20, borderRadius: 3, backgroundColor: '#ffa726' }}>
                        <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, width: width / 3.8, height: width / 3.8, backgroundColor: '#ffd54f', borderRadius: width / 7.6 }}>
                            <Text style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', fontSize: width / 12, fontWeight: 'bold', color: 'white', transform: transform() }}>{this.state.BMI}</Text>
                            <Text style={{ textAlign: 'center', fontSize: width / 25, color: 'white', fontWeight: 'bold', bottom: width / 18, transform: transform() }}>{i18n.t('result')}</Text>
                        </View>
                        <View style={{ marginTop: width / 50 }}>
                            <Text style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', fontSize: width / 18, fontWeight: 'bold', color: 'white', transform: transform() }}>{this.state.category === '' ? '' : `You are ${this.state.categoryName}`}</Text>
                        </View>
                        <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, width: w / 1.3, marginTop: width / 30 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold', color: this.state.category === 'UnderWeight' ? 'brown' : 'white', fontSize: width / 25, transform: transform(), textAlign: textAlign() }}>{i18n.t('underWeight')}</Text>
                                <Text style={{ fontWeight: 'bold', color: this.state.category === 'UnderWeight' ? 'brown' : 'white', fontSize: width / 25, transform: transform(), textAlign: textAlign() }}>{'<' + ' ' + '18.5'}</Text>
                            </View>
                        </View>
                        <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, width: w / 1.3, marginTop: width / 30 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold', color: this.state.category === 'Normal' ? 'brown' : 'white', fontSize: width / 25, transform: transform(), textAlign: textAlign() }}>{i18n.t('normal')}</Text>
                                <Text style={{ fontWeight: 'bold', color: this.state.category === 'Normal' ? 'brown' : 'white', fontSize: width / 25, transform: transform(), textAlign: textAlign() }}>{'18.5' + '-' + '25'}</Text>
                            </View>
                        </View>
                        <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, width: w / 1.3, marginTop: width / 30 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold', color: this.state.category === 'OverWeight' ? 'brown' : 'white', fontSize: width / 25, transform: transform(), textAlign: textAlign() }}>{i18n.t('overWeight')}</Text>
                                <Text style={{ fontWeight: 'bold', color: this.state.category === 'OverWeight' ? 'brown' : 'white', fontSize: width / 25, transform: transform(), textAlign: textAlign() }}>{'25' + '-' + '30'}</Text>
                            </View>
                        </View>
                        <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, width: w / 1.3, marginTop: width / 30 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold', color: this.state.category === 'Obese' ? 'brown' : 'white', fontSize: width / 25, transform: transform(), textAlign: textAlign() }}>{i18n.t('obese')}</Text>
                                <Text style={{ fontWeight: 'bold', color: this.state.category === 'Obese' ? 'brown' : 'white', fontSize: width / 25, transform: transform(), textAlign: textAlign() }}>{'30' + '-' + '35'}</Text>
                            </View>
                        </View>
                        <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, width: w / 1.3, marginTop: width / 30 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold', color: this.state.category === 'Severely Obese' ? 'brown' : 'white', fontSize: width / 25, transform: transform(), textAlign: textAlign() }}>{i18n.t('severelyObese')}</Text>
                                <Text style={{ fontWeight: 'bold', color: this.state.category === 'Severely Obese' ? 'brown' : 'white', fontSize: width / 25, transform: transform(), textAlign: textAlign() }}>{'35' + '-' + '40'}</Text>
                            </View>
                        </View>
                        <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, width: w / 1.3, marginTop: width / 30 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold', color: this.state.category === 'Very Severely Obese' ? 'brown' : 'white', fontSize: width / 25, transform: transform(), textAlign: textAlign() }}>{i18n.t('verySeverelyObese')}</Text>
                                <Text style={{ fontWeight: 'bold', color: this.state.category === 'Very Severely Obese' ? 'brown' : 'white', fontSize: width / 25, transform: transform(), textAlign: textAlign() }}>{'>' + ' ' + '40'}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto', width: w / 1.08, paddingBottom: width / 30, borderRadius: 3, backgroundColor: 'white' }}>
                        <View style={{ width: w / 1.2, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }} >
                            <View style={{ padding: width / 30, width: w / 3, flexDirection: 'row', backgroundColor: '#4D91E7', borderRadius: 5 }}>
                                <Icon name='female' size={width / 12} style={{ marginTop: 'auto', marginBottom: 'auto', transform: transform() }} color='#063570' />
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ fontSize: width / 28, color: '#063570', marginLeft: width / 50, transform: transform() }}>{i18n.t('gender')}</Text>
                                    <Text style={{ fontSize: width / 28, color: 'white', marginLeft: width / 50, transform: transform() }}>{this.state.userDetails ? this.state.userDetails.gender.toUpperCase() : ''}</Text>
                                </View>
                            </View>
                            <View style={{ padding: width / 30, width: w / 3, flexDirection: 'row', backgroundColor: '#18D8A2', borderRadius: 5 }}>
                                <Icon name='calender' size={width / 12} style={{ marginTop: 'auto', marginBottom: 'auto', transform: transform() }} color='#008861' />
                                <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                                    <Text style={{ fontSize: width / 28, color: '#008861', marginLeft: width / 50, transform: transform() }}>{i18n.t('age')}</Text>
                                    <Text style={{ fontSize: width / 25, color: 'white', marginLeft: width / 50, transform: transform() }}>{this.state.age}</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={{ width: w / 1.4, marginLeft: 'auto', marginTop: width / 20, marginRight: 'auto', borderBottomWidth: 1, borderBottomColor: '#ddd', flexDirection: 'row' }}>
                                <Icon name='height-icon' size={width / 25} style={{ marginTop: 'auto', marginBottom: 'auto', transform: transform() }} color='#1b5e20' />

                                <TextInput
                                    keyboardType='numeric'
                                    autoCapitalize='none'
                                    onChangeText={(text) => this.setState({ height: text })}
                                    value={String(this.state.height)}
                                    style={{ paddingLeft: paddingLeftBMI(), paddingRight: paddingRightBMI(), fontSize: width / 28, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 10, }}
                                    returnKeyType='next'
                                    placeholderTextColor='#333'
                                    placeholder='Height (in cm)' />
                            </View>
                            <View style={{ width: w / 1.4, marginLeft: 'auto', marginTop: width / 20, marginRight: 'auto', borderBottomWidth: 1, borderBottomColor: '#ddd', flexDirection: 'row' }}>
                                <Icon name='weight' size={width / 25} style={{ marginTop: 'auto', marginBottom: 'auto' }} color='#1b5e20' />

                                <TextInput
                                    keyboardType='numeric'
                                    autoCapitalize='none'
                                    onChangeText={(text) => this.setState({ weight: text })}
                                    value={String(this.state.weight)}
                                    style={{ paddingLeft: paddingLeftBMI(), paddingRight: paddingRightBMI(), fontSize: width / 28, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 10, }}
                                    returnKeyType='next'
                                    placeholderTextColor='#333'
                                    placeholder='Weight (in kg)' />
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => this.state.height === 0 || this.state.weight === 0 ? '' : this.calculateBMI()}>
                            <View style={{ width: w / 1.5, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                                <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50, transform: transform() }}>{i18n.t('calculate')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto', width: w / 1.08, paddingBottom: width / 30, borderRadius: 3, backgroundColor: 'white' }}>
                        <View style={{ marginLeft: width / 50, marginTop: width / 30 }}>
                            <Text style={{ fontSize: width / 25, color: '#333', transform: transform(), fontWeight: 'bold' }}>{i18n.t('weightProgress')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>

                            <BMICalendar getValue={(value, typ) => this.setState({ SelectedDates: value, typeOfDate: typ }, () => this._onRefresh())} format={this.state.Schedule} />

                        </View>

                        <View style={{ flexDirection: 'row', marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', transform: transform() }}>
                            <View style={{ flexDirection: 'column', height: height / 2.5, justifyContent: 'space-between', marginRight: width / 30 }}>
                                <View>
                                    <Text style={{ color: 'grey', fontSize: width / 30 }}>{this.state.max ? this.state.max : 100}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: 'grey', fontSize: width / 30 }}>{this.state.max ? this.state.max - 10 : 80}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: 'grey', fontSize: width / 30 }}>{this.state.max ? this.state.max - 20 : 60}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: 'grey', fontSize: width / 30 }}>{this.state.max ? this.state.max - 30 : 40}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: 'grey', fontSize: width / 30 }}>{this.state.max ? this.state.max - 40 : 20}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: 'grey', fontSize: width / 30 }}>{this.state.max ? this.state.max - 50 : 0}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                    <VerticalBarChart data={this.state.datas} barMaxHeight={height / 2.5} barWidth={width / 15} style={{ width: w / 1.4, height: height / 2.5, backgroundColor: 'white', borderBottomWidth: 1, borderLeftWidth: 1, borderColor: "#bdbdbd", paddingLeft: width / 30 }} />
                                </View>
                                <View style={{ flexDirection: 'row', width: w / 1.4, justifyContent: 'space-between', paddingLeft: width / 30 }}>
                                    {this.state.SelectedDates.map((data, i) => {
                                        return (
                                            <View key={i}>
                                                <Text style={{ color: 'grey', fontSize: width / 30 }}>{new Date(data.date).getDate()}</Text>
                                            </View>
                                        )
                                    })}


                                </View>
                            </View>
                        </View>
                        <View style={{ width: w / 1.4, flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 20, marginLeft: 'auto', marginRight: 'auto' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ color: 'grey', fontSize: width / 28, textAlign: 'center', transform: transform() }}>{i18n.t('start')}</Text>
                                <Text style={{ color: '#ffb74d', fontSize: width / 18, fontWeight: 'bold', transform: transform(), textAlign: 'center' }}>{this.state.startWeight}</Text>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ color: 'grey', fontSize: width / 28, textAlign: 'center', transform: transform() }}>{i18n.t('current')}</Text>
                                <Text style={{ color: '#ff9800', fontSize: width / 18, fontWeight: 'bold', transform: transform(), textAlign: 'center' }}>{this.state.weight}</Text>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ color: 'grey', fontSize: width / 28, textAlign: 'center', transform: transform() }}>{i18n.t('goal')}</Text>
                                <Text style={{ color: '#ffb74d', fontSize: width / 18, fontWeight: 'bold', transform: transform(), textAlign: 'center' }}>{this.state.goal}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                            <View style={{ width: w / 1.5, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                                <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50, transform: transform() }}>{i18n.t('trackWeight')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>


                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View elevation={10} style={{ borderWidth: 1, borderColor: '#ddd', backgroundColor: 'white', height: height / 1.6, width: width - 40, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width / 1.15, marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0.5, paddingBottom: width / 60, borderBottomColor: '#333' }}>
                            <Text style={{ fontSize: width / 20, color: '#333', marginLeft: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], textAlign: this.state.isRTL ? 'right' : 'left' }}>{i18n.t('trackWeight')}</Text>
                            <TouchableOpacity onPress={() => { this.setModalVisible(false) }}>
                                <Icon name="close" size={width / 20} style={{ marginRight: width / 30 }} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: width / 30, marginLeft: width / 30 }}>
                            <Icon name='attendance' size={width / 12} style={{ marginTop: 'auto', marginBottom: 'auto' }} color='grey' />
                            <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                                <Text style={{ color: 'grey', fontSize: width / 28 }}>{i18n.t('today')}</Text>
                                <Text style={{ color: '#ff9800', fontSize: width / 22, fontWeight: 'bold' }}>{new Date().getDate()}/{new Date().getMonth()}/{new Date().getFullYear()}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: height / 80 }}>
                            <Text style={{ color: 'grey', fontSize: width / 25, marginTop: width / 30, marginLeft: width / 30, textAlign: 'left' }}>{i18n.t('howMuchDoYouWeightToday')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: width / 30, marginLeft: width / 30 }}>
                            <TouchableOpacity onPressIn={() => this.onPressDecrementWeight()} onPressOut={() => this.onPressDecrementWeightStopTimer()}>
                                <View style={{ width: width / 10, height: width / 10, borderRadius: width / 20, borderWidth: 1, borderColor: 'grey' }}>
                                    <Text style={{ color: 'grey', fontSize: width / 12, textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', bottom: 2 }}>-</Text>
                                </View>
                            </TouchableOpacity>
                            <Text style={{ color: '#ff9800', fontSize: width / 15, fontWeight: 'bold', marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30 }}>{this.state.weightUpdate}</Text>
                            <Text style={{ color: 'grey', fontSize: width / 28, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 50 }}>{i18n.t('kg')}</Text>
                            <TouchableOpacity onPressIn={() => this.onPressIncrementWeight()} onPressOut={() => this.onPressIncrementWeightStopTimer()}>
                                <View style={{ width: width / 10, height: width / 10, borderRadius: width / 20, borderWidth: 1, borderColor: 'grey', marginLeft: width / 30 }}>
                                    <Text style={{ color: 'grey', fontSize: width / 12, textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', bottom: 2 }}>+</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: height / 80 }}>
                            <Text style={{ color: 'grey', fontSize: width / 25, marginTop: width / 30, marginLeft: width / 30, textAlign: 'left' }}>{i18n.t('whatIsYourGoalWeight')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: width / 30, marginLeft: width / 30 }}>
                            <TouchableOpacity onPressIn={() => this.onPressDecrementGoal()} onPressOut={() => this.onPressDecrementGoalStopTimer()}>

                                <View style={{ width: width / 10, height: width / 10, borderRadius: width / 20, borderWidth: 1, borderColor: 'grey' }}>
                                    <Text style={{ color: 'grey', fontSize: width / 12, textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', bottom: 2 }}>-</Text>
                                </View>
                            </TouchableOpacity>
                            <Text style={{ color: '#ff9800', fontSize: width / 15, fontWeight: 'bold', marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30 }}>{this.state.goal}</Text>
                            <Text style={{ color: 'grey', fontSize: width / 28, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 50 }}>{i18n.t('kg')}</Text>
                            <TouchableOpacity onPressIn={() => this.onPressIncrementGoal()} onPressOut={() => this.onPressIncrementGoalStopTimer()}>

                                <View style={{ width: width / 10, height: width / 10, borderRadius: width / 20, borderWidth: 1, borderColor: 'grey', marginLeft: width / 30 }}>
                                    <Text style={{ color: 'grey', fontSize: width / 12, textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', bottom: 2 }}>+</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => this.updateWeight()}>
                            <View style={{ width: width - 50, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                                <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50 }}>{i18n.t('updateWeight')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View >
        )
    }
}

export default BMI