import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, Image, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import loginBg from '../../assets/images/loginBg.png';
import { Icon, width, height, w, h, transform, textAlign, URL, paddingRight } from '../../utils/api/helpers'
import PhoneInput from 'react-native-phone-input';
import { getAllPackage } from '../../utils/api/package'
import { request, PERMISSIONS, check, RESULTS } from 'react-native-permissions';
import { getCurrency, getUserDetailsById, updateMemberProfile, updateEmployeeProfile, getDesignationById } from '../../utils/api/authorization'
import { getUserDetailsById as getUserDetails } from '../../utils/api/employee'
import * as ImagePicker from 'react-native-image-picker';
import Loader from '../../utils/resources/Loader'
import alert from '../../assets/images/alert.png'
import i18n from 'i18n-js'


class EditProfile extends Component {
    _isMounted = false

    state = {
        currency: '',
        rtl: null,
        packages: [],
        userDetails: '',
        userCredentials: '',
        modalVisible: false,
        avatar: '',
        memberId: '',
        loading: false,
        imageURI: '',
        name: '',
        namee: '',
        mobile: '',
        mobilee: '',
        designation: '',
        userId: '',
        height: '',
        weight: '',
        heighte: '',
        weighte: '',
        mobileEdit: false,
        weightEdit: false,
        heightEdit: false,
        questions: '',
        doneFingerAuth: false,
        modalVisibleTwo: false
    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            AsyncStorage.getItem('authedToken').then((token) => {
                const userId = jwtDecode(token).credential
                const designation = jwtDecode(token).designation
                const memberId = jwtDecode(token).userId
                this.setState({
                    userId,
                    memberId
                }, () => {
                    getDesignationById(designation).then(res => {
                        this.setState({
                            designation: res.data.response.designationName
                        }, () => {
                            if (this.state.designation === 'Member') {
                                getUserDetailsById(this.state.userId).then(res => {
                                    if (res) {
                                        this.setState({
                                            userDetails: res.data.response,
                                            userCredentials: res.data.response.credentialId,
                                            avatar: `${URL}/${res.data.response.credentialId.avatar.path.replace(/\\/g, "/")}`,
                                            name: res.data.response.credentialId.userName,
                                            mobile: res.data.response.mobileNo,
                                            height: res.data.response.height === null ? '' : res.data.response.height,
                                            weight: res.data.response.weight === null ? '' : res.data.response.weight,
                                            questions: res.data.response.questions,
                                            doneFingerAuth: res.data.response.credentialId.doneFingerAuth
                                        })
                                    }
                                })
                            } else {
                                getUserDetails(this.state.memberId).then(res => {
                                    if (res) {
                                        this.setState({
                                            userDetails: res.data.response,
                                            userCredentials: res.data.response.credentialId,
                                            avatar: `${URL}/${res.data.response.credentialId.avatar.path.replace(/\\/g, "/")}`,
                                            name: res.data.response.credentialId.userName,
                                            mobile: res.data.response.mobileNo,
                                        })
                                    }
                                })
                            }

                        })
                    })

                })
            })
            getCurrency().then(res => {
                if (res) {
                    this.setState({
                        currency: res.data.response
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

    setModalVisibleTwo(visible) {
        this.setState({ modalVisibleTwo: visible });
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

    validatePhone() {
        const pno = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[0-9]*$/
        if (this.phone.getValue() === '') {
            this.setState({
                mobilee: 'Enter Contact'
            })
        } else {
            if (this.phone.isValidNumber() === true && pno.test(this.phone.getValue())) {
                this.setState({
                    mobilee: '',
                    mobile: this.phone.getValue(),

                })
            } else {
                this.setState({
                    mobilee: 'Enter valid contact'
                })
            }
        }
    }

    onSelectCountry = () => {
        this.setState({
            input: "+" + this.phone.getCountryCode()
        })
    }

    onSave = () => {
        const { designation } = this.state
        this.setState({
            loading: true
        })
        const obj = {
            mobileNo: this.state.mobile,
            height: this.state.height,
            weight: this.state.weight
        }
        if (this.state.designation === 'Member') {
            if (this.state.mobilee === '' && (this.state.height < 300 && this.state.height > 20) && (this.state.weight < 1000 && this.state.weight > 10)) {
                if (this.state.imageURI === '') {
                    const formData = new FormData()
                    formData.append('data', JSON.stringify(obj))
                    updateMemberProfile(this.state.userId, formData).then(res => {
                        if (res) {
                            this.setState({
                                loading: false,
                                mobileEdit: false,
                                weightEdit: false,
                                heightEdit: false
                            }, () => {
                                this.props.navigation.navigate('AuthLoadingScreen', { designation })
                            })
                        }
                    })
                } else {
                    const formData = new FormData()
                    formData.append('avatar', this.state.imageURI)
                    formData.append('data', JSON.stringify(obj))
                    updateMemberProfile(this.state.userId, formData).then(res => {
                        if (res) {
                            this.setState({
                                loading: false,
                                mobileEdit: false,
                                weightEdit: false,
                                heightEdit: false
                            }, () => {
                                this.props.navigation.navigate('AuthLoadingScreen', { designation })
                            })
                        }
                    })
                } if (this.state.imageURI === '') {
                    const formData = new FormData()
                    formData.append('data', JSON.stringify(obj))
                    updateMemberProfile(this.state.userId, formData).then(res => {
                        if (res) {
                            this.setState({
                                loading: false,
                                mobileEdit: false,
                                weightEdit: false,
                                heightEdit: false
                            }, () => {
                                this.props.navigation.navigate('AuthLoadingScreen', { designation })
                            })
                        }
                    })
                } else {
                    const formData = new FormData()
                    formData.append('avatar', this.state.imageURI)
                    formData.append('data', JSON.stringify(obj))
                    updateMemberProfile(this.state.userId, formData).then(res => {
                        if (res) {
                            this.setState({
                                loading: false,
                                mobileEdit: false,
                                weightEdit: false,
                                heightEdit: false
                            }, () => {
                                this.props.navigation.navigate('AuthLoadingScreen', { designation })
                            })
                        }
                    })
                }
            } else {
                this.setState({
                    loading: false
                })
                this.setModalVisibleTwo(true)
            }

        } else {
            if (this.state.mobilee === '') {
                if (this.state.imageURI === '') {
                    const formData = new FormData()
                    formData.append('data', JSON.stringify(obj))
                    updateEmployeeProfile(this.state.userId, formData).then(res => {
                        if (res) {
                            this.setState({
                                loading: false,
                                mobileEdit: false,
                                weightEdit: false,
                                heightEdit: false
                            }, () => {
                                this.props.navigation.navigate('AuthLoadingScreen', { designation })
                            })
                        }
                    })
                } else {
                    const formData = new FormData()
                    formData.append('avatar', this.state.imageURI)
                    formData.append('data', JSON.stringify(obj))
                    updateEmployeeProfile(this.state.userId, formData).then(res => {
                        if (res) {
                            this.setState({
                                loading: false,
                                mobileEdit: false,
                                weightEdit: false,
                                heightEdit: false
                            }, () => {
                                this.props.navigation.navigate('AuthLoadingScreen', { designation })
                            })
                        }
                    })
                }
            } else {
                this.setState({
                    loading: false
                })
                this.setModalVisibleTwo(true)
            }
        }

    }

    render() {
        const userImage = JSON.parse(JSON.stringify({ uri: this.state.imageURI === '' ? this.state.avatar : this.state.imageURI.uri }))

        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <Loader loading={this.state.loading} text='Registering User' />

                <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="home" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                        <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('myProfile')}</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>

                    <View style={{ width: w / 1.1, paddingBottom: width / 10, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 10, borderRadius: 3 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                                <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                                    <Image source={userImage} style={{ width: width / 4.5, height: width / 4.5, borderRadius: width / 9, borderWidth: 2, borderColor: '#ddd' }} />
                                    <View style={{ position: 'absolute', left: width / 7, width: width / 20, height: width / 20, borderRadius: width / 40, backgroundColor: '#ddd' }}>
                                        <Icon name="edit" size={width / 30} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} color="black" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={{ fontSize: width / 22, color: 'grey', fontWeight: 'bold', transform: transform(), marginTop: width / 50, textAlign: 'center' }}>{this.state.userCredentials.userName}</Text>



                        {this.state.mobileEdit === true ? <View style={{ marginTop: width / 10, width: w / 1.4, marginLeft: 'auto', marginRight: 'auto', borderRadius: 3, paddingBottom: 5, borderBottomWidth: this.state.mobile === '' || this.state.mobilee !== '' ? 1 : 1, borderBottomColor: this.state.mobile === '' || this.state.mobilee !== '' ? 'red' : '#ddd' }}>

                            <PhoneInput
                                ref={(ref) => {
                                    this.phone = ref;
                                }}

                                value={this.state.mobile}
                                initialCountry='bh'
                                textStyle={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), }}

                                onChangePhoneNumber={() => this.validatePhone()}
                                onSelectCountry={() => this.onSelectCountry()}
                            />

                        </View> :
                            <View style={{ marginTop: width / 10, width: w / 1.4, marginLeft: 'auto', marginRight: 'auto', borderRadius: 3, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon name="mobile" size={width / 22} color="grey" />

                                        <Text style={{ fontSize: width / 25, marginLeft: width / 50, color: '#333', transform: transform(), textAlign: textAlign(), }}>{this.state.mobile}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => this.setState({ mobileEdit: true })}>
                                        <Icon name="edit" size={width / 22} color="grey" />
                                    </TouchableOpacity>
                                </View>

                            </View>}
                        {this.state.designation === 'Member' ?
                            <View>
                                {this.state.heightEdit === true ?
                                    <View style={{ width: w / 1.4, marginLeft: 'auto', marginTop: width / 20, marginRight: 'auto', borderBottomWidth: 1, borderBottomColor: this.state.height > 300 ? 'red' : '#ddd' }}>
                                        <TextInput
                                            keyboardType='numeric'
                                            autoCapitalize='none'
                                            onChangeText={(text) => this.setState({ height: text })}
                                            value={String(this.state.height)}
                                            style={{ fontSize: width / 28, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 10, }}
                                            returnKeyType='next'
                                            placeholderTextColor='#333'
                                            placeholder='Height (in cm)' />
                                    </View> :

                                    <View style={{ marginTop: width / 10, width: w / 1.4, marginLeft: 'auto', marginRight: 'auto', borderRadius: 3, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Icon name="height-icon" size={width / 22} color="grey" />

                                                <Text style={{ fontSize: width / 25, marginLeft: width / 50, color: '#333', transform: transform(), textAlign: textAlign(), }}>{this.state.height}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => this.setState({ heightEdit: true })}>

                                                <Icon name="edit" size={width / 22} color="grey" />
                                            </TouchableOpacity>
                                        </View>

                                    </View>}
                                {this.state.weightEdit === true ?
                                    <View style={{ width: w / 1.4, marginLeft: 'auto', marginTop: width / 20, marginRight: 'auto', borderBottomWidth: 1, borderBottomColor: this.state.weight > 1000 ? 'red' : '#ddd' }}>
                                        <TextInput
                                            keyboardType='numeric'
                                            autoCapitalize='none'
                                            onChangeText={(text) => this.setState({ weight: text })}
                                            value={String(this.state.weight)}
                                            style={{ fontSize: width / 28, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', height: width / 10, }}
                                            returnKeyType='next'
                                            placeholderTextColor='#333'
                                            placeholder='Weight (in kg)' />
                                    </View> : <View style={{ marginTop: width / 10, width: w / 1.4, marginLeft: 'auto', marginRight: 'auto', borderRadius: 3, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Icon name="weight" size={width / 22} color="grey" />

                                                <Text style={{ fontSize: width / 25, marginLeft: width / 50, color: '#333', transform: transform(), textAlign: textAlign(), }}>{this.state.weight}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => this.setState({ weightEdit: true })}>

                                                <Icon name="edit" size={width / 22} color="grey" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>}
                            </View>

                            : <View>

                            </View>}
                        {this.state.weightEdit === true || this.state.heightEdit === true || this.state.mobileEdit === true || this.state.imageURI !== '' ? <TouchableOpacity onPress={() => this.onSave()}>
                            <View style={{ marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', transform: transform() }}>

                                <View style={{ backgroundColor: '#1976d2', width: width / 1.4, height: width / 8, borderRadius: 30, transform: transform() }}>
                                    <Text style={{ textAlign: 'center', fontSize: width / 18, color: 'white', marginBottom: 'auto', marginTop: 'auto', transform: transform() }}>{i18n.t('save')}</Text>
                                </View>
                            </View>
                        </TouchableOpacity> : <View></View>}
                        {this.state.weightEdit === true || this.state.heightEdit === true || this.state.mobileEdit === true || this.state.imageURI !== '' ? <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <View style={{ marginTop: width / 15, marginLeft: 'auto', marginRight: 'auto', transform: transform() }}>
                                <Icon name="close" size={width / 18} color="#1976d2" />

                            </View>
                        </TouchableOpacity> : <View></View>}
                        {this.state.designation === 'Member' && this.state.doneFingerAuth && this.state.questions !== undefined ?
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('QuestionOne', { designation: this.state.designation, userId: this.state.userId })}>
                                <View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: w / 1.4, marginTop: width / 20, marginLeft: 'auto', marginRight: 'auto' }}>
                                        <View style={{ width: width / 15, height: width / 15, borderRadius: width / 30, backgroundColor: '#ddd' }}>
                                            <Icon name="edit" size={width / 30} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} color="black" />
                                        </View>
                                    </View>

                                    <View style={{ width: w / 1.4, marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 50, backgroundColor: '#CCE5FF', marginTop: width / 30, borderRadius: 2 }}>
                                        <Text style={{ fontSize: width / 28, marginLeft: width / 30, marginTop: width / 50, color: '#004085', textAlign: textAlign(), transform: transform() }}>{i18n.t('level')}</Text>
                                        <Text style={{ fontSize: width / 28, marginLeft: width / 30, color: '#004085', fontWeight: 'bold', marginTop: width / 100, textAlign: textAlign(), transform: transform() }}>{this.state.questions ? this.state.questions.levelQuestion : ''}</Text>
                                    </View>
                                    <View style={{ width: w / 1.4, marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 50, backgroundColor: '#F8D7DA', marginTop: width / 50, borderRadius: 2 }}>
                                        <Text style={{ fontSize: width / 28, marginLeft: width / 30, marginTop: width / 50, color: '#721C24', textAlign: textAlign(), transform: transform() }}>{i18n.t('ExercisingPerWeek')}</Text>
                                        <Text style={{ fontSize: width / 28, marginLeft: width / 30, color: '#721C24', fontWeight: 'bold', marginTop: width / 100, textAlign: textAlign(), transform: transform() }}>{this.state.questions ? this.state.questions.exercisingQuestion : ''}</Text>
                                    </View>
                                    <View style={{ width: w / 1.4, marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 50, backgroundColor: '#D4EDDA', marginTop: width / 50, borderRadius: 2 }}>
                                        <Text style={{ fontSize: width / 28, marginLeft: width / 30, marginTop: width / 50, color: '#155724', textAlign: textAlign(), transform: transform() }}>{i18n.t('MyGoal')}</Text>
                                        <Text style={{ fontSize: width / 28, marginLeft: width / 30, color: '#155724', fontWeight: 'bold', marginTop: width / 100, textAlign: textAlign(), transform: transform() }}>{this.state.questions ? this.state.questions.goalQuestion : ''}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            : null}

                    </View>



                </ScrollView>

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


                <Modal
                    transparent={true}
                    visible={this.state.modalVisibleTwo}
                >
                    <View elevation={3} style={{ backgroundColor: '#ffebee', height: height / 2.5, width: width - 80, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <Image style={{ width: w / 5, height: width / 5, marginLeft: 'auto', marginRight: 'auto', marginTop: height / 30 }} source={alert} />
                        <Text style={{ fontSize: width / 22, color: '#333', textAlign: 'center', marginTop: height / 30, width: width - 100, marginLeft: 'auto', marginRight: 'auto' }}>{i18n.t('someFieldsAreIncorrect')}</Text>
                        <TouchableOpacity onPress={() => { this.setModalVisibleTwo(false) }}>
                            <View style={{ width: width / 8, height: width / 8, borderRadius: width / 16, backgroundColor: '#03a9f4', marginLeft: 'auto', marginRight: 'auto', marginTop: height / 30 }}>
                                <Icon name="close" size={width / 20} style={{ marginRight: 'auto', marginLeft: 'auto', marginTop: 'auto', marginBottom: 'auto' }} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View >
        )
    }
}

export default EditProfile