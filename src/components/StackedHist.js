import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { StackedBarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const StackedHist = ({ data, legend, labels, barColors, title, shortNameLegend }) => {
  const chartData = {
    labels: labels,
    legend: legend,
    data: data,
    barColors: barColors,
  };

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text>{shortNameLegend}</Text>
      <StackedBarChart
        data={chartData}
        width={screenWidth}
        height={300}
        fromZero={true}
        segments={4}
        decimalPlaces={1}
        chartConfig={{
          backgroundGradientFrom: '#e7e7e7',
          backgroundGradientTo: '#e7e7e7',
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8
  }
});

export default StackedHist;