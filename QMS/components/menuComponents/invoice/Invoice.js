import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../../utils/api/helpers'
import { createStackNavigator } from 'react-navigation-stack'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { createAppContainer } from 'react-navigation'
import InvoiceDetails from './InvoiceDetails'
import PackagesInvoice from './PackagesInvoice'
import TrainerInvoice from './TrainerInvoice'
import i18n from 'i18n-js'


class Invoice extends Component {
    _isMounted = false

    state = {
        currency: '',
        rtl: null,
        packages: [],
        userDetails: '',
        userCredentials: '',
        modalVisible: false,
    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {


        }
    }


    componentWillUnmount() {
        this._isMounted = false
    }



    render() {
        const Tabs = createMaterialTopTabNavigator({
            PackagesInvoice: {
                screen: PackagesInvoice,
                navigationOptions: {
                    tabBarLabel: i18n.t('packages'),
                }
            },
            TrainerInvoice: {
                screen: TrainerInvoice,
                navigationOptions: {
                    tabBarLabel: i18n.t('trainer'),
                }
            },
        }, {
            navigationOptions: {
                header: null
            },
            swipeEnabled: true,
            animateStyle: false,
            tabBarOptions: {
                scrollEnabled: true,
                activeTintColor: '#1976d2',
                inactiveTintColor: '#b0b0b0',
                upperCaseLabel: false,
                labelStyle: {
                    fontSize: width / 25,

                },
                style: {
                    paddingBottom: width / 80,
                    marginTop: 0,
                    backgroundColor: 'white',
                },
                tabStyle: {
                    width: w / 2,
                },
                indicatorStyle: {
                    backgroundColor: '#1976d2',
                },
            },
        })

        const NavigationPageNavigator = createStackNavigator({
            Home: {
                screen: Tabs,
                navigationOptions: {
                    header: null,
                },
            },
            InvoiceDetails: {
                screen: InvoiceDetails,
                navigationOptions: {
                    header: null,
                },
            },

        })

        const AppNavigator = createAppContainer(NavigationPageNavigator)
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="home" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                        <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('invoices')}</Text>
                    </TouchableOpacity>
                </View>
                <AppNavigator />
            </View >
        )
    }
}

export default Invoice