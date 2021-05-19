import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { height, Icon, width, rtl, transform } from '../../utils/api/helpers';

export default class Header extends Component {

  render() {
    const { title, icon } = this.props
    return (
      <View elevation={5} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: width / 25 }}>
        <TouchableOpacity onPress={() => this.props.goBack()}>
          <Icon name={icon ? icon : 'back-button'} color='#333' size={width / 15} />
        </TouchableOpacity>
        <View style={{ width: width / 30 }} />
        <Text style={{ fontSize: width / 20, color: '#333', transform: transform(), fontWeight: 'bold' }}>{title}</Text>
      </View>
    )
  }
}