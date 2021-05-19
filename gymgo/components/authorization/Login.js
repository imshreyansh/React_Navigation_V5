import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, Modal, Image, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { showMessage, hideMessage } from "react-native-flash-message";
import loginBg from '../../assets/images/loginBg.png';
import Svg, { Ellipse, Defs, ClipPath, Image as SvgImage } from 'react-native-svg'
import fb from '../../assets/images/facebook.png';
import google from '../../assets/images/google.png';
import gymnago from '../../assets/images/gymnago.png';
import jwtDecode from 'jwt-decode'
import Loader from '../../utils/resources/Loader'
import { loginMember, getDesignationById, forgotPassword } from '../../utils/api/authorization'
import { Icon, width, height, w, h, transform, textAlign } from '../../utils/api/helpers'
import PushNotification from "react-native-push-notification";
import axios from 'axios';
import i18n from 'i18n-js'

class Login extends Component {
    _isMounted = false

    state = {
        email: '',
        password: '',
        isRTL: null,
        modalVisible: false,
        forgotPass: '',
        rtl: null,
        success: false,
        loading: false,
        viewStatus: false,
        role: '',
        showSuccess: false,
        lang: true,
        appLang: ''
    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {

        }
    }


    componentWillUnmount() {
        this._isMounted = false

    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible, forgotPass: '' });
    }

    async saveItem(item, selectedValue) {
        try {
            await AsyncStorage.setItem(item, selectedValue);
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }
    }
    // fbAuth = () => {
    //     LoginManager.logInWithPermissions(["public_profile"]).then(
    //         (result) => {
    //             if (result.isCancelled) {
    //                 console.log("Login cancelled");
    //             } else {
    //                 AccessToken.getCurrentAccessToken().then(
    //                     (data) => {
    //                         console.log(data)
    //                     })
    //                 console.log(
    //                     "Login success with permissions: " +
    //                     result.grantedPermissions.toString()
    //                 );
    //             }
    //         },
    //         (error) => {
    //             console.log("Login fail with error: " + error);
    //         }
    //     );
    // }
    //ga0RGNYHvNM5d0SLGQfpQWAPGJ8=    --key hash

    setAxiosHeader = async () => {
        const token = jwtDecode(await AsyncStorage.getItem('authedToken')).credential
        if (token) axios.defaults.headers.common['userId'] = token
    }

    onLogin = () => {
        const credentials = {
            email: this.state.email,
            password: this.state.password
        }
        //lz3zv4yj

        this.setState({
            loading: true
        });

        loginMember(credentials).then(res => {
            if (res) {
                const user = res.data
                this.saveItem('authedToken', user.response)
                this.setState({
                    email: '',
                    password: '',
                    loading: false,
                })
                this.setAxiosHeader()

                AsyncStorage.getItem('authedToken').then(token => {
                    const designation = jwtDecode(token).designation
                    getDesignationById(designation).then(res => {
                        if (res) {
                            this.setState({
                                role: res.data.response.designationName
                            }, () => {
                                const { role } = this.state
                                if (role === 'Member') {
                                    this.props.navigation.push('AuthLoadingScreen', { role })

                                } else if (role === 'Trainer') {
                                    this.props.navigation.push('AuthLoadingScreen', { role })

                                } else if (role === 'System Admin') {
                                    this.props.navigation.push('AuthLoadingScreen', { role })
                                } else {
                                    showMessage({
                                        message: 'You are not allowed to login',
                                        type: "danger",
                                    })
                                }
                            })
                        }
                    }



                    )


                })
            } else {
                this.setState({
                    loading: false
                })
            }
        })
    }


    forgotPass = () => {
        this.setState({
            loading: true
        })
        const email = {
            email: this.state.forgotPass
        }


        forgotPassword(email).then(res => {
            if (res) {
                this.setState({
                    showSuccess: true,
                    loading: false
                })

                showMessage({
                    message: "E-mail sent successfully",
                    type: "success",
                })
            } else {
                this.setState({
                    loading: false
                })
            }
        })
    }

    async saveItem(item, selectedValue) {
        try {
            await AsyncStorage.setItem(item, selectedValue);
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }
    }

    languageChanger = (lang) => {
        i18n.locale = lang
        this.saveItem('language', lang)
        this.setState({
            appLang: lang,
            lang: !this.state.lang
        }, () => {
            console.log(this.state.lang)
            this.props.navigation.navigate('AuthLoadingScreen')
        }
        )
    }


    render() {
        return (
            <View style={{ transform: transform(), backgroundColor: 'white', flex: 1 }}>
                <Loader loading={this.state.loading} text='Loading' />
                <Svg height={Platform.OS === 'ios' ? '40%' : '36%'} width='100%'>
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
                        href={loginBg}
                        clipPath="url(#clip)"
                    />
                </Svg>
                <View style={{ position: 'absolute', justifyContent: 'flex-end', flexDirection: 'row', width: w, transform: transform(), paddingRight: width / 30, marginTop: width / 50, marginLeft: 'auto', marginRight: 'auto' }}>
                    <TouchableOpacity onPress={() => this.languageChanger(i18n.locale === 'ar' ? 'en' : 'ar')}>

                        <View style={{ flexDirection: 'row' }}>
                            <Icon name="language" size={width / 18} color="white" />
                            <Text style={{ marginLeft: width / 50, fontSize: width / 25, color: 'white' }}>{i18n.locale === 'ar' ? 'English' : 'العَرَبِيَّة'}</Text>
                        </View>
                    </TouchableOpacity>

                </View>
                <View style={{ position: 'absolute', justifyContent: 'center', flexDirection: 'row', marginTop: height / 8, marginLeft: 'auto', marginRight: 'auto', alignItems: 'center', width: w }}>

                    <Image source={gymnago} resizeMode='stretch' style={{ width: width / 1.5, height: width / 7, transform: transform() }} />
                </View>

                <ScrollView>

                    <KeyboardAvoidingView style={{ flex: 1, }} behavior="padding" >
                        <View>

                            <View style={{ marginTop: height / 15, width: w / 1.2, borderBottomWidth: 1, borderBottomColor: '#ddd', marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row' }}>
                                <Icon name="user" size={width / 18} style={{ top: width / 50 }} color="grey" />
                                <TextInput
                                    autoCapitalize='none'
                                    onChangeText={(text) => this.setState({ email: text, })}
                                    value={this.state.email}
                                    style={{ fontSize: width / 25, transform: transform(), textAlign: textAlign(), color: '#333', width: w / 1.3, marginLeft: 'auto', marginRight: 'auto', height: width / 9, paddingLeft: 8 }}
                                    returnKeyType='next'
                                    placeholderTextColor='grey'
                                    placeholder={i18n.t('email')} />
                            </View>
                            <View style={{ marginTop: width / 20, width: w / 1.2, borderBottomWidth: 1, borderBottomColor: '#ddd', marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="password" size={width / 18} style={{ top: width / 50 }} color="grey" />
                                    {this.state.viewStatus === true ?
                                        <TextInput
                                            autoCapitalize='none'
                                            onChangeText={(text) => this.setState({ password: text, })}
                                            value={this.state.password}
                                            style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.4, marginLeft: 'auto', marginRight: 'auto', height: width / 9, paddingLeft: 8 }}
                                            returnKeyType='next'
                                            placeholderTextColor='grey'
                                            placeholder={i18n.t('password')} /> :
                                        <TextInput
                                            secureTextEntry
                                            autoCapitalize='none'
                                            onChangeText={(text) => this.setState({ password: text, })}
                                            value={this.state.password}
                                            style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.4, marginLeft: 'auto', marginRight: 'auto', height: width / 9, paddingLeft: 8 }}
                                            returnKeyType='next'
                                            placeholderTextColor='grey'
                                            placeholder={i18n.t('password')} />}
                                </View>
                                <TouchableOpacity onPress={() => this.setState({ viewStatus: !this.state.viewStatus })}>
                                    <Icon name={this.state.viewStatus === true ? "eye" : "pending"} size={width / 16} style={{ top: width / 50 }} color="grey" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => this.onLogin()}>
                                <View style={{ width: w / 1.2, backgroundColor: '#00c853', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: 5 }}>
                                    <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 40, transform: transform(), }}>{i18n.t('login')}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                                <View style={{ width: w / 1.2, marginTop: width / 20, marginLeft: 'auto', marginRight: 'auto', justifyContent: 'flex-end', flexDirection: 'row' }}>
                                    <Text style={{ fontSize: width / 24, color: '#333', fontWeight: 'bold', transform: transform(), }}>{i18n.t('forgotPassword')}</Text>
                                </View>
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2, marginTop: height / 12, marginLeft: 'auto', marginRight: 'auto' }}>
                                <Text style={{ fontSize: width / 28, color: '#333', top: 5, transform: transform(), }}>{i18n.t('dontHaveAnAccount')}</Text>
                                <View style={{ flexDirection: 'column' }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
                                        <Text style={{ fontSize: width / 18, color: '#333', fontWeight: 'bold', transform: transform(), }}>{i18n.t('signUp')}</Text>
                                    </TouchableOpacity>
                                    {/* <Text style={{ fontSize: width / 28, color: 'white', fontWeight: 'bold', transform: transform(), textAlign: 'center' }}>OR</Text>
                              <View style={{ flexDirection: 'row', width: w / 4.5, justifyContent: 'space-between' }}>
                                  <TouchableOpacity onPress={() => this.fbAuth()}>
                                      <Image source={fb} style={{ width: width / 10, height: width / 10 }} />
                                  </TouchableOpacity>
                                  <TouchableOpacity>
                                      <Image source={google} style={{ width: width / 12, height: width / 12, top: 3 }} />
                                  </TouchableOpacity>
                              </View> */}
                                </View>
                            </View>
                        </View>



                        <Modal
                            transparent={true}
                            visible={this.state.modalVisible}
                        >
                            <View elevation={3} style={{ backgroundColor: 'white', height: width / 1.8, width: width - 40, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width / 1.15, marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0.5, paddingBottom: width / 60 }}>
                                    <Text style={{ fontSize: width / 20, marginLeft: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], textAlign: this.state.isRTL ? 'right' : 'left' }}>{i18n.t('forgotPassword')}</Text>
                                    <TouchableOpacity onPress={() => { this.setModalVisible(false), this.setState({ showSuccess: false }) }}>
                                        <Icon name="close" size={width / 20} style={{ marginRight: width / 30 }} color="black" />
                                    </TouchableOpacity>
                                </View>
                                {this.state.showSuccess === true ? <View style={{ marginTop: width / 20, justifyContent: "center", alignItems: "center", marginLeft: 'auto', marginRight: 'auto', width: width - 50 }}>
                                    <Icon name="email" size={width / 9} style={{ marginTop: width / 50 }} color="#333" />
                                    <Text style={{ fontSize: width / 22, color: '#333', width: width - 60, marginTop: width / 30 }}>{i18n.t('forgotPasswordSuccess')}</Text>

                                </View> :
                                    <View>
                                        <View style={{ transform: transform(), width: width / 1.2, borderBottomWidth: 1, borderBottomColor: '#333', marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', marginTop: width / 20 }}>
                                            <Icon name="user" size={width / 18} style={{ top: width / 50 }} color="#333" />
                                            <TextInput
                                                autoCapitalize='none'
                                                onChangeText={(text) => this.setState({ forgotPass: text, })}
                                                value={this.state.forgotPass}
                                                style={{ fontSize: width / 25, color: '#333', width: w / 1.3, transform: transform(), textAlign: textAlign(), marginLeft: 'auto', marginRight: 'auto', height: width / 9, paddingLeft: 8 }}
                                                returnKeyType='next'
                                                placeholderTextColor='#333'
                                                placeholder={i18n.t('email')} />
                                        </View>
                                        <TouchableOpacity onPress={() => this.forgotPass()}>
                                            <View style={{ width: width / 1.5, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                                                <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50 }}>{i18n.t('submit')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>}

                            </View>
                        </Modal>
                    </KeyboardAvoidingView>

                </ScrollView>
            </View>


        )
    }
}

export default Login