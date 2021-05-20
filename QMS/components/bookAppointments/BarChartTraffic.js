import React, { Component } from 'react'
import { View, Text, Animated, ScrollView, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
export default class BarChartTraffic extends Component {
    state = {
        current: ''
    }

    active = (i) => {
        this.setState({ current: i })
        this.props.getValue(i)
    }

    render() {
        const max = Math.max(...this.props.data.map(d => d.length))
        return (

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2, height: height / 4, backgroundColor: 'white', paddingLeft: width / 30 }}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

                    {this.props.data.map((d, i) => {
                        return (
                            <View key={i} style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', width: w / 12 }}>
                                <TouchableOpacity onPress={() => this.active(i)}>
                                    <Animated.View style={{ width: this.props.barWidth, height: d.length ? this.props.barMaxHeight * d.length / max : 0, backgroundColor: this.state.current === i ? '#fb8c00' : '#ffe0b2', borderTopLeftRadius: 3, borderTopRightRadius: 3 }} />
                                </TouchableOpacity>
                                <Text style={{ color: 'grey', fontSize: width / 35, width: w / 12, textAlign: 'center' }}>{d.time}</Text>
                            </View>

                        )
                    })}

                </ScrollView>

            </View>



        )
    }
}

BarChartTraffic.propTypes = {
    barWidth: PropTypes.number,
    barMaxHeight: PropTypes.number,
}

BarChartTraffic.defaultProps = {
    barWidth: 20,
    barMaxHeight: 200,
}