import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, StyleSheet, Picker, Image } from 'react-native';
import loginBg from '../../assets/images/loginBg.png';
import boyImage from '../../assets/images/boy.jpg'
import { Icon, width, height, w, h, transform, textAlign } from '../../utils/api/helpers'
import i18n from 'i18n-js'

class QuestionTwo extends Component {

    state = {
        level: [{ name: i18n.t('oneDayAWeek'), isChecked: false }, { name: i18n.t('twoDayAWeek'), isChecked: false }, { name: i18n.t('threeDayAWeek'), isChecked: false }, { name: i18n.t('fourDayAWeek'), isChecked: false }, { name: i18n.t('fiveDayAWeek'), isChecked: false }, { name: i18n.t('sixDayAWeek'), isChecked: false }, { name: i18n.t('sevenDayAWeek'), isChecked: false }],
        rtl: null
    }

    onSubmit = () => {
        const data = this.state.level.filter(check => check.isChecked === true)
        const id = {
            designation: this.props.navigation.getParam('id').designation,
            questionOne: this.props.navigation.getParam('id').questionOne,
            questionTwo: data.length === 0 ? '' : data[0].name,
            userId: this.props.navigation.getParam('id').userId
        }
        if (id.questionTwo !== '') {
            this.props.navigation.navigate('QuestionThree', { id })
        } else {
            alert(i18n.t('pleaseSelectOneOption'))
        }

    }
    render() {
        return (
            <View style={{ flex: 1, transform: transform(), backgroundColor: '#eeeeee' }}>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 10 }}>
                    <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                            <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('myProfile')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.1, backgroundColor: 'white', marginTop: width / 15, paddingBottom: width / 10, borderRadius: 3 }}>
                        <View style={{ alignItems: 'center', marginTop: width / 20 }}>
                            <Text style={{ fontSize: width / 20, fontWeight: 'bold', color: 'grey', transform: transform(), textAlign: textAlign(), textAlign: 'center' }}>{i18n.t('howManyDays')}</Text>

                        </View>
                        {this.state.level.map((data, i) => {
                            const check = (id) => {
                                this.state.level.map((d, index) => {
                                    if (index !== id) {
                                        d.isChecked = false

                                    } else {
                                        d.isChecked = true
                                    }
                                })
                                this.setState({
                                    level: this.state.level,
                                })


                            }

                            return (
                                <TouchableOpacity key={i} onPress={() => check(i)}>
                                    <View style={{ width: w / 1.2, borderRadius: 3, backgroundColor: data.isChecked === true ? '#e1f5fe' : '#eeeeee', marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', paddingBottom: width / 30, justifyContent: 'space-between', marginTop: width / 10, borderWidth: data.isChecked === true ? 1 : 0, borderColor: data.isChecked === true ? '#0288d1' : '' }}>
                                        <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 20, color: '#333', marginTop: width / 30, width: w / 2, fontWeight: 'bold', marginLeft: width / 30 }}>{data.name}</Text>
                                        {data.isChecked === true ? <Icon name='check' color='#0288d1' size={width / 15} style={{ transform: transform(), marginTop: width / 30, marginRight: width / 30 }} /> : <View style={{ width: width / 18, height: width / 18, borderRadius: width / 36, borderWidth: 1, borderColor: 'grey', marginTop: width / 25, marginRight: width / 30 }} />}
                                    </View>
                                </TouchableOpacity>
                            )
                        })}


                        <TouchableOpacity onPress={() => this.onSubmit()}>
                            <View style={{ width: w / 1.2, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                                <Text style={{ transform: transform(), fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50 }}>{i18n.t('next')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View >
        )
    }
}

export default QuestionTwo