import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const Histogram = ({ data, xAxis, title }) => {
  
  //grabs data for a chart based on different variables
  const chartData = Array.isArray(data)
    ? {
      labels: xAxis,
      datasets: [
        {
          data
        }
      ]
    }
    : data;
  
  //draws histogram via the bar chart module in the react native chart kit
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <BarChart
        data={chartData}
        width={screenWidth}
        height={220}
        fromZero={true}
        segments={4}
        chartConfig={{
          backgroundGradientFrom: '#e7e7e7',
          backgroundGradientTo: '#e7e7e7',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
          style: {
            borderRadius: 16,
            padding: 5,
          },
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

export default Histogram;