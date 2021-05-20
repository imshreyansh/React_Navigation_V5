import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, ImageBackground, StyleSheet } from 'react-native'
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
        input: '',
        page: 1,
        inputOne: '',
        inputTwo: '',
        inputThree: '',
        inputFour: ''
    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {

        }
    }


    componentWillUnmount() {
        this._isMounted = false

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


    focusNextField(nextField, text) {
        if (text.length === 1) {
            this.refs[nextField].focus();
        }
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

    onSubmit = () => {
        this.setState({ page: 2 })
    }

    renderView = () => {
        if (this.state.page === 1) {
            return (

                <View>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: height / 8 }}>
                        <Icon name="OTP" size={width / 4} color="grey" />
                        <Text style={{ fontSize: width / 15, fontWeight: 'bold', color: '#424242', textAlign: 'center', marginTop: width / 30 }}>Enter your Phone Number</Text>
                        <Text style={{ fontSize: width / 22, color: '#9e9e9e', textAlign: 'center', marginTop: width / 30, width: w / 1.08 }}>We will send you an One Time Password on this mobile number</Text>
                    </View>
                    <View>
                        <View style={{ height: width / 8, marginTop: height / 20, width: w / 1.1, borderWidth: 1, borderColor: '#ddd', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#fafafa', flexDirection: 'row', borderRadius: width / 12 }}>
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
                </View>
            )
        } else {
            return (
                <View>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: height / 8 }}>
                        <Icon name="OTP" size={width / 4} color="grey" />
                        <Text style={{ fontSize: width / 15, fontWeight: 'bold', color: '#424242', textAlign: 'center', marginTop: width / 30 }}>OTP Verification</Text>
                        <Text style={{ fontSize: width / 22, color: '#9e9e9e', textAlign: 'center', marginTop: width / 30, width: w / 1.08 }}>Enter the 4 digit OTP that was sent on</Text>
                        <Text style={{ fontSize: width / 22, color: '#0288d1', fontWeight: 'bold', textAlign: 'center', marginTop: width / 30, width: w / 1.08 }}>(+97339611888)</Text>
                    </View>
                    <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: height / 20 }}>
                        {i18n.locale === 'ar' ?
                            <View style={styles.subContainerBottom1}>
                                <TextInput ref="1" value={this.state.inputOne} style={styles.form} maxLength={1} keyboardType='numeric' onChangeText={(text) => this.setState({ inputOne: text })} />
                                <TextInput ref="2" value={this.state.inputTwo} style={styles.form} maxLength={1} keyboardType='numeric' onChangeText={(text) => { this.setState({ inputTwo: text }), this.focusNextField('1', text) }} />
                                <TextInput ref="3" value={this.state.inputThree} style={styles.form} maxLength={1} keyboardType='numeric' onChangeText={(text) => { this.setState({ inputThree: text }), this.focusNextField('2', text) }} />
                                <TextInput ref="4" value={this.state.inputFour} style={styles.form} maxLength={1} keyboardType='numeric' onChangeText={(text) => { this.setState({ inputFour: text }), this.focusNextField('3', text) }} />
                            </View> :
                            <View style={styles.subContainerBottom1}>
                                <TextInput ref="1" value={this.state.inputOne} style={styles.form} maxLength={1} keyboardType='numeric' onChangeText={(text) => { this.setState({ inputOne: text }), this.focusNextField('2', text) }} />
                                <TextInput ref="2" value={this.state.inputTwo} style={styles.form} maxLength={1} keyboardType='numeric' onChangeText={(text) => { this.setState({ inputTwo: text }), this.focusNextField('3', text) }} />
                                <TextInput ref="3" value={this.state.inputThree} style={styles.form} maxLength={1} keyboardType='numeric' onChangeText={(text) => { this.setState({ inputThree: text }), this.focusNextField('4', text) }} />
                                <TextInput ref="4" value={this.state.inputFour} style={styles.form} maxLength={1} keyboardType='numeric' onChangeText={(text) => this.setState({ inputFour: text })} />
                            </View>
                        }
                        <Text style={{ textAlign: 'right', color: 'red', fontSize: width / 30, top: 5, transform: transform(), textAlign: textAlignForError(), marginRight: width / 30 }}>{this.state.mobilee}</Text>
                    </View>
                    <TouchableOpacity>
                        <View style={{ marginTop: width / 50, flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto' }}>
                            <Text style={{ fontSize: width / 25, color: '#9e9e9e', textAlign: 'center' }}>Didn't recieved OTP ? </Text>
                            <Text style={{ fontSize: width / 25, color: 'red', textAlign: 'center', fontWeight: 'bold' }}>Resend</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
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
                        {this.renderView()}
                    </KeyboardAvoidingView>

                    <TouchableOpacity onPress={() => this.onSubmit()}>
                        <View style={{ width: w / 1.2, backgroundColor: 'orange', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                            <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50 }}>{this.state.page === 1 ? i18n.t('submit') : i18n.t('verify')}</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>

            </View >
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
        width: width / 1.5,

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
        backgroundColor: '#edc006',
    },
    btnText2: {
        textAlign: 'center',
        fontSize: width / 18,
        color: '#333',
        padding: width / 20,
        fontWeight: 'bold',
        paddingTop: width / 40,
    },
    form: {
        width: width / 8,
        height: width / 7,
        fontSize: width / 20,
        color: '#525252',
        borderColor: 'grey',
        borderRadius: 3,
        textAlign: 'center',
        backgroundColor: '#eee',
        fontWeight: 'bold'
    },
    textBottom1: {
        paddingTop: width / 15,
        fontSize: width / 30
    },
})

export default ForgotPassword