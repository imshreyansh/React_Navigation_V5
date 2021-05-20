import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, ActionSheetIOS, TouchableOpacity, TextInput, ScrollView, StyleSheet, Picker, Image } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, isTablet, URL, paddingLeft } from '../../utils/api/helpers'
import WorkoutCalendar from '../../utils/WorkoutCalendar'
import { getAllMember, getAllDietSession, getAllDietFood, updateDiet, getMemberDietByTrainer } from '../../utils/api/addWorkoutAndDiet'
import { getAllMemberFromTrainer } from '../../utils/api/employee'
import AsyncStorage from '@react-native-community/async-storage';
import { showMessage, hideMessage } from "react-native-flash-message";
import Loader from '../../utils/resources/Loader'
import jwtDecode from 'jwt-decode'
import { SearchBar } from 'react-native-elements';
import i18n from 'i18n-js'
class AddedDietByTrainer extends Component {
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
        // Schedules: [{ name: 'Daily' }, { name: 'Weekly' }],
        // Schedule: null,
        // Schedulee: '',
        SelectedDates: [],
        Sessions: [],
        Session: null,
        Sessione: '',
        SessionText: i18n.t('pleaseSelect'),
        search: '',
        measurementValue: '',
        specifications: '',
        foodItems: [],
        dietPlan: [],
        searchedItem: [],
        searchItems: [],
        foodItem: '',
        loading: false,
        addedDiet: [],
        dietId: ''
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

