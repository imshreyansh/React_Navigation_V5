import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Header from '../common/Header'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { getMemberDietDetails } from '../../utils/api/getWorkoutAndDietMember'
import i18n from 'i18n-js';


export default class DietPlanDetailsScreen extends React.Component {
  _isMounted = false
  state = {

    dietPlanSession: '',
    dietPlan: []
  }


  componentDidMount() {
    this._isMounted = true
    if (this._isMounted) {
      getMemberDietDetails(this.props.navigation.getParam('id')).then(res => {
        if (res) {
          this.setState({
            dietPlanSession: res.data.response.dietPlanSession,
            dietPlan: res.data.response.dietPlan
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

  render() {
    const { dietPlanSession } = this.state
    var shours = new Date(dietPlanSession.fromTime).getHours()
    var sminutes = new Date(dietPlanSession.fromTime).getMinutes()
    var sampm = shours >= 12 ? 'PM' : 'AM'
    shours = shours % 12
    shours = shours ? shours : 12  // the hour '0' should be '12'
    var startTime = shours + ':' + `${("0" + sminutes).slice(-2)}` + ' ' + sampm
    var ehours = new Date(dietPlanSession.toTime).getHours()
    var eminutes = new Date(dietPlanSession.toTime).getMinutes()
    var eampm = ehours >= 12 ? 'PM' : 'AM'
    ehours = ehours % 12
    ehours = ehours ? ehours : 12  // the hour '0' should be '12'
    var endTime = ehours + ':' + `${("0" + eminutes).slice(-2)}` + ' ' + eampm
    const calories = this.props.navigation.getParam('calories')
    function ico(d) {
      if (d === "Breakfast") {
        return `breakfast`
      } else if (d === "Lunch") {
        return `lunch`
      } else {
        return `dinner`
      }
    }
    return (
      <View style={{ flex: 1, backgroundColor: '#eeeeee', transform: transform() }}>
        <Header title={this.props.navigation.getParam('title')} goBack={() => this.onGoBack()} />
        <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w, borderRadius: 3, paddingBottom: width / 30, backgroundColor: '#00bfa5' }}>
          <View style={{ marginTop: width / 30, marginLeft: width / 30, flexDirection: 'row' }}>
            <Icon name={ico(dietPlanSession.sessionName)} size={width / 10} color='#424242' />
            <Text style={{ fontWeight: 'bold', fontSize: width / 15, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30, color: 'white', transform: transform() }}>{dietPlanSession.sessionName}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.08, marginTop: width / 30, marginLeft: width / 30 }}>
            <View style={{ flexDirection: 'row' }}>
              <Icon name='calories-icon' size={width / 10} style={{ marginTop: 'auto', marginBottom: 'auto' }} color='#424242' />
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ fontSize: width / 24, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30, color: 'white', textAlign: 'center', transform: transform() }}>{i18n.t('calories')}</Text>
                <Text style={{ fontWeight: 'bold', fontSize: width / 12, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30, color: '#fff176', textAlign: 'center', transform: transform() }}>{Math.round(calories)}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Icon name='stop-watch' size={width / 15} style={{ marginTop: 'auto', marginBottom: 'auto' }} color='#424242' />
              <Text style={{ fontWeight: 'bold', fontSize: width / 25, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30, color: '#fff176', transform: transform() }}>{startTime}-{endTime}</Text>

            </View>
          </View>

        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ width: w / 1.05, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', flexWrap: 'wrap', marginTop: width / 20 }}>
            {this.state.dietPlan.map((data, i) => {
              return (

                <View style={{ width: w / 2.2, backgroundColor: '#e0f7fa', borderWidth: 1, paddingBottom: width / 30, borderRadius: 5, borderColor: '#80deea', marginTop: width / 30 }}>
                  <Text style={{ width: w / 1.55, fontSize: width / 25, color: '#f58020', fontWeight: 'bold', marginLeft: width / 30, marginTop: width / 60, transform: transform(), textAlign: textAlign() }}>{data.foodItem.itemName}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 2.3, marginTop: width / 40 }}>
                    <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                      <Text style={{ fontSize: width / 30, color: '#0097a7', transform: transform() }}>{i18n.t('calories')}</Text>
                      <Text style={{ fontSize: width / 25, color: 'orange', fontWeight: 'bold', textAlign: 'center', transform: transform() }}>{Math.round(data.calories)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'orange', padding: width / 50, width: width / 5, borderRadius: 5 }}>
                      <Text style={{ fontSize: width / 30, color: '#fff', transform: transform() }}>{data.foodItem.measurement}</Text>
                      <View style={{ width: width / 50 }} />
                      <Text style={{ fontSize: width / 28, color: '#fff', fontWeight: 'bold', transform: transform() }}>{data.measureValue}</Text>
                    </View>
                  </View>
                </View>

              )
            })}
          </View>
        </ScrollView>
      </View>
    )
  }
}