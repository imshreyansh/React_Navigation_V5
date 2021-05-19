import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, RefreshControl, Image, Animated } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, URL, paddingRightBMI, paddingLeftBMI } from '../../../utils/api/helpers'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { getCurrency, getUserDetailsById, updateMemberProfile } from '../../../utils/api/authorization'
import { getClassById } from '../../../utils/api/classes'
import { showMessage, hideMessage } from "react-native-flash-message";
import sq from '../../../assets/images/sq.jpg'
import boyImage from '../../../assets/images/boy.jpg'
import i18n from 'i18n-js';


class MyClassesDetails extends Component {
    _isMounted = false

    state = {
        classDetails: '',
        employeeId: '',
        classImage: '',
        room: '',
        branch: '',
        members: [],
        modalVisible: false,
    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            getClassById(this.props.navigation.getParam('id')).then(res => {
                if (res) {
                    this.setState({
                        classDetails: res.data.response,
                        classImage: `${URL}/${res.data.response.image.path.replace(/\\/g, "/")}`,
                        room: res.data.response.room,
                        branch: res.data.response.branch,
                        members: res.data.response.members
                    })
                }
            })
            AsyncStorage.getItem('authedToken').then((token) => {
                const userId = jwtDecode(token).credential
                const employeeId = jwtDecode(token).userId
                this.setState({
                    userId,
                    employeeId
                })
            })


        }
    }


    componentWillUnmount() {
        this._isMounted = false
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }



    render() {
        const classesImage = JSON.parse(JSON.stringify({ uri: this.state.classImage }))
        var shours = new Date(this.state.classDetails.startTime).getHours()
        var sminutes = new Date(this.state.classDetails.startTime).getMinutes()
        var sampm = shours >= 12 ? 'PM' : 'AM'
        shours = shours % 12
        shours = shours ? shours : 12  // the hour '0' should be '12'
        var startTime = shours + ':' + `${("0" + sminutes).slice(-2)}` + ' ' + sampm

        var ehours = new Date(this.state.classDetails.endTime).getHours()
        var eminutes = new Date(this.state.classDetails.endTime).getMinutes()
        var eampm = ehours >= 12 ? 'PM' : 'AM'
        ehours = ehours % 12
        ehours = ehours ? ehours : 12  // the hour '0' should be '12'
        var endTime = ehours + ':' + `${("0" + eminutes).slice(-2)}` + ' ' + eampm
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eee' }}>
                <View elevation={3} style={{ width: w, height: width / 7, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />
                        </TouchableOpacity>

                        <Text style={{ marginLeft: width / 30, top: width / 30, fontSize: width / 18, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('classDetails')}</Text>
                    </View>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 20 }}>

                    <View>
                        <Image resizeMode='stretch' style={{ width: w, height: height / 3, marginLeft: 'auto', marginRight: 'auto', transform: transform() }} source={classesImage} />
                        <View style={{ width: w, marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 30, backgroundColor: this.state.classDetails.color, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }}>
                            <View style={{ marginTop: width / 30, marginLeft: width / 30 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: width / 20, color: 'white', transform: transform(), textAlign: textAlign(), }}>{this.state.classDetails.className}</Text>
                                <Text numberOfLines={1} style={{ fontSize: width / 28, color: 'white', width: w / 1.3, transform: transform(), textAlign: textAlign() }}>{this.state.classDetails.description}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.08, marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="calender" size={width / 15} style={{ marginTop: 'auto', marginBottom: 'auto' }} color="white" />
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ marginLeft: width / 80, color: 'white', fontSize: width / 35, transform: transform(), textAlign: textAlign() }}>{i18n.t('date')}</Text>
                                        <Text style={{ marginLeft: width / 80, color: 'white', fontSize: width / 30, fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{new Date(this.state.classDetails.startDate).getDate()}/{new Date(this.state.classDetails.startDate).getMonth() + 1}/{new Date(this.state.classDetails.startDate).getFullYear()}-{new Date(this.state.classDetails.endDate).getDate()}/{new Date(this.state.classDetails.endDate).getMonth() + 1}/{new Date(this.state.classDetails.endDate).getFullYear()}</Text>
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
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.08, marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="location" size={width / 15} style={{ marginTop: 'auto', marginBottom: 'auto' }} color="white" />
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ marginLeft: width / 80, color: 'white', fontSize: width / 35, transform: transform(), textAlign: textAlign() }}>{i18n.t('branch')}</Text>
                                        <Text style={{ marginLeft: width / 80, color: 'white', fontSize: width / 30, fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.branch.branchName}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="classes" size={width / 15} style={{ marginTop: 'auto', marginBottom: 'auto' }} color="white" />
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ marginLeft: width / 80, color: 'white', fontSize: width / 35, transform: transform(), textAlign: textAlign() }}>{i18n.t('members')}</Text>
                                        <Text style={{ marginLeft: width / 80, color: 'white', fontSize: width / 30, fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.members.length}/{this.state.classDetails.capacity}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'column', width: w / 1.08, marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto' }}>

                                <Text style={{ fontSize: width / 30, color: 'white', marginLeft: width / 30, transform: transform(), textAlign: textAlign() }}>{i18n.t('daysIncluded')}</Text>

                                <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: width / 50, paddingTop: width / 50, width: w / 1.2, backgroundColor: '#f5f5f5', marginLeft: 'auto', marginRight: 'auto', borderRadius: 2, marginTop: width / 30 }}>
                                        <Text style={{ fontSize: width / 28, color: '#333', marginLeft: width / 30, transform: transform(), textAlign: textAlign() }}>{this.state.classDetails ? `${new Date(this.state.classDetails.classDays[0]).getDate()}/${new Date(this.state.classDetails.classDays[0]).getMonth() + 1}/${new Date(this.state.classDetails.classDays[0]).getFullYear()}` : ''}</Text>
                                        <Icon name="down-arrow" size={width / 22} style={{ marginRight: width / 30, transform: transform() }} color="#333" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                    <Text style={{ marginTop: width / 30, marginLeft: width / 30, fontSize: width / 25, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('members')}</Text>
                    {this.state.members.map((data, i) => {
                        function colorBorder() {
                            if (data.member.questions && data.member.questions.levelQuestion && data.member.questions.levelQuestion === 'Beginner') {
                                return '#e65100'
                            } else if (data.member.questions && data.member.questions.levelQuestion && data.member.questions.levelQuestion === 'Intermediate') {
                                return '#01579b'
                            } else {
                                return '#33691e'
                            }
                        }
                        function colorBackground() {
                            if (data.member.questions && data.member.questions.levelQuestion && data.member.questions.levelQuestion === 'Beginner') {
                                return '#ffb74d'
                            } else if (data.member.questions && data.member.questions.levelQuestion && data.member.questions.levelQuestion === 'Intermediate') {
                                return '#4fc3f7'
                            } else {
                                return '#aed581'
                            }
                        }
                        const urlImage = `${URL}/${data.member.credentialId.avatar.path.replace(/\\/g, "/")}`
                        const image = JSON.parse(JSON.stringify({ uri: urlImage }))
                        return (
                            <View style={{ width: w / 1.1, borderRadius: 3, marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 30, backgroundColor: 'white' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2, marginTop: width / 50, marginLeft: 'auto', marginRight: 'auto' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image source={image} style={{ width: width / 7, height: width / 7, borderRadius: width / 14, borderWidth: 2, borderColor: 'white' }} />
                                        <View style={{ flexDirection: 'column', marginTop: width / 50, marginLeft: width / 50 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: width / 25, width: w / 2.5, color: 'grey', transform: transform(), textAlign: textAlign(), }}>{data.member.credentialId.userName}</Text>
                                            <Text style={{ fontSize: width / 28, color: 'blue', transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>ID: {data.member.memberId}</Text>
                                        </View>
                                    </View>

                                    {data.member.questions && data.member.questions.levelQuestion ?
                                        <View>
                                            <View style={{ width: w / 4.5, padding: width / 80, borderWidth: 1, borderRadius: 3, backgroundColor: colorBackground(), borderColor: colorBorder(), marginTop: 'auto', marginBottom: 'auto' }}>
                                                <Text style={{ fontSize: width / 30, color: 'white', transform: transform(), textAlign: 'center' }}>{data.member.questions && data.member.questions.levelQuestion ? data.member.questions.levelQuestion : ''}</Text>
                                            </View>
                                        </View>
                                        : null}
                                </View>
                                <View style={{ borderWidth: 0.4, marginTop: width / 50, borderColor: '#ddd' }} />
                                <View style={{ marginTop: width / 50, flexDirection: 'row', marginLeft: width / 30, flexDirection: 'row' }}>
                                    <View style={{ width: width / 14, height: width / 14, backgroundColor: 'purple', borderRadius: width / 28, marginTop: 'auto', marginBottom: 'auto' }}>
                                        <Icon name="call" size={width / 28} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} color="white" />
                                    </View>
                                    <Text style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 50, fontSize: width / 32, color: 'grey', transform: transform(), textAlign: textAlign(), width: w / 4.2 }}>{data.member.mobileNo}</Text>
                                    <View style={{ width: width / 14, height: width / 14, backgroundColor: 'green', borderRadius: width / 28, marginLeft: width / 30, marginTop: 'auto', marginBottom: 'auto' }}>
                                        <Icon name="email" size={width / 28} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} color="white" />
                                    </View>
                                    <Text style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 50, fontSize: width / 32, color: 'grey', transform: transform(), textAlign: textAlign(), width: w / 2.5 }}>{data.member.credentialId.email}</Text>
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>
                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View elevation={10} style={{ backgroundColor: 'white', height: height / 3, width: width - 40, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width / 1.15, marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0.5, paddingBottom: width / 60, borderBottomColor: '#333' }}>
                            <Text style={{ fontSize: width / 20, color: '#333', marginLeft: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], textAlign: this.state.isRTL ? 'right' : 'left' }}>{i18n.t('daysIncluded')}</Text>
                            <TouchableOpacity onPress={() => { this.setModalVisible(false) }}>
                                <Icon name="close" size={width / 20} style={{ marginRight: width / 30 }} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>
                            {this.state.classDetails ? this.state.classDetails.classDays.map((data, i) => {
                                return (
                                    <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width - 50, marginLeft: 'auto', marginRight: 'auto' }}>
                                        <Text style={{ fontSize: width / 25, color: '#333', marginLeft: width / 30 }}>{`${new Date(data).getDate()}/${new Date(data).getMonth() + 1}/${new Date(data).getFullYear()}`}</Text>
                                        <Icon name="approve-icon" size={width / 22} style={{ marginRight: width / 30 }} color="#4caf50" />
                                    </View>
                                )
                            }) : <View></View>}

                        </ScrollView>
                    </View>
                </Modal>
            </View >
        )
    }
}

export default MyClassesDetails