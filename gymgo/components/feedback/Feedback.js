import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, Image, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, URL, paddingLeftWater, paddingRightWater } from '../../utils/api/helpers'
import { showMessage } from 'react-native-flash-message';
import { getCurrency, getMemberById } from '../../utils/api/authorization'
import { addFeedback, getMemberFeedback } from '../../utils/api/feedback'
import Loader from '../../utils/resources/Loader'
import i18n from 'i18n-js'
class Feedback extends Component {
    _isMounted = false

    state = {
        currency: '',
        rtl: null,
        userDetails: '',
        userCredentials: '',
        branch: '',
        refreshing: false,
        modalVisible: false,
        memberId: '',
        loading: false,
        comp: false,
        suggs: true,
        description: '',
        data: [],
        comment: ''

    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            const unsubscribe = this.props.navigation.addListener('didFocus', () => {
                AsyncStorage.getItem('authedToken').then((token) => {
                    const memberId = jwtDecode(token).userId
                    this.setState({
                        memberId,
                        loading: true
                    }, () => {
                        getMemberById(this.state.memberId).then(res => {
                            if (res) {
                                this.setState({
                                    userDetails: res.data.response,
                                    userCredentials: res.data.response.credentialId,
                                    branch: res.data.response.branch._id,
                                    loading: false
                                }, () => {
                                    this._onRefresh()
                                })
                            }
                        })
                    })
                })
                getCurrency().then(res => {
                    if (res) {
                        this.setState({
                            currency: res.data.response
                        })
                    }
                })
            })
        }
    }



    componentWillUnmount() {
        this._isMounted = false
    }

    setModalVisible(visible, comment) {
        this.setState({ modalVisible: visible, comment });
    }

    _onRefresh = () => {
        this.setState({
            refreshing: true
        })

        const obj = {
            member: this.state.memberId
        }
        getMemberFeedback(obj).then(res => {
            if (res) {
                this.setState({
                    data: res.data.response,
                    refreshing: false
                })
            }
        })

    }

    onSubmit = () => {
        if (this.state.description !== '') {
            this.setState({
                loading: true
            })
            const obj = {
                member: this.state.memberId,
                optionType: this.state.comp === true ? 'Complaints' : 'Suggestions',
                branch: this.state.branch,
                description: this.state.description
            }
            addFeedback(obj).then(res => {
                if (res) {
                    this.setState({
                        description: '',
                        loading: false
                    }, () => this._onRefresh())
                    showMessage({
                        message: "Added Feedback",
                        type: "success",
                    })
                } else {
                    this.setState({ loading: false })
                }
            })
        } else {
            alert(i18n.t('allTheFieldsAreRequired'))
        }
    }

    renderBackgroundColor = (i) => {
        if (i % 2 === 0) {
            return '#eee'
        } else {
            return 'white'
        }
    }

    render() {
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <Loader loading={this.state.loading} text='Registering User' />

                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        progressBackgroundColor='#1976d2'
                        colors={['white', 'yellow']}
                    />}>
                    <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="home" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                            <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('feedbacks')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', marginTop: width / 30, paddingBottom: width / 30, borderRadius: 2 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <TouchableOpacity onPress={() => this.setState({ comp: true, suggs: false })}>
                                <View style={{ flexDirection: 'row' }}>
                                    {this.state.comp === true ? <Icon name='transport-status' size={width / 15} style={{ transform: transform() }} color="#7e57c2" /> : <View style={{ width: width / 15, height: width / 15, borderRadius: width / 30, borderWidth: 1, borderColor: 'grey' }} />}
                                    <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 24, color: '#333', marginLeft: width / 30 }}>{i18n.t('complaints')}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ comp: false, suggs: true })}>
                                <View style={{ flexDirection: 'row' }}>
                                    {this.state.suggs === true ? <Icon name='transport-status' size={width / 15} style={{ transform: transform() }} color="#7e57c2" /> : <View style={{ width: width / 15, height: width / 15, borderRadius: width / 30, borderWidth: 1, borderColor: 'grey' }} />}
                                    <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 24, color: '#333', marginLeft: width / 30 }}>{i18n.t('suggestions')}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', marginTop: width / 30, paddingBottom: width / 20, borderRadius: 2 }}>
                        <Text style={{ marginTop: width / 30, marginLeft: width / 30, fontSize: width / 25, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('description')}</Text>
                        <View style={{ marginTop: width / 20, marginLeft: 'auto', marginRight: 'auto', transform: transform() }}>
                            <TextInput
                                multiline={true}
                                style={{ width: w / 1.2, padding: width / 30, paddingBottom: width / 5, borderWidth: 1, backgroundColor: '#fafafa', borderRadius: 5, borderColor: '#cfd2d3', fontSize: width / 25, textAlign: textAlign() }}
                                autoCapitalize='none'
                                onChangeText={(text) => this.setState({ description: text })}
                                value={this.state.description}
                            />

                        </View>
                    </View>
                    <View style={{ width: w, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', marginTop: width / 30, paddingBottom: width / 20, borderRadius: 2 }}>
                        <TouchableOpacity onPress={() => this.onSubmit()}>
                            <View style={{ width: width - 80, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginTop: width / 20, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                                <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50, transform: transform() }}>{i18n.t('submit')}</Text>
                            </View>
                        </TouchableOpacity>
                        <Text style={{ marginTop: width / 15, marginLeft: width / 30, fontSize: width / 22, color: 'grey', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('feedbackDetails')}</Text>
                        {this.state.data.map((data, i) => {
                            return (
                                <View style={{ width: w, marginLeft: 'auto', marginRight: 'auto', backgroundColor: this.renderBackgroundColor(i), marginTop: width / 30, paddingBottom: width / 20, borderRadius: 2 }} >
                                    <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 60 }} >
                                        <Text style={{ fontSize: width / 35, color: 'orange', transform: transform(), textAlign: textAlign() }}>{new Date(data.date).getDate()}/{new Date(data.date).getMonth() + 1}/{new Date(data.date).getFullYear()}</Text>
                                        <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 60, flexDirection: 'row', justifyContent: 'space-between' }} >
                                            <Text style={{ fontSize: width / 30, color: '#333', width: w / 1.8, transform: transform(), textAlign: textAlign() }}>{data.description}</Text>
                                            <View style={{ flexDirection: 'row', marginTop: 'auto', marginBottom: 'auto' }}>
                                                <Text style={{ fontSize: width / 28, color: data.optionType === 'Complaints' ? '#4caf50' : 'orange', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{data.optionType}</Text>
                                                {data.adminComment ? <TouchableOpacity onPress={() => { this.setModalVisible(true, data.adminComment) }}>
                                                    <Icon name="attendance" size={width / 20} style={{ marginLeft: width / 30, transform: transform() }} color="grey" /></TouchableOpacity>
                                                    : <View><Icon name="attendance" size={width / 20} style={{ marginLeft: width / 30, transform: transform() }} color="transparent" /></View>}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )

                        })}

                    </View>


                </ScrollView>
                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View elevation={10} style={{ borderWidth: 1, borderColor: '#ddd', backgroundColor: 'white', height: height / 3, width: width - 40, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width / 1.15, marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0.5, paddingBottom: width / 60, borderBottomColor: '#333' }}>
                            <Text style={{ fontSize: width / 20, color: '#333', marginLeft: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], textAlign: this.state.isRTL ? 'right' : 'left' }}>{i18n.t('gymOwnerComments')}</Text>
                            <TouchableOpacity onPress={() => { this.setModalVisible(false) }}>
                                <Icon name="close" size={width / 20} style={{ marginRight: width / 30 }} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>
                            <Text style={{ fontSize: width / 25, color: '#333', marginLeft: width / 30, marginTop: width / 30 }}>{this.state.comment}</Text>

                        </ScrollView>
                    </View>
                </Modal>
            </View>
        )
    }
}

export default Feedback