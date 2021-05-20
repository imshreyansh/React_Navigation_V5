// import * as Sentry from '@sentry/react-native';
import i18n from 'i18n-js';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { SafeAreaView, StatusBar } from 'react-native';
import FlashMessage from "react-native-flash-message"
import { Navigators } from './components/navigator/Navigators'
import { Navigator } from './components/navigator/NewNavigator'
import AuthLoadingScreen from './components/common/AuthLoadingScreen'
import { ar } from './utils/ar';
import { en } from './utils/en';
import axios from 'axios';
i18n.fallbacks = true
i18n.translations = { ar, en }

export default class App extends React.Component {

  constructor(props) {
    super(props)

    // Sentry.init({
    //   dsn: "https://b23c46cc516e4ad194b6a8145ec49c8b@sentry.io/1869333",
    // })
  }

  // componentDidCatch(error, errorInfo) {
  //   Sentry.withScope(scope => {
  //     Object.keys(errorInfo).forEach(key => {
  //       scope.setExtra(key, errorInfo[key])
  //     })
  //     Sentry.captureException(error)
  //   })
  // }

  setAxiosHeader = async () => {
    const token = jwtDecode(await AsyncStorage.getItem('authedToken')).credential
    if (token) axios.defaults.headers.common['userId'] = token
  }

  componentDidMount() {
    AsyncStorage.getItem('language').then(lang => {
      i18n.locale = lang

    })
    Icon.loadFont();
    this.setAxiosHeader()

  }


  render() {

    //console.disableYellowBox = true
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Navigator />
        {/* <Navigators /> */}
        <FlashMessage position="top" />
      </SafeAreaView>
    )
  }
}