import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, Image, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, URL, paddingLeftWater, paddingRightWater } from '../../utils/api/helpers'
import { getAllBranch } from '../../utils/api/authorization'
import Loader from '../../utils/resources/Loader'
import i18n from 'i18n-js';

export default class ContactHome extends React.Component {
    _isMounted = false

    state = {
        branches: []
    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            getAllBranch().then(res => {
                if (res) {
                    this.setState({
                        branches: res.data.response
                    })
                }
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <Loader loading={this.state.loading} text='Registering User' />
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>

                    <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="home" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                            <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('contactUs')}</Text>
                        </TouchableOpacity>
                    </View>
                    {this.state.branches.map((data, i) => {
                        return (
                            <View key={i} style={{ width: w / 1.1, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20, paddingBottom: width / 30, borderRadius: 3 }}>
                                <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#ddd', marginTop: width / 30 }}>
                                    <Text style={{ fontSize: width / 20, color: '#333', fontWeight: 'bold', marginLeft: width / 30, paddingBottom: width / 80, transform: transform(), textAlign: textAlign() }}>{data.branchName}</Text>
                                </View>
                                <View style={{ marginTop: width / 50, width: w / 1.2, marginLeft: 'auto', marginRight: 'auto' }}>
                                    <View style={{ flexDirection: 'row', marginTop: width / 30 }}>
                                        <Icon name="call" size={width / 20} style={{ marginLeft: width / 30 }} color="orange" />
                                        <Text style={{ fontSize: width / 28, color: '#333', marginLeft: width / 30, transform: transform(), textAlign: textAlign() }}>{data.mobile}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: width / 30 }}>
                                        <Icon name="email" size={width / 20} style={{ marginLeft: width / 30 }} color="orange" />
                                        <Text style={{ fontSize: width / 28, color: '#333', marginLeft: width / 30, transform: transform(), textAlign: textAlign() }}>{data.email}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: width / 30 }}>
                                        <Icon name="navigation-transport" size={width / 20} style={{ marginLeft: width / 30 }} color="orange" />
                                        <Text style={{ fontSize: width / 28, color: '#333', marginLeft: width / 30, transform: transform(), textAlign: textAlign() }}>{data.address}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Maps', { id: data._id })}>
                                    <View style={{ width: w / 2, backgroundColor: '#66bb6a', paddingBottom: width / 50, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10, marginTop: width / 20 }}>
                                        <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50, transform: transform() }}>{i18n.t('showRoute')}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    })}


                </ScrollView>
            </View >
        )
    }

}
