import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, ActionSheetIOS, TouchableOpacity, TextInput, ScrollView, StyleSheet, Picker, Image } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, isTablet, URL, paddingLeft } from '../../../utils/api/helpers'
import { getAllDietSession, getAllDietFood, addDiet } from '../../../utils/api/addWorkoutAndDiet'
import { getMemberById } from '../../../utils/api/authorization'
import AsyncStorage from '@react-native-community/async-storage';
import { showMessage, hideMessage } from "react-native-flash-message";
import Loader from '../../../utils/resources/Loader'
import jwtDecode from 'jwt-decode'
import { SearchBar } from 'react-native-elements';
import i18n from 'i18n-js'
class AddMemberDiet extends Component {
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
        qty: '',
        advice: '',
        foodItems: [],
        dietPlan: [],
        searchedItem: [],
        searchItems: [],
        SelectedItem: '',
        loading: false,
        memberDetails: '',
        credentials: '',
        memberId: ''
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
            this.setState({
                memberId: this.props.navigation.getParam('memberId'),
                SelectedDates: this.props.navigation.getParam('date')
            })
            AsyncStorage.getItem('authedToken').then((token) => {
                const userId = jwtDecode(token).userId

                this.setState({
                    userId,

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
                    })
                } else {
                    this.setState({
                        Session: '',
                        SessionText: i18n.t('pleaseSelect'),
                        Sessione: i18n.t('pleaseSelect')
                    })
                }
            });
    }

    renderSession() {
        if (Platform.OS === 'android') {
            return (
                <View style={[this.state.Session !== '' ? styles.form : styles.forme, { transform: transform(), }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: 0 }}
                        selectedValue={this.state.Session}
                        onValueChange={(itemValue) => this.setState({ Session: itemValue })}>
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
        if (this.state.SelectedItem !== '') {
            return (

                <View style={{ backgroundColor: '#ddd', width: w / 1.1, paddingBottom: width / 50, borderWidth: 1, borderColor: '#ddd', marginTop: width / 30, borderRadius: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ marginTop: width / 50, fontSize: width / 22, marginLeft: width / 30, fontWeight: 'bold', color: 'white', transform: transform(), textAlign: textAlign() }}>{this.state.SelectedItem.itemName}</Text>
                    <Text style={{ marginTop: width / 50, fontSize: width / 22, marginLeft: width / 30, marginRight: width / 30, width: w / 3, color: 'white', transform: transform(), textAlign: textAlign() }}>Calories: {this.state.SelectedItem.calories}</Text>
                    <TouchableOpacity onPress={() => this.setState({ SelectedItem: '' })}>
                        <View style={{ width: width / 15, marginTop: width / 50, borderRadius: width / 30, height: width / 15, marginRight: width / 30, alignItems: 'center', backgroundColor: 'orange' }}>
                            <Icon name='close' color='white' size={width / 24} style={{ marginTop: 'auto', marginBottom: 'auto' }} />

                        </View>
                    </TouchableOpacity>
                </View>

            )
        } else {
            return (
                <View style={{ transform: transform(), paddingLeft: paddingLeft(), transform: transform(), }}>
                    <SearchBar
                        placeholder={i18n.t('search')}
                        placeholderTextColor='#D3D3D3'
                        onChangeText={this.updateSearch}
                        lightTheme
                        containerStyle={{ backgroundColor: 'white', borderWidth: 1, width: w / 1.1, height: isTablet === false ? width / 11 : width / 8, borderColor: '#C8C8C8', borderRadius: 5, marginTop: width / 30 }}
                        inputContainerStyle={{ backgroundColor: 'white', width: w / 1.3, height: height / 40, }}
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
            SelectedItem: d
        })
    }

    onAdd = () => {
        const { SelectedItem } = this.state
        if (SelectedItem !== '' && this.state.qty > 0) {
            const obj = {
                SelectedItem,
                qty: this.state.qty,
                advice: this.state.advice,
            }
            const objTwo = {
                foodItem: SelectedItem._id,

                measureValue: parseInt(this.state.qty),

                calories: Math.round((SelectedItem.calories / SelectedItem.measurementValue) * this.state.qty),

                specifications: this.state.advice
            }
            if ((this.state.foodItems.filter(data => data.SelectedItem._id === SelectedItem._id)).length > 0) {
                alert('Item is already added')
            } else {
                this.state.foodItems.push(obj)
                this.state.dietPlan.push(objTwo)
                this.setState({
                    SelectedItem: '',
                    qty: '',
                    advice: '',

                })
            }

        }

    }

    deleteItem = (i) => {
        const data = this.state.foodItems.filter(data => data.SelectedItem._id !== i)
        this.setState({
            foodItems: data
        })
    }

    onSubmit = () => {
        const { Session, SelectMember, SelectMembere, SelectedDates, } = this.state
        if (Session !== null && SelectedDates.length > 0) {
            const { memberId, Session, SelectedDates, dietPlan } = this.state

            const memberDietInfo = []
            SelectedDates.forEach(week => {
                memberDietInfo.push({ member: memberId, dietPlanSession: Session, dateOfDiet: new Date(new Date(week.date)), dietPlan })
            })

            this.setState({
                loading: true
            })

            addDiet(memberDietInfo).then(res => {
                if (res) {

                    this.setState({
                        loading: false,
                        foodItems: [],
                        SelectMember: '',
                        dietPlan: [],
                        Session: '',

                    }, () => {
                        showMessage({
                            message: 'Successfully Added',
                            type: "success",
                        })
                        this.props.navigation.navigate('MyMembers')

                    })
                }
            })

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

                        <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('addDiet')}</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 20 }}>

                    <View style={{ width: w, backgroundColor: '#eeeeee', paddingBottom: width / 10 }}>

                        <View style={{ marginTop: width / 30, width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', paddingBottom: width / 50, borderRadius: 3 }}>
                            <View style={{ flexDirection: 'row', marginTop: width / 30, marginLeft: width / 30 }}>
                                <Image source={image} style={{ width: width / 7, height: width / 7, borderRadius: width / 14, borderWidth: 2, borderColor: 'white' }} />
                                <View style={{ flexDirection: 'column', marginTop: width / 50, marginLeft: width / 50 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: width / 25, width: w / 2.5, color: 'grey', transform: transform(), textAlign: textAlign() }}>{credentials.userName}</Text>
                                    <Text style={{ fontSize: width / 28, color: 'blue', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>ID: {memberDetails.memberId}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginTop: width / 30, marginLeft: width / 30 }}>
                            <Text style={{ fontSize: width / 22, color: '#333', transform: transform(), textAlign: textAlign() }}>{i18n.t('date')}</Text>
                            <Text style={{ fontSize: width / 22, color: 'orange', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{new Date(this.props.navigation.getParam('date')[0].date).getDate()}/{new Date(this.props.navigation.getParam('date')[0].date).getMonth() + 1}/{new Date(this.props.navigation.getParam('date')[0].date).getFullYear()}</Text>
                        </View>
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
                                onChangeText={(text) => this.setState({ qty: text })}
                                value={this.state.qty}
                                style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: '#333', width: w / 4.7, marginLeft: 'auto', marginRight: 'auto', height: width / 10 }}
                                returnKeyType='next'
                                placeholderTextColor='#333'
                            />
                        </View>
                        <View style={{ width: w / 1.6, backgroundColor: '#eeeeee', borderRadius: 3, height: width / 12, }}>
                            <TextInput

                                autoCapitalize='words'
                                onChangeText={(text) => this.setState({ advice: text })}
                                value={this.state.advice}
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
                                    <Text style={{ transform: transform(), textAlign: textAlign(), marginTop: width / 30, marginLeft: width / 30, fontSize: width / 25, color: '#333', fontWeight: 'bold', width: w / 2 }}>{data.SelectedItem.itemName}</Text>
                                    <Text style={{ transform: transform(), marginTop: width / 30, marginLeft: width / 30, fontSize: width / 28, color: '#e53935', width: w / 3, textAlign: 'center' }}>{Math.round((data.SelectedItem.calories / data.SelectedItem.measurementValue) * data.qty)} {i18n.t('calories')}</Text>

                                </View>
                                <View style={{ width: w / 1.1, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto' }}>
                                    <Text style={{ transform: transform(), textAlign: textAlign(), marginTop: width / 30, marginLeft: width / 30, fontSize: width / 30, color: 'orange', width: w / 3.5, fontWeight: 'bold' }}>{i18n.t('QTYOrGrams')}: {data.qty}</Text>
                                    <View style={{ flexDirection: 'row', width: w / 2.5, marginTop: width / 30 }}>
                                        <View style={{ borderLeftWidth: 1, borderLefttColor: '#ddd' }} />
                                        <Text style={{ transform: transform(), textAlign: textAlign(), marginLeft: width / 60, fontSize: width / 30, color: '#333', width: w / 3.2, }}>{data.advice}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => this.deleteItem(data.SelectedItem._id)}>
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

export default AddMemberDiet