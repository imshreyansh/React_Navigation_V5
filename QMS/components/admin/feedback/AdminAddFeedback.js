import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, Image, RefreshControl, StyleSheet, ActionSheetIOS, Picker } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, URL, paddingLeftWater, paddingRightWater, isTablet } from '../../../utils/api/helpers'
import { showMessage } from 'react-native-flash-message';
import { getUserByCredentials, getAllBranch } from '../../../utils/api/authorization'
import { getActiveStatusRegisterMembers, addFeedback } from '../../../utils/api/feedback'
import Loader from '../../../utils/resources/Loader'
import boyImage from '../../../assets/images/boy.jpg'
import { SearchBar } from 'react-native-elements';
import i18n from 'i18n-js'
class Feedback extends Component {
    _isMounted = false

    state = {
        rtl: null,
        userDetails: '',
        userCredentials: '',
        loading: false,
        description: '',
        comp: false,
        suggs: true,
        typeOfBranches: [],
        branch: '',
        branchLabel: i18n.t('pleaseSelect'),
        search: '',
        allMembers: [],
        searchShow: true,
        selectedMember: '',
        selectedMemberDetails: ''

    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            const unsubscribe = this.props.navigation.addListener('didFocus', () => {
                AsyncStorage.getItem('authedToken').then((token) => {
                    const userId = jwtDecode(token).credential
                    this.setState({
                        userId,
                    }, () => {
                        this._onRefresh()
                    })
                })
            })
        }
    }



    componentWillUnmount() {
        this._isMounted = false
    }

    updateSearch = search => {
        if (search !== '') {
            this.setState({ search }, () => {
                this.onSearch()
            })
        } else {
            this.setState({
                search: '',
            }, () => this.onSearch())
        }
    }


    _onRefresh = () => {
        this.setState({
            refreshing: true,

        })

        getUserByCredentials(this.state.userId).then(res => {
            if (res) {
                this.setState({
                    userDetails: res.data.response,
                    userCredentials: res.data.response.credentialId,
                    refreshing: false
                }, () => {
                    getAllBranch().then(res => {
                        if (res) {
                            this.setState({
                                typeOfBranches: res.data.response
                            })
                        }
                    })
                })
            }
        })
    }

    onSubmit = () => {
        if (this.state.description !== '' && this.state.branch !== '' && this.state.selectedMember !== '') {
            this.setState({
                loading: true
            })
            const obj = {
                optionType: this.state.comp === true ? 'Complaints' : 'Suggestions',
                member: this.state.selectedMember,
                description: this.state.description,
                branch: this.state.branch,
                mode: 'Manual',
            }
            addFeedback(obj).then(res => {
                if (res) {
                    showMessage({
                        message: "Added Feedback",
                        type: "success",
                    })
                    this.props.navigation.goBack()
                }
            })
        } else {
            alert(i18n.t('allTheFieldsAreRequired'))
        }
    }



    onSelectMember = () => {

    }

    onSearch = () => {
        const obj = {
            branch: this.state.branch,
            search: this.state.search
        }
        getActiveStatusRegisterMembers(obj).then(res => {
            if (res) {
                this.setState({
                    allMembers: res.data.response
                })
            }
        })
    }

    showSellingProductsPicker = () => {
        const data = this.state.typeOfBranches.map(l => l.branchName)
        const len = data.length
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
        },
            (buttonIndex) => {
                this.setState({ branch: data[buttonIndex] });
                if (this.state.typeOfBranches[buttonIndex] !== undefined) {
                    this.setState({
                        branch: this.state.typeOfBranches[buttonIndex]._id,
                        branchLabel: this.state.typeOfBranches[buttonIndex].branchName,
                        searchShow: true,
                        allMembers: [],
                        selectedMember: '',
                        selectedMemberDetails: ''
                    })
                } else {
                    this.setState({
                        branch: '',
                        allMembers: [],
                        branchLabel: i18n.t('pleaseSelect'),
                        searchShow: true,
                        selectedMember: '',
                        selectedMemberDetails: ''
                    })
                }
            });
    }

    renderSellingProductsPicker() {
        if (Platform.OS === 'android') {
            return (
                <View style={[styles.formSelling, {
                    transform: transform(), borderTopRightRadius: i18n.locale === 'ar' ? 0 : 3,
                    borderBottomRightRadius: i18n.locale === 'ar' ? 0 : 3, borderBottomLeftRadius: i18n.locale === 'ar' ? 3 : 0, borderTopLeftRadius: i18n.locale === 'ar' ? 3 : 0
                }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: width / 50, width: w / 1.24, color: 'white' }}
                        selectedValue={this.state.branch}
                        onValueChange={(itemValue) => this.setState({ branch: itemValue, allMembers: [], searchShow: true, selectedMember: '', selectedMemberDetails: '' })}>
                        {
                            this.state.typeOfBranches.map((v) => {
                                return <Picker.Item label={v.branchName} value={v._id} key={v._id} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showSellingProductsPicker()}>
                    <View style={[styles.formSelling, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 20, color: 'white' }}>{this.state.branchLabel}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    onMemberSelect = (id, data) => {
        this.setState({
            selectedMember: id,
            selectedMemberDetails: data,
            searchShow: false
        })
    }
    render() {
        const avatarOne = this.state.selectedMemberDetails !== '' ? `${URL}/${this.state.selectedMemberDetails.credentialId.avatar.path.replace(/\\/g, "/")}` : ''
        const userImageOne = JSON.parse(JSON.stringify({ uri: avatarOne }))
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <Loader loading={this.state.loading} text='Registering User' />

                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        progressBackgroundColor='#1976d2'
                        colors={['white', 'yellow']}
                    />}>
                    <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                            <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('feedbacks')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: w / 1.1, flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto' }}>
                        <View style={{ backgroundColor: 'orange', width: w / 10, height: width / 10, marginTop: width / 30, borderTopLeftRadius: 3, borderBottomLeftRadius: 3 }}>
                            <Icon name='notify-branch' size={width / 15} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} color="white" />
                        </View>
                        {this.renderSellingProductsPicker()}
                    </View>
                    <View style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', marginTop: width / 30, paddingBottom: width / 30, borderRadius: 2 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <TouchableOpacity onPress={() => this.setState({ comp: true, suggs: false })}>
                                <View style={{ flexDirection: 'row' }}>
                                    {this.state.comp === true ? <Icon name='transport-status' size={width / 15} style={{ transform: transform() }} color="orange" /> : <View style={{ width: width / 15, height: width / 15, borderRadius: width / 30, borderWidth: 1, borderColor: 'grey' }} />}
                                    <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 24, color: '#333', marginLeft: width / 30 }}>{i18n.t('complaints')}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ comp: false, suggs: true })}>
                                <View style={{ flexDirection: 'row' }}>
                                    {this.state.suggs === true ? <Icon name='transport-status' size={width / 15} style={{ transform: transform() }} color="orange" /> : <View style={{ width: width / 15, height: width / 15, borderRadius: width / 30, borderWidth: 1, borderColor: 'grey' }} />}
                                    <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 24, color: '#333', marginLeft: width / 30 }}>{i18n.t('suggestions')}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this.state.branch !== '' && this.state.searchShow ?
                        <View style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', marginTop: width / 30, paddingBottom: width / 30, borderRadius: 2 }}>
                            <View style={{ marginLeft: 'auto', marginRight: 'auto', transform: transform() }}>
                                <SearchBar
                                    placeholder={i18n.t('search')}
                                    placeholderTextColor='#D3D3D3'
                                    onChangeText={this.updateSearch}
                                    lightTheme
                                    containerStyle={{ backgroundColor: 'white', borderWidth: 1, width: w / 1.2, height: isTablet === false ? width / 11 : width / 8, borderColor: '#C8C8C8', borderRadius: 5, marginTop: width / 30 }}
                                    inputContainerStyle={{ backgroundColor: 'white', width: w / 1.4, height: height / 40, }}
                                    inputStyle={{ textAlign: textAlign(), }}
                                    searchIcon={{ size: width / 16 }}
                                    value={this.state.search}
                                />
                            </View>
                            {this.state.allMembers.map((data, i) => {
                                const avatar = data ? `${URL}/${data.credentialId.avatar.path.replace(/\\/g, "/")}` : ''
                                const userImage = JSON.parse(JSON.stringify({ uri: avatar }))
                                return (
                                    <TouchableOpacity onPress={() => this.onMemberSelect(data._id, data)}>
                                        <View key={i} style={{ width: w / 1.2, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#ddd', marginTop: width / 30, borderRadius: 5, padding: width / 80 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ marginTop: width / 50, marginLeft: width / 50 }}>
                                                    <Image source={userImage} style={{ width: width / 8, height: width / 8, borderRadius: width / 16, borderWidth: 2, borderColor: 'white' }} />
                                                </View>
                                                <View style={{ flexDirection: 'column', marginTop: width / 50, marginLeft: width / 50 }}>
                                                    <View>
                                                        <Text style={{ color: 'grey', fontSize: width / 28, fontWeight: 'bold', width: w / 2, transform: transform(), textAlign: textAlign() }}>{data.credentialId.userName}</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={{ color: '#283593', fontSize: width / 28, fontWeight: 'bold', width: w / 2, transform: transform(), textAlign: textAlign() }}>ID:{data.memberId}</Text>
                                                    </View>
                                                </View>
                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </View> : this.state.branch !== '' && !this.state.searchShow ?
                            <View style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', marginTop: width / 30, paddingBottom: width / 30, borderRadius: 2 }}>
                                <View style={{ width: w / 1.2, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#ddd', marginTop: width / 30, borderRadius: 5, padding: width / 80 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ marginTop: width / 50, marginLeft: width / 50 }}>
                                            <Image source={userImageOne} style={{ width: width / 8, height: width / 8, borderRadius: width / 16, borderWidth: 2, borderColor: 'white' }} />
                                        </View>
                                        <View style={{ flexDirection: 'column', marginTop: width / 50, marginLeft: width / 50 }}>
                                            <View>
                                                <Text style={{ color: 'grey', fontSize: width / 28, fontWeight: 'bold', width: w / 2, transform: transform(), textAlign: textAlign() }}>{this.state.selectedMemberDetails.credentialId.userName}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ color: '#283593', fontSize: width / 28, fontWeight: 'bold', width: w / 2, transform: transform(), textAlign: textAlign() }}>ID:{this.state.selectedMemberDetails.memberId}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            : null}

                    <View style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', marginTop: width / 30, paddingBottom: width / 20, borderRadius: 2 }}>
                        <Text style={{ marginTop: width / 30, marginLeft: width / 30, fontSize: width / 25, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('description')}</Text>
                        <View style={{ marginTop: width / 20, marginLeft: 'auto', marginRight: 'auto', transform: transform() }}>
                            <TextInput
                                multiline={true}
                                style={{ width: w / 1.2, padding: width / 30, paddingBottom: width / 5, borderWidth: 1, backgroundColor: '#fafafa', borderRadius: 5, borderColor: '#cfd2d3', fontSize: width / 25, textAlign: textAlign() }}
                                autoCapitalize='none'
                                onChangeText={(text) => this.setState({ description: text })}
                                value={this.state.description}
                            />

                        </View>
                        <TouchableOpacity onPress={() => this.onSubmit()}>
                            <View style={{ width: width - 80, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginTop: width / 20, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                                <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50, transform: transform() }}>{i18n.t('submit')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </ScrollView>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    form: {
        marginTop: width / 30,
        width: w / 3,
        borderColor: '#ddd',
        borderWidth: 1,
        backgroundColor: '#ddd',
        borderRadius: 3,
        height: width / 12,
    },
    formSelling: {
        marginTop: width / 30,
        width: w / 1.24,
        backgroundColor: 'orange',

        height: width / 10,
    },
    fab: {
        position: 'absolute',
        width: width / 7.5,
        height: width / 7.5,
        flexDirection: 'column',
        alignItems: 'center',
        left: w / 1.23,
        bottom: w / 20,
        backgroundColor: '#DC3545',
        borderRadius: width / 15,
    },

    fabIcon: {
        fontSize: width / 10.5,
        color: 'white',
    }
})

export default Feedback