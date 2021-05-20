import React from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import i18n from 'i18n-js';
import { createAppContainer } from 'react-navigation'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { createStackNavigator } from 'react-navigation-stack'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import Reward from './Reward'
import GiftCards from './GiftCards'
import History from './History'
import RewardDetails from './RewardDetails'
import GiftCardDetails from './GiftCardDetails'
import ReferAFriendPage from '../common/ReferAFriendPage'
export default class RewardMember extends React.Component {
    _isMounted = false

    state = {

    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {

        }
    }


    componentWillUnmount() {
        this._isMounted = false
    }

    static navigationOptions = ({ navigation }) => {
        return {
            tabBarLabel: i18n.t('reward'),
        }
    }

    render() {
        const Tabs = createMaterialTopTabNavigator({
            Reward: {
                screen: Reward,
                navigationOptions: {
                    tabBarLabel: i18n.t('rewards'),
                }
            },
            GiftCards: {
                screen: GiftCards,
                navigationOptions: {
                    tabBarLabel: i18n.t('giftCards'),
                }
            }, History: {
                screen: History,
                navigationOptions: {
                    tabBarLabel: i18n.t('history'),
                }
            },
        }, {
            navigationOptions: {
                header: null
            },
            swipeEnables: false,
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
                    width: w / 3,
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
            RewardDetails: {
                screen: RewardDetails,
                navigationOptions: {
                    header: null,
                },
            },
            GiftCardDetails: {
                screen: GiftCardDetails,
                navigationOptions: {
                    header: null,
                },
            },
            ReferAFriendPage: {
                screen: ReferAFriendPage,
                navigationOptions: {
                    header: null,
                },
            }
        })

        const AppNavigator = createAppContainer(NavigationPageNavigator)
        return (
            <View style={{ flex: 1 }}>
                <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="home" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                        <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('reward')}</Text>
                    </TouchableOpacity>
                </View>
                <AppNavigator />
            </View>
        )
    }
}