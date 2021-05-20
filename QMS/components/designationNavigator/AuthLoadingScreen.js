import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import jwtDecode from 'jwt-decode'
import { Text, View, AppState, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AuthLoader from '../../utils/resources/AuthLoader'
import { height, Icon, width, w, h } from '../../utils/resources/helpers';
import i18n from 'i18n-js'
import Login from '../authorization/Login'
import SignUp from '../authorization/SignUp'
import ForgotPassword from '../authorization/ForgotPassword'
import MobileLogin from '../authorization/MobileLogin'
import UserProfile from '../profile/UserProfile'
import Home from '../dashboard/Home'
import Favourites from '../dashboard/Favourites'
import MyTickets from '../dashboard/MyTickets'
import Notifications from '../dashboard/Notifications'
import DrawerMenuBar from '../menu/DrawerMenuBar'
import Settings from '../menu/Settings'


export default class AuthLoadingScreen extends React.Component {
    constructor() {
        super()
        this.callNav()
    }
    state = {
        loading: true,
        savedDesignation: '',
        doneFingerAuth: '',
        reactToken: '',
        navigation: '',
        getRole: '',
        status: '',
        role: ''
    }

    componentDidMount() {
        this._isMounted = true
        setTimeout(() => {
            this.setState({
                loading: false
            })
        }, 5000)
    }


    callNav = async () => {
        const { role } = this.props.route !== undefined ? this.props.route.params : ''
        this.setState({
            role
        })
    }

    render() {
        const { role } = this.state
        const RootStack = createStackNavigator();
        return (
            <View style={{ flex: 1 }}>
                <AuthLoader loading={this.state.loading} text='Loading' />
                {role === '' || role === 'Auth' ?
                    <RootStack.Navigator>
                        <RootStack.Screen name="AuthStack" component={AuthStack} options={{ headerShown: false }} />
                    </RootStack.Navigator> : role === 'Member' ?
                        <RootStack.Navigator>
                            <RootStack.Screen name="UserDrawerNavigatorEnglish" component={UserDrawerNavigatorEnglish} options={{ headerShown: false }} />
                        </RootStack.Navigator> :
                        <RootStack.Navigator>
                            <RootStack.Screen name="AuthStack" component={AuthStack} options={{ headerShown: false }} />
                        </RootStack.Navigator>}
            </View>
        )
    }
}

//*******************************************************************************************************************************************************************
//Navigators

const AuthStackNavigator = createStackNavigator();

const AuthStack = () => {
    return (
        <AuthStackNavigator.Navigator>
            <AuthStackNavigator.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <AuthStackNavigator.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
            <AuthStackNavigator.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
            <AuthStackNavigator.Screen name="MobileLogin" component={MobileLogin} options={{ headerShown: false }} />
        </AuthStackNavigator.Navigator>
    )
}

const UserTabNavigator = createBottomTabNavigator();

const UserTab = () => {
    return (
        <UserTabNavigator.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Home') {
                    iconName = 'home'
                } else if (route.name === 'Favourites') {
                    iconName = 'bmi-tracker'
                } else if (route.name === 'MyTickets') {
                    iconName = 'water-intake'
                } else if (route.name === 'Notifications') {
                    iconName = 'water-intake'
                }
                return <Icon name={iconName} size={25} color={color} />;
            },
        })}
            tabBarOptions={{ activeTintColor: '#1976d2' }}>
            <UserTabNavigator.Screen name="Home" component={Home} />
            <UserTabNavigator.Screen name="Favourites" component={Favourites} />
            <UserTabNavigator.Screen name="MyTickets" component={MyTickets} />
            <UserTabNavigator.Screen name="Notifications" component={Notifications} />
        </UserTabNavigator.Navigator>
    )
}

const UserStackNavigator = createStackNavigator();

const UserStack = () => {
    return (
        <UserStackNavigator.Navigator>
            <UserStackNavigator.Screen name="UserTab" component={UserTab} options={{ headerShown: false }} />
            <UserStackNavigator.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        </UserStackNavigator.Navigator>
    )
}

const UserDrawerNavigator = createDrawerNavigator();

const UserDrawerNavigatorEnglish = () => {
    return (
        <UserDrawerNavigator.Navigator drawerType={'slide'} drawerPosition={'left'} drawerContent={() => <DrawerMenuBar />}>
            <UserDrawerNavigator.Screen name="UserStack" component={UserStack} />
        </UserDrawerNavigator.Navigator>
    )
}

const UserDrawerNavigatorArabic = () => {
    return (
        <UserDrawerNavigator.Navigator drawerType={'slide'} drawerPosition={'right'}>
            <UserDrawerNavigator.Screen name="UserStack" component={UserStack} />
        </UserDrawerNavigator.Navigator>
    )
}