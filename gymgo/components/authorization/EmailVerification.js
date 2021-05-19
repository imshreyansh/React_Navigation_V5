import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, ActionSheetIOS, Picker, StyleSheet, Modal, Platform } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, textAlignForError, paddingRight } from '../../utils/api/helpers'
import Loader from '../../utils/resources/Loader'
import image from '../../assets/images/curvedImage.png'
import { showMessage, hideMessage } from "react-native-flash-message";
import { registerMember, verify } from '../../utils/api/authorization'
import i18n from 'i18n-js'


class EmailVerification extends Component {

    state = {
        loading: false,
        rtl: null,
        inputOne: '',
        inputTwo: '',
        inputThree: '',
        inputFour: '',
        getCode: '',
        userInfo: '',
        imageURI: ''
    }

    focusNextField(nextField, text) {
        if (text.length === 1) {
            this.refs[nextField].focus();
        }
    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            this.setState({
                getCode: this.props.navigation.getParam('code'),
                userInfo: this.props.navigation.getParam('obj'),
                imageURI: this.props.navigation.getParam('avatar')
            })
        }


    }

    componentWillUnmount() {
        this._isMounted = false
    }

    onSubmit = () => {
        const { inputOne, inputTwo, inputThree, inputFour } = this.state
        const code = i18n.locale === 'ar' ? inputFour + inputThree + inputTwo + inputOne : inputOne + inputTwo + inputThree + inputFour
        this.setState({
            loading: true
        })
        const newCode = JSON.stringify(this.state.getCode)

        if (code === newCode) {
            const formData = new FormData()
            formData.append('avatar', this.state.imageURI)
            formData.append('data', JSON.stringify(this.state.userInfo))
            registerMember(formData).then(res => {
                if (res) {
                    this.setState({
                        loading: false
                    })
                    this.props.navigation.navigate('Login')
                    showMessage({
                        message: "Registration Successful",
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
                loading: false,
                inputOne: '',
                inputTwo: '',
                inputThree: '',
                inputFour: '',
            })
            showMessage({
                message: "Verification code doesn't match with entered code",
                type: "error",
            })
        }

    }

    onCancel = () => {
        this.props.navigation.navigate('Login')

        showMessage({
            message: "Registration Failed",
            type: "error",
        })
    }

    resendCode = () => {
        const data = {
            email: this.state.userInfo.email
        }
        this.setState({
            loading: true
        })
        verify(data).then(res => {
            if (res) {
                this.setState({
                    getCode: res.data.response.code,
                    inputOne: '',
                    inputTwo: '',
                    inputThree: '',
                    inputFour: '',
                    loading: false
                })
                showMessage({
                    message: "A new code has been sent on your email",
                    type: "success",
                })
            }
        })
    }



    render() {
        return (

            <KeyboardAvoidingView>
                <Loader loading={this.state.loading} text='Registering User' />
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <ImageBackground style={{ width: w, height: w / 1.4 }} source={image}>
                        <Text style={{ marginTop: width / 20, marginLeft: width / 20, fontWeight: 'bold', fontSize: width / 16, color: 'white', paddingRight: paddingRight() }}>{i18n.t('emailVerification')}</Text>
                        <Text style={{ marginTop: width / 20, width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', fontSize: width / 25, color: 'white', paddingRight: paddingRight() }}>{i18n.t('verification')}</Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: width / 20 }}>
                            <Icon name="email" size={width / 4} color="white" />
                        </View>
                    </ImageBackground>
                    <View style={styles.containerBottom}>
                        <Text style={styles.textBottom1}>{i18n.t('enterCode')}</Text>
                        {i18n.locale === 'ar' ?
                            <View style={styles.subContainerBottom1}>
                                <TextInput ref="1" style={styles.form} maxLength={1} keyboardType='numeric' onChangeText={(text) => this.setState({ inputOne: text })} />
                                <TextInput ref="2" style={styles.form} maxLength={1} keyboardType='numeric' onChangeText={(text) => { this.setState({ inputTwo: text }), this.focusNextField('1', text) }} />
                                <TextInput ref="3" style={styles.form} maxLength={1} keyboardType='numeric' onChangeText={(text) => { this.setState({ inputThree: text }), this.focusNextField('2', text) }} />
                                <TextInput ref="4" style={styles.form} maxLength={1} keyboardType='numeric' onChangeText={(text) => { this.setState({ inputFour: text }), this.focusNextField('3', text) }} />
                            </View> :
                            <View style={styles.subContainerBottom1}>
                                <TextInput ref="1" style={styles.form} maxLength={1} keyboardType='numeric' onChangeText={(text) => { this.setState({ inputOne: text }), this.focusNextField('2', text) }} />
                                <TextInput ref="2" style={styles.form} maxLength={1} keyboardType='numeric' onChangeText={(text) => { this.setState({ inputTwo: text }), this.focusNextField('3', text) }} />
                                <TextInput ref="3" style={styles.form} maxLength={1} keyboardType='numeric' onChangeText={(text) => { this.setState({ inputThree: text }), this.focusNextField('4', text) }} />
                                <TextInput ref="4" style={styles.form} maxLength={1} keyboardType='numeric' onChangeText={(text) => this.setState({ inputFour: text })} />
                            </View>
                        }
                        <View style={styles.subContainerBottom2}>
                            <Text style={{ fontSize: width / 30 }}>{i18n.t('didNotCode')}</Text>
                            <TouchableOpacity onPress={() => this.resendCode()} style={styles.btn1}>
                                <Text style={styles.btnText1}>{i18n.t('resendCode')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this.onSubmit()} style={styles.btn2}>
                                <Text style={styles.btnText2}>{i18n.t('submit')}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => this.onCancel()}>
                            <View style={{ width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', marginTop: width / 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name="reject-icon" size={width / 18} style={{ marginTop: width / 80 }} color="#00c853" />
                                <Text style={{ fontSize: width / 18, color: '#00c853', fontWeight: 'bold', textAlign: 'center', marginLeft: width / 30 }}>{i18n.t('cancel')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}
const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: 'white',
        paddingBottom: width / 30
    },
    containerBottom: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    subContainerBottom1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width / 2.8,

    },
    subContainerBottom2: {
        flexDirection: 'row',
        paddingBottom: width / 10,
        paddingTop: width / 10,
    },
    btn1: {
        width: width / 3.5,
        height: width / 15,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0)',
    },
    btnText1: {
        textAlign: 'center',
        fontSize: width / 28,
        fontWeight: 'bold',
        color: 'black',
    },
    btn2: {
        width: width / 1.5,
        height: width / 8,
        borderRadius: width / 10,
        backgroundColor: '#00c853',
    },
    btnText2: {
        textAlign: 'center',
        fontSize: width / 18,
        color: 'white',
        padding: width / 20,
        paddingTop: width / 40,
    },
    form: {
        width: width / 15,
        height: width / 6,
        fontSize: width / 20,
        color: '#525252',
        borderBottomColor: 'grey',
        borderBottomWidth: width / 200,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    textBottom1: {
        paddingTop: width / 15,
        fontSize: width / 30
    },


})
export default EmailVerification