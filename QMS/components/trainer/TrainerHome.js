import React from 'react';
import { View, Text, Platform, Image, ScrollView, TouchableOpacity, ImageBackground, Modal } from 'react-native';
import image from '../../assets/images/curvedImage.png'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import boyImage from '../../assets/images/abc.gif'
import notifyBell from '../../assets/images/notifyBell.png'
import sampleNotify from '../../assets/images/sampleNotify.png'
import Svg, { Ellipse, Defs, ClipPath, Image as SvgImage } from 'react-native-svg'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { DrawerActions } from 'react-navigation-drawer';
import { getUserNotification, readUserNotifications, clearUserNotifications } from '../../utils/api/notifications'
import { getUserDetailsById } from '../../utils/api/employee'
import { getAllOffer } from '../../utils/api/rewards'
import blue from '../../assets/images/blue.jpg'
import red from '../../assets/images/red.jpg'
import green from '../../assets/images/green.jpg'
import io from 'socket.io-client'
let socket
const ENDPOINT = `https://skoolgo.pixelmindit.com:5000/notification`
import i18n from 'i18n-js'

export default class TrainerHome extends React.Component {
    _isMounted = false

    state = {
        contents: [{ id: 1, name: i18n.t('workouts'), icon: 'workouts', backgroundColor: 'orange' }, { id: 2, name: i18n.t('dietPlan'), icon: 'diet-plans', backgroundColor: '#69f0ae' }, { id: 3, name: i18n.t('packages'), icon: 'packages', backgroundColor: '#2196f3' }, { id: 4, name: i18n.t('events'), icon: 'calender', backgroundColor: 'red' }
            , { id: 5, name: i18n.t('myMembers'), icon: 'user', backgroundColor: '#7e57c2' }, { id: 6, name: i18n.t('myClasses'), icon: 'classes', backgroundColor: '#004d40' }],
        rtl: null,
        userId: "",
        userDetails: "",
        userCredentials: "",
        avatar: '',
        notification: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        modalVisible: false,
        offers: [],
        notificationRead: [],
        employeeIdUser: ''
    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            AsyncStorage.getItem('NotificationNavigationForeground').then(values => {
                if (values === 'go' && values !== 'not' && values !== 'null') {
                    AsyncStorage.getItem('AppState').then(status => {
                        if (status === 'active' && AppState.currentState === 'active') {
                            AsyncStorage.getItem('NotificationNavigation').then((id) => {
                                if (id !== '' || id !== null || id !== undefined) {
                                    this.props.navigation.navigate(id)
                                    AsyncStorage.removeItem('NotificationNavigation')
                                    AsyncStorage.removeItem('AppState')
                                    AsyncStorage.removeItem('NotificationNavigationForeground')
                                }
                            })
                        }

                    })
                }
            })
            getAllOffer().then(res => {
                if (res) {
                    this.setState({
                        offers: res.data.response
                    })
                }
            })

            AsyncStorage.getItem('authedToken').then((token) => {
                const userId = jwtDecode(token).userId
                const employeeIdUser = jwtDecode(token).credential
                this.setState({
                    userId,
                    employeeIdUser
                }, () => {
                    socket = io(ENDPOINT, { query: { userId: this.state.employeeIdUser } })
                    socket.on('getNotification', data => {
                        this.setState({
                            notification: data.filter(d => d.notificationType === 'Mobile').reverse(),
                            notificationRead: data.filter(d => (d.notificationType === 'Mobile' && d.read === false))
                        })
                    })
                    getUserDetailsById(this.state.userId).then(res => {
                        if (res) {
                            this.setState({
                                userDetails: res.data.response,
                                userCredentials: res.data.response.credentialId,
                                avatar: `${URL}/${res.data.response.credentialId.avatar.path.replace(/\\/g, "/")}`
                            })
                        }
                    })
                    const data = {
                        userId: this.state.employeeIdUser,
                        notificationType: 'Mobile'
                    }

                    getUserNotification(data).then(res => {
                        if (res) {
                            this.setState({
                                notification: res.data.response,
                                notificationRead: res.data.response.filter(d => d.read === false)
                            })
                        }
                    })
                })
            })
        }


    }

    componentWillUnmount() {
        this._isMounted = false
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    openContent = (id) => {
        if (id === 1) {
            this.props.navigation.navigate('AssignWorkoutNavigator')
        } else if (id === 2) {
            this.props.navigation.navigate('AssignDietNavigator')
        } else if (id === 3) {
            this.props.navigation.navigate('TrainerPackage')
        } else if (id === 4) {
            this.props.navigation.navigate('SchedulePage')
        } else if (id === 5) {
            this.props.navigation.navigate('MyMembers')
        } else if (id === 6) {
            this.props.navigation.navigate('MyClasses')
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            tabBarLabel: i18n.t('home'),

        }
    }

    setStatusNotification = (id, nav) => {
        const data = []
        data.push(id)
        const obj = {
            ids: data,
            userId: this.state.employeeIdUser
        }
        socket.emit('readRequest', obj)
        this.setModalVisible(false)
        this.props.navigation.navigate(nav)
    }

    clearNotifications = () => {
        const datas = {
            userId: this.state.employeeIdUser,
        }
        clearUserNotifications(datas).then(res => {
            if (res) {
                const data = {
                    userId: this.state.employeeIdUser,
                    notificationType: 'Mobile'
                }
                getUserNotification(data).then(res => {
                    if (res) {
                        this.setState({
                            notification: res.data.response,
                            notificationRead: res.data.response.filter(d => d.read === false)
                        })
                    }
                })
            }
        })
    }


    render() {
        const userImage = JSON.parse(JSON.stringify({ uri: this.state.avatar }))
        return (
            <View style={{ transform: transform(), backgroundColor: '#eeeeee', flex: 1 }}>
                <Svg height={Platform.OS === 'ios' ? '45%' : '43%'} width='100%'>
                    <Defs>
                        <ClipPath id="clip">
                            <Ellipse
                                cx={w / 2}
                                cy={h / 8}
                                rx={w / 1.5}
                                ry={h / 4.5}
                            />
                        </ClipPath>
                    </Defs>
                    <SvgImage
                        width="100%"
                        height="100%"
                        preserveAspectRatio="xMidYMid slice"
                        href={image}
                        clipPath="url(#clip)"
                    />
                </Svg>
                <View style={{ position: 'absolute' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: width / 20, paddingBottom: h / 100, width: w }}>
                        <TouchableOpacity onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}>
                            <Icon name='toggle' color='white' size={width / 15} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                            <View>
                                <Icon name='notification' color='white' size={width / 15} />
                                {this.state.notificationRead.length > 0 ? <View style={{ width: width / 25, height: width / 25, backgroundColor: 'red', position: 'absolute', borderRadius: width / 50, top: -5, right: -2 }} /> : <View></View>}
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', transform: transform() }}>
                        <Image source={userImage.uri !== "" ? userImage : boyImage} style={{ width: width / 5, height: width / 5, borderRadius: width / 10, borderWidth: 2, borderColor: 'white' }} />
                        <Text style={{ fontSize: width / 22, color: 'white', fontWeight: 'bold', marginTop: Platform.OS === 'ios' ? width / 30 : 10 }}>{this.state.userCredentials.userName}</Text>
                        <Text style={{ fontSize: width / 28, color: 'white' }}>{i18n.t('empId')}: {this.state.userDetails.employeeId}</Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ padding: width / 10, paddingTop: width / 30, paddingBottom: width / 30, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                        {this.state.contents.map((a, i) => {
                            return (
                                <TouchableOpacity key={i} onPress={() => this.openContent(a.id)}>
                                    <View elevation={3} style={{ transform: transform(), flexDirection: 'row', width: w / 2.6, height: height / 12, marginTop: width / 30, justifyContent: 'space-between', backgroundColor: 'white', borderBottomWidth: 4, borderBottomColor: a.backgroundColor, borderRadius: 3 }}>
                                        <View style={{ width: w / 2.8, transform: transform(), justifyContent: 'space-between', flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto', }}>
                                            <View style={{ width: width / 10, height: width / 10, borderRadius: width / 20, backgroundColor: a.backgroundColor, marginTop: 'auto', marginBottom: 'auto', justifyContent: 'center', alignItems: 'center' }}>
                                                <Icon name={a.icon} color='white' size={width / 18} style={{ transform: transform() }} />
                                            </View>
                                            <Text style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), marginTop: 'auto', marginBottom: 'auto', width: w / 4 }}>{a.name}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    <View style={{ marginLeft: width / 20, marginTop: width / 30 }}>
                        <Text style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign() }}>{i18n.t('offers')}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {this.state.offers.map((data, i) => {

                                const offer = `${URL}/${data.product.image.path.replace(/\\/g, "/")}`
                                const offerImage = JSON.parse(JSON.stringify({ uri: offer }))

                                function getImage(e) {
                                    if (e !== undefined) {
                                        if (e % 3 === 0) {
                                            return blue
                                        } else if (e % 3 === 1) {
                                            return red
                                        } else {
                                            return green
                                        }
                                    }

                                }
                                return (
                                    <ImageBackground source={getImage(i)} imageStyle={{ borderRadius: 5 }} key={i} style={{ paddingBottom: width / 50, paddingTop: width / 50, width: this.state.offers.length === 1 ? width / 1.1 : width / 1.5, marginRight: width / 20, marginTop: width / 30, borderRadius: 4 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', width: this.state.offers.length === 1 ? width / 1.15 : width / 1.6 }}>
                                            <View style={{ flexDirection: 'column' }}>
                                                <Text style={{ fontSize: width / 12, color: 'white', fontWeight: 'bold', transform: transform() }}>{data.offerPercentage}%</Text>
                                                <Text style={{ fontSize: width / 25, color: 'white', marginLeft: width / 50, transform: transform() }}>{i18n.t('off')}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ fontSize: width / 28, transform: transform(), color: 'white', width: this.state.offers.length === 1 ? width / 2.5 : width / 4, marginLeft: width / 70 }}>{data.offerName}</Text>
                                            </View>
                                            <Image resizeMode='stretch' source={offerImage} style={{ transform: transform(), width: this.state.offers.length === 1 ? width / 5 : width / 6.5, height: this.state.offers.length === 1 ? width / 5 : width / 6.5, borderRadius: 2, }} />

                                        </View>
                                    </ImageBackground>
                                )
                            })}
                        </ScrollView>
                    </View>
                </ScrollView>
                <Modal transparent={false}
                    visible={this.state.modalVisible}>
                    <View style={{ backgroundColor: 'white', height: h / 1.02, width: w, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, paddingBottom: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <View style={{ borderBottomWidth: 1.5, borderBottomColor: '#ddd', width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', marginTop: Platform.OS === 'android' ? 0 : width / 30 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => this.setModalVisible(false)}>
                                    <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                                    <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', fontWeight: 'bold', }}>{i18n.t('notifications')}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={{ top: width / 30, fontSize: width / 18, color: '#333', fontWeight: 'bold', right: width / 50 }}>({this.state.notification.length})</Text>

                        </View>
                        <ScrollView contentContainerStyle={{ backgroundColor: "white", paddingBottom: width / 30 }}>


                            {this.state.notification.length > 0 ? this.state.notification.map((data, i) => {
                                var shours = new Date(data.time).getHours()
                                var sminutes = new Date(data.time).getMinutes()
                                var sampm = shours >= 12 ? 'PM' : 'AM'
                                shours = shours % 12
                                shours = shours ? shours : 12  // the hour '0' should be '12'
                                var startTime = shours + ':' + `${("0" + sminutes).slice(-2)}` + ' ' + sampm
                                var today = new Date();
                                var Christmas = new Date(data.time);
                                var diffMs = (today - Christmas); // milliseconds between now & Christmas
                                var diffDays = Math.floor(diffMs / 86400000); // days
                                var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
                                var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                                const leftReminderDays = diffDays + " days"
                                const leftReminderHours = diffHrs + " hour"
                                const leftReminderMinutes = diffMins + " minute"
                                const final = diffDays > 0 ? leftReminderDays : diffHrs > 0 ? leftReminderHours : diffMins >= 0 ? leftReminderMinutes : ''
                                return (
                                    <TouchableOpacity key={i} onPress={() => this.setStatusNotification(data._id, data.mobileCompo)}>
                                        <View elevation={data.read === true ? 0 : 2} style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', backgroundColor: data.read === true ? '#ddd' : 'white', padding: width / 80, marginTop: width / 30, borderWidth: 0.5, borderColor: '#ddd', borderRadius: 3 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ width: width / 8, height: width / 8, borderRadius: width / 16, backgroundColor: data.backgroundColor }}>
                                                    <Icon name={data.icon} size={width / 12} color={data.color} style={{ transform: transform(), marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} />
                                                </View>
                                                <View style={{ flexDirection: 'column' }}>
                                                    <Text style={{ marginLeft: width / 50, fontSize: width / 28, fontWeight: 'bold', color: '#616161', width: w / 1.5 }}>{data.title}</Text>
                                                    <Text style={{ marginLeft: width / 50, fontSize: width / 32, fontWeight: 'bold', color: '#9e9e9e' }}>{final} ago</Text>
                                                    <View style={{ justifyContent: 'flex-end', width: w / 1.4, flexDirection: 'row' }}>
                                                        <Text style={{ fontSize: width / 35, color: 'red' }}>{new Date(data.date).getDate()}/{new Date(data.date).getMonth() + 1}/{new Date(data.date).getFullYear()}, {startTime}</Text>
                                                    </View>
                                                </View>

                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }) : <View style={{ height: width / 0.7, width: w / 1.1, justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', }}>
                                <View style={{ marginTop: width / 2.5 }}>
                                    <Image source={notifyBell} style={{ width: width / 5, height: width / 5, marginLeft: 'auto', marginRight: 'auto', }} />
                                    <Text style={{ textAlign: 'center', fontSize: width / 24, color: '#333', fontWeight: 'bold', marginTop: width / 50 }}>{i18n.t('noNotify')}</Text>
                                    <Text style={{ textAlign: 'center', fontSize: width / 28, color: '#333', marginTop: width / 50 }}>{i18n.t('notify')}</Text>
                                </View>
                            </View>}
                        </ScrollView>
                        {this.state.notification.length > 0 ? <TouchableOpacity onPress={() => this.clearNotifications()}>
                            <View style={{ padding: width / 50, width: w / 3, backgroundColor: '#00c853', marginLeft: 'auto', marginRight: 'auto', borderRadius: 5, marginTop: width / 40 }}>
                                <Text style={{ fontSize: width / 28, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>{i18n.t('clearAll')}</Text>
                            </View>
                        </TouchableOpacity> : <View></View>}
                    </View>
                </Modal>
            </View>
        )
    }
}