import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, ImageBackground } from 'react-native'
import { h, w, width, height, Icon, transform, textAlign, textAlignForError } from '../../utils/resources/helpers'
import design from '../../assets/images/design.png'
import pixel from '../../assets/images/pixel.png'
import PhoneInput from 'react-native-phone-input'
import i18n from 'i18n-js'

class ForgotPassword extends Component {
    state = {
        email: '',
        viewStatus: false,
        password: '',
        text: 'Enter the registered email id and you will get the security code',
        buttonEmail: 'email',
        mobilee: '',
        emaile: '',
        input: ''
    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {

        }
    }


    componentWillUnmount() {
        this._isMounted = false

    }

    renderButtons = () => {
        if (this.state.buttonEmail === 'email') {
            return (
                <View style={{ width: w / 1.15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20 }}>
                    <TouchableOpacity onPress={() => this.setState({ buttonEmail: 'email', text: 'Enter the registered email id and you will get the security code' })}>
                        <View style={{ width: w / 2.5, backgroundColor: '#01579b', padding: width / 40, borderRadius: 3 }}>
                            <Text style={{ fontSize: width / 15, color: 'white', textAlign: 'center' }}>Email</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ buttonEmail: 'mobile', text: 'Enter the registered mobile number and you will get the security code' })}>
                        <View style={{ width: w / 2.5, backgroundColor: '#bdbdbd', padding: width / 40, borderRadius: 3 }}>
                            <Text style={{ fontSize: width / 15, color: '#333', textAlign: 'center' }}>Mobile</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View style={{ width: w / 1.15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20 }}>
                    <TouchableOpacity onPress={() => this.setState({ buttonEmail: 'email', text: 'Enter the registered email id and you will get the security code' })}>
                        <View style={{ width: w / 2.5, backgroundColor: '#bdbdbd', padding: width / 40, borderRadius: 3 }}>
                            <Text style={{ fontSize: width / 15, color: '#333', textAlign: 'center' }}>Email</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ buttonEmail: 'mobile', text: 'Enter the registered mobile number and you will get the security code' })}>
                        <View style={{ width: w / 2.5, backgroundColor: '#01579b', padding: width / 40, borderRadius: 3 }}>
                            <Text style={{ fontSize: width / 15, color: 'white', textAlign: 'center' }}>Mobile</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    renderInput = () => {
        if (this.state.buttonEmail === 'email') {
            return (
                <View>
                    <View style={{ marginTop: height / 20, width: w / 1.1, borderBottomWidth: 1, borderBottomColor: '#ddd', marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row' }}>
                        <Icon name="email" size={width / 18} style={{ top: width / 40, marginLeft: width / 30 }} color="grey" />
                        <TextInput
                            autoCapitalize='none'
                            onChangeText={(text) => this.validate(text, 'email')}
                            value={this.state.email}
                            style={{ fontSize: width / 25, transform: transform(), textAlign: textAlign(), color: '#333', width: w / 1.4, marginLeft: 'auto', marginRight: 'auto', height: width / 9, paddingLeft: 8 }}
                            returnKeyType='next'
                            placeholderTextColor='grey'
                            placeholder={i18n.t('email')} />
                    </View>
                    <Text style={{ textAlign: 'right', color: 'red', transform: transform(), textAlign: textAlignForError(), fontSize: width / 30, top: 5, marginRight: width / 30 }}>{this.state.emaile}</Text>
                </View>
            )
        } else {
            return (
                <View>
                    <View style={{ height: width / 8, marginTop: height / 20, width: w / 1.1, borderBottomWidth: 1, borderBottomColor: '#ddd', marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row' }}>
                        <Icon name="mobile" size={width / 18} style={{ top: width / 30, marginLeft: width / 30 }} color="grey" />
                        <PhoneInput
                            ref={(ref) => {
                                this.phone = ref;
                            }}

                            value={this.state.input}
                            textStyle={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.6 }}
                            style={{ paddingLeft: width / 30 }}
                            onChangePhoneNumber={() => this.validatePhone()}
                            onSelectCountry={() => this.onSelectCountry()}
                        />

                    </View>
                    <Text style={{ textAlign: 'right', color: 'red', fontSize: width / 30, top: 5, transform: transform(), textAlign: textAlignForError(), marginRight: width / 30 }}>{this.state.mobilee}</Text>
                </View>

            )
        }
    }


    validatePhone() {
        const pno = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[s/0-9]*$/

        if (this.phone.getValue() === '') {
            this.setState({
                mobilee: i18n.t('mobileErrorThree')
            })
        } else {
            if (this.phone.isValidNumber() === true && pno.test(this.phone.getValue())) {
                this.setState({
                    mobilee: '',
                    mobile: this.phone.getValue(),

                })
            } else {
                this.setState({
                    mobilee: i18n.t('mobileErrorTwo')
                })
            }
        }
    }

    onSelectCountry = () => {
        this.setState({
            input: "+" + this.phone.getCountryCode()
        })
    }

    validate = (text, type) => {
        const emailVer = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (type === 'email') {
            this.setState({
                email: text,
            })
            if (text === '') {
                this.setState({
                    emaile: i18n.t('emailErrorThree')
                })
            } else {
                if (!emailVer.test(text)) {
                    this.setState({
                        emaile: i18n.t('emailErrorTwo')
                    })
                } else {
                    this.setState({
                        emaile: '',
                        email: text
                    })
                }
            }
        }
    }

    render() {
        return (

            // {`M100.36,-200.17 C${w * 2.5},173.19 80.23,50.34 -16.08,500.95 L-37.52,211.67 L0.00,0.00 Z`}
            <View style={{ flex: 1, backgroundColor: 'white' }}>

                <View style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="back" size={width / 12} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 50 }}>

                    <KeyboardAvoidingView behavior='padding'>

                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: height / 8 }}>
                            <Icon name="password" size={width / 4} color="grey" />
                            <Text style={{ fontSize: width / 15, fontWeight: 'bold', color: '#424242', textAlign: 'center', marginTop: width / 30 }}>Forgot Password ?</Text>
                            <Text style={{ fontSize: width / 22, color: '#9e9e9e', textAlign: 'center', marginTop: width / 30, width: w / 1.08 }}>{this.state.text}</Text>
                        </View>
                        {this.renderButtons()}
                        {this.renderInput()}
                    </KeyboardAvoidingView>

                    <TouchableOpacity onPress={() => this.onSubmit()}>
                        <View style={{ width: w / 1.2, backgroundColor: 'orange', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                            <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50 }}>{i18n.t('submit')}</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>

            </View >
        )
    }
}

export default ForgotPassword