            getAllDietSession().then(res => {
                if (res) {
                    this.setState({
                        Sessions: res.data.response

                    })
                }
            })
        }

        getAllDietFood().then(res => {
            if (res) {
                this.setState({
                    searchItems: res.data.response
                })
            }
        })


    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getUserDiet = () => {
        if (this.state.SelectMember !== null && this.state.Session !== null) {
            this.setState({ foodItems: [] })
            const memberId = this.state.SelectMember
            const date = this.state.SelectedDates.length > 0 ? this.state.SelectedDates[0].date : ''
            const session = this.state.Session
            const data = {
                member: memberId,
                dateOfDiet: new Date(date),
                dietPlanSession: session

            }

            getMemberDietByTrainer(data).then(res => {
                if (res) {
                    this.setState({
                        addedDiet: res.data.response,
                        dietId: res.data.response[0]._id,
                        foodItems: res.data.response[0].dietPlan,
                    })
                }
            })

        }



    }

    updateSearch = search => {
        if (search !== '') {
            this.setState({ search }, () => {
                const items = this.state.searchItems.filter(data => data.itemName.toLowerCase().includes(search.toLowerCase()))
                this.setState({ searchedItem: items })
            })
        } else {
            this.setState({
                searchedItem: [],
                search: '',
            })
        }
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
                    }, () => this.getUserDiet())
                } else {
                    this.setState({
                        SelectMember: '',
                        SelectMemberText: '',
                        SelectMembere: i18n.t('pleaseSelect')
                    })
                }
            });
    }
    // showWorkoutCategory = () => {
    //     const data = this.state.WorkoutCategories.map(l => l.levelName)
    //     data.push(i18n.t('pleaseSelect'))
    //     const len = data.length
    //     ActionSheetIOS.showActionSheetWithOptions({
    //         options: data,
    //         cancelButtonIndex: len - 1,
    //     },
    //         (buttonIndex) => {
    //             this.setState({ WorkoutCategory: data[buttonIndex] });
    //             if (this.state.WorkoutCategories[buttonIndex] !== undefined) {
    //                 this.setState({
    //                     WorkoutCategory: this.state.WorkoutCategories[buttonIndex]._id,
    //                     WorkoutCategoryText: this.state.WorkoutCategories[buttonIndex].levelName,
    //                     WorkoutCategorye: '',
    //                 }, () => {
    //                     this.getLevelByIdIOS(this.state.WorkoutCategory, buttonIndex)
    //                 })
    //             } else {
    //                 this.setState({
    //                     WorkoutCategory: '',
    //                     WorkoutCategoryText: '',
    //                     WorkoutCategorye: i18n.t('pleaseSelect')
    //                 })
    //             }
    //         });
    // }
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
    showSession = () => {
        const data = this.state.Sessions.map(l => l.sessionName)
        data.push(i18n.t('pleaseSelect'))
        const len = data.length
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
            cancelButtonIndex: len - 1,
        },
            (buttonIndex) => {
                this.setState({ Session: data[buttonIndex] });
                if (this.state.Sessions[buttonIndex] !== undefined) {
                    this.setState({
                        Session: this.state.Sessions[buttonIndex]._id,
                        SessionText: this.state.Sessions[buttonIndex].sessionName,
                        Sessione: '',
                    }, () => this.getUserDiet())
                } else {
                    this.setState({
                        Session: '',
                        SessionText: i18n.t('pleaseSelect'),
                        Sessione: i18n.t('pleaseSelect')
                    })
                }
            });
    }
    renderSelectMember() {
        if (Platform.OS === 'android') {
            return (
                <View style={[this.state.SelectMember !== '' ? styles.form : styles.forme, { transform: transform(), }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: 0 }}
                        selectedValue={this.state.SelectMember}
                        onValueChange={(itemValue) => this.setState({ SelectMember: itemValue }, () => this.getUserDiet())}>
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
    // renderWorkoutCategory() {
    //     if (Platform.OS === 'android') {
    //         return (
    //             <View style={[this.state.WorkoutCategory !== '' ? styles.form : styles.forme, { transform: transform(), }]}>
    //                 <Picker
    //                     mode='dropdown'
    //                     style={{ bottom: 0 }}
    //                     selectedValue={this.state.WorkoutCategory}
    //                     onValueChange={(itemValue, itemIndex) => this.getLevelById(itemValue, itemIndex)}>
    //                     <Picker.Item label={i18n.t('pleaseSelect')} value='' />
    //                     {
    //                         this.state.WorkoutCategories.map((v) => {
    //                             return <Picker.Item label={v.levelName} value={v._id} key={v._id} />
    //                         })
    //                     }
    //                 </Picker>
    //             </View>
    //         )
    //     } else {
    //         return (
    //             <TouchableOpacity onPress={() => this.showWorkoutCategory()}>
    //                 <View style={[this.state.WorkoutCategory !== '' ? styles.form : styles.forme, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
    //                     <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
    //                         <Text numberOfLines={1} style={{ left: width / 90, fontSize: width / 20, transform: transform() }}>{this.state.WorkoutCategoryText}</Text>
    //                         <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
    //                     </View>
    //                 </View>
    //             </TouchableOpacity>
    //         )
    //     }
    // }
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
    renderSession() {
        if (Platform.OS === 'android') {
            return (
                <View style={[this.state.Session !== '' ? styles.form : styles.forme, { transform: transform(), }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: 0 }}
                        selectedValue={this.state.Session}
                        onValueChange={(itemValue) => this.setState({ Session: itemValue }, () => this.getUserDiet())}>
                        <Picker.Item label={i18n.t('pleaseSelect')} value='' />
                        {
                            this.state.Sessions.map((v) => {
                                return <Picker.Item label={v.sessionName} value={v._id} key={v._id} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showSession()}>
                    <View style={[this.state.Session !== '' ? styles.form : styles.forme, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ left: width / 90, fontSize: width / 20, transform: transform() }}>{this.state.SessionText}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }


    renderSearch = () => {
        if (this.state.foodItem !== '') {
            return (

                <View style={{ backgroundColor: '#ddd', width: w / 1.1, paddingBottom: width / 50, borderWidth: 1, borderColor: '#ddd', marginTop: width / 30, borderRadius: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ marginTop: width / 50, fontSize: width / 22, marginLeft: width / 30, fontWeight: 'bold', color: 'white', transform: transform(), textAlign: textAlign() }}>{this.state.foodItem.itemName}</Text>
                    <Text style={{ marginTop: width / 50, fontSize: width / 22, marginLeft: width / 30, marginRight: width / 30, width: w / 3, color: 'white', transform: transform(), textAlign: textAlign() }}>Calories: {this.state.foodItem.calories}</Text>
                    <TouchableOpacity onPress={() => this.setState({ foodItem: '' })}>
                        <View style={{ width: width / 15, marginTop: width / 50, borderRadius: width / 30, height: width / 15, marginRight: width / 30, alignItems: 'center', backgroundColor: 'orange' }}>
                            <Icon name='close' color='white' size={width / 24} style={{ marginTop: 'auto', marginBottom: 'auto' }} />

                        </View>
                    </TouchableOpacity>
                </View>

            )
        } else {
            return (
                <View style={{ transform: transform(), paddingLeft: paddingLeft(), transform: transform() }}>
                    <SearchBar
                        placeholder={i18n.t('search')}
                        placeholderTextColor='#D3D3D3'
                        onChangeText={this.updateSearch}
                        lightTheme
                        containerStyle={{ backgroundColor: 'white', borderWidth: 1, width: w / 1.1, height: isTablet === false ? width / 11 : width / 8, borderColor: '#C8C8C8', borderRadius: 5, marginTop: width / 30 }}
                        inputContainerStyle={{ backgroundColor: 'white', width: w / 1.3, height: height / 40 }}
                        inputStyle={{ textAlign: textAlign() }}
                        searchIcon={{ size: width / 16 }}
                        value={this.state.search}
                    />
                    {this.state.searchedItem.map((data, i) => {
                        return (
                            <TouchableOpacity key={i} onPress={() => this.onSelectItem(data, i)}>
                                <View key={i} style={{ backgroundColor: '#ddd', width: w / 1.1, paddingBottom: width / 30, borderWidth: 1, borderColor: '#ddd', marginTop: width / 30, borderRadius: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ marginTop: width / 50, fontSize: width / 25, marginLeft: width / 30, fontWeight: 'bold' }}>{data.itemName}</Text>
                                    <Text style={{ marginTop: width / 50, fontSize: width / 25, marginLeft: width / 30, marginRight: width / 30, width: w / 3 }}>Calories: {data.calories}</Text>

                                </View>
                            </TouchableOpacity>
                        )
                    })}

                </View>
            )
        }

    }

    onSelectItem = (d) => {
        this.setState({
            foodItem: d
        })
    }

    onAdd = () => {
        const { foodItem } = this.state
        if (foodItem !== '' && this.state.measurementValue > 0) {
            const obj = {
                foodItem,
                measureValue: parseInt(this.state.measurementValue),
                specifications: this.state.specifications,
                calories: Math.round((foodItem.calories / foodItem.measurementValue) * this.state.measurementValue),
            }
            const objTwo = {
                foodItem: foodItem._id,

                measureValue: parseInt(this.state.measurementValue),
                calories: Math.round((foodItem.calories / foodItem.measurementValue) * this.state.measurementValue),

                specifications: this.state.specifications
            }
            if ((this.state.foodItems.filter(data => data.foodItem._id === foodItem._id)).length > 0) {
                alert('Item is already added')
            } else {
                this.state.foodItems.push(obj)
                this.state.dietPlan.push(objTwo)
                this.setState({
                    foodItem: '',
                    measurementValue: '',
                    specifications: '',

                })
            }

        }

    }

    deleteItem = (i) => {
        const data = this.state.foodItems.filter(data => data.foodItem._id !== i)
        this.setState({
            foodItems: data
        })
    }

    onSubmit = () => {
        const { Session, SelectMember, SelectMembere, SelectedDates, } = this.state
        if (Session !== null && SelectMember !== null && SelectedDates.length > 0 && SelectMembere === '') {
            const { SelectMember, Session, SelectedDates, foodItems } = this.state
            const dietPlan = []

            this.state.foodItems.forEach(data => {
                dietPlan.push({
                    foodItem: data.foodItem._id,

                    measureValue: data.measureValue,

                    calories: data.calories,

                    specifications: data.specifications
                })
            })



            const memberDietInfo = { member: SelectMember, dietPlanSession: Session, dateOfDiet: new Date(new Date(SelectedDates[0].date)), dietPlan }
            const id = this.state.dietId
            this.setState({
                loading: true
            })

            updateDiet(id, memberDietInfo).then(res => {
                if (res) {

                    this.setState({
                        loading: false,
                        foodItems: [],
                        SelectMember: '',
                        dietPlan: [],
                        Session: '',

                    }, () => {
                        showMessage({
                            message: 'Successfully Updated',
                            type: "success",
                        })
                    })
                }
            })

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
                            <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 25, color: '#333' }}>{i18n.t('selectMember')}</Text>
                            {this.renderSelectMember()}
                        </View>
                        {/* <View style={{ marginTop: width / 30, width: w / 1.1, marginLeft: 'auto', marginRight: 'auto' }}>
                            <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 25, color: '#333' }}>Workout Level</Text>
                            {this.renderWorkoutCategory()}
                        </View> */}
                        {/* <View style={{ marginTop: width / 30, width: w / 1.1, marginLeft: 'auto', marginRight: 'auto' }}>
                            <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 25, color: '#333' }}>Schedule</Text>
                            {this.renderSchedule()}
                        </View> */}
                    </View>
                    <View>
                        <WorkoutCalendar getValue={(value) => this.setState({ SelectedDates: value }, () => this.getUserDiet(value))} format={this.state.Schedule} />
                    </View>
                    <View style={{ marginTop: width / 20, width: w, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#eee', paddingBottom: width / 20 }}>
                        <Text style={{ transform: transform(), textAlign: textAlign(), marginTop: width / 30, marginLeft: width / 30, fontSize: width / 25, color: '#333' }}>{i18n.t('dietPlanSessions')}</Text>

                        <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto' }}>
                            {this.renderSession()}
                        </View>
                    </View>
                    <Text style={{ transform: transform(), textAlign: textAlign(), marginTop: width / 20, marginLeft: width / 30, fontSize: width / 22, fontWeight: 'bold', color: '#333' }}>{i18n.t('assignDietPlans')}</Text>

                    <View style={{ marginTop: width / 20, marginLeft: width / 30 }}>
                        <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 25, color: '#333' }}>{i18n.t('foodItems')}</Text>
                        {this.renderSearch()}

                    </View>
                    <View style={{ marginTop: width / 20, width: w / 1.05, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 28, width: w / 4.5, fontWeight: 'bold' }}>{i18n.t('QTYOrGrams')}</Text>
                        <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 28, width: w / 1.6, fontWeight: 'bold' }}>{i18n.t('specOrAdvice')}</Text>
                    </View>
                    <View style={{ marginTop: width / 20, width: w / 1.05, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ width: w / 4.5, backgroundColor: '#eeeeee', borderRadius: 3, height: width / 12, }}>
                            <TextInput
                                keyboardType='numeric'
                                autoCapitalize='words'
                                onChangeText={(text) => this.setState({ measurementValue: text })}
                                value={this.state.measurementValue}
                                style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: '#333', width: w / 4.7, marginLeft: 'auto', marginRight: 'auto', height: width / 10 }}
                                returnKeyType='next'
                                placeholderTextColor='#333'
                            />
                        </View>
                        <View style={{ width: w / 1.6, backgroundColor: '#eeeeee', borderRadius: 3, height: width / 12, }}>
                            <TextInput

                                autoCapitalize='words'
                                onChangeText={(text) => this.setState({ specifications: text })}
                                value={this.state.specifications}
                                style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: '#333', width: w / 1.8, marginLeft: 'auto', marginRight: 'auto', height: width / 10 }}
                                returnKeyType='next'
                                placeholderTextColor='#333'
                            />
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => this.onAdd()}>
                        <View style={{ transform: transform(), marginTop: width / 10, width: w / 1.05, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: width / 40 }}>
                            <View style={{ backgroundColor: '#7e57c2', padding: width / 50, width: w / 4.5, borderRadius: 5 }}>
                                <Text style={{ fontSize: width / 25, color: 'white', textAlign: 'center' }}>{i18n.t('add')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {this.state.foodItems.length > 0 ? <Text style={{ transform: transform(), textAlign: textAlign(), marginTop: width / 20, marginLeft: width / 30, fontSize: width / 22, fontWeight: 'bold', color: '#333' }}>{i18n.t('foodItems')}</Text> : <View></View>}
                    {this.state.foodItems.map((data, i) => {
                        return (
                            <View key={i} style={{ marginTop: width / 20, width: w / 1.1, borderWidth: 1, marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 20, backgroundColor: '#f5f5f5', borderColor: '#ddd' }}>
                                <View style={{ width: w / 1.1, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto' }}>
                                    <Text style={{ transform: transform(), textAlign: textAlign(), marginTop: width / 30, marginLeft: width / 30, fontSize: width / 25, color: '#333', fontWeight: 'bold', width: w / 2 }}>{data.foodItem.itemName}</Text>
                                    <Text style={{ transform: transform(), marginTop: width / 30, marginLeft: width / 30, fontSize: width / 28, color: '#e53935', width: w / 3, textAlign: 'center' }}>{(data.foodItem.calories / data.foodItem.measurementValue) * data.measureValue} {i18n.t('calories')}</Text>

                                </View>
                                <View style={{ width: w / 1.1, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto' }}>
                                    <Text style={{ transform: transform(), textAlign: textAlign(), marginTop: width / 30, marginLeft: width / 30, fontSize: width / 30, color: 'orange', width: w / 3.5, fontWeight: 'bold' }}>{i18n.t('QTYOrGrams')}: {data.measureValue}</Text>
                                    <View style={{ flexDirection: 'row', width: w / 2.5, marginTop: width / 30 }}>
                                        <View style={{ borderLeftWidth: 1, borderLefttColor: '#ddd' }} />
                                        <Text style={{ transform: transform(), textAlign: textAlign(), marginLeft: width / 60, fontSize: width / 30, color: '#333', width: w / 3.2, }}>{data.specifications}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => this.deleteItem(data.foodItem._id)}>
                                        <View style={{ width: width / 15, marginTop: width / 30, borderRadius: width / 30, height: width / 15, marginRight: width / 30, alignItems: 'center', backgroundColor: 'orange' }}>
                                            <Icon name='close' color='white' size={width / 24} style={{ marginTop: 'auto', marginBottom: 'auto' }} />

                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })}
                    {this.state.foodItems.length > 0 ?
                        <TouchableOpacity onPress={() => this.onSubmit()}>
                            <View style={{ transform: transform(), width: w / 1.2, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                                <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50 }}>{i18n.t('save')}</Text>
                            </View>
                        </TouchableOpacity>
                        : <View></View>}

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

export default AddedDietByTrainer