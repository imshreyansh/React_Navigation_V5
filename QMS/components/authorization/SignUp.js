import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, ActionSheetIOS, Picker, StyleSheet, Modal, Platform } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, textAlignForError, paddingRight } from '../../utils/resources/helpers'
import { showMessage, hideMessage } from "react-native-flash-message";
import Gender from '../../utils/resources/gender.json'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { request, PERMISSIONS, check, RESULTS } from 'react-native-permissions';
import DateTimePicker from "react-native-modal-datetime-picker";
import PhoneInput from 'react-native-phone-input'
import i18n from 'i18n-js'

class SignUp extends Component {
    _isMounted = false

    state = {
        loading: false,
        name: null,
        namee: '',
        email: null,
        emaile: '',
        personal: null,
        personale: '',
        nationality: null,
        nationalitye: i18n.t('nationality'),
        gendere: i18n.t('gender'),
        gender: null,
        branches: [],
        branch: null,
        branche: i18n.t('branch'),
        branchLabel: i18n.t('branch'),
        password: null,
        passworde: '',
        confirm: null,
        confirme: '',
        modalVisible: false,
        imageURI: null,
        finalName: '',
        visible: false,
        dob: null,
        show: '',
        dobe: '',
        age: '',
        agee: '',
        mobile: '',
        mobilee: '',
        input: '+973',
        rtl: null,
        viewStatus: false,
        viewStatusTwo: false,
        ageDisplay: '',
        weight: '',
        weighte: '',
        height: '',
        heighte: '',
        emergency: '',
        emergencye: '',
        emergencyInput: '',
        relationship: '',
        referral: ''
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
        this.setState({ modalVisible: visible });
    }



