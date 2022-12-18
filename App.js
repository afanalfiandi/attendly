import * as React from 'react';
import { View, BackHandler, StyleSheet, Image, StatusBar, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './pages/SplashScreen';
import Intro from './pages/Intro';
import GrantLocation from './pages/GrantLocation';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Rekap from './pages/Rekap';
import Jadwal from './pages/Jadwal';
import Profil from './pages/Profil';
import Masuk from './pages/Masuk';
import Pulang from './pages/Pulang';
import Izin from './pages/Izin';
import Scan from './pages/Scan';
import UbahProfil from './pages/UbahProfil';
import UbahPassword from './pages/UbahPassword';
import RekapIzin from './pages/RekapIzin';
import ActivateGPS from './pages/ActivateGPS';
import NoInternet from './pages/NoInternet';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const App = () => {


  React.useEffect(() => {
    const backAction = () => {
      Alert.alert("", "Apakah Anda yakin ingin keluar dari aplikasi?", [
        {
          text: "Batal",
          onPress: () => null,
          style: "cancel"
        },
        { text: "Keluar", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  return (
    <NavigationContainer>
      <StatusBar
        animated={true}
        backgroundColor='white'
        barStyle='dark-content'
        
      />
      <Tab.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true, }}>
        <Tab.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ tabBarStyle: { display: 'none' }, tabBarButton: () => null }}
        />
        <Tab.Screen name="Intro" component={Intro} options={{ tabBarStyle: { display: 'none' }, tabBarButton: () => null }} />
        <Tab.Screen name="GrantLocation" component={GrantLocation} options={{ tabBarStyle: { display: 'none' }, tabBarButton: () => null }} />
        <Tab.Screen name="ActivateGPS" component={ActivateGPS} options={{ tabBarStyle: { display: 'none' }, tabBarButton: () => null }} />
        <Tab.Screen name="NoInternet" component={NoInternet} options={{ tabBarStyle: { display: 'none' }, tabBarButton: () => null }} />
        <Tab.Screen name="SignIn" component={SignIn} options={{ tabBarStyle: { display: 'none' }, tabBarButton: () => null }} />
        <Tab.Screen name="Masuk" component={Masuk} options={{ tabBarStyle: { display: 'none' }, tabBarButton: () => null }} />
        <Tab.Screen name="Pulang" component={Pulang} options={{ tabBarStyle: { display: 'none' }, tabBarButton: () => null }} />
        <Tab.Screen name="Izin" component={Izin} options={{ tabBarStyle: { display: 'none' }, tabBarButton: () => null }} />
        <Tab.Screen name="Scan" component={Scan} options={{ tabBarStyle: { display: 'none' }, tabBarButton: () => null }} />
        <Tab.Screen name="UbahProfil" component={UbahProfil} options={{ tabBarStyle: { display: 'none' }, tabBarButton: () => null }} />
        <Tab.Screen name="UbahPassword" component={UbahPassword} options={{ tabBarStyle: { display: 'none' }, tabBarButton: () => null }} />
        <Tab.Screen name="RekapIzin" component={RekapIzin} options={{ tabBarStyle: { display: 'none' }, tabBarButton: () => null }} />
        <Tab.Screen name="Home" component={Home} options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  source={
                    focused ?
                      require("./assets/img/icon/home-blue.png")
                      : require("./assets/img/icon/home-white.png")
                  }
                />
              </View>
            );
          }
        }}
        />
        <Tab.Screen name="Rekap"
          component={Rekap}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View>
                  <Image
                    source={
                      focused ?
                        require("./assets/img/icon/rekap-blue.png")
                        : require("./assets/img/icon/rekap-white.png")
                    }
                  />
                </View>
              );
            }
          }} />
        <Tab.Screen name="Jadwal" component={Jadwal}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View>
                  <Image
                    source={
                      focused ?
                        require("./assets/img/icon/jadwal-blue.png")
                        : require("./assets/img/icon/jadwal-white.png")
                    }
                  />
                </View>
              );
            }
          }}
        />
        <Tab.Screen name="Profil" component={Profil}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View>
                  <Image
                    source={
                      focused ?
                        require("./assets/img/icon/profile-blue.png")
                        : require("./assets/img/icon/profile-white.png")
                    }
                  />
                </View>
              );
            }
          }} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default App



const styles = StyleSheet.create({})