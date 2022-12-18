import { StyleSheet, PermissionsAndroid, Text, Image, View, Animated, Alert } from 'react-native'
import React, { useRef, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNSettings from 'react-native-settings';

const blue = '#0D4AA7';
const black = '#3d3d3d';
const red = '#C74B4C';

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    fadeIn();
    navig();
  }, []);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  const navig = () => {
    setTimeout(async () => {
      const userId = await AsyncStorage.getItem('userId');
      const showApp = await AsyncStorage.getItem('showApp');
      const grantLocation = await AsyncStorage.getItem('grantLocation');
      const gps = await RNSettings.getSetting(RNSettings.LOCATION_SETTING);

      if (showApp != 1) {
        navigation.navigate('Intro');
      } else if (grantLocation != 1) {
        navigation.navigate('GrantLocation');
      } else if (grantLocation == 1 && gps != 'ENABLED' && userId != null) {
        navigation.navigate('ActivateGPS');
      } else if (userId == null) {
        navigation.navigate('SignIn');
      } else {
        navigation.navigate('Home');
      }
    }, 4000);
  }
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.View
          style={{ opacity: fadeAnim }}
        >
          <Image source={require('../assets/img/icon/finger-lg.png')} />
        </Animated.View>
      </View>
      <View style={styles.brandContainer}>
        <Animated.View style={[styles.brandContainer,{opacity: fadeAnim}]}>
          <Text style={styles.brandName}>attend.ly</Text>
          <Text style={styles.brandMoto}>an easy way to track and record attendance</Text>
        </Animated.View>
      </View>
    </View >
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  logoContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '49%'
  },
  brandContainer: {
    flex: 2,
    paddingTop: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: blue,
    marginTop: '25%'
  },
  brandMoto: {
    color: blue
  }
})