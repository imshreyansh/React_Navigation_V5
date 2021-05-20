import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, RefreshControl, Image, Animated } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, URL, paddingRightBMI, paddingLeftBMI } from '../../utils/api/helpers'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { getCurrency, getUserDetailsById, updateMemberProfile } from '../../utils/api/authorization'
import { getAllClassesByBranch } from '../../utils/api/classes'
import Loader from '../../utils/resources/Loader'
import { showMessage, hideMessage } from "react-native-flash-message";
import sq from '../../assets/images/sq.jpg'
import boyImage from '../../assets/images/boy.jpg'
import i18n from 'i18n-js';


class ClassHome extends Component {
    _isMounted = false

    state = {
        currency: '',
        userDetails: '',
        userCredentials: '',
        refreshing: false,
        loading: false,
        allClasses: [],
        branchName: ''
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
                    branchId: res.data.response.branch._id,
                    branchName: res.data.response.branch,
                    refreshing: false
                }, () => {
                    const data = {
                        branch: this.state.branchId,
                    }
                    getAllClassesByBranch(data).then(res => {
                        if (res) {
                            this.setState({
                                allClasses: res.data.response
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


                <View elevation={3} style={{ width: w, height: width / 7, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />
                        </TouchableOpacity>

                        <Text style={{ marginLeft: width / 30, top: width / 30, fontSize: width / 18, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('classes')}</Text>
                    </View>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        progressBackgroundColor='#1976d2'
                        colors={['white', 'yellow']}
                    />}>
                    {this.state.allClasses.map((data, id) => {
                        const trainerImage = `${URL}/${data.trainer.credentialId.avatar.path.replace(/\\/g, "/")}`
                        const userImage = JSON.parse(JSON.stringify({ uri: trainerImage }))
                        const classImage = `${URL}/${data.image.path.replace(/\\/g, "/")}`
                        const classesImage = JSON.parse(JSON.stringify({ uri: classImage }))
                        return (
                            <TouchableOpacity key={id} onPress={() => this.props.navigation.navigate('ClassDetailsBeforeBuy', { id: data._id })}>
                                <View style={{ marginTop: width / 20 }}>
                                    <Image resizeMode='stretch' style={{ width: w / 1.08, height: height / 3, marginLeft: 'auto', marginRight: 'auto', transform: transform() }} source={classesImage} />
                                    <View style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 30, backgroundColor: data.color, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }}>
                                        <View style={{ marginTop: width / 30, marginLeft: width / 30 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: width / 20, color: 'white', transform: transform(), textAlign: textAlign(), }}>{data.className}</Text>
                                            <Text numberOfLines={1} style={{ fontSize: width / 28, color: 'white', width: w / 1.3, transform: transform(), textAlign: textAlign() }}>{data.description}</Text>
                                        </View>
                                        <View style={{ marginTop: width / 25 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.1, marginLeft: 'auto', marginRight: 'auto' }}>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Image source={userImage} style={{ width: width / 8, height: width / 8, borderRadius: width / 16, transform: transform(), marginLeft: width / 50 }} />
                                                    <View style={{ marginTop: width / 50, flexDirection: 'column', marginLeft: width / 30 }}>
                                                        <Text numberOfLines={1} style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 28, color: 'white', transform: transform(), textAlign: textAlign() }}>{i18n.t('trainer')}</Text>
                                                        <Text numberOfLines={1} style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 25, width: w / 2, color: 'white', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{data.trainer.credentialId.userName}</Text>
                                                    </View>
                                                </View>
                                                <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 18, width: w / 5, color: 'white', fontWeight: 'bold', marginTop: width / 30, transform: transform(), textAlign: textAlign() }}>{this.state.currency} {data.amount}</Text>

                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', width: w / 1.2, marginTop: width / 25 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Icon name='navigation-transport' size={width / 12} color="white" />
                                                <View style={{ flexDirection: 'column', marginLeft: width / 60 }}>
                                                    <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 30, width: w / 5, color: 'white', transform: transform(), textAlign: textAlign() }}>{i18n.t('branch')}</Text>
                                                    <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 26, width: w / 5, color: 'white', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.branchName.branchName}</Text>

                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Icon name='seat' size={width / 12} color="white" />
                                                <View style={{ flexDirection: 'column', marginLeft: width / 60 }}>
                                                    <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 38, width: w / 4.5, color: 'white', transform: transform(), textAlign: textAlign() }}>{i18n.t('remainingSeats')}</Text>
                                                    <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 22, width: w / 5, color: 'white', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{data.occupied ? data.capacity - data.occupied : data.capacity - 0}</Text>

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

export default ClassHome