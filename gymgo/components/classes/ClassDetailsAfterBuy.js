import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, RefreshControl, Image, Animated } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, URL, paddingRightBMI, paddingLeftBMI } from '../../utils/api/helpers'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { getCurrency, getUserDetailsById, updateMemberProfile } from '../../utils/api/authorization'
import Loader from '../../utils/resources/Loader'
import { showMessage, hideMessage } from "react-native-flash-message";
import { getClassById } from '../../utils/api/classes'
import sq from '../../assets/images/sq.jpg'
import boyImage from '../../assets/images/boy.jpg'
import i18n from 'i18n-js';


class ClassDetailsAfterBuy extends Component {
    _isMounted = false

    state = {
        currency: '',
        userDetails: '',
        userCredentials: '',
        refreshing: false,
        loading: false,
        modalVisible: false,
        classDetails: '',
        trainer: '',
        trainerImage: '',
        branchName: "",
        memberId: '',
        room: ""
    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {

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
        }
    }


    componentWillUnmount() {
        this._isMounted = false
    }

    _onRefresh = () => {
        this.setState({
            refreshing: true,

        })

        getUserDetailsById(this.state.userId).then(res => {
            if (res) {
                this.setState({
                    userDetails: res.data.response,
                    userCredentials: res.data.response.credentialId,
                    refreshing: false,
                    branchName: res.data.response.branch,

                })
            }
        })
        getClassById(this.props.navigation.getParam('id')).then(res => {
            if (res) {
                this.setState({
                    classDetails: res.data.response,
                    classImage: `${URL}/${res.data.response.image.path.replace(/\\/g, "/")}`,
                    trainer: res.data.response.trainer,
                    trainerImage: `${URL}/${res.data.response.trainer.credentialId.avatar.path.replace(/\\/g, "/")}`,
                    room: res.data.response.room
                })
            }
        })
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

        const trainerImages = JSON.parse(JSON.stringify({ uri: this.state.trainerImage }))
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <Loader loading={this.state.loading} text='Registering User' />


                <View elevation={3} style={{ width: w, height: width / 7, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />
                        </TouchableOpacity>

                        <Text style={{ marginLeft: width / 30, top: width / 30, fontSize: width / 18, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('classDetails')}</Text>
                    </View>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        progressBackgroundColor='#1976d2'
                        colors={['white', 'yellow']}
                    />}>
                    <View>
                        <Image resizeMode='stretch' style={{ width: w, height: height / 3, marginLeft: 'auto', marginRight: 'auto', transform: transform() }} source={classesImage} />
                    </View>
                    <View style={{ width: w, marginLeft: 'auto', marginRight: 'auto', backgroundColor: this.state.classDetails.color, paddingBottom: width / 30 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.1, marginLeft: 'auto', marginRight: 'auto' }}>
                            <Text style={{ fontSize: width / 20, color: 'white', marginTop: width / 30, marginLeft: width / 30, width: w / 2, transform: transform(), textAlign: textAlign() }}>{this.state.classDetails.className}</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: width / 25, color: 'white', marginTop: width / 30, width: w / 2.5, textAlign: 'center', transform: transform() }}>{startTime} {i18n.t('to')} {endTime}</Text>
                        </View>
                        <Text style={{ fontSize: width / 28, color: 'white', marginLeft: width / 30, width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', transform: transform(), textAlign: textAlign() }}>{this.state.classDetails.description}</Text>
                    </View>

                    <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.08, backgroundColor: 'white', marginTop: width / 30, paddingBottom: width / 20, borderRadius: 3 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.15, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 50 }}>

                            <View style={{ flexDirection: 'column', marginLeft: width / 80 }}>
                                <Text style={{ fontSize: width / 25, color: 'grey', transform: transform() }}>{i18n.t('from')}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="calender" size={width / 15} style={{ marginTop: 'auto', marginBottom: 'auto' }} color="orange" />
                                    <Text style={{ fontSize: width / 20, color: '#4caf50', fontWeight: 'bold', transform: transform(), marginLeft: width / 50 }}>{`${new Date(this.state.classDetails.startDate).getDate()}/${new Date(this.state.classDetails.startDate).getMonth() + 1}/${new Date(this.state.classDetails.startDate).getFullYear()}`}</Text>
                                </View>
                            </View>


                            <View style={{ flexDirection: 'column', marginLeft: width / 80 }}>
                                <Text style={{ fontSize: width / 25, color: 'grey', transform: transform() }}>{i18n.t('to')}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="calender" size={width / 15} style={{ marginTop: 'auto', marginBottom: 'auto' }} color="orange" />
                                    <Text style={{ fontSize: width / 20, color: '#4caf50', fontWeight: 'bold', transform: transform(), marginLeft: width / 50 }}>{`${new Date(this.state.classDetails.endDate).getDate()}/${new Date(this.state.classDetails.endDate).getMonth() + 1}/${new Date(this.state.classDetails.endDate).getFullYear()}`}</Text>

                                </View>
                            </View>
                        </View>


                        <Text style={{ fontSize: width / 25, color: 'grey', fontWeight: 'bold', transform: transform(), marginTop: width / 30, marginLeft: width / 30, transform: transform(), textAlign: textAlign() }}>{i18n.t('daysIncluded')}</Text>
                        <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: width / 50, paddingTop: width / 50, width: w / 1.2, backgroundColor: '#f5f5f5', marginLeft: 'auto', marginRight: 'auto', borderRadius: 2, marginTop: width / 30 }}>
                                <Text style={{ fontSize: width / 28, color: '#333', marginLeft: width / 30, transform: transform(), textAlign: textAlign() }}>{this.state.classDetails ? `${new Date(this.state.classDetails.classDays[0]).getDate()}/${new Date(this.state.classDetails.classDays[0]).getMonth() + 1}/${new Date(this.state.classDetails.classDays[0]).getFullYear()}` : ''}</Text>
                                <Icon name="approve-icon" size={width / 22} style={{ marginRight: width / 30, transform: transform() }} color="#4caf50" />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.08, backgroundColor: 'white', marginTop: width / 30, paddingBottom: width / 20, borderRadius: 3 }}>

                        <View style={{ flexDirection: 'row', marginTop: width / 30 }}>
                            <Image source={trainerImages} style={{ width: width / 6, height: width / 6, borderRadius: width / 12, transform: transform(), marginLeft: width / 50 }} />
                            <View style={{ marginTop: width / 50, flexDirection: 'column', marginLeft: width / 30 }}>
                                <Text numberOfLines={1} style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 25, color: '#333' }}>{i18n.t('trainer')}</Text>
                                <Text numberOfLines={1} style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 22, width: w / 1.7, color: '#333', fontWeight: 'bold' }}>{this.state.trainer ? this.state.trainer.credentialId.userName : ''}</Text>
                            </View>
                        </View>
                        <View style={{ borderBottomWidth: 1, width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', borderBottomColor: '#ddd', marginTop: width / 30 }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', width: w / 1.2, marginTop: width / 25 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon name='navigation-transport' size={width / 12} color="orange" />
                                <View style={{ flexDirection: 'column', marginLeft: width / 60 }}>
                                    <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 30, width: w / 5, color: '#333' }}>{i18n.t('branch')}</Text>
                                    <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 28, width: w / 5, color: '#333', fontWeight: 'bold' }}>{this.state.branchName.branchName}</Text>

                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon name='seat' size={width / 12} color="orange" />
                                <View style={{ flexDirection: 'column', marginLeft: width / 60 }}>
                                    <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 38, width: w / 4.5, color: '#333' }}>{i18n.t('room')}</Text>
                                    <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 28, width: w / 5, color: '#333', fontWeight: 'bold' }}>{this.state.room.roomName}</Text>

                                </View>
                            </View>
                        </View>
                    </View>

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
                        <ScrollView>
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

export default ClassDetailsAfterBuy