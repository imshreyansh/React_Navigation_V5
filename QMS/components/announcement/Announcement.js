import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground, RefreshControl } from 'react-native';
import Header from '../common/Header'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { getAllAnnouncements } from '../../utils/api/announcements'
import i18n from 'i18n-js';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'

export default class Announcement extends React.Component {
    _isMounted = false
    state = {
        refreshing: false,
        announcements: [],
        credId: ''
    }


    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            const willFocusSubscription = this.props.navigation.addListener(
                'willFocus',
                () => {
                    this._onRefresh()
                }
            )
        }

    }

    componentWillUnmount() {
        this._isMounted = false
    }


    _onRefresh = () => {
        this.setState({
            refreshing: true
        })
        AsyncStorage.getItem('authedToken').then((token) => {
            const credId = jwtDecode(token).credential
            this.setState({
                credId
            }, () => {
                getAllAnnouncements().then(res => {
                    if (res) {
                        this.setState({
                            announcements: res.data.response.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)),
                            refreshing: false
                        })
                    }
                })
            })

        })



    }




    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#eeeeee', transform: transform() }}>
                <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="home" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                        <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('announcements')}</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        progressBackgroundColor='#1976d2'
                        colors={['white', 'yellow']}
                    />}>
                    {this.state.announcements.map((data, i) => {
                        const monthNames = [i18n.t('Jan'), i18n.t('Feb'), i18n.t('Mar'), i18n.t('Apr'), i18n.t('May'), i18n.t('Jun'),
                        i18n.t('Jul'), i18n.t('Aug'), i18n.t('Sep'), i18n.t('Oct'), i18n.t('Nov'), i18n.t('Dec')
                        ]
                        const userRead = data.users.filter(d => d.user === this.state.credId).length
                        return (
                            <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('AnnouncementDetails', { id: data._id })}>
                                <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: w / 4.5, padding: width / 50, borderTopLeftRadius: 3, borderBottomLeftRadius: 3, backgroundColor: data.color }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: width / 10, color: 'white', textAlign: 'center', transform: transform() }}>{new Date(data.startDate).getDate()}</Text>
                                            <Text style={{ fontWeight: 'bold', fontSize: width / 30, color: 'white', textAlign: 'center', transform: transform() }}>{monthNames[new Date(data.startDate).getMonth()]} {new Date(data.startDate).getFullYear()}</Text>

                                        </View>
                                        <View style={{ width: w / 1.5, padding: width / 50, backgroundColor: 'white', borderTopRightRadius: 3, borderBottomRightRadius: 3, }}>
                                            <Text numberOfLines={2} style={{ fontWeight: 'bold', fontSize: width / 28, color: '#333', width: w / 1.8, transform: transform(), textAlign: textAlign() }}>{data.title}</Text>
                                            <View style={{ width: w / 1.8, marginLeft: 'auto', marginRight: 'auto', justifyContent: 'flex-end', flexDirection: 'row' }}>
                                                <View style={{ width: width / 28, height: width / 28, borderRadius: width / 56, backgroundColor: userRead > 0 ? '#ddd' : '#64dd17', marginTop: width / 30 }} />
                                            </View>
                                        </View>

                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })}

                </ScrollView>
            </View >
        )
    }
}