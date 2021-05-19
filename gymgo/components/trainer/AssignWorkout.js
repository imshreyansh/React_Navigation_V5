import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, ActionSheetIOS, TouchableOpacity, TextInput, ScrollView, StyleSheet, Picker, Image } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import WorkoutWeekChangeCalendar from '../../utils/WorkoutWeekChangeCalendar'
import { getAllMember, getAllWorkoutLevel, getByWorkoutCategory, addWorkout } from '../../utils/api/addWorkoutAndDiet'
import { getAllMemberFromTrainer } from '../../utils/api/employee'
import Loader from '../../utils/resources/Loader'
import { showMessage, hideMessage } from "react-native-flash-message";
import i18n from 'i18n-js'
class AssignWorkout extends Component {
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
        userId: ''


    }


    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            AsyncStorage.getItem('authedToken').then((token) => {
                const userId = jwtDecode(token).userId

                this.setState({
                    userId,

                }, () => {
                    getAllMemberFromTrainer(this.state.userId).then(res => {
                        if (res) {
                            this.setState({
                                SelectMembers: res.data.response
                            })
                        }
                    })

                })
            })

            getAllWorkoutLevel().then(res => {
                if (res) {
                    this.setState({
                        WorkoutCategories: res.data.response,
                    })
                }
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
                        data.sets = 0,
                            data.reps = 0,
                            data.weight = 0
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
                    data.sets = 0,
                        data.reps = 0,
                        data.weight = 0
                })
            })


        })
    }

    showSelectMember = () => {
        const data = this.state.SelectMembers.map(l => l.credentialId.userName)

        data.push(i18n.t('pleaseSelect'))
        const len = data.length
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
            cancelButtonIndex: len - 1,
        },
            (buttonIndex) => {
                this.setState({ SelectMember: data[buttonIndex] });
                if (this.state.SelectMembers[buttonIndex] !== undefined) {
                    this.setState({
                        SelectMember: this.state.SelectMembers[buttonIndex]._id,
                        SelectMemberText: this.state.SelectMembers[buttonIndex].credentialId.userName,
                        SelectMembere: '',
                    })
                } else {
                    this.setState({
                        SelectMember: '',
                        SelectMemberText: '',
                        SelectMembere: i18n.t('pleaseSelect')
                    })
                }
            });
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
    // showSchedule = () => {
    //     const data = this.state.Schedules.map(l => l.name)
    //     data.push(i18n.t('pleaseSelect'))
    //     const len = data.length
    //     ActionSheetIOS.showActionSheetWithOptions({
    //         options: data,
    //         cancelButtonIndex: len - 1,
    //     },
    //         (buttonIndex) => {
    //             this.setState({ Schedule: data[buttonIndex] });
    //             if (this.state.Schedules[buttonIndex] !== undefined) {
    //                 this.setState({
    //                     Schedule: this.state.Schedules[buttonIndex].name,
    //                     Schedulee: '',
    //                 })
    //             } else {
    //                 this.setState({
    //                     Schedule: '',
    //                     Schedulee: i18n.t('pleaseSelect')
    //                 })
    //             }
    //         });
    // }

    renderSelectMember() {
        if (Platform.OS === 'android') {
            return (
                <View style={[this.state.SelectMember !== '' ? styles.form : styles.forme, { transform: transform(), }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: 0 }}
                        selectedValue={this.state.SelectMember}
                        onValueChange={(itemValue) => this.setState({ SelectMember: itemValue })}>
                        <Picker.Item label={i18n.t('pleaseSelect')} value='' />
                        {
                            this.state.SelectMembers.map((v) => {
                                return <Picker.Item label={v.credentialId.userName} value={v._id} key={v._id} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showSelectMember()}>
                    <View style={[this.state.SelectMember !== '' ? styles.form : styles.forme, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ left: width / 90, fontSize: width / 20, transform: transform() }}>{this.state.SelectMemberText}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
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
    renderButtons = () => {

        return (

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.8, marginTop: width / 20, marginLeft: width / 30 }}>
                <TouchableOpacity onPress={() => this.setState({ workouts: true, cardio: false })}>
                    <View style={{ flexDirection: 'row' }}>
                        {this.state.workouts === true ? <Icon name='transport-status' size={width / 20} style={{ transform: transform() }} color="#7e57c2" /> : <View style={{ width: width / 20, height: width / 20, borderRadius: width / 40, borderWidth: 1, borderColor: 'grey' }} />}
                        <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 28, color: '#333', marginLeft: width / 30 }}>{i18n.t('workouts')}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({ workouts: false, cardio: true })}>
                    <View style={{ flexDirection: 'row' }}>
                        {this.state.cardio === true ? <Icon name='transport-status' size={width / 20} style={{ transform: transform() }} color="#7e57c2" /> : <View style={{ width: width / 20, height: width / 20, borderRadius: width / 40, borderWidth: 1, borderColor: 'grey' }} />}
                        <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 28, color: '#333', marginLeft: width / 30 }}>{i18n.t('cardio')}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    // renderSchedule() {
    //     if (Platform.OS === 'android') {
    //         return (
    //             <View style={[this.state.Schedule !== '' ? styles.form : styles.forme, { transform: transform(), }]}>
    //                 <Picker
    //                     mode='dropdown'
    //                     style={{ bottom: 0 }}
    //                     selectedValue={this.state.Schedule}
    //                     onValueChange={(itemValue) => this.setState({ Schedule: itemValue, SelectedDates: [] })}>
    //                     <Picker.Item label={i18n.t('pleaseSelect')} value='' />
    //                     {
    //                         this.state.Schedules.map((v) => {
    //                             return <Picker.Item label={v.name} value={v.name} key={v.name} />
    //                         })
    //                     }
    //                 </Picker>
    //             </View>
    //         )
    //     } else {
    //         return (
    //             <TouchableOpacity onPress={() => this.showSchedule()}>
    //                 <View style={[this.state.Schedule !== '' ? styles.form : styles.forme, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
    //                     <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
    //                         <Text numberOfLines={1} style={{ left: width / 90, fontSize: width / 20, transform: transform() }}>{this.state.Schedule}</Text>
    //                         <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
    //                     </View>
    //                 </View>
    //             </TouchableOpacity>
    //         )
    //     }
    // }

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
                        <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 28, width: w / 5, fontWeight: 'bold', textAlign: 'center' }}>{i18n.t('weight')}</Text>
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
                                        value={data.sets}
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
                                        value={data.reps}
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
                                        value={data.weight}
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
                            <Text style={{ transform: transform(), width: w / 5, textAlign: textAlign(), fontSize: width / 28, fontWeight: 'bold', }}>{i18n.t('weightTrainer')}</Text>
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
                                            value={data.sets}
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
                                            value={data.reps}
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
                                            value={data.weight}
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
                                            value={data.hour}
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
                                            value={data.minute}
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
                                            value={data.distance}
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
        const ifSmallerDate = this.state.SelectedDates.filter(date => new Date(date.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))
        if (WorkoutCategorye !== null && SelectMember !== null && SelectedDates.length > 0 && SelectMembere === '' && WorkoutCategorye === '') {
            if (ifSmallerDate.length === 0) {
                if (this.state.cardio === true) {
                    const works = [], memberWorkoutInfo = []
                    this.state.cardios.forEach(work => {
                        if (work.sets || work.reps || work.weight || work.distance || work.hour || work.minute) {
                            works.push({ workout: work._id, sets: work.sets || 0, reps: work.reps || 0, weight: work.weight || 0, distance: work.distance || 0, time: `${work.hour || 0}h ${work.minute || 0}m` })
                        }
                    })
                    this.state.SelectedDates.forEach(week => {
                        memberWorkoutInfo.push({ member: this.state.SelectMember, workoutCategories: 'Cardio', workoutsLevel: this.state.WorkoutCategory, dateOfWorkout: new Date(new Date(week.date)), workouts: works, note: this.state.note })
                    })
                    this.setState({
                        loading: true
                    })
                    addWorkout(memberWorkoutInfo).then(res => {
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
                                    message: 'Successfully Added',
                                    type: "success",
                                })
                            })
                        }
                    })

                } else if (this.state.workouts === true && WorkoutCategory !== '' && WorkoutCategory !== null) {
                    const works = [], memberWorkoutInfo = []
                    this.state.exercise.forEach(work => {
                        if (work.sets || work.reps || work.weight) {
                            works.push({ workout: work._id, sets: work.sets || 0, reps: work.reps || 0, weight: work.weight || 0 })
                        }
                    })
                    this.state.SelectedDates.forEach(week => {
                        memberWorkoutInfo.push({ member: this.state.SelectMember, workoutCategories: 'Workouts', workoutsLevel: this.state.WorkoutCategory, dateOfWorkout: new Date(new Date(week.date)), workouts: works, note: this.state.note })
                    })
                    this.setState({
                        loading: true
                    })
                    addWorkout(memberWorkoutInfo).then(res => {
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
                                    message: 'Successfully Added',
                                    type: "success",
                                })
                            })
                        } else {
                            this.setState({ loading: false })
                        }
                    })
                }

            } else {
                alert('You cannot assign workouts for previous days')
            }
        } else {
            alert(i18n.t('missingFields'))
        }

    }
    render() {


        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: 'white' }}>
                <Loader loading={this.state.loading} text='Loading' />

                <ScrollView contentContainerStyle={{ paddingBottom: width / 20 }}>

                    <View style={{ width: w, backgroundColor: '#eeeeee', paddingBottom: width / 10 }}>

                        <View style={{ marginTop: width / 30, width: w / 1.1, marginLeft: 'auto', marginRight: 'auto' }}>
                            <Text style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), }}>{i18n.t('selectMember')}</Text>
                            {this.renderSelectMember()}
                        </View>
                        {this.state.cardio === true ? <View></View> :
                            <View style={{ marginTop: width / 30, width: w / 1.1, marginLeft: 'auto', marginRight: 'auto' }}>
                                <Text style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), }}>{i18n.t('workoutLevel')}</Text>
                                {this.renderWorkoutCategory()}
                            </View>
                        }

                        {/* <View style={{ marginTop: width / 30, width: w / 1.1, marginLeft: 'auto', marginRight: 'auto' }}>
                            <Text style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), }}>Schedule</Text>
                            {this.renderSchedule()}
                        </View> */}
                    </View>
                    <View>
                        <WorkoutWeekChangeCalendar getValue={(value) => this.setState({ SelectedDates: value })} />
                    </View>

                    <View>
                        {this.renderButtons()}
                    </View>

                    <Text style={{ marginTop: width / 20, marginLeft: width / 30, fontSize: width / 22, fontWeight: 'bold', color: '#333', transform: transform(), textAlign: textAlign(), }}>{i18n.t('assignWorkouts')}</Text>

                    {this.renderWorkouts()}
                    <View style={{ width: w / 1.05, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 10 }}>
                        <Text style={{ fontSize: width / 22, color: '#333', transform: transform(), textAlign: textAlign(), }}>{i18n.t('note')}</Text>
                        <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#eeeeee', borderRadius: 3, marginTop: width / 30, height: width / 4 }}>
                            <TextInput

                                autoCapitalize='words'
                                onChangeText={(text) => this.setState({ note: text })}
                                value={this.state.name}
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

export default AssignWorkout