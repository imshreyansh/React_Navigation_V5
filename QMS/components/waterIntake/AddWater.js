import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, Image, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, URL, paddingLeftWater, paddingRightWater } from '../../utils/api/helpers'
import { getAllPackage } from '../../utils/api/package'
import { getCurrency, getMemberById } from '../../utils/api/authorization'
import { addWaterInTake, getMemberWaterInTake } from '../../utils/api/waterIntake'
import Loader from '../../utils/resources/Loader'
import * as Progress from 'react-native-progress';
import one from '../../assets/images/one.png'
import two from '../../assets/images/two.png'
import three from '../../assets/images/three.png'
import four from '../../assets/images/four.png'
import five from '../../assets/images/five.png'
import six from '../../assets/images/six.png'
import i18n from 'i18n-js';

export default class AddWater extends React.Component {
    _isMounted = false

    state = {
        currency: '',
        rtl: null,
        userDetails: '',
        userCredentials: '',
        refreshing: false,
        selection: '250',
        modalVisible: false,
        customizeWaterLevel: '',
        ml: 250,
        decrementActive: false,
        limit: 1800,
        height: '',
        weight: '',
        loading: false,
        consume: 0,
        records: [],
        waterIntakeDetails: '',
        percentage: 0


    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            const unsubscribe = this.props.navigation.addListener('didFocus', () => {
                AsyncStorage.getItem('authedToken').then((token) => {
                    const userId = jwtDecode(token).userId

                    this.setState({
                        userId,

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
            })

        }
    }


    componentWillUnmount() {
        this._isMounted = false
    }


    setModalVisible(visible) {
        this.setState({ modalVisible: visible, forgotPass: '' });
    }

    _onRefresh = () => {
        this.setState({
            refreshing: true
        })

        getMemberById(this.state.userId).then(res => {
            if (res) {

                this.setState({
                    userDetails: res.data.response,
                    userCredentials: res.data.response.credentialId,
                    height: res.data.response.height === null ? '' : res.data.response.height,
                    weight: res.data.response.weight === null ? '' : res.data.response.weight,
                    refreshing: false
                }, () => {
                    const data = {
                        memberId: this.props.navigation.getParam('id'),
                        from: new Date(),
                        to: new Date()
                    }

                    getMemberWaterInTake(data).then(res => {
                        if (res) {
                            this.setState({
                                waterIntakeDetails: res.data.response,
                                consume: res.data.response[0].consume,
                                records: res.data.response[0].record,

                            }, () => {
                                const data = JSON.stringify(res.data.response[0].consume / res.data.response[0].target)
                                const dataTwo = data === '1' ? '1' : data.split('.')
                                const dataThree = data === '1' ? '1' : dataTwo[1].split('')[0]
                                const percentage = data === '1' ? JSON.parse(dataTwo) : JSON.parse(`${dataTwo[0]}.${dataThree[0]}`)
                                this.setState({ percentage })
                            })
                        }
                    })
                })
            }
        })


    }

    onPressDecrement = () => {
        if (this.state.ml > JSON.parse(this.state.selection)) {
            if (this.state.selection === '100') {
                this.setState({
                    ml: this.state.ml - 100
                })
            } else if (this.state.selection === '250') {
                this.setState({
                    ml: this.state.ml - 250
                })
            } else if (this.state.selection === '300') {
                this.setState({
                    ml: this.state.ml - 300
                })
            } else if (this.state.selection === '400') {
                this.setState({
                    ml: this.state.ml - 400
                })
            } else if (this.state.selection === '500') {
                this.setState({
                    ml: this.state.ml - 500
                })
            } else if (this.state.selection === '600') {
                this.setState({
                    ml: this.state.ml - 600
                })
            }
        } else {
            this.setState({
                decrementActive: false
            })
        }
    }

    onPressIncrement = () => {

        this.setState({
            decrementActive: true
        })
        if (this.state.selection === '100') {
            this.setState({
                ml: JSON.parse(this.state.ml) + 100
            })
        } else if (this.state.selection === '250') {
            this.setState({
                ml: JSON.parse(this.state.ml) + 250
            })
        } else if (this.state.selection === '300') {
            this.setState({
                ml: JSON.parse(this.state.ml) + 300
            })
        } else if (this.state.selection === '400') {
            this.setState({
                ml: JSON.parse(this.state.ml) + 400
            })
        } else if (this.state.selection === '500') {
            this.setState({
                ml: JSON.parse(this.state.ml) + 500
            })
        } else if (this.state.selection === '600') {
            this.setState({
                ml: JSON.parse(this.state.ml) + 600
            })
        }
    }

    onPressSubmit = () => {
        this.setState({
            loading: true
        })
        const data = {
            memberId: this.props.navigation.getParam('id'),
            target: this.props.navigation.getParam('target'),
            date: new Date(),
            consume: this.state.ml
        }
        addWaterInTake(data).then(res => {

            if (res) {
                this.setState({
                    loading: false
                }, () => {
                    this._onRefresh()
                })
            } else {
                this.setState({
                    loading: false
                })
            }
        })
    }



    onPressCustom = () => {
        this.setState({
            loading: true
        })
        const data = {
            memberId: this.props.navigation.getParam('id'),
            target: this.props.navigation.getParam('target'),
            date: new Date(),
            consume: this.state.customizeWaterLevel
        }

        addWaterInTake(data).then(res => {
            if (res) {
                this.setState({
                    loading: false
                }, () => {
                    this._onRefresh()
                })
            } else {
                this.setState({
                    loading: false
                })
            }
        })

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

                    <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                                <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('addWater')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ width: w, height: height / 3, backgroundColor: '#42a5f5' }}>
                        <View style={{ flexDirection: 'row', marginTop: width / 20 }}>
                            <Text style={{ fontSize: width / 12, fontWeight: 'bold', color: 'white', marginLeft: width / 10, transform: transform() }}>{this.state.consume}</Text>
                            <Text style={{ fontSize: width / 25, fontWeight: 'bold', color: 'orange', marginLeft: width / 30, marginTop: 'auto', marginBottom: 'auto', transform: transform() }}>{i18n.t('of')}</Text>
                            <Text style={{ fontSize: width / 12, fontWeight: 'bold', color: 'white', marginLeft: width / 30, transform: transform() }}>{this.props.navigation.getParam('target')}</Text>
                            <Text style={{ fontSize: width / 25, fontWeight: 'bold', color: 'blue', marginLeft: width / 80, marginTop: 'auto', marginBottom: 'auto', top: 5, transform: transform() }}>ml</Text>
                        </View>
                        <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <Progress.Bar progress={this.state.percentage} width={width / 1.2} borderColor='#42a5f5' unfilledColor='white' color='orange' height={height / 50} style={{ borderRadius: width / 2.4 }} />
                        </View>
                    </View>
                    <View style={{ width: w / 1.3, borderRadius: 3, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', height: height / 2.5, bottom: height / 8 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', width: w / 1.5, marginTop: width / 20 }}>
                            <TouchableOpacity onPress={() => this.setState({ selection: '100', ml: 100, decrementActive: false })}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Icon name="ml" size={width / 10} color={this.state.selection === '100' ? 'orange' : "#333"} />
                                    <Text style={{ fontSize: width / 25, color: this.state.selection === '100' ? 'orange' : "#333", textAlign: 'center', transform: transform() }}>100ml</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ selection: '250', ml: 250, decrementActive: false })}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Icon name="ml1" size={width / 10} color={this.state.selection === '250' ? 'orange' : "#333"} />
                                    <Text style={{ fontSize: width / 25, color: this.state.selection === '250' ? 'orange' : "#333", textAlign: 'center', transform: transform() }}>250ml</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ selection: '300', ml: 300, decrementActive: false })}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Icon name="ml2" size={width / 10} color={this.state.selection === '300' ? 'orange' : "#333"} />
                                    <Text style={{ fontSize: width / 25, color: this.state.selection === '300' ? 'orange' : "#333", textAlign: 'center', transform: transform() }}>300ml</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', width: w / 1.5, marginTop: height / 25 }}>
                            <TouchableOpacity onPress={() => this.setState({ selection: '400', ml: 400, decrementActive: false })}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Icon name="ml3" size={width / 10} color={this.state.selection === '400' ? 'orange' : "#333"} />
                                    <Text style={{ fontSize: width / 25, color: this.state.selection === '400' ? 'orange' : "#333", textAlign: 'center', transform: transform() }}>400ml</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ selection: '500', ml: 500, decrementActive: false })}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Icon name="ml4" size={width / 10} color={this.state.selection === '500' ? 'orange' : "#333"} />
                                    <Text style={{ fontSize: width / 25, color: this.state.selection === '500' ? 'orange' : "#333", textAlign: 'center', transform: transform() }}>500ml</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ selection: '600', ml: 600, decrementActive: false })}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Icon name="ml4" size={width / 10} color={this.state.selection === '600' ? 'orange' : "#333"} />
                                    <Text style={{ fontSize: width / 25, color: this.state.selection === '600' ? 'orange' : "#333", textAlign: 'center', transform: transform() }}>600ml</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                            <View style={{ borderRadius: 3, width: w / 2, marginTop: height / 25, marginLeft: 'auto', marginRight: 'auto', padding: width / 30, backgroundColor: 'orange' }}>
                                <Text style={{ fontSize: width / 22, color: 'white', fontWeight: 'bold', textAlign: 'center', transform: transform() }}>{i18n.t('customize')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: w / 1.5, marginLeft: 'auto', marginRight: 'auto', bottom: height / 25 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            {this.state.decrementActive === true ?
                                <TouchableOpacity onPress={() => this.onPressDecrement()}>
                                    <View style={{ width: width / 10, height: width / 10, borderRadius: width / 20, borderColor: 'grey', marginLeft: width / 30, backgroundColor: '#8bc34a', marginTop: 'auto', marginBottom: 'auto' }}>
                                        <Text style={{ color: 'white', fontSize: width / 12, textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', bottom: 2 }}>-</Text>
                                    </View>
                                </TouchableOpacity> :

                                <View style={{ width: width / 10, height: width / 10, borderRadius: width / 20, borderColor: 'grey', marginLeft: width / 30, backgroundColor: '#ddd', marginTop: 'auto', marginBottom: 'auto' }}>
                                    <Text style={{ color: 'white', fontSize: width / 12, textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', bottom: 2 }}>-</Text>
                                </View>}
                            <Image source={this.state.selection === '100' ? one : this.state.selection === '250' ? two : this.state.selection === '300' ? three : this.state.selection === '400' ? four : this.state.selection === '500' ? five : this.state.selection === '600' ? six : 'one'} style={{ width: width / 5, height: width / 5, transform: transform() }} />
                            <TouchableOpacity onPress={() => this.onPressIncrement()}>
                                <View style={{ width: width / 10, height: width / 10, borderRadius: width / 20, marginLeft: width / 30, backgroundColor: '#8bc34a', marginTop: 'auto', marginBottom: 'auto' }}>
                                    <Text style={{ color: 'white', fontSize: width / 12, textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', bottom: 2 }}>+</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <Text style={{ fontSize: width / 28, transform: transform() }}>{this.state.ml}ml</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => this.onPressSubmit()}>
                        <View style={{ width: w / 2, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                            <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50, transform: transform() }}>{i18n.t('submit')}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontWeight: 'bold', fontSize: width / 25, transform: transform() }}>{i18n.t('records')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: width / 30, marginTop: 'auto', marginBottom: 'auto', transform: transform() }}>{new Date().getDate()}/{new Date().getMonth()}/{new Date().getFullYear()}</Text>
                            <Icon name="attendance" size={width / 25} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 50 }} color="#333" />

                        </View>

                    </View>
                    <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#86C6DB', marginTop: width / 30, paddingBottom: width / 30 }}>
                        {this.state.records.map((data, i) => {
                            var shours = new Date(data.date).getHours()
                            var sminutes = new Date(data.date).getMinutes()
                            var sampm = shours >= 12 ? 'PM' : 'AM'
                            shours = shours % 12
                            shours = shours ? shours : 12  // the hour '0' should be '12'
                            var startTime = shours + ':' + `${("0" + sminutes).slice(-2)}` + ' ' + sampm
                            return (
                                <View key={i}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon name="clock" size={width / 20} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 50 }} color="#333333" />
                                            <Text style={{ fontWeight: 'bold', color: '#333333', fontSize: width / 30, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30, transform: transform() }}>{startTime}</Text>
                                        </View>
                                        <View>
                                            <Text style={{ fontWeight: 'bold', fontSize: width / 25, color: '#333333', paddingRight: width / 40, transform: transform() }}>{data.consume}ml</Text>
                                        </View>
                                    </View>
                                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#1067B9', width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 50 }} />
                                </View>
                            )
                        })}



                    </View>
                </ScrollView>

                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View elevation={10} style={{ borderWidth: 1, borderColor: '#ddd', backgroundColor: 'white', height: height / 1.6, width: width - 40, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width / 1.15, marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0.5, paddingBottom: width / 60, borderBottomColor: '#333' }}>
                            <Text style={{ fontSize: width / 20, color: '#333', marginLeft: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], textAlign: this.state.isRTL ? 'right' : 'left' }}>{i18n.t('customize')}</Text>
                            <TouchableOpacity onPress={() => { this.setModalVisible(false) }}>
                                <Icon name="close" size={width / 20} style={{ marginRight: width / 30 }} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: height / 25, marginLeft: width / 30 }}>
                            <Text style={{ color: 'grey', fontSize: width / 15, fontWeight: 'bold' }}>{new Date().getDate()}/{new Date().getMonth()}/{new Date().getFullYear()}</Text>
                        </View>
                        <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: height / 15 }}>
                            <Image source={four} style={{ width: width / 5, height: width / 5, transform: transform() }} />
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto', width: width - 60, marginTop: height / 25, justifyContent: 'center' }}>


                            <View style={{ width: w / 2, backgroundColor: '#eeeeee', borderRadius: 3, transform: transform() }}>
                                <TextInput
                                    keyboardType='numeric'
                                    autoCapitalize='words'
                                    onChangeText={(text) => this.setState({ customizeWaterLevel: text })}
                                    value={this.state.customizeWaterLevel}
                                    style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 2.1, marginLeft: 'auto', marginRight: 'auto', height: width / 8, paddingLeft: paddingLeftWater(), paddingRight: paddingRightWater() }}
                                    placeholderTextColor='#333'
                                    placeholder={i18n.t('enterWaterLevel')} />

                            </View>
                            <View style={{ width: w / 12, backgroundColor: '#eeeeee', borderRadius: 3, transform: transform(), marginLeft: width / 30 }}>

                                <Text style={{ fontSize: width / 25, color: 'grey', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', fontWeight: 'bold', transform: transform() }}>ml</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => this.onPressCustom()}>
                            <View style={{ width: w / 2, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10, marginTop: height / 25 }}>
                                <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50 }}>{i18n.t('submit')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View >
        )
    }

}
