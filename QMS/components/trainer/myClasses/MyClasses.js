import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, RefreshControl, Image, Animated } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, URL, paddingRightBMI, paddingLeftBMI } from '../../../utils/api/helpers'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { getCurrency, getUserDetailsById, updateMemberProfile } from '../../../utils/api/authorization'
import { getMyClasses } from '../../../utils/api/classes'
import { showMessage, hideMessage } from "react-native-flash-message";
import sq from '../../../assets/images/sq.jpg'
import boyImage from '../../../assets/images/boy.jpg'
import i18n from 'i18n-js';


class myClasses extends Component {
    _isMounted = false

    state = {
        allClasses: [],
        employeeId: ''
    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {

            AsyncStorage.getItem('authedToken').then((token) => {
                const userId = jwtDecode(token).credential
                const employeeId = jwtDecode(token).userId
                this.setState({
                    userId,
                    employeeId
                }, () => {
                    const data = {
                        trainer: this.state.employeeId
                    }
                    getMyClasses(data).then(res => {
                        if (res) {
                            this.setState({
                                allClasses: res.data.response === null ? [] : res.data.response.filter(data => new Date().setHours(0, 0, 0, 0) <= new Date(data.endDate)),
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



    render() {
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: 'white' }}>
                <View elevation={3} style={{ width: w, height: width / 7, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />
                        </TouchableOpacity>

                        <Text style={{ marginLeft: width / 30, top: width / 30, fontSize: width / 18, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('myClasses')}</Text>
                    </View>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>
                    {this.state.allClasses.map((data, i) => {
                        const classImage = `${URL}/${data.image.path.replace(/\\/g, "/")}`
                        const classesImage = JSON.parse(JSON.stringify({ uri: classImage }))
                        var shours = new Date(data.startTime).getHours()
                        var sminutes = new Date(data.startTime).getMinutes()
                        var sampm = shours >= 12 ? 'PM' : 'AM'
                        shours = shours % 12
                        shours = shours ? shours : 12  // the hour '0' should be '12'
                        var startTime = shours + ':' + `${("0" + sminutes).slice(-2)}` + ' ' + sampm

                        var ehours = new Date(data.endTime).getHours()
                        var eminutes = new Date(data.endTime).getMinutes()
                        var eampm = ehours >= 12 ? 'PM' : 'AM'
                        ehours = ehours % 12
                        ehours = ehours ? ehours : 12  // the hour '0' should be '12'
                        var endTime = ehours + ':' + `${("0" + eminutes).slice(-2)}` + ' ' + eampm
                        return (
                            <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('MyClassesDetails', { id: data._id })}>
                                <View style={{ marginTop: width / 20 }}>
                                    <Image resizeMode='stretch' style={{ width: w, height: height / 3, marginLeft: 'auto', marginRight: 'auto', transform: transform() }} source={classesImage} />
                                    <View style={{ width: w, marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 30, backgroundColor: data.color, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }}>
                                        <View style={{ marginTop: width / 30, marginLeft: width / 30 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: width / 20, color: 'white', transform: transform(), textAlign: textAlign(), }}>{data.className}</Text>
                                            <Text numberOfLines={1} style={{ fontSize: width / 28, color: 'white', width: w / 1.3, transform: transform(), textAlign: textAlign() }}>{data.description}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.08, marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto' }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Icon name="calender" size={width / 15} style={{ marginTop: 'auto', marginBottom: 'auto' }} color="white" />
                                                <View style={{ flexDirection: 'column' }}>
                                                    <Text style={{ marginLeft: width / 80, color: 'white', fontSize: width / 35, transform: transform(), textAlign: textAlign() }}>{i18n.t('date')}</Text>
                                                    <Text style={{ marginLeft: width / 80, color: 'white', fontSize: width / 30, fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{new Date(data.startDate).getDate()}/{new Date(data.startDate).getMonth() + 1}/{new Date(data.startDate).getFullYear()}-{new Date(data.endDate).getDate()}/{new Date(data.endDate).getMonth() + 1}/{new Date(data.endDate).getFullYear()}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Icon name="time" size={width / 15} style={{ marginTop: 'auto', marginBottom: 'auto' }} color="white" />
                                                <View style={{ flexDirection: 'column' }}>
                                                    <Text style={{ marginLeft: width / 80, color: 'white', fontSize: width / 35, transform: transform(), textAlign: textAlign() }}>{i18n.t('time')}</Text>
                                                    <Text style={{ marginLeft: width / 80, color: 'white', fontSize: width / 30, fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{startTime} - {endTime}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                </View>
                            </TouchableOpacity>
                        )
                    })}



                </ScrollView>
            </View >
        )
    }
}

export default myClasses