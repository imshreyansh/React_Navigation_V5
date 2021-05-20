import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, ActionSheetIOS, TouchableOpacity, TextInput, ScrollView, StyleSheet, Picker, Image } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../../utils/api/helpers'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { getAllMember, getAllWorkoutLevel, getByWorkoutCategory, updateWorkout, getMemberWorkoutByTrainer } from '../../../utils/api/addWorkoutAndDiet'
import { getMemberById } from '../../../utils/api/authorization'
import Loader from '../../../utils/resources/Loader'
import { showMessage, hideMessage } from "react-native-flash-message";
import i18n from 'i18n-js'
class UpdateMemberWorkout extends Component {
    _isMounted = false

    state = {

        rtl: null,
        SelectMembers: [],
        SelectMember: null,
        SelectMembere: '',
        SelectMemberText: i18n.t('pleaseSelect'),
        WorkoutCategories: [],
        WorkoutCategory: null,
        WorkoutCategorye: '',
        WorkoutCategoryText: i18n.t('pleaseSelect'),
        workouts: false,
        cardio: true,
        borderColorSets: null,
        borderColorReps: null,
        borderColorWeight: null,
        borderColorHour: null,
        borderColorMinute: null,
        borderColorDistance: null,
        loading: false,
        exerciseAdded: [],
        cardiosAdded: [],
        SelectedDates: [],
        SelectedDatese: '',
        note: '',
        exercise: [],
        cardios: [],
        userId: '',
        addedWorkout: [],
        updateId: '',
        memberDetails: '',
        credentials: '',
        levelName: ''

    }


    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            getMemberById(this.props.navigation.getParam('memberId')).then(res => {
                if (res) {
                    this.setState({
                        memberDetails: res.data.response,
                        credentials: res.data.response.credentialId,

                    })
                }
            })
            getAllWorkoutLevel().then(res => {
                if (res) {
                    this.setState({
                        WorkoutCategories: res.data.response,
                    }, () => {
                        if (this.props.navigation.getParam('type') === 'workouts') {
                            this.setState({
                                workouts: true,
                                cardio: false,
                                SelectedDates: this.props.navigation.getParam('date'),
                                memberId: this.props.navigation.getParam('memberId'),
                                SelectMember: this.props.navigation.getParam('memberId'),
                                WorkoutCategory: this.props.navigation.getParam('levelId'),
                                levelName: this.props.navigation.getParam('levelName')


                            }, () => {
                                this.getUserWorkout()
                                const abc = () => this.state.levelName
                                this.getLevelByIdUniversal(this.state.WorkoutCategories.findIndex(abc))
                            })
                        } else {
                            this.setState({
                                cardio: true,
                                workouts: false,
                                SelectedDates: this.props.navigation.getParam('date'),
                                memberId: this.props.navigation.getParam('memberId'),
                                SelectMember: this.props.navigation.getParam('memberId'),


                            }, () => {
                                this.getUserWorkout()
                            })
                        }
                    })
                }
            })


            AsyncStorage.getItem('authedToken').then((token) => {
                const userId = jwtDecode(token).userId

                this.setState({
                    userId,

                })
            })


