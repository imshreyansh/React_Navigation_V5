import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, Image, RefreshControl } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, URL, paddingLeftWater, paddingRightWater, isTablet } from '../../../utils/api/helpers'
import i18n from 'i18n-js'
import { SearchBar } from 'react-native-elements';
import { getAllMemberFromTrainer } from '../../../utils/api/employee'
import boy from '../../../assets/images/boy.jpg'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'

class myMembers extends Component {
    _isMounted = false

    state = {
        currency: '',
        searchedItem: [],
        searchItems: [],
        search: '',
        userId: '',
        SelectMembers: []

    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            AsyncStorage.getItem('authedToken').then((token) => {
                const userId = jwtDecode(token).userId

                this.setState({
                    userId,

                }, () => {
                    getAllMemberFromTrainer(this.state.userId).then(res => {
                        if (res) {
                            this.setState({
                                SelectMembers: res.data.response,
                                searchItems: res.data.response,
                            })
                        }
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
                const items = this.state.searchItems.filter(data => data.credentialId.userName.toLowerCase().includes(search.toLowerCase()))
                this.setState({ SelectMembers: items })
            })
        } else {
            this.setState({
                SelectMembers: this.state.searchItems,
                search: '',
            })
        }
    }

    render() {
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>


                <View style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                        <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('myMembers')}</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }} >
                    <View elevation={3} style={{ width: w, transform: transform(), paddingBottom: width / 30, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', alignItems: 'center' }} >
                        <SearchBar
                            placeholder={i18n.t('search')}
                            placeholderTextColor='#D3D3D3'
                            onChangeText={this.updateSearch}
                            lightTheme
                            containerStyle={{ backgroundColor: 'white', borderWidth: 1, width: w / 1.1, height: isTablet === false ? width / 11 : width / 8, borderColor: '#C8C8C8', borderRadius: 5, marginTop: width / 30 }}
                            inputContainerStyle={{ backgroundColor: 'white', width: w / 1.3, height: height / 40, }}
                            inputStyle={{ textAlign: textAlign(), }}
                            searchIcon={{ size: width / 16 }}
                            value={this.state.search}
                        />
                    </View>
                    {this.state.SelectMembers.map((data, i) => {
                        function colorBorder() {
                            if (data.questions.levelQuestion === 'Beginner') {
                                return '#e65100'
                            } else if (data.questions.levelQuestion === 'Intermediate') {
                                return '#01579b'
                            } else {
                                return '#33691e'
                            }
                        }
                        function colorBackground() {
                            if (data.questions.levelQuestion === 'Beginner') {
                                return '#ffb74d'
                            } else if (data.questions.levelQuestion === 'Intermediate') {
                                return '#4fc3f7'
                            } else {
                                return '#aed581'
                            }
                        }
                        const urlImage = `${URL}/${data.credentialId.avatar.path.replace(/\\/g, "/")}`
                        const image = JSON.parse(JSON.stringify({ uri: urlImage }))
                        return (
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('MyMemberDetails', { memberId: data.credentialId.userId })}>
                                <View style={{ width: w / 1.1, borderRadius: 3, marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 30, backgroundColor: 'white' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2, marginTop: width / 50, marginLeft: 'auto', marginRight: 'auto' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Image source={image} style={{ width: width / 7, height: width / 7, borderRadius: width / 14, borderWidth: 2, borderColor: 'white' }} />
                                            <View style={{ flexDirection: 'column', marginTop: width / 50, marginLeft: width / 50 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: width / 25, width: w / 2.5, color: 'grey', transform: transform(), textAlign: textAlign(), }}>{data.credentialId.userName}</Text>
                                                <Text style={{ fontSize: width / 28, color: 'blue', transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>ID: {data.memberId}</Text>
                                            </View>
                                        </View>

                                        {data.questions && data.questions.levelQuestion ? <View>
                                            <View style={{ width: w / 4.5, padding: width / 80, borderWidth: 1, borderRadius: 3, backgroundColor: colorBackground(), borderColor: colorBorder(), marginTop: 'auto', marginBottom: 'auto' }}>
                                                <Text style={{ fontSize: width / 30, color: 'white', transform: transform(), textAlign: 'center' }}>{data.questions.levelQuestion}</Text>
                                            </View>
                                        </View> : null}
                                    </View>
                                    <View style={{ borderWidth: 0.4, marginTop: width / 50, borderColor: '#ddd' }} />
                                    <View style={{ marginTop: width / 50, flexDirection: 'row', marginLeft: width / 30, flexDirection: 'row' }}>
                                        <View style={{ width: width / 14, height: width / 14, backgroundColor: 'purple', borderRadius: width / 28, marginTop: 'auto', marginBottom: 'auto' }}>
                                            <Icon name="call" size={width / 28} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} color="white" />
                                        </View>
                                        <Text style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 50, fontSize: width / 32, color: 'grey', transform: transform(), textAlign: textAlign(), width: w / 4.2 }}>{data.mobileNo}</Text>
                                        <View style={{ width: width / 14, height: width / 14, backgroundColor: 'green', borderRadius: width / 28, marginLeft: width / 30, marginTop: 'auto', marginBottom: 'auto' }}>
                                            <Icon name="email" size={width / 28} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} color="white" />
                                        </View>
                                        <Text style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 50, fontSize: width / 32, color: 'grey', transform: transform(), textAlign: textAlign(), width: w / 2.5 }}>{data.credentialId.email}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })}

                </ScrollView>

            </View>
        )
    }
}

export default myMembers