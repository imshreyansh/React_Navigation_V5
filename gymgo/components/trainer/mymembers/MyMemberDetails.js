import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, Image, RefreshControl } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, URL, paddingLeftWater, paddingRightWater, isTablet, textAlignMember } from '../../../utils/api/helpers'
import WorkoutCalendar from '../../../utils/WorkoutCalendar'
import { getMemberById } from '../../../utils/api/authorization'
import { getMemberWorkoutByDate } from '../../../utils/api/getWorkoutAndDietMember'
import { getMemberDietByDate } from '../../../utils/api/getWorkoutAndDietMember'
import i18n from 'i18n-js'
import { SearchBar } from 'react-native-elements';
import boy from '../../../assets/images/boy.jpg'
import sq from '../../../assets/images/sq.jpg'

class myMemberDetails extends Component {
    _isMounted = false

    state = {
        SelectedDates: '',
        type: 'W',
        workouts: true,
        cardio: false,
        memberDetails: '',
        credentials: '',
        questions: '',
        branch: '',
        workoutsData: [],
        cardiosData: [],
        levelId: '',
        allData: [],
        levelName: '',
        allDiets: []
    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            getMemberById(this.props.navigation.getParam('memberId')).then(res => {
                if (res) {
                    this.setState({
                        memberDetails: res.data.response,
                        credentials: res.data.response.credentialId,
                        questions: res.data.response.questions,
                        branch: res.data.response.branch
                    })
                }
            })
        }
    }




    componentWillUnmount() {
        this._isMounted = false
    }

    onDateSelect = () => {
        const data = {
            member: this.props.navigation.getParam('memberId'),
            dateOfWorkout: new Date(this.state.SelectedDates[0].date),

        }
        getMemberWorkoutByDate(data).then(res => {
            if (res) {
                this.setState({
                    allData: res.data.response
                }, () => {
                    this.setState({
                        cardiosData: this.state.allData.filter(id => id.workoutCategories === 'Cardio').length > 0 ? this.state.allData.filter(id => id.workoutCategories === 'Cardio')[0].workouts : [],
                        workoutsData: this.state.allData.filter(id => id.workoutCategories === 'Workouts').length > 0 ? this.state.allData.filter(id => id.workoutCategories === 'Workouts')[0].workouts : [],
                        levelId: this.state.allData.filter(id => id.workoutCategories === 'Workouts').length > 0 ? this.state.allData.filter(id => id.workoutCategories === 'Workouts')[0].workoutsLevel._id : [],
                        levelName: this.state.allData.filter(id => id.workoutCategories === 'Workouts').length > 0 ? this.state.allData.filter(id => id.workoutCategories === 'Workouts')[0].workoutsLevel.levelName : [],
                    })
                })
            }
        })

        const datas = {
            member: this.state.userId,
            dateOfDiet: new Date(this.state.SelectedDates[0].date),

        }
        getMemberDietByDate(datas).then(res => {
            if (res) {
                this.setState({
                    allDiets: res.data.response,
                })
            }
        })
    }

    renderContent = () => {
        const ifSmallerDate = this.state.SelectedDates ? this.state.SelectedDates.filter(date => new Date(date.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) : []

        if (this.state.type === 'W') {
            return (
                <View>
                    {this.state.SelectedDates.length > 0 && (this.state.workoutsData.length > 0 && this.state.workouts === true) || this.state.SelectedDates.length > 0 && (this.state.cardiosData.length > 0 && this.state.cardio === true) ?
                        <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', justifyContent: 'flex-end', flexDirection: 'row', marginTop: width / 30 }} >
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('UpdateMemberWorkout', { type: this.state.workouts === true ? 'workouts' : 'cardio', date: this.state.SelectedDates, memberId: this.props.navigation.getParam('memberId'), levelId: this.state.workouts === true ? this.state.levelId : '', levelName: this.state.workouts === true ? this.state.levelName : '' })}>

                                <View elevation={3} style={{ padding: width / 80, width: w / 5, borderRadius: 5, backgroundColor: '#039be5', flexDirection: 'row' }}>
                                    <Text style={{ fontSize: width / 28, color: 'white', marginLeft: width / 50, transform: transform(), textAlign: textAlign() }}>{i18n.t('edit')}</Text>
                                    <Icon name='edit' size={width / 22} style={{ transform: transform(), marginLeft: width / 30 }} color="white" />
                                </View>
                            </TouchableOpacity>

                        </View>
                        : <View></View>}
                    {this.state.cardio === false ? this.state.workoutsData.map((data, i) => {
                        const urlImage = `${URL}/${data.workout.workoutsImages.path.replace(/\\/g, "/")}`
                        const image = JSON.parse(JSON.stringify({ uri: urlImage }))
                        return (
                            <View style={{ marginTop: width / 30 }}>


                                <View style={{ width: w, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', marginTop: width / 30, paddingBottom: width / 30, }}>
                                    <View style={{ flexDirection: 'row', marginTop: width / 30, marginLeft: width / 30 }}>
                                        <Image source={image} style={{ width: width / 7, height: width / 7, borderRadius: 3 }} />
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text style={{ fontSize: width / 25, marginLeft: width / 30, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{data.workout.workoutName}</Text>
                                            <View style={{ flexDirection: 'row', marginTop: width / 50, }}>
                                                <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                                                    <Text style={{ fontSize: width / 28, fontWeight: 'bold', color: 'orange', textAlign: 'center', transform: transform() }}>{data.sets}</Text>
                                                    <Text style={{ fontSize: width / 32, color: 'grey', textAlign: 'center', transform: transform() }}>{i18n.t('sets')}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                                                    <Text style={{ fontSize: width / 28, fontWeight: 'bold', color: 'orange', textAlign: 'center', transform: transform() }}>{data.reps}</Text>
                                                    <Text style={{ fontSize: width / 32, color: 'grey', textAlign: 'center', transform: transform() }}>{i18n.t('reps')}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                                                    <Text style={{ fontSize: width / 28, fontWeight: 'bold', color: 'orange', textAlign: 'center', transform: transform() }}>{data.weight}</Text>
                                                    <Text style={{ fontSize: width / 32, color: 'grey', textAlign: 'center', transform: transform() }}>{i18n.t('kg')}</Text>
                                                </View>

                                            </View>
                                        </View>
                                    </View>
                                </View>

                            </View>
                        )
                    }) : this.state.cardiosData.map((data, i) => {
                        const urlImage = `${URL}/${data.workout.workoutsImages.path.replace(/\\/g, "/")}`
                        const image = JSON.parse(JSON.stringify({ uri: urlImage }))
                        return (
                            <View style={{ marginTop: width / 30 }}>


                                <View style={{ width: w, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', marginTop: width / 30, paddingBottom: width / 30, }}>
                                    <View style={{ flexDirection: 'row', marginTop: width / 30, marginLeft: width / 30 }}>
                                        <Image source={image} style={{ width: width / 7, height: width / 7, borderRadius: 3 }} />
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text style={{ fontSize: width / 25, marginLeft: width / 30, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{data.workout.workoutName}</Text>
                                            <View style={{ flexDirection: 'row', marginTop: width / 50, }}>
                                                <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                                                    <Text style={{ fontSize: width / 28, fontWeight: 'bold', color: 'orange', textAlign: 'center', transform: transform() }}>{data.sets}</Text>
                                                    <Text style={{ fontSize: width / 32, color: 'grey', textAlign: 'center', transform: transform() }}>{i18n.t('sets')}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                                                    <Text style={{ fontSize: width / 28, fontWeight: 'bold', color: 'orange', textAlign: 'center', transform: transform() }}>{data.reps}</Text>
                                                    <Text style={{ fontSize: width / 32, color: 'grey', textAlign: 'center', transform: transform() }}>{i18n.t('reps')}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                                                    <Text style={{ fontSize: width / 28, fontWeight: 'bold', color: 'orange', textAlign: 'center', transform: transform() }}>{data.weight}</Text>
                                                    <Text style={{ fontSize: width / 32, color: 'grey', textAlign: 'center', transform: transform() }}>{i18n.t('kg')}</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                                                        <Text style={{ fontSize: width / 28, fontWeight: 'bold', color: 'orange', textAlign: 'center', transform: transform() }}>{data.distance}</Text>
                                                        <Text style={{ fontSize: width / 32, color: 'grey', textAlign: 'center', transform: transform() }}>{i18n.t('km')}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                                                        <Text style={{ fontSize: width / 28, fontWeight: 'bold', color: 'orange', textAlign: 'center', transform: transform() }}>{data.time}</Text>
                                                        <Text style={{ fontSize: width / 32, color: 'grey', textAlign: 'center', transform: transform() }}>{i18n.t('time')}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                            </View>
                        )
                    })}
                    {ifSmallerDate.length === 0 && (this.state.SelectedDates.length > 0 && (this.state.workoutsData.length === 0 && this.state.workouts === true) || this.state.SelectedDates.length > 0 && (this.state.cardiosData.length === 0 && this.state.cardio === true)) ?
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('AddMemberWorkout', { type: this.state.workouts === true ? 'workouts' : 'cardio', date: this.state.SelectedDates, memberId: this.props.navigation.getParam('memberId'), })}>
                            <View style={{ transform: transform(), width: w / 1.2, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                                <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50 }}>{i18n.t('addWorkout')}</Text>
                            </View>
                        </TouchableOpacity> : <View></View>}
                </View>
            )



        } else {
            return (
                <View>
                    {this.state.allDiets.length > 0 ? this.state.allDiets.map((diet, i) => {

                        var shours = new Date(diet.dietPlanSession.fromTime).getHours()
                        var sminutes = new Date(diet.dietPlanSession.fromTime).getMinutes()
                        var sampm = shours >= 12 ? 'PM' : 'AM'
                        shours = shours % 12
                        shours = shours ? shours : 12  // the hour '0' should be '12'
                        var startTime = shours + ':' + `${("0" + sminutes).slice(-2)}` + ' ' + sampm
                        var ehours = new Date(diet.dietPlanSession.toTime).getHours()
                        var eminutes = new Date(diet.dietPlanSession.toTime).getMinutes()
                        var eampm = ehours >= 12 ? 'PM' : 'AM'
                        ehours = ehours % 12
                        ehours = ehours ? ehours : 12  // the hour '0' should be '12'
                        var endTime = ehours + ':' + `${("0" + eminutes).slice(-2)}` + ' ' + eampm
                        const dietPlan = diet.dietPlan.map(id => id.foodItem.itemName)
                        const calories = diet.dietPlan.map(id => id.calories).reduce((a, b) => a + b)

                        function ico(d) {
                            if (d === "Breakfast") {
                                return `breakfast`
                            } else if (d === "Lunch") {
                                return `lunch`
                            } else {
                                return `dinner`
                            }
                        }

                        return (
                            <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('MemberDietDetails', { title: diet.dietPlanSession.sessionName, id: diet._id, calories: calories, date: this.state.SelectedDates, memberId: this.props.navigation.getParam('memberId'), })}>
                                <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.1, borderRadius: 3, paddingBottom: width / 30, backgroundColor: '#00bfa5', marginTop: width / 20 }}>

                                    <View style={{ width: w / 1.2, marginLeft: 'auto', marginTop: width / 30, marginRight: 'auto', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon name={ico(diet.dietPlanSession.sessionName)} size={width / 10} color='#424242' />
                                            <Text style={{ fontWeight: 'bold', fontSize: width / 15, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30, color: 'white', transform: transform() }}>{diet.dietPlanSession.sessionName}</Text>
                                        </View>
                                        <Icon name='right-arrow' size={width / 12} color='white' />

                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2, marginTop: width / 30, marginLeft: width / 30 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon name='calories-icon' size={width / 10} style={{ marginTop: 'auto', marginBottom: 'auto' }} color='#424242' />
                                            <View style={{ flexDirection: 'column' }}>
                                                <Text style={{ fontSize: width / 24, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30, color: 'white', textAlign: 'center', transform: transform() }}>{i18n.t('calories')}</Text>
                                                <Text style={{ fontWeight: 'bold', fontSize: width / 12, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30, color: '#fff176', textAlign: 'center', transform: transform() }}>{Math.round(calories)}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon name='stop-watch' size={width / 15} style={{ marginTop: 'auto', marginBottom: 'auto' }} color='#424242' />
                                            <Text style={{ fontWeight: 'bold', fontSize: width / 25, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30, color: '#fff176', transform: transform() }}>{startTime}-{endTime}</Text>

                                        </View>
                                    </View>

                                </View>
                            </TouchableOpacity>

                        )
                    }) : <View></View>}
                    {ifSmallerDate.length === 0 && (this.state.SelectedDates.length > 0 && this.state.allDiets.length === 0) ?
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('AddMemberDiet', { date: this.state.SelectedDates, memberId: this.props.navigation.getParam('memberId'), })}>
                            <View style={{ transform: transform(), width: w / 1.2, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                                <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50 }}>{i18n.t('addDiet')}</Text>
                            </View>
                        </TouchableOpacity> : <View></View>}
                </View>
            )
        }
    }
    render() {
        const { memberDetails, credentials, questions, branch } = this.state
        const urlImage = credentials ? `${URL}/${credentials.avatar.path.replace(/\\/g, "/")}` : ''
        const image = JSON.parse(JSON.stringify({ uri: urlImage }))
        var diff_ms = memberDetails ? Date.now() - new Date(memberDetails.dateOfBirth).getTime() : ''
        var age_dt = memberDetails ? new Date(diff_ms) : '';
        var age = memberDetails ? age_dt.getUTCFullYear() - 1970 : 0

        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>


                <View style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                        <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('memberDetails')}</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }} >

                    <View elevation={3} style={{ width: w, marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 30, backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.1, marginTop: width / 50, marginLeft: 'auto', marginRight: 'auto' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={image} style={{ width: width / 7, height: width / 7, borderRadius: width / 14, borderWidth: 2, borderColor: 'white' }} />
                                <View style={{ flexDirection: 'column', marginTop: width / 50, marginLeft: width / 50 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: width / 25, width: w / 2.5, transform: transform(), textAlign: textAlign(), color: 'grey' }}>{credentials.userName}</Text>
                                    <Text style={{ fontSize: width / 28, color: 'blue', transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>ID: {memberDetails.memberId}</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'column', marginTop: width / 30, }}>
                                <Text style={{ fontSize: width / 35, transform: transform(), textAlign: textAlign(), color: 'grey' }}>{i18n.t('admissionDate')}</Text>
                                <Text style={{ fontSize: width / 32, color: 'red', transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>{new Date(memberDetails.admissionDate).getDate()}/{new Date(memberDetails.admissionDate).getMonth() + 1}/{new Date(memberDetails.admissionDate).getFullYear()}</Text>
                            </View>
                        </View>
                        <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.08 }}>
                                <View style={{ borderRightWidth: 1, width: w / 4 }}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: 'grey' }}>{i18n.t('level')}</Text>
                                        <Text style={{ fontSize: width / 28, transform: transform(), textAlign: textAlign(), color: 'orange' }}>{questions.levelQuestion}</Text>
                                    </View>
                                </View>
                                <View style={{ borderRightWidth: 1, width: w / 2.8, marginLeft: 'auto', marginRight: 'auto', }}>
                                    <View style={{ flexDirection: 'column', paddingLeft: width / 80 }}>
                                        <Text style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: 'grey' }}>{i18n.t('exercisingPerWeek')}</Text>
                                        <Text style={{ fontSize: width / 28, transform: transform(), textAlign: textAlign(), color: '#2196f3' }}>{questions.exercisingQuestion}</Text>
                                    </View>
                                </View>
                                <View style={{ width: w / 4 }}>
                                    <View style={{ flexDirection: 'column', paddingLeft: width / 80 }}>
                                        <Text style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: 'grey' }}>{i18n.t('myGoal')}</Text>
                                        <Text style={{ fontSize: width / 28, transform: transform(), textAlign: textAlign(), color: 'green' }}>{questions.goalQuestion}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ borderWidth: 0.4, marginTop: width / 30, borderColor: '#ddd' }} />

                        <View style={{ marginTop: width / 50, }}>
                            <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="call" size={width / 25} color="orange" />
                                    <Text style={{ marginLeft: width / 50, fontSize: width / 28, transform: transform(), textAlign: textAlign(), color: 'black' }}>{i18n.t('phone')}</Text>
                                </View>
                                <Text style={{ fontSize: width / 28, color: 'grey', width: w / 1.9, textAlign: textAlignMember(), transform: transform() }}>{memberDetails.mobileNo}</Text>
                            </View>
                        </View>
                        <View style={{ borderWidth: 0.4, marginTop: width / 30, borderColor: '#ddd' }} />

                        <View style={{ marginTop: width / 50, }}>
                            <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="email" size={width / 25} color="orange" />
                                    <Text style={{ marginLeft: width / 50, fontSize: width / 28, color: 'black', transform: transform(), textAlign: textAlign() }}>{i18n.t('email')}</Text>
                                </View>
                                <Text style={{ fontSize: width / 28, color: 'grey', width: w / 1.9, textAlign: textAlignMember(), transform: transform() }}>{credentials.email}</Text>
                            </View>
                        </View>
                        <View style={{ borderWidth: 0.4, marginTop: width / 30, borderColor: '#ddd' }} />

                        <View style={{ marginTop: width / 50, }}>
                            <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="take-an-action" size={width / 25} color="orange" />
                                    <Text style={{ marginLeft: width / 50, fontSize: width / 28, color: 'black', transform: transform(), textAlign: textAlign() }}>{i18n.t('personalIds')}</Text>
                                </View>
                                <Text style={{ fontSize: width / 28, color: 'grey', width: w / 1.9, textAlign: textAlignMember(), transform: transform() }}>{memberDetails.personalId}</Text>
                            </View>
                        </View>
                        <View style={{ borderWidth: 0.4, marginTop: width / 30, borderColor: '#ddd' }} />

                        <View style={{ marginTop: width / 50, }}>
                            <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="calender" size={width / 25} color="orange" />
                                    <Text style={{ marginLeft: width / 50, fontSize: width / 28, color: 'black', transform: transform(), textAlign: textAlign() }}>{i18n.t('dateOfBirth')}</Text>
                                </View>
                                <Text style={{ fontSize: width / 28, color: 'grey', width: w / 1.9, textAlign: textAlignMember(), transform: transform() }}>{new Date(memberDetails.dateOfBirth).getDate()}/{new Date(memberDetails.dateOfBirth).getMonth() + 1}/{new Date(memberDetails.dateOfBirth).getFullYear()}</Text>
                            </View>
                        </View>
                        <View style={{ borderWidth: 0.4, marginTop: width / 30, borderColor: '#ddd' }} />

                        <View style={{ marginTop: width / 50, }}>
                            <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="language" size={width / 25} color="orange" />
                                    <Text style={{ marginLeft: width / 50, fontSize: width / 28, color: 'black', transform: transform(), textAlign: textAlign() }}>{i18n.t('nationality')}</Text>
                                </View>
                                <Text style={{ fontSize: width / 28, color: 'grey', width: w / 1.9, textAlign: textAlignMember(), transform: transform() }}>{memberDetails.nationality}</Text>
                            </View>
                        </View>
                        <View style={{ borderWidth: 0.4, marginTop: width / 30, borderColor: '#ddd' }} />

                        <View style={{ marginTop: width / 50, }}>
                            <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="gender" size={width / 25} color="orange" />
                                    <Text style={{ marginLeft: width / 50, fontSize: width / 28, color: 'black', transform: transform(), textAlign: textAlign() }}>{i18n.t('gender')}</Text>
                                </View>
                                <Text style={{ fontSize: width / 28, color: 'grey', width: w / 1.9, textAlign: textAlignMember(), transform: transform() }}>{memberDetails.gender}</Text>
                            </View>
                        </View>
                        <View style={{ borderWidth: 0.4, marginTop: width / 30, borderColor: '#ddd' }} />

                        <View style={{ marginTop: width / 50, }}>
                            <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="time-table" size={width / 25} color="orange" />
                                    <Text style={{ marginLeft: width / 50, fontSize: width / 28, color: 'black', transform: transform(), textAlign: textAlign() }}>{i18n.t('age')}</Text>
                                </View>
                                <Text style={{ fontSize: width / 28, color: 'grey', width: w / 1.9, textAlign: textAlignMember(), transform: transform() }}>{age}</Text>
                            </View>
                        </View>
                        <View style={{ borderWidth: 0.4, marginTop: width / 30, borderColor: '#ddd' }} />

                        <View style={{ marginTop: width / 50, }}>
                            <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="location" size={width / 25} color="orange" />
                                    <Text style={{ marginLeft: width / 50, fontSize: width / 28, color: 'black', transform: transform(), textAlign: textAlign() }}>{i18n.t('branch')}</Text>
                                </View>
                                <Text style={{ fontSize: width / 28, color: 'grey', width: w / 1.9, textAlign: textAlignMember(), transform: transform() }}>{branch.branchName}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: w, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', marginTop: width / 30 }}>

                        <WorkoutCalendar getValue={(value) => this.setState({ SelectedDates: value }, () => this.onDateSelect())} />

                        <View style={{ marginTop: width / 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => this.setState({ type: 'W' })}>
                                <View style={{ width: w / 2, borderBottomWidth: 4, paddingBottom: width / 30, borderBottomColor: this.state.type === 'W' ? 'orange' : 'white' }}>
                                    <Text style={{ fontWeight: 'bold', color: this.state.type === 'W' ? 'orange' : 'grey', fontSize: width / 18, textAlign: 'center', transform: transform() }}>{i18n.t('workouts')}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ type: 'D' })}>
                                <View style={{ width: w / 2, borderBottomWidth: 4, paddingBottom: width / 30, borderBottomColor: this.state.type === 'D' ? 'orange' : 'white' }}>
                                    <Text style={{ fontWeight: 'bold', color: this.state.type === 'D' ? 'orange' : 'grey', fontSize: width / 18, textAlign: 'center', transform: transform() }}>{i18n.t('dietPlans')}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this.state.type === 'W' ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.8, marginLeft: width / 30, marginTop: width / 30 }}>
                        <TouchableOpacity onPress={() => this.setState({ workouts: true, cardio: false })}>
                            <View style={{ flexDirection: 'row' }}>
                                {this.state.workouts === true ? <Icon name='transport-status' size={width / 20} style={{ transform: transform() }} color="#1976d2" /> : <View style={{ width: width / 20, height: width / 20, borderRadius: width / 40, borderWidth: 1, borderColor: 'grey' }} />}
                                <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 28, color: '#333', marginLeft: width / 30 }}>{i18n.t('workouts')}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ workouts: false, cardio: true })}>
                            <View style={{ flexDirection: 'row' }}>
                                {this.state.cardio === true ? <Icon name='transport-status' size={width / 20} style={{ transform: transform() }} color="#1976d2" /> : <View style={{ width: width / 20, height: width / 20, borderRadius: width / 40, borderWidth: 1, borderColor: 'grey' }} />}
                                <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 28, color: '#333', marginLeft: width / 30 }}>{i18n.t('cardio')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View> : <View></View>}
                    {this.renderContent()}

                </ScrollView>

            </View >
        )
    }
}

export default myMemberDetails