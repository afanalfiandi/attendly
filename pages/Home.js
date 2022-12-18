import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Modal, ScrollView, RefreshControl, Alert, Pressable, PermissionsAndroid, Image, Dimensions, ActivityIndicator, ImageBackground, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import { getPreciseDistance } from 'geolib';
import LinearGradient from 'react-native-linear-gradient';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import RNSettings from 'react-native-settings';
import NoInternet from './NoInternet';
import NetInfo from "@react-native-community/netinfo";


import moment from 'moment'
import 'moment/locale/id';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const blue = '#0D4AA7';
const black = '#616161';
const red = '#C74B4C';
const yellow = '#F7B44C';

const latSekolah = '-7.4214337';
const longSekolah = '109.2542909';

const Home = () => {
  const navigation = useNavigation();
  const [ping, setPing] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [clock, setClock] = useState(moment().format("hh:mm"));
  const [jamPresensi, setJamPresensi] = useState(moment().format("hh:mm:ss"));

  const [distance, setDistance] = useState(null);

  const [latUser, setLatUser] = useState();
  const [longUser, setLongUser] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingMap, setLoadingMap] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [initRegion, setInitRegion] = useState({
    latitude: -7.4214337,
    longitude: 109.2542909,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [data, setData] = useState({
    nama: null,
    nip: null,
    img: null
  });
  const [jam, setJam] = useState(
    {
      masuk: null,
      pulang: null
    }
  );

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3500);

    setInterval(() => {
      setClock(moment().format('hh:mm'));
      setJamPresensi(moment().format('hh:mm:ss'));
      pingCheck();
      getData();
      getJam();
      getJarak();
    }, 1000);
  }, []);


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    getJam();
    getJarak();
    wait(2000).then(() => setRefreshing(false));
  }, []);


  const pingCheck = () => {
    NetInfo.fetch().then(state => {
      setPing(state.isConnected);
    });
  }

  const getData = async () => {
    const userId = await AsyncStorage.getItem('userId');

    fetch('https://afanalfiandi.com/attendly/api/api.php?op=getUser', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userId
      })
    }).then((response) => response.json())
      .then((json) => {
        setData({
          nama: json.nama,
          nip: json.nip,
          img: json.img
        });
      })
  }


  const getJam = async () => {
    const userId = await AsyncStorage.getItem('userId');
    fetch('https://afanalfiandi.com/attendly/api/api.php?op=getJam', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userId
      })
    }).then((response) => response.json())
      .then((json) => {
        setJam(
          {
            masuk: json.masuk,
            pulang: json.pulang
          }
        );
      })
  }

  const getJarak = async () => {
    const gps = await RNSettings.getSetting(RNSettings.LOCATION_SETTING);

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    Geolocation.getCurrentPosition((position) => {
      const lat = JSON.stringify(position.coords.latitude);
      const long = JSON.stringify(position.coords.longitude);
      var jarak = Math.sqrt(
        (lat - latSekolah) * (lat - latSekolah) +
        (long - longSekolah) * (long - longSekolah)
      );
      jarak = jarak * 111319;
      setDistance(jarak.toFixed(0));
      // setDistance('12');
      setLatUser(lat);
      setLongUser(long);

    }, (e) => console.log(e), { enableHighAccuracy: false, timeout: 3000 });
  }


  const openMap = () => {
    setModalVisible(true);
  }

  const onSuccess = () => {
    setModalVisible(!modalVisible);
    setLoadingMap(false);
    if (jam.masuk == null) {
      setJam({
        masuk: jamPresensi,
        pulang: null
      });
    } else {
      setJam({
        masuk: jam.masuk,
        pulang: jamPresensi
      });
    }
  }
  const submitMasuk = async () => {
    const userId = await AsyncStorage.getItem('userId');
    setLoadingMap(true);
    fetch('https://afanalfiandi.com/attendly/api/api.php?op=addPresensiMasuk', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userId,
        lat: latUser,
        long: longUser,
        masuk: jamPresensi
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 'Success!') {
          setTimeout(() => {
            Alert.alert('Status Presensi', 'Presensi masuk berhasil!', [
              {
                text: "OK", onPress: () => onSuccess()
              }
            ]);
          }, 3000);
        } else {
          setLoadingMap(true);
          setTimeout(() => {
            Alert.alert('Status Presensi', 'Presensi masuk gagal!', [
              {
                text: "OK", onPress: () => setLoadingMap(false)
              }
            ]);
          }, 3000)
        }
      })
      .catch((e) => {
        console.log(e);
      })
  }

  const submitPulang = async () => {
    const userId = await AsyncStorage.getItem('userId');
    setLoadingMap(true);
    fetch('https://afanalfiandi.com/attendly/api/api.php?op=addPresensiPulang', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userId,
        lat: latUser,
        long: longUser,
        pulang: jamPresensi
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 'Success!') {
          setJam({
            masuk: jam.masuk,
            pulang: jamPresensi
          });
          setTimeout(() => {
            Alert.alert('Status Presensi', 'Presensi pulang berhasil!', [
              {
                text: "OK", onPress: () => onSuccess()
              }
            ]);
          }, 3000);
        } else {
          setLoadingMap(true);
          setTimeout(() => {
            Alert.alert('Status Presensi', 'Presensi pulang gagal!', [
              {
                text: "OK", onPress: () => setLoadingMap(false)
              }
            ]);
          }, 3000)
        }
      })
      .catch((e) => {
        console.log(e);
      })
  }
  const MasukBtn = () => {
    return (
      <TouchableOpacity style={[styles.btn, { backgroundColor: blue }]} onPress={openMap}>
        <Image source={require('../assets/img/icon/absen-finger.png')} />
        <Text style={styles.btnText}>MASUK</Text>
      </TouchableOpacity>
    )
  }

  const PulangBtn = () => {
    return (
      <TouchableOpacity style={[styles.btn]} onPress={openMap} disabled={(jam.pulang != null ? true : false)}>
        <LinearGradient colors={['#E73272', '#863398']} style={[styles.liner]}>
          <Image source={require('../assets/img/icon/absen-finger.png')} />
          <Text style={styles.btnText}>PULANG</Text>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  const SelesaiBtn = () => {
    return (
      <TouchableOpacity style={[styles.btn, { backgroundColor: yellow }]} disabled={true}>
        <Image source={require('../assets/img/icon/selesai.png')} />
        <Text style={styles.btnText}>SELESAI</Text>
      </TouchableOpacity>
    )
  }

  const DisabledBtn = () => (
    <TouchableOpacity style={[styles.btn, { backgroundColor: red }]} disabled={true}>
      <Image source={require('../assets/img/icon/absen-finger.png')} />
      <Text style={styles.btnText}>GAGAL!</Text>
    </TouchableOpacity>
  )

  return (
    <View style={{
      flex: 1,
      height: height,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white'
    }}>
      {loading && (
        <ActivityIndicator size="large" style={styles.activityIndicator} />
      )}

      {!loading && ping == true && (
        <ImageBackground source={require('../assets/img/background.png')} resizeMode="cover" style={styles.image}
        >

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalContainer}>

              <View style={styles.mapContainer}>
                <MapView
                  style={{ width: '100%', height: '100%' }}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={initRegion}
                  showsUserLocation={true}
                >

                  <Marker coordinate={{
                    latitude: -7.4214337,
                    longitude: 109.2542909,
                  }} />
                </MapView>
                <View style={styles.buttonCallout}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(!modalVisible)}
                    style={styles.backBtn}
                  >
                    <Image source={require('../assets/img/icon/back-blue.png')} />
                  </TouchableOpacity>
                </View>



                <View style={styles.btnMasukContainer}>
                  {jam.masuk == null && (
                    <TouchableOpacity
                      onPress={submitMasuk}
                      style={styles.masukBtn}
                    >
                      <Text style={styles.masukText}>Masuk</Text>
                    </TouchableOpacity>
                  )}

                  {jam.masuk != null && (
                    <TouchableOpacity
                      onPress={submitPulang}
                      style={styles.masukBtn}
                    >
                      <Text style={styles.masukText}>Pulang</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {loadingMap && (
                  <ActivityIndicator size="large" style={{
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    color: 'blue'
                  }} />
                )}
              </View>
            </View>
          </Modal>
          <View style={styles.header}>

            <View style={styles.imgContainer}>
              <TouchableOpacity onPress={() => {
                navigation.navigate('Profil');
              }}>
                <Image style={styles.userImg} source={{ uri: 'https://afanalfiandi.com/attendly/uploads/img/' + data.img }} />
              </TouchableOpacity>
            </View>
            <View style={styles.userContainer}>
              <Text style={styles.h1}>{data.nama}</Text>
              <Text style={styles.h2}>{data.nip}</Text>

            </View>
            <View style={[styles.imgContainer, {
              width: 35,
              height: 35,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 100,
              shadowColor: "#000",
              shadowOffset: {
                width: 5,
                height: 9,
              },
              shadowOpacity: 1,
              shadowRadius: 10,
              elevation: 20,
            }]}>
              <TouchableOpacity onPress={() => {
                navigation.navigate('Izin');
              }}>
                <Image style={[styles.userImg, { height: 25, width: 24 }]} source={require('../assets/img/icon/cuti-logo.png')} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.clockContainer}>
            <Text style={styles.clock}>{clock}</Text>
            <Text style={styles.day}>{moment().format("dddd, Do MMMM YYYY")}</Text>
          </View>

          {/* jika jarak lebih dr 50, disable btn dan ganti warna merah */}
          {distance >= 50 && (
            <DisabledBtn />
          )}

          {/* Jika jarak kurang dari 50, sudah absen masuk tapi belum absen pulang */}
          {distance < 50 && jam.masuk != null && jam.pulang == null && (
            <PulangBtn />
          )}

          {/* jika jarak krg dari 50, blm absen masuk dan pulang, btn warna gradasi dan tulisan pulang */}
          {distance < 50 && jam.masuk == null && jam.pulang == null (
            <MasukBtn />
          )}


          {distance < 50 && jam.pulang != null && jam.masuk != null && (
            <SelesaiBtn />
          )}
          <View style={styles.distanceContainer}>
            <Image source={require('../assets/img/icon/gps-black.png')} />

            {distance >= 50 && (
              <Text style={[styles.distanceText, { color: red }]}>
                Jarak : {distance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} Meter
              </Text>
            )}
            {distance < 50 && (
              <Text style={[styles.distanceText, { color: black }]}>
                Jarak : {distance} Meter
              </Text>
            )}

          </View>

          <View style={styles.historyContainer}>
            <View style={styles.column}>

              <View style={styles.historyTextContainer}>
                <Image style={styles.clockImg} source={require('../assets/img/icon/clock-masuk.png')} />
                {jam.masuk != null && (
                  <Text style={styles.historyText}>{jam.masuk} </Text>
                )}

                {jam.masuk == null && (
                  <Text style={styles.historyText}>--:-- </Text>
                )}
                <Text >MASUK </Text>
              </View>
            </View>
            <View style={styles.column}>

              <View style={styles.historyTextContainer}>
                <Image style={styles.clockImg} source={require('../assets/img/icon/clock-pulang.png')} />
                {jam.pulang != null && (
                  <Text style={styles.historyText}>{jam.pulang} </Text>
                )}

                {jam.pulang == null && (
                  <Text style={styles.historyText}>--:-- </Text>
                )}
                <Text>PULANG </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      )}
      {!loading && ping != true && (
        <NoInternet />
      )}
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  image: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: '7%',
    padding: 20,
    position: 'absolute'
  },
  userContainer: {
    alignItems: 'center',
    flex: 1,
  },
  h1: {
    fontSize: width * 0.06,
    textTransform: 'uppercase',
    color: black
  },
  h2: {
    color: black,
    fontSize: width * 0.04,
  },
  userImg: {
    width: 35,
    height: 35,
    borderRadius: 100,
    elevation: 5
  },
  imgContainer: {
    elevation: 5

  },
  clockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '20%',
  },
  clock: {
    fontSize: width * 0.12,
    fontWeight: 'bold',
    color: black
  },
  day: {
    fontSize: width * 0.05,
    color: black
  },
  btn: {
    alignItems: 'center',
    width: 150,
    justifyContent: 'center',
    borderRadius: 200,
    height: 150,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 9,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 20,
  },

  liner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 200,

  },
  btnText: {
    color: 'white',
    fontSize: width * 0.045,
    marginTop: 10,
    fontWeight: 'bold'
  },
  distanceContainer: {
    flexDirection: 'row',
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '10%'
  },
  distanceText: {
    marginLeft: '2%',
    fontSize: width * 0.045,
    fontWeight: 'bold'
  },
  historyContainer: {
    width: width,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    bottom: '10%',
    position: 'absolute'
  },
  column: {
    justifyContent: 'center',
    width: '50%',
    alignItems: 'center',
  },
  historyTextContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  historyText: {
    fontSize: width * 0.053,
    marginTop: 10,
    fontWeight: 'bold',
    color: black
  },
  clockImg: {
    width: 30,
    height: 30,
    opacity: 0.7
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },

  buttonCallout: {
    position: 'absolute',

    margin: width * 0.05,
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 20
  },

  backBtn: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnMasukContainer: {
    position: 'absolute',
    width: '100%',
    bottom: '8%',
    paddingHorizontal: 22
  },
  masukBtn: {
    backgroundColor: blue,
    height: width * 0.09,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 7
  },
  masukText: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: 17
  },
  activityIndicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    color: 'blue'
  }

})