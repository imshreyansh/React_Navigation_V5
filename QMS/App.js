// import * as Sentry from '@sentry/react-native';
import i18n from 'i18n-js';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { SafeAreaView, StatusBar } from 'react-native';
import FlashMessage from "react-native-flash-message"
import { Navigators } from './components/navigator/Navigators'
import { ar } from './utils/langauges/ar'
import { en } from './utils/langauges/en'
import axios from 'axios';
i18n.fallbacks = true
i18n.translations = { ar, en }

export default class App extends React.Component {


  // setAxiosHeader = async () => {
  //   const token = jwtDecode(await AsyncStorage.getItem('authedToken')).credential
  //   if (token) axios.defaults.headers.common['userId'] = token
  // }

  componentDidMount() {
    AsyncStorage.getItem('language').then(lang => {
      i18n.locale = lang

    })
    Icon.loadFont();
    // this.setAxiosHeader()

  }


  render() {

    //console.disableYellowBox = true
    return (
      <SafeAreaView style={{ flex: 1 }}>

        <Navigators />
        <FlashMessage position="top" />
      </SafeAreaView>
    )
  }
}