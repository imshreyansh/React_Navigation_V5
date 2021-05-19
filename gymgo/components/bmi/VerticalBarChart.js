import React, { Component } from 'react'
import { View, Text, Animated } from 'react-native'
import PropTypes from 'prop-types'

export default class VerticalBarChart extends Component {

    render() {
        const max = Math.max(...this.props.data.map(d => d.length))
        return (
            <View style={{ ...this.props.style, flexDirection: 'row', justifyContent: 'space-between' }}>
                {this.props.data.map((d, i) => {
                    if (d.color !== undefined) {
                        return (
                            <View key={i} style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Text style={{ color: d.color, ...this.props.textLabelStyle }}>{d.label}</Text>
                                <Text style={{ color: 'orange', ...this.props.textDataStyle }}>{d.weight}</Text>
                                <Animated.View style={{ borderTopLeftRadius: 3, borderTopRightRadius: 3, width: this.props.barWidth, height: this.props.barMaxHeight * d.length / max, backgroundColor: '#4D91E7' }} />
                            </View>
                        )
                    } else {
                        const color = ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)
                        return (
                            <View key={i} style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Text style={{ color: color, ...this.props.textLabelStyle }}>{d.label}</Text>
                                <Text style={{ color: 'orange', ...this.props.textDataStyle }}>{d.weight}</Text>
                                <Animated.View style={{ borderTopLeftRadius: 3, borderTopRightRadius: 3, width: this.props.barWidth, height: this.props.barMaxHeight * d.length / max, backgroundColor: '#4D91E7' }} />
                            </View>
                        )
                    }
                })}
            </View>
        )
    }
}

VerticalBarChart.propTypes = {
    barWidth: PropTypes.number,
    barMaxHeight: PropTypes.number,
}

VerticalBarChart.defaultProps = {
    barWidth: 20,
    barMaxHeight: 200,
}