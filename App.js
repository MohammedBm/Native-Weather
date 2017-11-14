import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Dimensions,
  TextInput,
  Button
} from 'react-native';
import axios from 'axios'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const API_key = '60b5122ca28b0be9'
const default_zipcode = '4021'

export default class App extends React.Component {
  constructor(){
    super();

    this.state = {
      zipcode: default_zipcode,
      days: []
    }
  }

  
  getForecast = () =>  {
    const request_url = "http://api.wunderground.com/api/" + API_key + '/forecast/q/' + default_zipcode + '.json'
    axios.get(request_url).then( (response) => {
      if( response.status == 200){
        let weather = response.data.forecast.simpleforecast.forecastday
        let forecast = [];
        weather.forEach(( element, index ) => {
          forecast = forecast.concat([
            {
              date: element.date.weekday,
              temperature: {
                high: {
                  fahrenheit: element.high.fahrenheit,
                  celsius: element.high.celsius
                },
                low: {
                  fahrenheit: element.low.fahrenheit,
                  celsius: element.low.celsius
                }
              },
              conditions: element.conditions,
              wind: {
                mph: element.avewind.mph,
                dir: element.avewind.dir
              },
              average_humidity: element.average_humidity,
              icon_url: element.icon_url  
            }
          ])
        })
        this.setState({days: forecast})
      }
    }).catch( (error) => {console.log(errr)})
  }

  onSubmit = () => {
    const { zipcode } = this.state
    (zipcode) => this.setState({ zipcode: 1 })
    console.log(this.state.zipcode)
  }


  render() {  
    if (this.state.days.length <= 0 ) {
      this.getForecast(this.state.zipcode); 
    }
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.wrapper}
        resetScrollToCoords={{ x: 0, y: 0 }}
      >
      <View style={styles.container}>
        <StatusBar hidden />
        {
          this.state.days.map( (element, index ) => {
            return (
              <View key={index} style={styles.dayContainer}>
                <Image 
                  style={styles.imageContainer} 
                  source={{uri: element.icon_url}}
                /> 
                <Text>{element.conditions}</Text>
                <Text>High: {element.temperature.high.celsius}C | {element.temperature.high.fahrenheit}F </Text>
                <Text>Low: {element.temperature.low.celsius}C | {element.temperature.low.fahrenheit}F </Text>
                <Text>Wind: {element.wind.dir} at {element.wind.mph} MPH</Text>
                <Text style={styles.day}>{element.date}</Text>
              </View>
            )
          })
        }
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            onChangeText={this.onSubmit}
            value={this.state.location}
          />
        </View>
      </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
      backgroundColor: '#3b5998',
      padding: 30,
      justifyContent: 'center',
      alignItems: 'stretch'
  },
  dayContainer: {
    marginTop: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: Dimensions.get('window').width/1.25
  },
  imageContainer: {
    width:50,
    height:50
  },
  day: {
    fontWeight: '900',
  },
  input: {
    fontSize: 20,
      borderRadius: 5,
      paddingVertical: 7.5,
      paddingHorizontal: 15,
      backgroundColor: 'grey',
      color: 'black'
  },
  inputWrapper: {
    marginBottom: 10,
    marginTop:5
  },
  button: {
    backgroundColor: 'red',
  }
});
