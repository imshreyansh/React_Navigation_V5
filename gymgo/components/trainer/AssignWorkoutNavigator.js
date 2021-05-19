import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, ActionSheetIOS, TouchableOpacity, TextInput, ScrollView, StyleSheet, Picker, Image } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, isTablet, URL } from '../../utils/api/helpers'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { SearchBar } from 'react-native-elements';
import i18n from 'i18n-js'
import AssignWorkout from './AssignWorkout'
import AddedWorkoutByTrainer from './AddedWorkoutByTrainer'


class AssignWorkoutNavigator extends Component {

    _isMounted = false

    state = {

        rtl: null,
        userId: ''
    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            AsyncStorage.getItem('authedToken').then((token) => {
                const userId = jwtDecode(token).userId

                this.setState({
                    userId,

                })
            })

        }


    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {

        const Tabs = createMaterialTopTabNavigator({
            AssignWorkout: {
                screen: AssignWorkout,
                navigationOptions: {
                    tabBarLabel: i18n.t('addWorkout'),
                }
            },
            AddedWorkoutByTrainer: {
                screen: AddedWorkoutByTrainer,
                navigationOptions: {
                    tabBarLabel: i18n.t('updateWorkout'),
                }
            },

        }, {
            navigationOptions: {
                header: null
            },
            swipeEnabled: false,
            animateStyle: false,
            tabBarOptions: {
                scrollEnabled: true,
                activeTintColor: '#7e57c2',
                inactiveTintColor: '#b0b0b0',
                upperCaseLabel: false,
                labelStyle: {
                    fontSize: width / 25,

                },
                style: {
                    height: width / 7,
                    marginTop: 0,
                    backgroundColor: 'white',

                },
                tabStyle: {
                    width: w / 2,
                },
                indicatorStyle: {
                    backgroundColor: '#7e57c2',
                },
            }
        })

        const NavigationPageNavigator = createStackNavigator({
            Home: {
                screen: Tabs,
                navigationOptions: {
                    header: null,
                },
            },
        })
        const AppNavigator = createAppContainer(NavigationPageNavigator)
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: 'white' }}>

                <View elevation={3} style={{ width: w, height: width / 7, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />
                        </TouchableOpacity>
                        <Text style={{ marginLeft: width / 30, top: width / 30, fontSize: width / 18, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('workouts')}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, transform: transform() }}>
                    <AppNavigator />
                </View>
            </View>
        )
    }
}

export default AssignWorkoutNavigator