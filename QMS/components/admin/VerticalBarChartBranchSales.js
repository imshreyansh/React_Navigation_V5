import React, { Component } from 'react'
import { View, Text, Animated, ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
export default class VerticalBarChartBranchSales extends Component {

    render() {
        const max = Math.max(...this.props.data.map(d => d.length))
        return (

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.4, height: height / 2.5, backgroundColor: 'white', borderLeftWidth: 1, borderColor: "#bdbdbd", paddingLeft: width / 30 }}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

                    {this.props.data.map((d, i) => {
                        return (
                            <View key={i} style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Text style={{ color: d.color, ...this.props.textLabelStyle }}>{d.label}</Text>
                                <Text style={{ color: 'orange', fontSize: width / 35, width: w / 7, textAlign: 'center', fontWeight: 'bold' }}>{d.sales}</Text>
                                <Animated.View style={{ width: this.props.barWidth, height: d.length ? this.props.barMaxHeight * d.length / max : 0, backgroundColor: '#1565c0' }} />
                                <Text style={{ color: 'grey', fontSize: width / 35, width: w / 7, textAlign: 'center' }}>{d.month}</Text>

                            </View>

                        )
                    })}

                </ScrollView>

            </View>



        )
    }
}

VerticalBarChartBranchSales.propTypes = {
    barWidth: PropTypes.number,
    barMaxHeight: PropTypes.number,
}

VerticalBarChartBranchSales.defaultProps = {
    barWidth: 20,
    barMaxHeight: 200,
}