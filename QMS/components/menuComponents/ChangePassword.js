import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { changePassword } from '../../utils/api/authorization'
import { showMessage, hideMessage } from "react-native-flash-message";
import Loader from '../../utils/resources/Loader'
import i18n from 'i18n-js'

class ChangePassword extends Component {
    _isMounted = false

    state = {
        modalVisible: false,
        loading: false,
        oldPassword: '',
        oldPassworde: '',
        newPassword: '',
        newPassworde: '',
        confirmPassword: '',
        confirmPassworde: '',
        userId: ''
    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            this.setState({ loading: true })

            AsyncStorage.getItem('authedToken').then((token) => {
                const userId = jwtDecode(token).credential
                this.setState({
                    userId,
                    loading: false
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

    validate = (text, type) => {
        if (type === 'oldPassword') {
            if (text === '') {
                this.setState({
                    oldPassworde: i18n.t('enterTheOldPassword'),
                    oldPassword: '',
                })
            } else {
                this.setState({
                    oldPassword: text,
                    oldPassworde: '',
                })
            }
        }
        if (type === 'newPassword') {
            if (text === '') {
                this.setState({
                    newPassworde: i18n.t('enterTheNewPassword'),
                    newPassword: '',
                })
            } else {
                this.setState({
                    newPassword: text,
                    newPassworde: '',
                })
            }
        }
        if (type === 'confirmPassword') {
            if (text === '') {
                this.setState({
                    confirmPassworde: i18n.t('enterTheConfirmPassword'),
                    confirmPassword: '',
                })
            } else {
                this.setState({
                    confirmPassword: text,
                    confirmPassworde: '',
                })
            }
        }
    }

    onPressSubmit = () => {
        this.setState({
            loading: true,
        })
        const { oldPassword, oldPassworde, newPassword, newPassworde, confirmPassword, confirmPassworde } = this.state
        if (
            oldPassword !== '' &&
            oldPassworde === '' &&
            confirmPassword !== '' &&
            confirmPassworde === '' &&
            newPassword !== '' &&
            newPassworde === '' && newPassword === confirmPassword
        ) {
            const password = {
                id: this.state.userId,
                oldPassword,
                newPassword,
                confirmPassword
            }
            changePassword(password).then(res => {
                if (res) {
                    this.setState({
                        status: 'success',
                        loading: false,
                        oldPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    })
                    showMessage({
                        message: 'Password Changed Successfully',
                        type: "success",
                    })
                } else {
                    this.setState({

                        loading: false
                    })
                }
            })
        } else {
            this.setState({
                loading: false
            })
            if (oldPassword === '') {
                this.setState({ oldPassworde: i18n.t('enterTheOldPassword') })
            }
            if (newPassword === '') {
                this.setState({ newPassworde: i18n.t('enterTheNewPassword') })
            }
            if (confirmPassword === '') {
                this.setState({ confirmPassworde: i18n.t('enterTheConfirmPassword') })
            }
            if (confirmPassword !== newPassword) {
                this.setState({ confirmPassworde: i18n.t('confirmErrorThree') })
            }
        }
    }

    onPressCancel = () => {
        this.setState({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        })
    }



    render() {
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <Loader loading={this.state.loading} text='Registering User' />
                <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                        <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('changePassword')}</Text>
                    </TouchableOpacity>
                </View>
                <KeyboardAvoidingView>
                    <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>
                        <View style={{ width: w / 1.08, paddingBottom: width / 30, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', marginTop: width / 20 }}>


                            <View style={{ marginTop: width / 30 }}>
                                <TextInput
                                    style={[this.state.oldPassworde !== '' ? styles.forme : styles.form, { paddingLeft: width / 30, transform: transform(), textAlign: textAlign(), paddingRight: this.state.isRTL ? 10 : 0 ,color: '#333'}]}
                                    autoCapitalize='none'
                                    onChangeText={(text) => this.validate(text, 'oldPassword')}
                                    value={this.state.oldPassword}
                                    placeholder={i18n.t('oldPassword')}
                                    placeholderTextColor='grey'

                                />
                                <Text style={[styles.errorText, { transform: transform(), textAlign: this.state.isRTL ? 'left' : 'right', paddingLeft: this.state.isRTL ? 10 : 0 }]}>{this.state.oldPassworde}</Text>
                            </View>
                            <View>
                                <TextInput
                                    style={[this.state.newPassworde !== '' ? styles.forme : styles.form, { paddingLeft: width / 30, transform: transform(), textAlign: textAlign(), paddingRight: this.state.isRTL ? 10 : 0 ,color: '#333'}]}
                                    autoCapitalize='none'
                                    onChangeText={(text) => this.validate(text, 'newPassword')}
                                    value={this.state.newPassword}
                                    placeholder={i18n.t('newPassword')}
                                    placeholderTextColor='grey'

                                />
                                <Text style={[styles.errorText, { transform: transform(), textAlign: this.state.isRTL ? 'left' : 'right', paddingLeft: this.state.isRTL ? 10 : 0 }]}>{this.state.newPassworde}</Text>
                            </View>
                            <View>
                                <TextInput
                                    style={[this.state.confirmPassworde !== '' ? styles.forme : styles.form, { paddingLeft: width / 30, transform: transform(), textAlign: textAlign(), paddingRight: this.state.isRTL ? 10 : 0,color: '#333' }]}
                                    autoCapitalize='none'
                                    onChangeText={(text) => this.validate(text, 'confirmPassword')}
                                    value={this.state.confirmPassword}
                                    placeholder={i18n.t('confirmPassword')}
                                    placeholderTextColor='grey'
                                />
                                <Text style={[styles.errorText, { transform: transform(), textAlign: this.state.isRTL ? 'left' : 'right', paddingLeft: this.state.isRTL ? 10 : 0 }]}>{this.state.confirmPassworde}</Text>
                            </View>
                            <View style={{ width: w / 1.08, flexDirection: 'column', marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 10, padding: width / 20 }}>
                                <TouchableOpacity onPress={() => this.onPressSubmit()}>
                                    <View style={{ marginTop: width / 50, marginLeft: 'auto', marginRight: 'auto', transform: transform() }}>

                                        <View style={{ backgroundColor: '#1976d2', width: width / 1.4, height: width / 8, borderRadius: 30, transform: transform() }}>
                                            <Text style={{ textAlign: 'center', fontSize: width / 18, color: 'white', marginBottom: 'auto', marginTop: 'auto', transform: transform() }}>{i18n.t('save')}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ width: width / 25 }} />
                                <TouchableOpacity onPress={() => this.onPressCancel()}>
                                    <View style={{ marginTop: width / 15, marginLeft: 'auto', marginRight: 'auto', transform: transform() }}>
                                        <Icon name="close" size={width / 18} color="#1976d2" />

                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View >
        )
    }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
    },
    searchdiv: {
        height: width / 7,
        width: '100%',
        backgroundColor: '#5aa8d8',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    icons: {
        flexDirection: 'row',
        paddingTop: width / 25,
        paddingRight: width / 25,
        justifyContent: 'space-between',
        width: width / 5,
    },
    form: {
        width: w / 1.2,
        marginLeft: 'auto',
        marginRight: 'auto',
        fontSize: width / 25,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        borderRadius: 5,
        height: width / 8,
    },
    forme: {
        width: w / 1.2,
        marginLeft: 'auto',
        marginRight: 'auto',
        fontSize: width / 25,
        borderBottomColor: 'red',
        borderBottomWidth: 1,
        borderRadius: 5,
        height: width / 8,
    },
    errorText: {
        color: 'red',
        fontSize: width / 35,
        paddingRight: width / 50,
        marginTop: width / 50,
        textAlign: 'right',
    },
};

export default ChangePassword