import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Header from '../common/Header'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { getMemberWorkoutDetails } from '../../utils/api/getWorkoutAndDietMember'
import Video from 'react-native-video'
import i18n from 'i18n-js';

export default class WorkoutDetails extends React.Component {
  _isMounted = false

  state = {
    workoutSession: '',
    abc: [1, 2, 3],
    video: ""
  }


  componentDidMount() {
    this._isMounted = true
    if (this._isMounted) {
      getMemberWorkoutDetails(this.props.navigation.getParam('id')).then(res => {
        if (res) {
          this.setState({
            workoutSession: res.data.response,
            video: `${URL}/${res.data.response.workoutsVideo.path.replace(/\\/g, "/")}`
          })
        }
      })
    }


  }

  componentWillUnmount() {
    this._isMounted = false
  }

  onGoBack() {
    this.props.navigation.goBack()
  }

  videoError = () => {
    alert('Video Cannot be loaded')
  }

  render() {
    const video = JSON.parse(JSON.stringify({ uri: this.state.video }))
    return (
      <View style={{ flex: 1, backgroundColor: '#eeeeee' }}>
        <View style={{ transform: transform() }}>
          <Header title={this.props.navigation.getParam('title')} goBack={() => this.onGoBack()} />

        </View>
        <ScrollView>

          <Video source={video}
            resizeMode="stretch"
            controls={true}
            onError={this.videoError}
            style={{ width: w, height: h / 3 }} />

          <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20, paddingBottom: width / 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {this.props.navigation.getParam('sets') && this.props.navigation.getParam('sets') !== 0 ?
              <View style={{ width: width / 6, height: width / 6, borderRadius: width / 12, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: width / 22, color: '#f58020', fontWeight: 'bold' }}>{this.props.navigation.getParam('sets')}</Text>
                <Text style={{ fontSize: width / 28, color: '#333' }}>{i18n.t('sets')}</Text>
              </View> : null}
            {this.props.navigation.getParam('reps') && this.props.navigation.getParam('reps') !== 0 ?
              <View style={{ width: width / 6, height: width / 6, borderRadius: width / 12, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: width / 22, color: '#f58020', fontWeight: 'bold' }}>{this.props.navigation.getParam('reps')}</Text>
                <Text style={{ fontSize: width / 28, color: '#333' }}>{i18n.t('reps')}</Text>
              </View> : null}
            {this.props.navigation.getParam('weight') && this.props.navigation.getParam('weight') !== 0 ?
              <View style={{ width: width / 6, height: width / 6, borderRadius: width / 12, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: width / 22, color: '#f58020', fontWeight: 'bold' }}>{this.props.navigation.getParam('weight')}</Text>
                <Text style={{ fontSize: width / 28, color: '#333' }}>{i18n.t('kg')}</Text>
              </View> : null}
            {this.props.navigation.getParam('time') && this.props.navigation.getParam('time') !== '0h 0m' ?
              <View style={{ width: width / 6, height: width / 6, borderRadius: width / 12, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: width / 22, color: '#f58020', fontWeight: 'bold', textAlign: 'center' }}>{this.props.navigation.getParam('time')}</Text>
                <Text style={{ fontSize: width / 28, color: '#333' }}>{i18n.t('time')}</Text>
              </View> : null}
            {this.props.navigation.getParam('distance') && this.props.navigation.getParam('distance') !== 0 ?
              <View style={{ width: width / 6, height: width / 6, borderRadius: width / 12, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', marginTop: width / 30 }}>
                <Text style={{ fontSize: width / 22, color: '#f58020', fontWeight: 'bold' }}>{this.props.navigation.getParam('distance')}</Text>
                <Text style={{ fontSize: width / 28, color: '#333' }}>{i18n.t('km')}</Text>
              </View> : null}
          </View>
          <View style={{ padding: width / 20, transform: transform() }}>
            <Text style={{ fontSize: width / 22, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('instructions')}</Text>


            <View style={{ flexDirection: 'row', marginTop: width / 30 }}>
              <View style={{ width: width / 30, height: width / 30, borderRadius: width / 60, backgroundColor: '#9e9e9e', marginTop: width / 100 }} />
              <View style={{ width: width / 30 }} />
              <Text style={{ width: w / 1.2, fontSize: width / 28, color: '#333', transform: transform(), textAlign: textAlign() }}>{this.state.workoutSession.instructions}</Text>
            </View>

          </View>
        </ScrollView>
      </View>
    )
  }
}