    showGenderPicker = () => {
        const data = Gender.map(l => l.name)
        data.push(i18n.t('pleaseSelect'))
        const len = data.length
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
            cancelButtonIndex: len - 1,
        },
            (buttonIndex) => {
                this.setState({ gender: data[buttonIndex] });
                if (Gender[buttonIndex] !== undefined) {
                    this.setState({
                        gender: Gender[buttonIndex].name,
                        gendere: Gender[buttonIndex].name,
                    })
                } else {
                    this.setState({
                        gender: '',
                        gendere: i18n.t('gender')
                    })
                }
            });
    }



    openCamera = () => {
        if (Platform.OS === 'android') {
            check(PERMISSIONS.ANDROID.CAMERA)
                .then(result => {
                    switch (result) {

                        case RESULTS.DENIED:
                            request(PERMISSIONS.ANDROID.CAMERA).then(result => {
                                if (result === 'granted') {
                                    const options = {
                                        maxWidth: 200,
                                        maxHeight: 200,
                                    }
                                    launchCamera(options, (response) => {
                                        if (response.didCancel) {
                                            this.setState({
                                                imageURI: ''
                                            })
                                        } else {
                                            this.setState({
                                                imageURI: {
                                                    name: response.fileName,
                                                    uri: response.uri,
                                                    type: response.type,
                                                    size: response.fileSize
                                                }
                                            }, () => {

                                                const finalName = 'Your Image'
                                                this.setState({
                                                    finalName
                                                })
                                                this.setModalVisible(false)
                                            })
                                        }


                                    });
                                }
                            });
                            break;
                        case RESULTS.GRANTED:
                            const options = {
                                maxWidth: 200,
                                maxHeight: 200,
                            }
                            launchCamera(options, (response) => {
                                if (response.didCancel) {
                                    this.setState({
                                        imageURI: ''
                                    })
                                } else {
                                    this.setState({
                                        imageURI: {
                                            name: response.fileName,
                                            uri: response.uri,
                                            type: response.type,
                                            size: response.fileSize
                                        }
                                    }, () => {

                                        const finalName = 'Your Image'
                                        this.setState({
                                            finalName
                                        })
                                        this.setModalVisible(false)
                                    })
                                }

                            });
                            break;
                        case RESULTS.BLOCKED:
                            Alert.alert('Allow the app for camera permissions from your phone settings');
                            break;
                    }
                })
        } else {
            check(PERMISSIONS.IOS.CAMERA)
                .then(result => {
                    switch (result) {

                        case RESULTS.DENIED:
                            request(PERMISSIONS.IOS.CAMERA).then(result => {
                                if (result === 'granted') {
                                    const options = {
                                        maxWidth: 200,
                                        maxHeight: 200,
                                    }
                                    launchCamera(options, (response) => {
                                        if (response.didCancel) {
                                            this.setState({
                                                imageURI: ''
                                            })
                                        } else {
                                            this.setState({
                                                imageURI: {
                                                    name: response.fileName,
                                                    uri: response.uri,
                                                    type: response.type,
                                                    size: response.fileSize
                                                }
                                            }, () => {

                                                const finalName = 'Your Image'
                                                this.setState({
                                                    finalName
                                                })
                                                this.setModalVisible(false)
                                            })
                                        }


                                    });
                                }
                            });
                            break;
                        case RESULTS.GRANTED:
                            const options = {
                                maxWidth: 200,
                                maxHeight: 200,
                            }
                            launchCamera(options, (response) => {
                                if (response.didCancel) {
                                    this.setState({
                                        imageURI: ''
                                    })
                                } else {
                                    this.setState({
                                        imageURI: {
                                            name: response.fileName,
                                            uri: response.uri,
                                            type: response.type,
                                            size: response.fileSize
                                        }
                                    }, () => {

                                        const finalName = 'Your Image'
                                        this.setState({
                                            finalName
                                        })
                                        this.setModalVisible(false)
                                    })
                                }

                            });
                            break;
                        case RESULTS.BLOCKED:
                            Alert.alert('Allow the app for camera permissions from your phone settings');
                            break;
                    }
                })
        }



    }

    openImageLibrary = () => {
        if (Platform.OS === 'android') {
            check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
                .then(result => {
                    switch (result) {

                        case RESULTS.DENIED:
                            request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(result => {
                                if (result === 'granted') {
                                    const options = {
                                        maxWidth: 200,
                                        maxHeight: 200,
                                    }
                                    launchImageLibrary(options, (response) => {
                                        if (response.didCancel) {
                                            this.setState({
                                                imageURI: ''
                                            })
                                        } else {
                                            this.setState({
                                                imageURI: {
                                                    name: response.fileName,
                                                    uri: response.uri,
                                                    type: response.type,
                                                    size: response.fileSize
                                                }
                                            }, () => {

                                                const finalName = 'Your Image'
                                                this.setState({
                                                    finalName
                                                })
                                                this.setModalVisible(false)
                                            })
                                        }


                                    });
                                }
                            });
                            break;
                        case RESULTS.GRANTED:
                            const options = {
                                maxWidth: 200,
                                maxHeight: 200,
                            }
                            launchImageLibrary(options, (response) => {
                                if (response.didCancel) {
                                    this.setState({
                                        imageURI: ''
                                    })
                                } else {
                                    this.setState({
                                        imageURI: {
                                            name: response.fileName,
                                            uri: response.uri,
                                            type: response.type,
                                            size: response.fileSize
                                        }
                                    }, () => {
                                        const finalName = 'Your Image'
                                        this.setState({
                                            finalName
                                        })
                                        this.setModalVisible(false)
                                    })
                                }

                            });
                            break;
                        case RESULTS.BLOCKED:
                            Alert.alert('Allow the app for camera permissions from your phone settings');
                            break;
                    }
                })
        } else {
            check(PERMISSIONS.IOS.CAMERA)
                .then(result => {
                    switch (result) {

                        case RESULTS.DENIED:
                            request(PERMISSIONS.IOS.CAMERA).then(result => {
                                if (result === 'granted') {
                                    const options = {
                                        maxWidth: 200,
                                        maxHeight: 200,
                                    }
                                    launchImageLibrary(options, (response) => {
                                        if (response.didCancel) {
                                            this.setState({
                                                imageURI: ''
                                            })
                                        } else {
                                            this.setState({
                                                imageURI: {
                                                    name: response.fileName,
                                                    uri: response.uri,
                                                    type: response.type,
                                                    size: response.fileSize
                                                }
                                            }, () => {

                                                const finalName = 'Your Image'
                                                this.setState({
                                                    finalName
                                                })
                                                this.setModalVisible(false)
                                            })
                                        }


                                    });
                                }
                            });
                            break;
                        case RESULTS.GRANTED:
                            const options = {
                                maxWidth: 200,
                                maxHeight: 200,
                            }
                            launchImageLibrary(options, (response) => {
                                if (response.didCancel) {
                                    this.setState({
                                        imageURI: ''
                                    })
                                } else {
                                    this.setState({
                                        imageURI: {
                                            name: response.fileName,
                                            uri: response.uri,
                                            type: response.type,
                                            size: response.fileSize
                                        }
                                    }, () => {

                                        const finalName = 'Your Image'
                                        this.setState({
                                            finalName
                                        })
                                        this.setModalVisible(false)
                                    })
                                }

                            });
                            break;
                        case RESULTS.BLOCKED:
                            Alert.alert('Allow the app for camera permissions from your phone settings');
                            break;
                    }
                })
        }


    }

    showDateTimePicker = () => {
        this.setState({ visible: true });
    }

    hideDateTimePicker = () => {
        this.setState({ visible: false });
    }

    handleDatePicked(date) {
        // const age = this.calculate_age(date)
        this.setState({
            dob: date.toISOString(),
            show: date.toISOString().split('T')[0].split('-').reverse().join('-'),
            dobe: '',
            // age
        })
        this.hideDateTimePicker()
    }

    calculate_age(date) {
        var diff_ms = Date.now() - date.getTime();
        var age_dt = new Date(diff_ms);
        var age = age_dt.getUTCFullYear() - 1970
        if (age > 14) {
            this.setState({
                agee: '',
                ageDisplay: age
            })
            return age
        } else {
            this.setState({
                agee: i18n.t('dobErrorTwo'),
                ageDisplay: age
            })
            return 0

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

    validateEmergencyPhone() {

        if (this.phoneTwo.isValidNumber() === true) {
            this.setState({
                emergencye: '',
                emergency: this.phoneTwo.getValue(),

            })
        } else {
            this.setState({
                emergencye: i18n.t('mobileErrorTwo')
            })
        }

    }

    onEmeregencySelectCountry = () => {
        this.setState({
            emergencyInput: "+" + this.phoneTwo.getCountryCode()
        })
    }



    validate = (text, type) => {
        const emailVer = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (type === 'name') {
            this.setState({
                name: text,
            })
            if (text === '') {
                this.setState({
                    namee: i18n.t('nameErrorTwo'),
                })
            } else {
                this.setState({
                    namee: '',
                    name: text
                })
            }
        } if (type === 'email') {
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
        } if (type === 'personal') {
            this.setState({
                personal: text,
            })
            if (text === '') {
                this.setState({
                    personale: i18n.t('personalErrorTwo'),
                })
            } else {
                this.setState({
                    personale: '',
                    personal: text
                })
            }
        } if (type === 'password') {
            this.setState({
                password: text,
                confirm: null
            })
            if (text === '') {
                this.setState({
                    passowrde: i18n.t('passwordError')
                })
            } else {
                if (text.length > 4 && text.length < 17) {
                    this.setState({
                        passworde: '',
                        password: text,
                        confirm: null
                    })
                } else {
                    this.setState({
                        passworde: i18n.t('passwordErrorTwo')
                    })
                }
            }
        } if (type === 'confirm') {
            this.setState({
                confirm: text,
            })
            if (text === '') {
                this.setState({
                    confirme: i18n.t('confirmErrorTwo')
                })
            } else {
                if (this.state.password === text) {
                    this.setState({
                        confirme: '',
                        confirm: text
                    })
                } else {
                    this.setState({
                        confirme: i18n.t('confirmErrorThree')
                    })
                }
            }
        } if (type === 'height') {
            this.setState({
                height: text
            })
            if (text !== '' && !(text < 300 && text > 20)) {
                this.setState({
                    heighte: 'error'
                })
            } else {
                this.setState({
                    heighte: '',
                    height: text
                })
            }
        } if (type === 'weight') {
            this.setState({
                weight: text
            })
            if (text !== '' && !(text < 1000 && text > 10)) {
                this.setState({
                    weighte: 'error'
                })
            } else {
                this.setState({
                    weighte: '',
                    weight: text
                })
            }
        }
    }

    onSubmit = () => {


        const { namee, emaile, mobilee, nationality, gender, imageURI, passworde, confirme, dobe, name, email, mobile, dob, password, confirm, personal, personale, branch, referral, agee, heighte, weighte } = this.state
        // if (name !== null && namee === '' && email !== null && emaile === '' && mobilee === '' && nationality !== null && nationality !== '' && gender !== null && gender !== '' && branch !== null && branch !== '' && imageURI !== '' && imageURI !== null && password !== null && passworde === '' && confirm !== null && confirme === '' && dobe === '' && personal !== null && personale === '' && agee === '' && heighte === '' && weighte === '') {
        if (name !== null && namee === '' && email !== null && emaile === '' && mobilee === '' && gender !== null && gender !== '' && password !== null && passworde === '' && confirm !== null && confirme === '' && dobe === '' && personal !== null && personale === '' && agee === '' && heighte === '' && weighte === '') {


        }
        if (name === '' || name === null) {
            this.setState({
                namee: i18n.t('nameError')
            })
        } if (email === '' || email === null) {
            this.setState({
                emaile: i18n.t('emailError')
            })
        } if (personal === '' || personal === null) {
            this.setState({
                personale: i18n.t('personalError')
            })
        } if (mobile === '' || mobile === null) {
            this.setState({
                mobilee: i18n.t('mobileError')
            })
        } if (dob === '' || dob === null) {
            this.setState({
                dobe: i18n.t('dobError')
            })
        }

        if (gender === '' || gender === null) {
            this.setState({
                gender: ''
            })
        }

        if (password === '' || password === null) {
            this.setState({
                passworde: i18n.t('passwordError')
            })
        } if (confirm === '' || confirm === null) {
            this.setState({
                confirme: i18n.t('confirmError')
            })
        }

    }

    renderGenderPicker() {
        if (Platform.OS === 'android') {
            return (
                <View style={[styles.form, { transform: transform(), flexDirection: 'row' }]}>
                    <Icon name="female" size={width / 18} style={{ top: width / 30, marginLeft: width / 30 }} color="grey" />
                    <Picker
                        mode='dropdown'
                        style={{ bottom: 0, color: '#333', width: w / 1.3 }}
                        selectedValue={this.state.gender}
                        onValueChange={(itemValue) => this.setState({ gender: itemValue })}>
                        <Picker.Item label={i18n.t('gender')} value='' />
                        {
                            Gender.map((v) => {
                                return <Picker.Item label={v.name} value={v.name} key={v.name} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showGenderPicker()}>
                    <View style={[styles.form, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 23, color: '#333' }}>{this.state.gendere}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }
    render() {
        return (
            <KeyboardAvoidingView>
                {/* <Loader loading={this.state.loading} text='Registering User' /> */}
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <Text style={{ marginTop: width / 20, marginLeft: width / 20, fontWeight: 'bold', fontSize: width / 16, color: '#333', paddingRight: this.state.rtl ? 20 : 0 }}>{i18n.t('signUp')}</Text>
                    <View style={{ transform: transform(), width: w / 1.05, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20, }}>
                        <View style={{ marginTop: width / 30, width: w / 1.1, borderWidth: 1, borderColor: '#ddd', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#fafafa', flexDirection: 'row', borderRadius: width / 12 }}>
                            <Icon name="user" size={width / 18} style={{ top: width / 40, marginLeft: width / 30 }} color="grey" />
                            <TextInput

                                autoCapitalize='words'
                                onChangeText={(text) => this.validate(text, 'name')}
                                value={this.state.name}
                                style={{ fontSize: width / 25, transform: transform(), textAlign: textAlign(), color: '#333', width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 8, paddingLeft: width / 30 }}
                                returnKeyType='next'
                                placeholderTextColor='#333'
                                placeholder={i18n.t('name')} />
                        </View>
                        <Text style={{ textAlign: 'right', color: 'red', transform: transform(), textAlign: textAlignForError(), fontSize: width / 30, top: 5, marginRight: width / 30 }}>{this.state.namee}</Text>

                        <View style={{ marginTop: width / 30, width: w / 1.1, borderWidth: 1, borderColor: '#ddd', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#fafafa', flexDirection: 'row', borderRadius: width / 12 }}>
                            <Icon name="email" size={width / 18} style={{ top: width / 30, marginLeft: width / 30 }} color="grey" />
                            <TextInput
                                autoCapitalize='none'
                                onChangeText={(text) => this.validate(text, 'email')}
                                value={this.state.email}
                                style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 8, paddingLeft: width / 30 }}
                                returnKeyType='next'
                                placeholderTextColor='#333'
                                placeholder={i18n.t('email')} />
                        </View>
                        <Text style={{ textAlign: 'right', color: 'red', transform: transform(), textAlign: textAlignForError(), fontSize: width / 30, top: 5, marginRight: width / 30 }}>{this.state.emaile}</Text>
                        <View style={{ marginTop: width / 30, width: w / 1.1, borderWidth: 1, borderColor: '#ddd', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#fafafa', flexDirection: 'row', borderRadius: width / 12 }}>
                            <Icon name="help-mobile" size={width / 18} style={{ top: width / 30, marginLeft: width / 30 }} color="grey" />
                            <TextInput

                                autoCapitalize='none'
                                onChangeText={(text) => this.validate(text, 'personal')}
                                value={this.state.personal}
                                style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 8, paddingLeft: width / 30 }}
                                returnKeyType='next'
                                placeholderTextColor='#333'
                                placeholder={i18n.t('personalId')} />
                        </View>
                        <Text style={{ textAlign: 'right', color: 'red', transform: transform(), textAlign: textAlignForError(), fontSize: width / 30, top: 5, marginRight: width / 30 }}>{this.state.personale}</Text>
                        <View style={{ height: width / 8, marginTop: width / 30, width: w / 1.1, borderWidth: 1, borderColor: '#ddd', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#fafafa', flexDirection: 'row', borderRadius: width / 12 }}>
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
                        <TouchableOpacity onPress={() => this.showDateTimePicker()} >
                            <View style={{ height: width / 8, marginTop: width / 30, width: w / 1.1, borderWidth: 1, borderColor: '#ddd', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#fafafa', flexDirection: 'row', borderRadius: width / 12 }}>
                                <Icon name="calender" size={width / 18} style={{ top: width / 30, marginLeft: width / 30 }} color="grey" />
                                <View style={{ marginLeft: 'auto', marginRight: 'auto', transform: transform(), flexDirection: 'row', width: w / 1.2 }}>
                                    <Text style={{ fontSize: width / 25, color: '#333', marginTop: width / 30, textAlign: textAlign(), width: w / 1.5, marginLeft: width / 30 }}>{this.state.show === '' ? i18n.t('dateOfBirth') : this.state.show}</Text>
                                    <Icon name="down-arrow" size={width / 18} style={{ marginTop: width / 30, marginLeft: width / 50 }} color="grey" />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'right', color: 'red', transform: transform(), textAlign: textAlignForError(), fontSize: width / 30, top: 5, marginRight: width / 30 }}>{this.state.dobe !== '' ? this.state.dobe : this.state.agee}</Text>
                        <DateTimePicker
                            isVisible={this.state.visible}
                            maximumDate={new Date()}
                            mode='date'
                            onConfirm={(date) => this.handleDatePicked(date)}
                            onCancel={() => this.hideDateTimePicker()}
                        />


                        <View style={{ marginTop: width / 30, width: w / 1.1, borderWidth: 1, borderColor: '#ddd', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#fafafa', flexDirection: 'row', borderRadius: width / 12 }}>
                            <Icon name="location" size={width / 18} style={{ top: width / 30, marginLeft: width / 30 }} color="grey" />
                            <TextInput

                                autoCapitalize='words'
                                onChangeText={(text) => this.setState({ relationship: text })}
                                value={this.state.relationship}
                                style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 8, paddingLeft: width / 30 }}
                                returnKeyType='next'
                                placeholderTextColor='#333'
                                placeholder={i18n.t('address')} />
                        </View>

                        <Text style={{ transform: transform(), textAlign: textAlignForError(), color: 'red', fontSize: width / 30, top: 5, marginRight: width / 30 }}>{''}</Text>
                        <View style={{ marginTop: width / 50 }}>
                            {this.renderGenderPicker()}

                        </View>
                        <Text style={{ transform: transform(), textAlign: textAlignForError(), color: 'red', fontSize: width / 30, top: 5, marginRight: width / 30 }}>{this.state.gender === '' ? i18n.t('genderError') : ''}</Text>

                        <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                            <View style={{ height: width / 8, marginTop: width / 30, width: w / 1.1, borderWidth: 1, borderColor: '#ddd', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#fafafa', flexDirection: 'row', borderRadius: width / 12 }}>
                                <Icon name="recording-online" size={width / 18} style={{ top: width / 30, marginLeft: width / 30 }} color="grey" />
                                <View style={{ transform: transform(), marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', width: w / 1.2 }}>
                                    <Text style={{ textAlign: textAlign(), fontSize: width / 25, color: '#333', width: w / 1.5, marginTop: width / 30, marginLeft: width / 30 }}>{this.state.imageURI === '' || this.state.imageURI === null ? i18n.t('uploadPhoto') : this.state.finalName}</Text>
                                    <Icon name="login" size={width / 18} style={{ marginTop: width / 30, }} color="grey" />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text style={{ transform: transform(), textAlign: textAlignForError(), color: 'red', fontSize: width / 30, top: 5, marginRight: width / 30 }}>{this.state.imageURI === '' ? i18n.t('imageError') : ''}</Text>

                        <View style={{ marginTop: width / 30, width: w / 1.1, borderWidth: 1, borderColor: '#ddd', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#fafafa', flexDirection: 'row', borderRadius: width / 12 }}>
                            <Icon name="password" size={width / 18} style={{ top: width / 30, marginLeft: width / 30 }} color="grey" />
                            <View style={{ flexDirection: 'row', width: w / 1.2, marginLeft: 'auto', marginRight: 'auto' }}>
                                {this.state.viewStatus === true ?
                                    <TextInput
                                        autoCapitalize='none'
                                        onChangeText={(text) => this.validate(text, 'password')}
                                        value={this.state.password}
                                        style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.5, height: width / 8, paddingLeft: width / 30 }}
                                        returnKeyType='next'
                                        placeholderTextColor='#333'
                                        placeholder={i18n.t('password')} /> :
                                    <TextInput
                                        secureTextEntry
                                        autoCapitalize='none'
                                        onChangeText={(text) => this.validate(text, 'password')}
                                        value={this.state.password}
                                        style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.5, height: width / 8, paddingLeft: width / 30 }}
                                        returnKeyType='next'
                                        placeholderTextColor='#333'
                                        placeholder={i18n.t('password')} />
                                }
                                <TouchableOpacity onPress={() => this.setState({ viewStatus: !this.state.viewStatus })}>
                                    <Icon name={this.state.viewStatus === true ? "eye" : "pending"} size={width / 16} style={{ top: width / 30 }} color="grey" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={{ textAlign: 'right', color: 'red', transform: transform(), textAlign: textAlignForError(), fontSize: width / 30, top: 5, marginRight: width / 30 }}>{this.state.passworde}</Text>
                        <View style={{ marginTop: width / 30, width: w / 1.1, borderWidth: 1, borderColor: '#ddd', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#fafafa', flexDirection: 'row', borderRadius: width / 12 }}>
                            <Icon name="password" size={width / 18} style={{ top: width / 30, marginLeft: width / 30 }} color="grey" />
                            <View style={{ flexDirection: 'row', width: w / 1.2, marginLeft: 'auto', marginRight: 'auto' }}>
                                {this.state.viewStatusTwo === true ?
                                    <TextInput

                                        autoCapitalize='none'
                                        onChangeText={(text) => this.validate(text, 'confirm')}
                                        value={this.state.confirm}
                                        style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.2, height: width / 8, paddingLeft: width / 30 }}
                                        returnKeyType='next'
                                        placeholderTextColor='#333'
                                        placeholder={i18n.t('confirmPassword')} />
                                    :
                                    <TextInput
                                        secureTextEntry
                                        autoCapitalize='none'
                                        onChangeText={(text) => this.validate(text, 'confirm')}
                                        value={this.state.confirm}
                                        style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.5, height: width / 8, paddingLeft: width / 30 }}
                                        returnKeyType='next'
                                        placeholderTextColor='#333'
                                        placeholder={i18n.t('confirmPassword')} />
                                }
                                <TouchableOpacity onPress={() => this.setState({ viewStatusTwo: !this.state.viewStatusTwo })}>
                                    <Icon name={this.state.viewStatusTwo === true ? "eye" : "pending"} size={width / 16} style={{ top: width / 30 }} color="grey" />
                                </TouchableOpacity>

                            </View>
                        </View>
                        <Text style={{ textAlign: 'right', color: 'red', transform: transform(), textAlign: textAlignForError(), fontSize: width / 30, top: 5, marginRight: width / 30 }}>{this.state.confirme}</Text>
                    </View>

                    <TouchableOpacity onPress={() => this.onSubmit()}>
                        <View style={{ width: w / 1.2, backgroundColor: 'orange', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                            <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50 }}>{i18n.t('submit')}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <View style={{ width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', marginTop: width / 20, justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="reject-icon" size={width / 18} style={{ marginTop: width / 80 }} color="orange" />
                            <Text style={{ fontSize: width / 18, color: 'orange', fontWeight: 'bold', textAlign: 'center', marginLeft: width / 30 }}>{i18n.t('cancel')}</Text>
                        </View>
                    </TouchableOpacity>

                    <Modal
                        transparent={true}
                        visible={this.state.modalVisible}
                    >
                        <View elevation={3} style={{ backgroundColor: 'white', height: width / 2.2, width: width - 40, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: w / 1.15, marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0.5, paddingBottom: width / 60 }}>
                                <Text style={{ fontSize: width / 20, marginLeft: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], textAlign: this.state.isRTL ? 'right' : 'left' }}>{i18n.t('uploadPhoto')}</Text>
                                <TouchableOpacity onPress={() => this.setModalVisible(false)}>
                                    <Icon name="close" size={width / 20} style={{ marginRight: width / 30 }} color="black" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => this.openCamera()}>
                                <View style={{ marginTop: width / 20, marginLeft: width / 30 }}>
                                    <Text style={{ fontSize: width / 22, paddingRight: paddingRight() }}>{i18n.t('takePicture')}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.openImageLibrary()}>
                                <View style={{ marginTop: width / 20, marginLeft: width / 30 }}>
                                    <Text style={{ fontSize: width / 22, paddingRight: paddingRight() }}>{i18n.t('selectFromGallery')}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Modal>
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

    form: {
        marginTop: width / 30,
        width: w / 1.1,
        borderWidth: 1,
        borderColor: '#ddd',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: '#fafafa',
        borderRadius: width / 12,
        height: width / 8,
    },
    forme: {
        marginTop: width / 30,
        width: w / 1.1,
        borderWidth: 1,
        borderColor: 'red',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: '#fafafa',
        borderRadius: width / 12,
        height: width / 8,
    },

})
export default SignUp