import React from 'react';
import { View, Text, Image, TouchableOpacity, Platform, Modal } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import PushNotification from "react-native-push-notification";
import { Icon, width, height, w, h, transform, URL } from '../../utils/api/helpers'
import boyImage from '../../assets/images/abc.gif'
import image from '../../assets/images/curvedImage.png'
import Svg, { Ellipse, Defs, ClipPath, Image as SvgImage } from 'react-native-svg'
import { logout } from '../../utils/api/authorization'
import { getUserDetailsById } from '../../utils/api/employee'
import i18n from 'i18n-js'

export default class TrainerDrawerMenuBar extends React.Component {
    _isMounted = false

    state = {
        contents: [{ id: 1, name: i18n.t('home'), icon: 'home' }, { id: 2, name: i18n.t('myProfile'), icon: 'my-profile' }, { id: 3, name: i18n.t('qrCode'), icon: 'attachment' }, { id: 7, name: i18n.t('announcements'), icon: 'announcments' }, { id: 4, name: i18n.t('contact'), icon: 'contact' }, { id: 5, name: i18n.t('aboutUs'), icon: 'students' }, { id: 6, name: i18n.t('settings'), icon: 'setting-mobile' }],
        userId: "",
        userDetails: "",
        userCredentials: "",
        avatar: '',
        name: '',
        id: '',
        modalVisible: false,
        EmployeeId: ''
    }



    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            AsyncStorage.getItem('authedToken').then((token) => {
                const userId = jwtDecode(token).userId
                const EmployeeId = jwtDecode(token).credential

                this.setState({
                    userId,
                    id: userId,
                    EmployeeId
                }, () => {
                    getUserDetailsById(this.state.userId).then(res => {
                        if (res) {
                            this.setState({
                                userDetails: res.data.response,
                                userCredentials: res.data.response.credentialId,
                                avatar: `${URL}/${res.data.response.credentialId.avatar.path.replace(/\\/g, "/")}`,
                                name: res.data.response.credentialId.userName

                            }

                                // , () => {
                                //     PushNotification.localNotificationSchedule({
                                //         //... You can use all the options from localNotifications
                                //         id: '123',
                                //         message: `Welcome ${this.state.userCredentials.userName}`, // (required)
                                //         date: new Date(),// in 60 secs,
                                //         autoCancel: true, // (optional) default: true
                                //         largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
                                //         smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
                                //         bigText: `Welcome ${this.state.userCredentials.userName}, Hope you are enjoying your day !!`, // (optional) default: "message" prop // (optional) default: none
                                //         color: "#7e57c2", // (optional) default: system default
                                //         vibrate: true, // (optional) default: true
                                //         vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
                                //         tag: 'some_tag', // (optional) add tag to message
                                //         group: "group", // (optional) add group to message
                                //         ongoing: false, // (optional) set whether this is an "ongoing" notification
                                //         priority: "high", // (optional) set notification priority, default: high
                                //         visibility: "private", // (optional) set notification visibility, default: private
                                //         importance: "high",
                                //         playSound: true // (optional) set notification importance, default: high
                                //     })
                                // }
                            )
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

    onPressLogout = () => {

        AsyncStorage.clear().then(() => {
            this.props.navigation.navigate('AuthLoadingScreen')
        })



    }


    openContent = (id) => {
        if (id === 1) {
            this.props.navigation.closeDrawer()
        } else if (id === 2) {
            this.props.navigation.navigate('EditProfile')


        } else if (id === 3) {
            this.setModalVisible(true)
            this.props.navigation.closeDrawer()

        } else if (id === 4) {
            this.props.navigation.navigate('ContactHome')

        } else if (id === 5) {
            this.props.navigation.navigate('About')
        } else if (id === 6) {
            this.props.navigation.navigate('Settings')

        } else if (id === 7) {
            this.props.navigation.navigate('Announcement')

        }
    }

    render() {

        const userImage = JSON.parse(JSON.stringify({ uri: this.state.avatar }))
        return (
            <View style={{ flex: 1 }}>
                <Svg height='30%' width='100%'>
                    <Defs>
                        <ClipPath id="clip">
                            <Ellipse
                                cx='50%'
                                cy='15%'
                                rx={width / 1.5}
                                ry={height / 4.5}
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

                <View style={{ position: 'absolute', alignItems: 'center', height: height / 4, justifyContent: 'center', width: '100%' }}>
                    <Image source={userImage.uri !== "" ? userImage : boyImage} style={{ width: width / 5, height: width / 5, borderRadius: width / 10, borderWidth: 2, borderColor: 'white' }} />
                    <Text style={{ fontSize: width / 22, color: 'white', fontWeight: 'bold' }}>{this.state.userCredentials.userName}</Text>
                    <Text style={{ fontSize: width / 28, color: 'white', fontWeight: 'bold' }}>{i18n.t('empId')}: {this.state.userDetails.employeeId}</Text>
                </View>
                <View style={{ justifyContent: 'space-between', height: Platform.OS === 'ios' ? h / 2.2 : h / 2, transform: transform() }}>
                    <View style={{ padding: width / 30 }}>
                        {this.state.contents.map(a => {
                            return (
                                <TouchableOpacity key={a.id} onPress={() => this.openContent(a.id)}>
                                    <View key={a.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon name={a.icon} color='#333' size={width / 20} style={{ transform: transform() }} />
                                        <View style={{ width: width / 30 }} />
                                        <Text style={{ fontSize: width / 24, color: '#333', transform: transform() }}>{a.name}</Text>
                                    </View>
                                    <View style={{ borderBottomWidth: 0.5, marginBottom: width / 20, paddingTop: width / 50, borderBottomColor: '#ddd' }} />
                                </TouchableOpacity>
                            )
                        })}
                    </View>

                </View>
                <TouchableOpacity onPress={() => this.onPressLogout()}>
                    <View style={{ alignItems: 'center', marginTop: height / 15 }}>
                        <View style={{ width: width / 2, padding: width / 30, flexDirection: 'row', alignItems: 'center', backgroundColor: '#8bc34a', justifyContent: 'center', borderRadius: width / 4 }}>
                            <Icon name='logout' color='white' size={width / 20} style={{ transform: transform() }} />
                            <View style={{ width: width / 30 }} />
                            <Text style={{ fontSize: width / 22, color: 'white' }}>{i18n.t('logout')}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View elevation={5} style={{ borderWidth: 1, borderColor: '#ddd', backgroundColor: 'white', height: width / 1.5, width: width / 1.5, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width / 1.5, marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0.5, paddingBottom: width / 60 }}>
                            <Text style={{ fontSize: width / 20, marginLeft: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], textAlign: this.state.isRTL ? 'right' : 'left' }}>QR</Text>
                            <TouchableOpacity onPress={() => this.setModalVisible(false)}>
                                <Icon name="close" size={width / 20} style={{ marginRight: width / 30 }} color="black" />
                            </TouchableOpacity>
                        </View>
                        <Image
                            source={{ uri: `https://quickchart.io/qr?text={"name": "${this.state.name}","id":"${this.state.id}"}` }}
                            resizeMode='stretch'
                            style={{ height: width / 2, marginLeft: 'auto', marginRight: 'auto', width: width / 2, transform: transform() }}
                        />
                    </View>
                </Modal>
            </View>
        )
    }
}