            const workoutCategories = {
                workoutCategories: 'Cardio'
            }
            getByWorkoutCategory(workoutCategories).then(res => {
                if (res) {
                    this.setState({
                        cardios: res.data.response
                    })
                }
            }, () => {
                this.state.cardios.map(data => {
                    data.sets = 0,
                        data.reps = 0,
                        data.weight = 0,
                        data.hour = 0,
                        data.minute = 0,
                        data.distance = 0
                })
            })


        }


    }

    componentWillUnmount() {
        this._isMounted = false
    }


    getLevelById = (d, i) => {
        this.setState({ WorkoutCategory: d }, () => {
            if (i > 0) {
                const exercise = this.state.WorkoutCategories[i - 1].workout

                this.setState({
                    exercise
                }, () => {
                    this.state.exercise.map(data => {
                        data.sets = '',
                            data.reps = '',
                            data.weight = ''
                    })
                })
            }

        })
    }

    getLevelByIdIOS = (d, i) => {
        this.setState({ WorkoutCategory: d }, () => {

            const exercise = this.state.WorkoutCategories[i].workout

            this.setState({
                exercise
            }, () => {
                this.state.exercise.map(data => {
                    data.sets = '',
                        data.reps = '',
                        data.weight = ''
                })
            })


        })
    }

    getLevelByIdUniversal = (i) => {


        const exercise = this.state.WorkoutCategories[i].workout

        this.setState({
            exercise
        }, () => {
            this.state.exercise.map(data => {
                data.sets = '',
                    data.reps = '',
                    data.weight = ''
            })
        })



    }

    getUserWorkout = () => {
        if (this.state.cardio === true) {
            const memberId = this.state.memberId
            const date = this.state.SelectedDates[0].date
            const data = {
                member: memberId,
                dateOfWorkout: new Date(date),
                workoutCategories: 'Cardio',
                workoutsLevel: null
            }
            getMemberWorkoutByTrainer(data).then(res => {
                if (res) {
                    this.setState({
                        addedWorkout: res.data.response
                    }, () => {
                        this.setState({
                            note: !this.state.addedWorkout ? '' : this.state.addedWorkout.note,
                            updateId: !this.state.addedWorkout ? '' : this.state.addedWorkout._id
                        })
                        !this.state.addedWorkout ? this.state.cardios.map(data => {
                            data.sets = '',
                                data.reps = '',
                                data.weight = '',
                                data.hour = '',
                                data.minute = '',
                                data.distance = ''
                        }) : this.state.addedWorkout.workouts.map(d => {

                            const filter = this.state.cardios.filter(data => data._id === d.workout._id)
                            if (filter.length > 0) {
                                this.state.cardios.map(data => {
                                    if (data._id === filter[0]._id) {
                                        const data = this.state.cardios.filter(data => data._id === filter[0]._id)
                                        const newCardio = this.state.cardios.filter(data => data._id !== filter[0]._id)
                                        data.map(dat => {
                                            dat.sets = d.sets
                                            dat.reps = d.reps,
                                                dat.weight = d.weight,
                                                dat.hour = d.time.split("h")[0],
                                                dat.minute = d.time.split("h")[1].split("m")[0].split(" ")[1],
                                                dat.distance = d.distance
                                        })

                                    }
                                })
                            }
                        })
                        this.setState({
                            cardios: this.state.cardios
                        })
                    })
                }
            })

        } else if (this.state.workouts === true && this.state.SelectMember !== null && this.state.WorkoutCategory !== null) {
            const memberId = this.state.memberId
            const levelId = this.state.WorkoutCategory
            const date = this.state.SelectedDates[0].date
            const data = {
                member: memberId,
                dateOfWorkout: new Date(date),
                workoutCategories: 'Workouts',
                workoutsLevel: levelId
            }


            getMemberWorkoutByTrainer(data).then(res => {
                if (res) {
                    this.setState({
                        addedWorkout: res.data.response
                    }, () => {
                        this.setState({
                            note: !this.state.addedWorkout ? '' : this.state.addedWorkout.note,
                            updateId: !this.state.addedWorkout ? '' : this.state.addedWorkout._id
                        })
                        !this.state.addedWorkout ? this.state.exercise.map(data => {
                            data.sets = '',
                                data.reps = '',
                                data.weight = ''
                        }) : this.state.addedWorkout.workouts.map(d => {
                            const filter = this.state.exercise.filter(data => data._id === d.workout._id)
                            if (filter.length > 0) {
                                this.state.exercise.map(data => {
                                    if (data._id === filter[0]._id) {
                                        const data = this.state.exercise.filter(data => data._id === filter[0]._id)
                                        const newExercise = this.state.exercise.filter(data => data._id !== filter[0]._id)
                                        data.map(dat => {
                                            dat.sets = d.sets
                                            dat.reps = d.reps,
                                                dat.weight = d.weight
                                        })

                                    }
                                })
                            }
                        })
                        this.setState({
                            exercise: this.state.exercise
                        })
                    })
                }
            })
        } else {
            alert('Select the above fields first and then select the date again !!')
        }


    }




    showWorkoutCategory = () => {
        const data = this.state.WorkoutCategories.map(l => l.levelName)
        data.push(i18n.t('pleaseSelect'))
        const len = data.length
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
            cancelButtonIndex: len - 1,
        },
            (buttonIndex) => {
                this.setState({ WorkoutCategory: data[buttonIndex] });
                if (this.state.WorkoutCategories[buttonIndex] !== undefined) {
                    this.setState({
                        WorkoutCategory: this.state.WorkoutCategories[buttonIndex]._id,
                        WorkoutCategoryText: this.state.WorkoutCategories[buttonIndex].levelName,
                        WorkoutCategorye: '',
                    }, () => {
                        this.getLevelByIdIOS(this.state.WorkoutCategory, buttonIndex)
                    })
                } else {
                    this.setState({
                        WorkoutCategory: '',
                        WorkoutCategoryText: '',
                        WorkoutCategorye: i18n.t('pleaseSelect')
                    })
                }
            });
    }


    renderWorkoutCategory() {
        if (Platform.OS === 'android') {
            return (
                <View style={[this.state.WorkoutCategory !== '' ? styles.form : styles.forme, { transform: transform(), }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: 0 }}
                        selectedValue={this.state.WorkoutCategory}
                        onValueChange={(itemValue, itemIndex) => this.getLevelById(itemValue, itemIndex)}>
                        <Picker.Item label={i18n.t('pleaseSelect')} value='' />
                        {
                            this.state.WorkoutCategories.map((v) => {
                                return <Picker.Item label={v.levelName} value={v._id} key={v._id} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showWorkoutCategory()}>
                    <View style={[this.state.WorkoutCategory !== '' ? styles.form : styles.forme, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ left: width / 90, fontSize: width / 20, transform: transform() }}>{this.state.WorkoutCategoryText}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }



    validate = (text, type, index, data, e) => {
        const rangeMinute = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
        if (type === 'sets') {
            if (text === '') {
                this.setState({ borderColorSets: index })
            } else {

                this.setState({
                    borderColorSets: '',
                })
            }
        } else if (type === 'reps') {
            if (text === '') {
                this.setState({ borderColorReps: index })
            } else {
                this.setState({
                    borderColorReps: ''
                })
            }
        } else if (type === 'weight') {
            if (text === '') {
                this.setState({ borderColorWeight: index })
            } else {
                this.setState({
                    borderColorWeight: ''
                })
            }
        } else if (type === 'hour') {
            if (text === '' || text.length > 2) {
                this.setState({ borderColorHour: index })
            } else {
                this.setState({
                    borderColorHour: ''
                })
            }
        } else if (type === 'minute') {
            if (text === '' || text.length > 2 || rangeMinute.includes(text) !== true) {
                this.setState({ borderColorMinute: index })
            } else {
                this.setState({
                    borderColorMinute: ''
                })
            }
        } else if (type === 'distance') {
            if (text === '') {
                this.setState({ borderColorDistance: index })
            } else {
                this.setState({
                    borderColorDistance: ''
                })
            }
        }
    }

    renderWorkouts = () => {
        if (this.state.workouts === true) {
            return (
                <View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.05, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20 }}>
                        <Text style={{ fontSize: width / 28, width: w / 4.5, fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('activities')}</Text>
                        <Text style={{ fontSize: width / 28, width: w / 5, fontWeight: 'bold', textAlign: 'center', transform: transform(), textAlign: textAlign(), }}>{i18n.t('sets')}</Text>
                        <Text style={{ fontSize: width / 28, width: w / 5, fontWeight: 'bold', textAlign: 'center', transform: transform(), textAlign: textAlign(), }}>{i18n.t('reps')}</Text>
                        <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 28, width: w / 5, fontWeight: 'bold', textAlign: 'center' }}>{i18n.t('weightTrainer')}</Text>
                    </View>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', width: w / 1.05, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }} />
                    {this.state.exercise.map((data, i) => {
                        return (
                            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.05, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                                <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 28, width: w / 4.5 }}>{data.workoutName}</Text>
                                <View style={{ width: w / 5, backgroundColor: '#eeeeee', borderRadius: 3, height: width / 12, borderColor: this.state.borderColorSets === i ? 'red' : '', borderWidth: this.state.borderColorSets === i ? 0.5 : 0 }}>
                                    <TextInput
                                        keyboardType='numeric'
                                        autoCapitalize='words'
                                        onChangeText={(text) => this.validate(data.sets = text, 'sets', i)}
                                        value={String(data.sets) !== 'undefined' ? String(data.sets) : ''}
                                        style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: '#333', width: w / 5.2, marginLeft: 'auto', marginRight: 'auto', height: width / 10 }}
                                        returnKeyType='next'
                                        placeholderTextColor='#333'
                                    />
                                </View>
                                <View style={{ width: w / 5, backgroundColor: '#eeeeee', borderRadius: 3, height: width / 12, borderColor: this.state.borderColorReps === i ? 'red' : '', borderWidth: this.state.borderColorReps === i ? 0.5 : 0 }}>
                                    <TextInput
                                        keyboardType='numeric'
                                        autoCapitalize='words'
                                        onChangeText={(text) => this.validate(data.reps = text, 'reps', i)}
                                        value={String(data.reps) !== 'undefined' ? String(data.reps) : ''}
                                        style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: '#333', width: w / 5.2, marginLeft: 'auto', marginRight: 'auto', height: width / 10 }}
                                        returnKeyType='next'
                                        placeholderTextColor='#333'
                                    />
                                </View>
                                <View style={{ width: w / 5, backgroundColor: '#eeeeee', borderRadius: 3, height: width / 12, borderColor: this.state.borderColorWeight === i ? 'red' : '', borderWidth: this.state.borderColorWeight === i ? 0.5 : 0 }}>
                                    <TextInput
                                        keyboardType='numeric'
                                        autoCapitalize='words'
                                        onChangeText={(text) => this.validate(data.weight = text, 'weight', i)}
                                        value={String(data.weight) !== 'undefined' ? String(data.weight) : ''}
                                        style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: '#333', width: w / 5.2, marginLeft: 'auto', marginRight: 'auto', height: width / 10 }}
                                        returnKeyType='next'
                                        placeholderTextColor='#333'
                                    />
                                </View>
                            </View>
                        )
                    })}

                </View>
            )
        } else if (this.state.cardio === true) {
            return (
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 20 }}>
                            <Text style={{ fontSize: width / 28, width: w / 4.5, marginLeft: width / 30, fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('activities')}</Text>
                            <Text style={{ fontSize: width / 28, width: w / 5, fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('sets')}</Text>
                            <Text style={{ fontSize: width / 28, width: w / 5, fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('reps')}</Text>
                            <Text style={{ transform: transform(), width: w / 5, textAlign: textAlign(), fontSize: width / 28, fontWeight: 'bold', }}>{i18n.t('weight')}</Text>
                            <Text style={{ transform: transform(), width: w / 5, textAlign: textAlign(), fontSize: width / 28, fontWeight: 'bold', paddingLeft: width / 30 }}>{i18n.t('time')}</Text>
                            <Text style={{ transform: transform(), width: w / 5, textAlign: textAlign(), fontSize: width / 28, fontWeight: 'bold', }}>{i18n.t('distance')}</Text>
                        </View>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', marginTop: width / 30 }} />
                        {this.state.cardios.map((data, i) => {
                            return (
                                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, paddingRight: width / 60 }}>
                                    <Text style={{ marginLeft: width / 30, transform: transform(), textAlign: textAlign(), fontSize: width / 28, width: w / 4.5 }}>{data.workoutName}</Text>
                                    <View style={{ width: w / 5, backgroundColor: '#eeeeee', borderRadius: 3, height: width / 12, borderColor: this.state.borderColorSets === i ? 'red' : '', borderWidth: this.state.borderColorSets === i ? 0.5 : 0 }}>
                                        <TextInput
                                            keyboardType='numeric'
                                            autoCapitalize='words'
                                            onChangeText={(text) => this.validate(data.sets = text, 'sets', i)}
                                            value={String(data.sets) !== 'undefined' ? String(data.sets) : ''}
                                            style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: '#333', width: w / 5.2, marginLeft: 'auto', marginRight: 'auto', height: width / 10 }}
                                            returnKeyType='next'
                                            placeholderTextColor='#333'
                                        />
                                    </View>
                                    <View style={{ width: w / 5, backgroundColor: '#eeeeee', borderRadius: 3, height: width / 12, marginLeft: width / 20, borderColor: this.state.borderColorReps === i ? 'red' : '', borderWidth: this.state.borderColorReps === i ? 0.5 : 0 }}>
                                        <TextInput
                                            keyboardType='numeric'
                                            autoCapitalize='words'
                                            onChangeText={(text) => this.validate(data.reps = text, 'reps', i)}
                                            value={String(data.reps) !== 'undefined' ? String(data.reps) : ''}
                                            style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: '#333', width: w / 5.2, marginLeft: 'auto', marginRight: 'auto', height: width / 10 }}
                                            returnKeyType='next'
                                            placeholderTextColor='#333'
                                        />
                                    </View>
                                    <View style={{ width: w / 5, backgroundColor: '#eeeeee', borderRadius: 3, height: width / 12, marginLeft: width / 20, borderColor: this.state.borderColorWeight === i ? 'red' : '', borderWidth: this.state.borderColorWeight === i ? 0.5 : 0 }}>
                                        <TextInput
                                            keyboardType='numeric'
                                            autoCapitalize='words'
                                            onChangeText={(text) => this.validate(data.weight = text, 'weight', i)}
                                            value={String(data.weight) !== 'undefined' ? String(data.weight) : ''}
                                            style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: '#333', width: w / 5.2, marginLeft: 'auto', marginRight: 'auto', height: width / 10 }}
                                            returnKeyType='next'
                                            placeholderTextColor='#333'
                                        />
                                    </View>
                                    <View style={{ width: w / 10, backgroundColor: '#eeeeee', borderRadius: 3, height: width / 12, marginLeft: width / 20, borderColor: this.state.borderColorHour === i ? 'red' : '', borderWidth: this.state.borderColorHour === i ? 0.5 : 0 }}>
                                        <TextInput
                                            keyboardType='numeric'
                                            autoCapitalize='words'
                                            maxLength={2}
                                            onChangeText={(text) => this.validate(data.hour = text, 'hour', i)}
                                            value={String(data.hour) !== 'undefined' ? String(data.hour) : ''}
                                            style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: '#333', width: w / 10.2, marginLeft: 'auto', marginRight: 'auto', height: width / 10 }}
                                            returnKeyType='next'
                                            placeholderTextColor='#ddd'
                                            placeholder='Hr'
                                        />
                                    </View>
                                    <View style={{ width: w / 10, backgroundColor: '#eeeeee', borderRadius: 3, height: width / 12, marginLeft: width / 20, borderColor: this.state.borderColorMinute === i ? 'red' : '', borderWidth: this.state.borderColorMinute === i ? 0.5 : 0 }}>
                                        <TextInput
                                            keyboardType='numeric'
                                            autoCapitalize='words'
                                            maxLength={2}
                                            onChangeText={(text) => this.validate(data.minute = text, 'minute', i)}
                                            value={String(data.minute) !== 'undefined' ? String(data.minute) : ''}
                                            style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: '#333', width: w / 10.2, marginLeft: 'auto', marginRight: 'auto', height: width / 10 }}
                                            returnKeyType='next'
                                            placeholderTextColor='#ddd'
                                            placeholder='Min'
                                        />
                                    </View>
                                    <View style={{ width: w / 5, backgroundColor: '#eeeeee', borderRadius: 3, height: width / 12, marginLeft: width / 20, borderColor: this.state.borderColorDistance === i ? 'red' : '', borderWidth: this.state.borderColorDistance === i ? 0.5 : 0 }}>
                                        <TextInput
                                            keyboardType='numeric'
                                            autoCapitalize='words'
                                            onChangeText={(text) => this.validate(data.distance = text, 'distance', i)}
                                            value={String(data.distance) !== 'undefined' ? String(data.distance) : ''}
                                            style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: '#333', width: w / 5.2, marginLeft: 'auto', marginRight: 'auto', height: width / 10 }}
                                            returnKeyType='next'
                                            placeholderTextColor='#333'
                                        />
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
            )
        } else {
            return (
                <View>
                </View>
            )
        }


    }
    onSubmit = () => {
        const { borderColorSets, borderColorReps, borderColorDistance, borderColorMinute, borderColorHour, WorkoutCategory, WorkoutCategorye, SelectMember, SelectMembere, SelectedDates, note } = this.state
        if (WorkoutCategorye !== null && SelectMember !== null && SelectedDates.length > 0 && SelectMembere === '' && WorkoutCategorye === '') {
            if (this.state.cardio === true) {
                const works = []
                this.state.cardios.forEach(work => {
                    if (work.sets || work.reps || work.weight || work.distance || work.hour || work.minute) {
                        works.push({ workout: work._id, sets: work.sets || 0, reps: work.reps || 0, weight: work.weight || 0, distance: work.distance || 0, time: `${work.hour || 0}h ${work.minute || 0}m` })
                    }
                })
                const id = this.state.updateId
                const memberWorkoutInfo = { member: this.state.SelectMember, workoutCategories: 'Cardio', workoutsLevel: this.state.WorkoutCategory, dateOfWorkout: new Date(new Date(SelectedDates[0].date)), workouts: works, note: this.state.note }


                this.setState({
                    loading: true
                })
                updateWorkout(id, memberWorkoutInfo).then(res => {
                    if (res) {

                        this.setState({
                            loading: false,
                            borderColorSets: null,
                            borderColorReps: null,
                            borderColorWeight: null,
                            borderColorHour: null,
                            borderColorMinute: null,
                            borderColorDistance: null,
                        }, () => {
                            this.props.navigation.navigate('TrainerHome')

                            showMessage({
                                message: 'Successfully Updated',
                                type: "success",
                            })
                        })
                    }
                })

            } else if (this.state.workouts === true) {
                const works = []
                this.state.exercise.forEach(work => {
                    if (work.sets || work.reps || work.weight) {
                        works.push({ workout: work._id, sets: work.sets || 0, reps: work.reps || 0, weight: work.weight || 0 })
                    }
                })
                const id = this.state.updateId
                const memberWorkoutInfo = { member: this.state.SelectMember, workoutCategories: 'Workouts', workoutsLevel: this.state.WorkoutCategory, dateOfWorkout: new Date(new Date(SelectedDates[0].date)), workouts: works, note: this.state.note }


                this.setState({
                    loading: true
                })
                updateWorkout(id, memberWorkoutInfo).then(res => {
                    if (res) {

                        this.setState({
                            loading: false,
                            borderColorSets: null,
                            borderColorReps: null,
                            borderColorWeight: null,
                            borderColorHour: null,
                            borderColorMinute: null,
                            borderColorDistance: null,
                        }, () => {
                            this.props.navigation.navigate('MyMembers')

                            showMessage({
                                message: 'Successfully Updated',
                                type: "success",
                            })
                        })
                    }
                })
            }


        } else {
            alert(i18n.t('missingFields'))
        }

    }
    render() {
        const { memberDetails, credentials } = this.state
        const urlImage = credentials ? `${URL}/${credentials.avatar.path.replace(/\\/g, "/")}` : ''
        const image = JSON.parse(JSON.stringify({ uri: urlImage }))

        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: 'white' }}>
                <Loader loading={this.state.loading} text='Loading' />
                <View style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                        <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('updateWorkout')}</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 20 }}>

                    <View style={{ width: w, backgroundColor: '#eeeeee', paddingBottom: width / 10 }}>
                        <View style={{ marginTop: width / 30, width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', paddingBottom: width / 50, borderRadius: 3 }}>
                            <View style={{ flexDirection: 'row', marginTop: width / 30, marginLeft: width / 30 }}>
                                <Image source={image} style={{ width: width / 7, height: width / 7, borderRadius: width / 14, borderWidth: 2, borderColor: 'white' }} />
                                <View style={{ flexDirection: 'column', marginTop: width / 50, marginLeft: width / 50 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: width / 25, width: w / 2.5, color: 'grey', transform: transform(), textAlign: textAlign(), }}>{credentials.userName}</Text>
                                    <Text style={{ fontSize: width / 28, color: 'blue', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>ID: {memberDetails.memberId}</Text>
                                </View>
                            </View>
                        </View>
                        {this.state.cardio === true ? <View></View> :
                            <View style={{ marginTop: width / 30, width: w / 1.1, marginLeft: 'auto', marginRight: 'auto' }}>
                                <Text style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), }}>{i18n.t('workoutLevel')}</Text>
                                {this.renderWorkoutCategory()}
                            </View>
                        }
                        <View style={{ marginTop: width / 30, marginLeft: width / 30 }}>
                            <Text style={{ fontSize: width / 22, color: '#333', transform: transform(), textAlign: textAlign() }}>{i18n.t('date')}</Text>
                            <Text style={{ fontSize: width / 22, color: 'orange', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{new Date(this.props.navigation.getParam('date')[0].date).getDate()}/{new Date(this.props.navigation.getParam('date')[0].date).getMonth() + 1}/{new Date(this.props.navigation.getParam('date')[0].date).getFullYear()}</Text>
                        </View>

                    </View>



                    <Text style={{ marginTop: width / 20, marginLeft: width / 30, fontSize: width / 22, fontWeight: 'bold', color: '#333', transform: transform(), textAlign: textAlign(), }}>Assign Workouts</Text>

                    {this.renderWorkouts()}
                    <View style={{ width: w / 1.05, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 10 }}>
                        <Text style={{ fontSize: width / 22, color: '#333', transform: transform(), textAlign: textAlign(), }}>{i18n.t('note')}</Text>
                        <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#eeeeee', borderRadius: 3, marginTop: width / 30, height: width / 4 }}>
                            <TextInput

                                autoCapitalize='words'
                                onChangeText={(text) => this.setState({ note: text })}
                                value={this.state.note}
                                style={{ fontSize: width / 28, transform: transform(), textAlign: textAlign(), color: '#333', width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 6, }}
                                returnKeyType='next'
                                placeholderTextColor='#333'
                            />
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => this.onSubmit()}>
                        <View style={{ transform: transform(), width: w / 1.2, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                            <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50 }}>{i18n.t('save')}</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: 'white',
        paddingBottom: width / 30
    },

    form: {
        marginTop: width / 30,
        paddingLeft: 20,
        width: w / 1.15,
        borderColor: '#ddd',
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        height: width / 8,
    },
    forme: {
        marginTop: width / 30,
        paddingLeft: 20,
        width: w / 1.15,
        borderColor: 'red',
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        height: width / 8,
    },
})

export default UpdateMemberWorkout