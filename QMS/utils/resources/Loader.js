import React from 'react';
import { ActivityIndicator, Dimensions, Platform, StyleSheet, Text, View, Modal } from 'react-native';

let w = Dimensions.get('window').width
let h = Dimensions.get('window').height
const isTablet = (h / w) > 1.6
let width = isTablet ? w : 500
let height = isTablet ? h : 900

const Loader = props => {
  const {
    loading,
    text } = props;
  if (loading) {
    if (Platform.OS === 'android') {
      return (
        <Modal
          transparent={true}
          visible={loading}>
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator
                animating={loading}
                color='#1976d2'
                size='large' />
              <View style={{ width: width / 30 }} />
              <Text style={{ fontSize: width / 25, color: '#1976d2' }}>Loading...</Text>
            </View>
          </View>
        </Modal>
      )
    } else {
      return (
        <Modal
          transparent={true}
          visible={loading}>
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator
                animating={loading}
                color='#1976d2'
                size='large' />
              <View style={{ width: width / 30 }} />
              <Text style={{ fontSize: width / 25, color: '#1976d2' }}>Loading...</Text>
            </View>
          </View>
        </Modal>
      )
    }
  } else {
    return (
      <View></View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
    top: height / 2

  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    padding: width / 20,
    width: width / 1.5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalBackgroundIOS: {
    flex: 1,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    backgroundColor: 'red',
    top: height / 2,
  },
  activityIndicatorWrapperIOS: {
    backgroundColor: '#FFFFFF',
    padding: width / 20,
    width: width / 1.5,
    height: height / 12,
    alignItems: 'center',
    flexDirection: 'row',
  }
});

export default Loader;