import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, RefreshControl, Image } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { DrawerActions } from 'react-navigation-drawer';
import { getAllPackage } from '../../utils/api/package'
import { getCurrency, getDesignationById, getUserDetailsById } from '../../utils/api/authorization'
import sq from '../../assets/images/sq.jpg'
import i18n from 'i18n-js';

class PackageHome extends Component {
    _isMounted = false

    state = {
        currency: '',
        role: '',
        modalVisible: false,
        rtl: null,
        packages: [],
        userPackages: [],
        refreshing: false,
        notifications: [{}]
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible, forgotPass: '' });
    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {

            const willFocusSubscription = this.props.navigation.addListener(
                'willFocus',
                () => {
                    this._onRefresh()
                }
            )
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
            refreshing: true
        })
        AsyncStorage.getItem('authedToken').then(token => {
            const designation = jwtDecode(token).designation
            const userId = jwtDecode(token).credential
            getDesignationById(designation).then(res => {
                if (res) {
                    this.setState({
                        role: res.data.response.designationName
                    }, () => {
                        const { role } = this.state
                        if (role === 'Member') {
                            getUserDetailsById(userId).then(res => {
                                if (res) {
                                    this.setState({
                                        userPackages: res.data.response.packageDetails,
                                        refreshing: false
                                    })
                                }
                            })
                        }
                    })
                }
            })
        })

        getAllPackage().then(res => {
            if (res) {
                this.setState({
                    packages: res.data.response === null ? [] : res.data.response.filter(data => new Date().setHours(0, 0, 0, 0) <= new Date(data.endDate))
                })
            }
        })
    }

    render() {
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <View elevation={3} style={{ width: w, height: width / 7, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />
                        </TouchableOpacity>

                        <Text style={{ marginLeft: width / 30, top: width / 30, fontSize: width / 18, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('packages')}</Text>

                    </View>

                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        progressBackgroundColor='#1976d2'
                        colors={['white', 'yellow']}
                    />
                }>

                    {this.state.packages.map((data, i) => {
                        const img = `${URL}/${data.image.path.replace(/\\/g, "/")}`
                        const packageImage = JSON.parse(JSON.stringify({ uri: img }))

                        return (
                            <TouchableOpacity key={i} onPress={() => this.state.userPackages.length > 0 ? this.setModalVisible(true) : this.props.navigation.navigate('PackageDetails', { id: data._id })}>
                                <Image resizeMode='stretch' style={{ width: w / 1.1, height: height / 3, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20 }} source={packageImage} />
                                <View key={i} style={{ backgroundColor: data.color, width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', borderRadius: 3, paddingBottom: width / 20 }}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ width: w / 1.7, fontSize: width / 21, fontWeight: 'bold', color: 'white', marginLeft: width / 30, transform: transform(), textAlign: textAlign(), marginTop: width / 60 }}>{data.packageName}</Text>
                                        <Text numberOfLines={2} style={{ width: w / 1.2, color: 'white', fontSize: width / 32, marginLeft: width / 30, transform: transform(), textAlign: textAlign(), marginTop: width / 80 }}>{data.description}.</Text>

                                    </View>
                                    <View style={{ width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon name="attendance" size={width / 22} color="white" />
                                            <Text style={{ fontSize: width / 25, color: 'white', transform: transform(), textAlign: 'center', marginLeft: width / 50 }}>{data.period.periodName}</Text>
                                        </View>
                                        <Text style={{ fontSize: width / 18, color: 'white', textAlign: 'center', fontWeight: 'bold', transform: transform(), width: w / 4, bottom: 5 }}>{this.state.currency} {(data.amount).toFixed(3)}</Text>
                                    </View>

                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View style={{ backgroundColor: 'white', height: width / 1.8, width: width - 40, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width / 1.15, marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0.5, paddingBottom: width / 60, borderBottomColor: '#333' }}>
                            <Text style={{ fontSize: width / 20, color: '#333', marginLeft: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], textAlign: this.state.isRTL ? 'right' : 'left' }}>Alert</Text>
                            <TouchableOpacity onPress={() => { this.setModalVisible(false) }}>
                                <Icon name="close" size={width / 20} style={{ marginRight: width / 30 }} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: width / 20, marginLeft: width / 30 }}>
                            <Text style={{ fontSize: width / 22, color: '#333' }}>{i18n.t('alreadyRegistered')}</Text>
                        </View>

                    </View>
                </Modal>
            </View>
        )
    }
}

export default PackageHome