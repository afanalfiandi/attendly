import { Pressable, TextInput, FlatList, Modal, ActivityIndicator, PermissionsAndroid, ScrollView, Dimensions, RefreshControl, StyleSheet, Text, Image, View, TouchableOpacity, Touchable, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import NetInfo from "@react-native-community/netinfo";
import { getPreciseDistance } from 'geolib';
import Geolocation from '@react-native-community/geolocation';
import ImagePicker, { showImagePicker, launchCamera, launchImageLibrary } from 'react-native-image-picker';

import NoInternet from './NoInternet';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const blue = '#0D4AA7';
const black = '#3d3d3d';
const red = '#C74B4C';
const grey = '#DBDBDB';

const options = {
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
const Profil = () => {
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [fotoLoading, setFotoLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [ping, setPing] = useState(true);
  const [detail, setDetail] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pw, setPw] = useState(false);
  const navigation = useNavigation();

  const [user, setUser] = useState({
    userID: '',
    userNip: '',
    userNama: '',
    userImg: '',
    userJabatan: ''
  });
  const [dataJabatan, setDataJabatan] = useState({
    id: '',
    jabatan: ''
  })
  const [nama, setNama] = useState(user.userNama);
  const [jabatan, setJabatan] = useState();
  const [optJabatan, setOptJabatan] = useState();


  const [pwLama, setPwLama] = useState();
  const [pwBaru, setPwBaru] = useState();

  const [fotouri, setUri] = useState();
  const [fototype, setType] = useState();
  const [fotoname, setName] = useState();
  const [lat, setLat] = useState();
  const [long, setLong] = useState();
  const [initialRegion, setInitialRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

  const pingCheck = () => {
    NetInfo.fetch().then(state => {
      setPing(state.isConnected);
    });
  }

  const getPosition = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    Geolocation.getCurrentPosition((position) => {
      const lat = JSON.stringify(position.coords.latitude);
      const long = JSON.stringify(position.coords.longitude);

      setInitialRegion({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      setLat(position.coords.latitude);
      setLong(position.coords.longitude);

    }, (e) => console.log(e), { enableHighAccuracy: false, timeout: 3000 });
  }

  const Map = () => {
    return (
      <MapView
        style={{ width: '100%', height: '100%' }}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation={true}
      >
      </MapView>
    )
  }

  const upload = async (uri, name, type) => {
    const userId = await AsyncStorage.getItem('userId');

    const formData = new FormData();
    formData.append('id', userId);
    formData.append('file', {
      uri: uri,
      type: type,
      name: name,
    });
    let res = await fetch('https://afanalfiandi.com/attendly/api/api.php?op=ubahImg', {
      method: 'post',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data; ',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setFotoLoading(true);
        setTimeout(() => {
          if (json == "1") {
            setUri(uri);
            setName(name);
            setType(type);
            setFotoLoading(false);
          } else {
            Alert.alert('', 'Ubah Foto Profil Gagal!');
          }
        }, 3000);
      })
  }
  const launchGallery = async () => {
    const result = await launchImageLibrary(options);

    if (result.didCancel) {
      console.log('Cancel');
    } else if (result.error) {
      console.log('ImagePicker Error: ', result.error);
    } else {
      let hasilUri = result.assets[0].uri;
      let hasilName = result.assets[0].fileName;
      let hasilType = result.assets[0].type;

      upload(hasilUri, hasilName, hasilType);
    }
  }

  const getUser = async () => {
    const userId = await AsyncStorage.getItem('userId');

    fetch('https://afanalfiandi.com/attendly/api/api.php?op=getUser', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userId,
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        setUser({
          userID: responseJson.id,
          userNip: responseJson.nip,
          userNama: responseJson.nama,
          userImg: responseJson.img,
          userJabatan: responseJson.jabatan,
        });

        setJabatan(responseJson.jabatan);
      })
      .catch((e) => {
        console.log(e);
      })
  }
  const ubahAkun = async () => {
    const userId = await AsyncStorage.getItem('userId');

    fetch('https://afanalfiandi.com/attendly/api/api.php?op=ubahAkun', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userId,
        nama: nama,
        jabatan: optJabatan
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        setEditLoading(true);
        setTimeout(() => {
          setEditLoading(false);
          if (responseJson == 'Failed') {
            Alert.alert('', 'Ubah Profil Gagal!');
          } else {
            Alert.alert('Ubah Profil', 'Ubah profil berhasil!');
            navigation.navigate('Profil');
          }
        }, 2500);

      })
      .catch((e) => {
        console.log(e);
      })
  }

  const ubahSandi = async () => {
    const userId = await AsyncStorage.getItem('userId');

    fetch('https://afanalfiandi.com/attendly/api/api.php?op=ubahPassword', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userId,
        pwLama: pwLama,
        pwBaru: pwBaru,
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        setPwLoading(true);
        setTimeout(() => {
          setPwLoading(false);
          if (responseJson == 'Failed') {
            Alert.alert('', 'Ubah Kata Sandi Gagal!');
          } else {
            Alert.alert('Ubah Kata Sandi', 'Ubah Kata Sandi Berhasil!');
            navigation.navigate('Profil');
          }
        }, 2500);

      })
      .catch((e) => {
        console.log(e);
      })
  }

  const logout = async () => {
    Alert.alert('', 'Apakah Anda yakin ingin keluar?', [
      {
        text: 'Batal',
        style: 'cancel'
      },
      {
        text: 'Keluar',
        onPress: () => {
          onLogout();
        }
      }
    ])
  }

  const onLogout = async () => {
    setLogoutLoading(true);

    setTimeout(async () => {
      setLogoutLoading(false);
      AsyncStorage.removeItem('userId');
      navigation.navigate('SignIn');
    }, 3000);
  }

  const getJabatan = () => {
    fetch('https://afanalfiandi.com/attendly/api/api.php?op=getJabatan', {})
      .then((res) => res.json())
      .then((result) => {
        setDataJabatan(result);
      })
  }

  const renderJabatan = ({ item }) => (
    <View style={{ marginVertical: 5 }}>
      <TouchableOpacity onPress={() => {
        setModalVisible(!modalVisible);
        setJabatan(item.jabatan);
        setOptJabatan(item.id);
      }} style={[{ borderBottomWidth: 1, padding: 10, borderBottomColor: grey, paddingHorizontal: 12 }]} disabled={detail ? false : true}>
        <Text style={{ color: black }}>{item.jabatan}</Text>
      </TouchableOpacity>
    </View>
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getUser();
    getPosition();

    wait(2000).then(() => setRefreshing(false));
  }, []);

  function convertToDegree(coord) {
    var absolute = Math.abs(coord);
    var degrees = Math.floor(absolute);
    var minutesNotTruncated = (absolute - degrees) * 60;
    var minutes = Math.floor(minutesNotTruncated);
    var seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    return degrees + "° " + minutes + "' " + seconds + '" ';
  }
  
  function convertDMS(lat, long) {
    var latitude = convertToDegree(lat);
    var latitudeCardinal = lat >= 0 ? "LU" : "LS";

    var longitude = convertToDegree(long);
    var longitudeCardinal = long >= 0 ? "BT" : "BB";

    return latitude + " " + latitudeCardinal + " dan " + longitude + " " + longitudeCardinal;
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      getPosition();
      getUser();
      getJabatan();
    }, 3500);

    
  }, []);
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>

            <View style={[styles.formHeading, { marginBottom: 10 }]}>
              <Text style={styles.h2}>Pilih Jabatan</Text>
              <TouchableOpacity style={styles.sideBtn} onPress={() => {
                setModalVisible(!modalVisible);
              }}>
                <Image source={require('../assets/img/icon/close-black.png')} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={dataJabatan}
              renderItem={renderJabatan}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </Modal>
      {loading && (
        <ActivityIndicator size="large" style={styles.activityIndicator} />
      )}

      {!loading && ping != true && (
        <NoInternet />
      )}
      {!loading && ping == true && (
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>

          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.h1}>Profil Saya</Text>

            </View>
            <TouchableOpacity onPress={logout}>
              <Image source={require('../assets/img/icon/power-blue.png')} />
            </TouchableOpacity>
          </View>
          <View style={styles.photoContainer}>

            <View>
              {fotoname == null && (
                <Image style={styles.profileImg} source={{ uri: 'https://afanalfiandi.com/attendly/uploads/img/' + user.userImg }} />
              )}
              {fotoname != null && (
                <Image style={styles.profileImg} source={{ uri: fotouri }} />
              )}
              {fotoLoading && (
                <ActivityIndicator size="large" style={[styles.activityIndicator, { color: 'blue' }]} />
              )}
              <TouchableOpacity style={styles.editImgBtn} onPress={launchGallery}>
                <Image source={require('../assets/img/icon/camera-small.png')} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.mapContainer}>
            <View style={styles.mapHeadingContainer}>
              <Text style={styles.h2}>Lokasi Anda Saat Ini</Text>
              <TouchableOpacity style={styles.sideBtn} onPress={() => {
                setMapLoading(true);
                setTimeout(() => {
                  getPosition();
                  setMapLoading(false);
                }, 3000);
              }}>
                <Image source={require('../assets/img/icon/refresh-black.png')} />
              </TouchableOpacity>
            </View>
            <Map />
            {mapLoading && (
              <ActivityIndicator size="large" style={styles.activityIndicator} />
            )}
          </View>
          <View style={styles.formContainer}>
            {logoutLoading && (
              <ActivityIndicator size="large" style={styles.activityIndicator} />
            )}
            <View style={styles.inputContainer}>
              <Text style={styles.h3}>Latitude</Text>

              <TextInput underlineColorAndroid="transparent"
                editable={false}
                style={[styles.input, { paddingVertical: 7, paddingHorizontal: 12 }]}
                value={JSON.stringify(initialRegion.latitude)}
                placeholderTextColor={grey}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.h3}>Longitude</Text>

              <TextInput underlineColorAndroid="transparent"
                editable={false}
                style={[styles.input, { paddingVertical: 7, paddingHorizontal: 12 }]}
                value={JSON.stringify(initialRegion.longitude)}
                placeholderTextColor={grey}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.h3}>Titik Lokasi (DMS)</Text>

              <TextInput underlineColorAndroid="transparent"
                editable={false}
                style={[styles.input, { paddingVertical: 7, paddingHorizontal: 12 }]}
                value={convertDMS(lat, long)}
                placeholderTextColor={grey}
              />
            </View>
          </View>

          <View style={styles.formContainer}>
            {editLoading && (
              <ActivityIndicator size="large" style={styles.activityIndicator} />
            )}
            <View style={styles.formHeading}>
              <Text style={styles.h2}>Detail Profil Saya</Text>
              <TouchableOpacity style={styles.sideBtn} onPress={() => {
                setDetail(true);
              }}>
                <Image source={require('../assets/img/icon/edit-black.png')} />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.h3}>NIP</Text>

              <TextInput underlineColorAndroid="transparent"
                editable={false}
                value={user.userNip}
                style={[styles.input, { color: grey, paddingVertical: 7, paddingHorizontal: 12 }]}
                placeholder={user.userNip}
                placeholderTextColor={grey}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.h3}>Nama Lengkap</Text>

              <TextInput underlineColorAndroid="transparent"
                editable={detail ? true : false}
                onChangeText={setNama}
                value={nama}
                placeholder={user.userNama}
                style={[styles.input, { paddingVertical: 7, paddingHorizontal: 12 }]}
                placeholderTextColor={detail ? black : grey}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.h3}>Jabatan</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.input, { paddingVertical: 14, paddingHorizontal: 12 }]} disabled={detail ? false : true}>
                <Text style={detail ? { color: black } : { color: grey }}>{jabatan}</Text>
              </TouchableOpacity>
            </View>

            
            <View style={styles.inputContainer}>

              <TouchableOpacity style={[styles.submitBtn, detail ? { opacity: 1 } : { opacity: 0.5 }]} onPress={ubahAkun} disabled={detail ? false : true}>
                <Text style={styles.btnText}>Ubah</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.formContainer, { marginBottom: 40 }]}>
            {pwLoading && (
              <ActivityIndicator size="large" style={styles.activityIndicator} />
            )}
            <View style={styles.formHeading}>
              <Text style={styles.h2}>Kata Sandi</Text>
              <TouchableOpacity style={styles.sideBtn} onPress={() => {
                setPw(true);
              }}>
                <Image source={require('../assets/img/icon/edit-black.png')} />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.h3}>Kata Sandi Sebelumnya</Text>

              <TextInput underlineColorAndroid="transparent"
                editable={pw ? true : false}
                secureTextEntry={true}
                onChangeText={setPwLama}
                value={pwLama}
                style={[styles.input, { paddingVertical: 7, paddingHorizontal: 12 }]}
                placeholder="Masukkan kata sandi sebelumnya"
                placeholderTextColor={grey}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.h3}>Kata Sandi Baru</Text>

              <TextInput underlineColorAndroid="transparent"
                editable={pw ? true : false}
                onChangeText={setPwBaru}
                secureTextEntry={true}
                value={pwBaru}
                style={[styles.input, { paddingVertical: 7, paddingHorizontal: 12 }]}
                placeholder="Masukkan kata sandi baru"
                placeholderTextColor={grey}
              />
            </View>
            <View style={styles.inputContainer}>

              <TouchableOpacity onPress={ubahSandi} style={[styles.submitBtn, pw ? { opacity: 1 } : { opacity: 0.5 }]} disabled={pw ? false : true}>
                <Text style={styles.btnText}>Ubah</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

    </View>
  )
}

export default Profil

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  backBtn: {
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  h1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: blue,
    marginLeft: 20
  },
  h2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: black
  },
  h3: {
    fontSize: 14,
    color: black,
    marginTop: 10
  },
  photoContainer: {
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 100
  },
  editImgBtn: {
    position: 'absolute',
    right: 3,
    bottom: 3,
    borderRadius: 100,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 20,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
  },
  mapContainer: {
    height: 180,
    width: '100%',
    justifyContent: 'center'
  },

  mapHeadingContainer: {
    marginHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  sideBtn: {
    padding: 5
  },
  inputContainer: {
    marginVertical: 10
  },
  input: {
    borderColor: '#DBDBDB',
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 1,
    color: black
  },
  submitBtn: {
    backgroundColor: blue,
    padding: 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
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
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 30
  },
  formHeading: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },










  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    width: '90%',
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

})