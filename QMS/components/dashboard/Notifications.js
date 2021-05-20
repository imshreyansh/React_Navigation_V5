import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, ImageBackground } from 'react-native'
import { h, w, width, height, Icon, transform, textAlign } from '../../utils/resources/helpers'
import i18n from 'i18n-js'

class Notifications extends Component {
    state = {

    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {

        }
    }


    componentWillUnmount() {
        this._isMounted = false

    }

    render() {
        return (

            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Text>Notifications</Text>
            </View >
        )
    }
}

export default Notifications