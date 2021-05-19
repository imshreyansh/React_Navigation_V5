import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, ActionSheetIOS, Picker, StyleSheet, Modal, Platform } from 'react-native';
import loginBg from '../../assets/images/loginBg.png';
import { Icon, width, height, w, h, transform, textAlign, textAlignForError, paddingRight } from '../../utils/api/helpers'
import Loader from '../../utils/resources/Loader'
import { showMessage, hideMessage } from "react-native-flash-message";
import { verify, getAllBranch } from '../../utils/api/authorization'
import { checkReferralCodeValidity } from '../../utils/api/rewards'
import Nations from '../../utils/data/country.json'
import Gender from '../../utils/data/gender.json'
import * as ImagePicker from 'react-native-image-picker';
import { request, PERMISSIONS, check, RESULTS } from 'react-native-permissions';
import DateTimePicker from "react-native-modal-datetime-picker";
import PhoneInput from 'react-native-phone-input';
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

            getAllBranch().then(res => {
                if (res) {
                    this.setState({
                        branches: res.data.response
                    })
                }
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }


    showNationalityPicker = () => {
        const data = Nations.map(l => l.name)
        data.push(i18n.t('pleaseSelect'))
        const len = data.length
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
            cancelButtonIndex: len - 1,
        },
            (buttonIndex) => {
                this.setState({ nationality: data[buttonIndex] });
                if (Nations[buttonIndex] !== undefined) {
                    this.setState({
                        nationality: Nations[buttonIndex].name,
                        nationalitye: Nations[buttonIndex].name,
                    })
                } else {
                    this.setState({
                        nationality: '',
                        nationalitye: i18n.t('nationality')
                    })
                }
            });
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

    showBranchPicker = () => {
        const data = this.state.branches.map(l => l.branchName)
        data.push(i18n.t('pleaseSelect'))
        const len = data.length
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
            cancelButtonIndex: len - 1,
        },
            (buttonIndex) => {
                this.setState({ branchLabel: data[buttonIndex] });
                if (this.state.branches[buttonIndex]) {
                    this.setState({
                        branch: this.state.branches[buttonIndex]._id,
                        branche: data[buttonIndex],
                    })
                } else {
                    this.setState({
                        branch: '',
                        branche: i18n.t('branch')
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
                                    ImagePicker.launchCamera(options, (response) => {
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
                            ImagePicker.launchCamera(options, (response) => {
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
                                    ImagePicker.launchCamera(options, (response) => {
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
                            ImagePicker.launchCamera(options, (response) => {
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
                                    ImagePicker.launchImageLibrary(options, (response) => {
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
                            ImagePicker.launchImageLibrary(options, (response) => {
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
                                    ImagePicker.launchImageLibrary(options, (response) => {
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
                            ImagePicker.launchImageLibrary(options, (response) => {
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
        const age = this.calculate_age(date)
        this.setState({
            dob: date.toISOString(),
            show: date.toISOString().split('T')[0].split('-').reverse().join('-'),
            dobe: '',
            age
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
    renderNationalityPicker() {
        if (Platform.OS === 'android') {
            return (
                <View style={[this.state.nationality !== '' ? styles.form : styles.forme, { transform: transform() }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: 0, color: '#333' }}
                        selectedValue={this.state.nationality}
                        onValueChange={(itemValue) => this.setState({ nationality: itemValue })}>
                        <Picker.Item label={i18n.t('nationality')} value='' />
                        {
                            Nations.map((v) => {
                                return <Picker.Item label={v.name} value={v.name} key={v.name} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showNationalityPicker()}>
                    <View style={[this.state.nationality !== '' ? styles.form : styles.forme, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 23, color: '#333' }}>{this.state.nationalitye}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    renderBranchPicker() {
        if (Platform.OS === 'android') {
            return (
                <View style={[this.state.branch !== '' ? styles.form : styles.forme, { transform: transform() }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: 0, color: '#333' }}
                        selectedValue={this.state.branch}
                        onValueChange={(itemValue) => this.setState({ branch: itemValue })}>
                        <Picker.Item label={i18n.t('branch')} value='' />
                        {
                            this.state.branches.map((v) => {
                                return <Picker.Item label={v.branchName} value={v._id} key={v._id} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showBranchPicker()}>
                    <View style={[this.state.branch !== '' ? styles.form : styles.forme, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 23, color: '#333' }}>{this.state.branche}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
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
        if (name !== null && namee === '' && email !== null && emaile === '' && mobilee === '' && nationality !== null && nationality !== '' && gender !== null && gender !== '' && branch !== null && branch !== '' && imageURI !== '' && imageURI !== null && password !== null && passworde === '' && confirm !== null && confirme === '' && dobe === '' && personal !== null && personale === '' && agee === '' && heighte === '' && weighte === '') {
            if (referral !== '') {
                const obj = {
                    code: this.state.referral
                }
                this.setState({
                    loading: true
                })
                checkReferralCodeValidity(obj).then(res => {
                    if (res) {
                        const emailLower = this.state.email.toLowerCase()

                        const data = {
                            email: this.state.email
                        }

                        verify(data).then(res => {
                            if (res) {
                                const avatar = this.state.imageURI
                                const code = res.data.response.code
                                const obj = {
                                    userName: this.state.name,
                                    email: emailLower,
                                    personalId: this.state.personal,
                                    mobileNo: this.state.mobile,
                                    dateOfBirth: this.state.dob,
                                    nationality: this.state.nationality,
                                    gender: this.state.gender,
                                    password: this.state.password,
                                    branch: this.state.branch,
                                    height: this.state.height,
                                    weight: this.state.weight,
                                    emergencyNumber: this.state.emergency,
                                    relationship: this.state.relationship,
                                    referralCode: this.state.referral
                                }
                                this.setState({
                                    loading: false
                                })

                                this.props.navigation.navigate('EmailVerification', { obj, avatar, code })

                            } else {
                                this.setState({
                                    loading: false
                                })
                                showMessage({
                                    message: "Email already exist !!",
                                    type: "error",
                                })
                            }
                        })
                    } else {
                        this.setState({
                            loading: false
                        })
                    }
                })
            }
            else {
                const emailLower = this.state.email.toLowerCase()
                this.setState({
                    loading: true
                })


                const data = {
                    email: this.state.email
                }

                verify(data).then(res => {
                    if (res) {
                        const avatar = this.state.imageURI
                        const code = res.data.response.code
                        const obj = {
                            userName: this.state.name,
                            email: emailLower,
                            personalId: this.state.personal,
                            mobileNo: this.state.mobile,
                            dateOfBirth: this.state.dob,
                            nationality: this.state.nationality,
                            gender: this.state.gender,
                            password: this.state.password,
                            branch: this.state.branch,
                            height: this.state.height,
                            weight: this.state.weight,
                            emergencyNumber: this.state.emergency,
                            relationship: this.state.relationship,
                            referralCode: this.state.referral
                        }
                        this.setState({
                            loading: false
                        })

                        this.props.navigation.navigate('EmailVerification', { obj, avatar, code })

                    } else {
                        this.setState({
                            loading: false
                        })
                        showMessage({
                            message: "Email already exist !!",
                            type: "error",
                        })
                    }
                })
            }

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
        } if (nationality === '' || nationality === null) {
            this.setState({
                nationality: ''
            })
        } if (gender === '' || gender === null) {
            this.setState({
                gender: ''
            })
        } if (branch === '' || branch === null) {
            this.setState({
                branch: ''
            })
        } if (imageURI === '' || imageURI === null) {
            this.setState({
                imageURI: ''
            })
        } if (password === '' || password === null) {
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
                <View style={[this.state.gender !== '' ? styles.form : styles.forme, { transform: transform() }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: 0, color: '#333' }}
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
                    <View style={[this.state.gender !== '' ? styles.form : styles.forme, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
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
                <Loader loading={this.state.loading} text='Registering User' />
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <Text style={{ marginTop: width / 20, marginLeft: width / 20, fontWeight: 'bold', fontSize: width / 16, color: '#333', paddingRight: this.state.rtl ? 20 : 0 }}>{i18n.t('signUp')}</Text>
                    <View style={{ transform: transform(), width: w / 1.05, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20, }}>
                        <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#eeeeee', borderRadius: 3, borderWidth: this.state.name === '' || this.state.namee !== '' ? 1 : 0, borderColor: this.state.name === '' || this.state.namee !== '' ? 'red' : '' }}>
                            <TextInput

                                autoCapitalize='words'
                                onChangeText={(text) => this.validate(text, 'name')}
                                value={this.state.name}
                                style={{ fontSize: width / 25, transform: transform(), textAlign: textAlign(), color: '#333', width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 8, }}
                                returnKeyType='next'
                                placeholderTextColor='#333'
                                placeholder={i18n.t('name')} />
                        </View>
                        <Text style={{ textAlign: 'right', color: 'red', transform: transform(), textAlign: textAlignForError(), fontSize: width / 30, top: 5, marginRight: width / 30 }}>{this.state.namee}</Text>

                        <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#eeeeee', borderRadius: 3, marginTop: width / 30, borderWidth: this.state.email === '' || this.state.emaile !== '' ? 1 : 0, borderColor: this.state.email === '' || this.state.emaile !== '' ? 'red' : '' }}>
                            <TextInput

                                autoCapitalize='none'
                                onChangeText={(text) => this.validate(text, 'email')}
                                value={this.state.email}
                                style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 8, }}
                                returnKeyType='next'
                                placeholderTextColor='#333'
                                placeholder={i18n.t('email')} />
                        </View>
                        <Text style={{ textAlign: 'right', color: 'red', transform: transform(), textAlign: textAlignForError(), fontSize: width / 30, top: 5, marginRight: width / 30 }}>{this.state.emaile}</Text>
                        <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#eeeeee', borderRadius: 3, marginTop: width / 30, borderWidth: this.state.personal === '' || this.state.personale !== '' ? 1 : 0, borderColor: this.state.personal === '' || this.state.personale !== '' ? 'red' : '' }}>
                            <TextInput

                                autoCapitalize='none'
                                onChangeText={(text) => this.validate(text, 'personal')}
                                value={this.state.personal}
                                style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 8, }}
                                returnKeyType='next'
                                placeholderTextColor='#333'
                                placeholder={i18n.t('personalId')} />
                        </View>
                        <Text style={{ textAlign: 'right', color: 'red', transform: transform(), textAlign: textAlignForError(), fontSize: width / 30, top: 5, marginRight: width / 30 }}>{this.state.personale}</Text>
                        <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#eeeeee', borderRadius: 3, marginTop: width / 30, height: width / 8, borderWidth: this.state.mobilee !== '' ? 1 : 0, borderColor: this.state.mobilee !== '' ? 'red' : '' }}>

                            <PhoneInput
                                ref={(ref) => {
                                    this.phone = ref;
                                }}

                                value={this.state.input}
                                initialCountry='bh'
                                textStyle={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), }}
                                style={{ top: width / 30, paddingLeft: width / 30 }}
                                onChangePhoneNumber={() => this.validatePhone()}
                                onSelectCountry={() => this.onSelectCountry()}
                            />

                        </View>
                        <Text style={{ textAlign: 'right', color: 'red', fontSize: width / 30, top: 5, transform: transform(), textAlign: textAlignForError(), marginRight: width / 30 }}>{this.state.mobilee}</Text>
                        <TouchableOpacity onPress={() => this.showDateTimePicker()} >
                            <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#eeeeee', borderRadius: 3, marginTop: width / 30, height: width / 8, justifyContent: 'space-between', flexDirection: 'row', borderWidth: this.state.agee !== '' || this.state.dobe !== '' ? 1 : 0, borderColor: this.state.agee !== '' || this.state.dobe !== '' ? 'red' : '' }}>
                                <View style={{ marginLeft: 'auto', marginRight: 'auto', transform: transform(), justifyContent: 'space-between', flexDirection: 'row', width: w / 1.2 }}>
                                    <Text style={{ fontSize: width / 25, color: '#333', marginTop: width / 30, textAlign: textAlign(), width: w / 1.35 }}>{this.state.show === '' ? i18n.t('dateOfBirth') : this.state.show}</Text>
                                    <Icon name="attendance" size={width / 18} style={{ marginTop: width / 30, }} color="grey" />
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

                        <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#eeeeee', borderRadius: 3, marginTop: width / 30, height: width / 8, justifyContent: 'space-between', flexDirection: 'row', borderWidth: this.state.imageURI !== '' ? 0 : 1, borderColor: this.state.imageURI !== '' ? '' : 'red' }}>
                            <Text style={{ textAlign: textAlign(), fontSize: width / 25, color: '#333', width: w / 1.35, marginTop: width / 30, paddingLeft: width / 20, transform: transform(), paddingRight: paddingRight() }}>{this.state.ageDisplay === '' ? i18n.t('age') : this.state.ageDisplay}</Text>
                        </View>
                        <View style={{ marginTop: width / 20, flexDirection: 'row', justifyContent: 'flex-end', width: w / 1.1, marginLeft: 'auto', marginRight: 'auto' }}>
                            <Text style={{ fontSize: width / 35, color: '#ddd', paddingBottom: width / 50, transform: transform(), textAlign: textAlign() }}>({i18n.t('optional')})</Text>
                        </View>
                        <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#eeeeee', borderRadius: 3, borderWidth: this.state.heighte !== '' ? 1 : 0, borderColor: this.state.heighte !== '' ? 'red' : '' }}>
                            <TextInput
                                keyboardType='numeric'
                                autoCapitalize='none'
                                onChangeText={(text) => this.validate(text, 'height')}
                                value={this.state.height}
                                style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 8, }}
                                returnKeyType='next'
                                placeholderTextColor='#333'
                                placeholder={i18n.t('height')} />
                        </View>
                        <View style={{ marginTop: width / 20, flexDirection: 'row', justifyContent: 'flex-end', width: w / 1.1, marginLeft: 'auto', marginRight: 'auto' }}>
                            <Text style={{ fontSize: width / 35, color: '#ddd', paddingBottom: width / 50, transform: transform(), textAlign: textAlign() }}>({i18n.t('optional')})</Text>
                        </View>
                        <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#eeeeee', borderRadius: 3, borderWidth: this.state.weighte !== '' ? 1 : 0, borderColor: this.state.weighte !== '' ? 'red' : '' }}>
                            <TextInput
                                keyboardType='numeric'
                                autoCapitalize='none'
                                onChangeText={(text) => this.validate(text, 'weight')}
                                value={this.state.weight}
                                style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 8, }}
                                returnKeyType='next'
                                placeholderTextColor='#333'
                                placeholder={i18n.t('weight')} />
                        </View>
                        <View style={{ marginTop: width / 20, flexDirection: 'row', justifyContent: 'flex-end', width: w / 1.1, marginLeft: 'auto', marginRight: 'auto' }}>
                            <Text style={{ fontSize: width / 35, color: '#ddd', paddingBottom: width / 50, transform: transform(), textAlign: textAlign() }}>({i18n.t('optional')})</Text>
                        </View>
                        <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#eeeeee', borderRadius: 3, height: width / 8, borderWidth: this.state.mobilee !== '' ? 1 : 0, borderColor: this.state.mobilee !== '' ? 'red' : '' }}>

                            <PhoneInput
                                ref={(ref) => {
                                    this.phoneTwo = ref;
                                }}

                                value={this.state.emergencyInput}
                                initialCountry='bh'
                                textStyle={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), }}
                                style={{ top: width / 30, paddingLeft: width / 30 }}
                                onChangePhoneNumber={() => this.validateEmergencyPhone()}
                                onSelectCountry={() => this.onEmeregencySelectCountry()}
                                textProps={{ placeholder: i18n.t('emergencyNumber') }}

                            />

                        </View>
                        <View style={{ marginTop: width / 20, flexDirection: 'row', justifyContent: 'flex-end', width: w / 1.1, marginLeft: 'auto', marginRight: 'auto' }}>
                            <Text style={{ fontSize: width / 35, color: '#ddd', paddingBottom: width / 50, transform: transform(), textAlign: textAlign() }}>({i18n.t('optional')})</Text>
                        </View>
                        <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#eeeeee', borderRadius: 3 }}>
                            <TextInput

                                autoCapitalize='words'
                                onChangeText={(text) => this.setState({ relationship: text })}
                                value={this.state.relationship}
                                style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 8, }}
                                returnKeyType='next'
                                placeholderTextColor='#333'
                                placeholder={i18n.t('relationship')} />
                        </View>
                        <View style={{ marginTop: width / 12 }}>
                            {this.renderNationalityPicker()}
                        </View>
                        <Text style={{ transform: transform(), textAlign: textAlignForError(), color: 'red', fontSize: width / 30, top: 5, marginRight: width / 30 }}>{this.state.nationality === '' ? i18n.t('nationalityError') : ''}</Text>
                        <View style={{ marginTop: width / 20 }}>
                            {this.renderGenderPicker()}

                        </View>
                        <Text style={{ transform: transform(), textAlign: textAlignForError(), color: 'red', fontSize: width / 30, top: 5, marginRight: width / 30 }}>{this.state.gender === '' ? i18n.t('genderError') : ''}</Text>
                        <View style={{ marginTop: width / 30 }}>
                            {this.renderBranchPicker()}

                        </View>
                        <Text style={{ transform: transform(), textAlign: textAlignForError(), color: 'red', fontSize: width / 30, top: 5, marginRight: width / 30 }}>{this.state.branch === '' ? i18n.t('branchError') : ''}</Text>

                        <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                            <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#eeeeee', borderRadius: 3, marginTop: width / 30, height: width / 8, justifyContent: 'space-between', flexDirection: 'row', borderWidth: this.state.imageURI !== '' ? 0 : 1, borderColor: this.state.imageURI !== '' ? '' : 'red' }}>
                                <View style={{ transform: transform(), marginLeft: 'auto', marginRight: 'auto', justifyContent: 'space-between', flexDirection: 'row', width: w / 1.2 }}>
                                    <Text style={{ textAlign: textAlign(), fontSize: width / 25, color: '#333', width: w / 1.35, marginTop: width / 30 }}>{this.state.imageURI === '' || this.state.imageURI === null ? i18n.t('uploadPhoto') : this.state.finalName}</Text>
                                    <Icon name="login" size={width / 18} style={{ marginTop: width / 30, }} color="grey" />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text style={{ transform: transform(), textAlign: textAlignForError(), color: 'red', fontSize: width / 30, top: 5, marginRight: width / 30 }}>{this.state.imageURI === '' ? i18n.t('imageError') : ''}</Text>

                        <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#eeeeee', borderRadius: 3, marginTop: width / 30, borderWidth: this.state.password === '' || this.state.passworde !== '' ? 1 : 0, borderColor: this.state.password === '' || this.state.passworde !== '' ? 'red' : '' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2, marginLeft: 'auto', marginRight: 'auto' }}>
                                {this.state.viewStatus === true ?
                                    <TextInput
                                        autoCapitalize='none'
                                        onChangeText={(text) => this.validate(text, 'password')}
                                        value={this.state.password}
                                        style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 8 }}
                                        returnKeyType='next'
                                        placeholderTextColor='#333'
                                        placeholder={i18n.t('password')} /> :
                                    <TextInput
                                        secureTextEntry
                                        autoCapitalize='none'
                                        onChangeText={(text) => this.validate(text, 'password')}
                                        value={this.state.password}
                                        style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 8, }}
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
                        <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#eeeeee', borderRadius: 3, marginTop: width / 30, borderWidth: this.state.confirm === '' || this.state.confirme !== '' ? 1 : 0, borderColor: this.state.confirm === '' || this.state.confirme !== '' ? 'red' : '' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2, marginLeft: 'auto', marginRight: 'auto' }}>
                                {this.state.viewStatusTwo === true ?
                                    <TextInput

                                        autoCapitalize='none'
                                        onChangeText={(text) => this.validate(text, 'confirm')}
                                        value={this.state.confirm}
                                        style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 8, }}
                                        returnKeyType='next'
                                        placeholderTextColor='#333'
                                        placeholder={i18n.t('confirmPassword')} />
                                    :
                                    <TextInput
                                        secureTextEntry
                                        autoCapitalize='none'
                                        onChangeText={(text) => this.validate(text, 'confirm')}
                                        value={this.state.confirm}
                                        style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 8, }}
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
                    <View style={{ marginTop: width / 50, flexDirection: 'row', justifyContent: 'flex-end', width: w / 1.1, marginLeft: 'auto', marginRight: 'auto' }}>
                        <Text style={{ fontSize: width / 35, color: '#ddd', paddingBottom: width / 50, transform: transform(), textAlign: textAlign() }}>({i18n.t('optional')})</Text>
                    </View>
                    <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', transform: transform(), backgroundColor: '#eeeeee', borderRadius: 3 }}>
                        <TextInput
                            autoCapitalize='none'
                            onChangeText={(text) => this.setState({ referral: text })}
                            value={this.state.referral}
                            style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 8, }}
                            returnKeyType='next'
                            placeholderTextColor='#333'
                            placeholder={i18n.t('referralCode')} />
                    </View>
                    <TouchableOpacity onPress={() => this.onSubmit()}>
                        <View style={{ width: w / 1.2, backgroundColor: '#00c853', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                            <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50 }}>{i18n.t('submit')}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <View style={{ width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', marginTop: width / 20, justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="reject-icon" size={width / 18} style={{ marginTop: width / 80 }} color="#00c853" />
                            <Text style={{ fontSize: width / 18, color: '#00c853', fontWeight: 'bold', textAlign: 'center', marginLeft: width / 30 }}>{i18n.t('cancel')}</Text>
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

        paddingLeft: 20,
        width: w / 1.08,
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: '#eeeeee',
        borderRadius: 5,
        height: width / 8,
    },
    forme: {

        paddingLeft: 20,
        width: w / 1.08,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderColor: 'red',
        borderWidth: 1,
        backgroundColor: '#eeeeee',
        borderRadius: 5,
        height: width / 8,
    },

})
export default SignUp