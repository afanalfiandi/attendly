import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppIntroSlider from 'react-native-app-intro-slider';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GrantLocation from './GrantLocation';

const blue = '#0D4AA7';
const black = '#3d3d3d';
const red = '#C74B4C';
const slides = [
  {
    key: 1,
    title: 'Selamat Datang!',
    text: 'Kelola dan pantau absensi dengan efisien',
    image: require('../assets/img/icon/slider-1.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,
    title: 'Kehadiran',
    text: 'Atur kehadiran secara akurat dengan fitur GPS Tracking',
    image: require('../assets/img/icon/slider-2.png'),
    backgroundColor: '#febe29',
  },
  {
    key: 3,
    title: 'Notifikasi',
    text: 'Dapatkan notifikasi secara real-time sesuai jadwal Anda',
    image: require('../assets/img/icon/slider-3.png'),
    backgroundColor: '#22bcb5',
  }
]

export default class Intro extends React.Component {
  state = {
    showRealApp: false
  }
  componentDidMount() {
    this._get();
  }

  _get = async () => {
    try {
      const val = await AsyncStorage.getItem('showApp')
      if (val == '1') {
        this.setState({ showRealApp: true });
      } else {
        return;
      }
    } catch (e) {
      console.log(e);
    }
  }

  _renderItem = ({ item }) => {
    return (
      <View style={styles.container}>
        <View style={styles.imgContainer}>
          <Image style={styles.image} source={item.image} />
        </View>
        <View style={styles.descContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
          {item.key == 3 && (
            <TouchableOpacity style={styles.startBtn} onPress={this._onDone}>
              <Text style={styles.startTxt}>Mulai</Text>
            </TouchableOpacity>
          )
          }
        </View>
      </View>
    );
  }
  _onDone = async () => {
    this.setState({ showRealApp: true });
    try {
      await AsyncStorage.setItem('showApp', '1')
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    if (this.state.showRealApp) {
      return <GrantLocation />;
    } else {
      return <AppIntroSlider dotStyle={{backgroundColor:'#F7B44C'}} activeDotStyle={{backgroundColor:blue}} renderItem={this._renderItem} data={slides} />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center'
  },
  imgContainer: {
    flex: 3,
    width: responsiveWidth(100),
    justifyContent: 'center',
    alignItems: 'center'
  },
  descContainer: {
    flex: 2,
    alignItems: 'center'
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    color: blue,
    fontWeight: 'bold',
    marginBottom: 5
  },
  text: {
    fontSize: responsiveFontSize(1.8),
    color: blue
  },
  startBtn: {
    backgroundColor: blue,
    marginTop: 40,
    height: responsiveHeight(5),
    width: responsiveWidth(40),
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  startTxt: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15
  }
})