import React from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import i18n from 'i18n-js'

export default class Reward extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarLabel: i18n.t('reward'),
        }
    }
    render() {
        return (
            <View>
                <Text>Reward</Text>
            </View>
        )
    }
}