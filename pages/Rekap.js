import { StyleSheet, ActivityIndicator, FlatList, Text, Image, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const bulan = [
  {
    number: 1,
    nama: 'Januari'
  },
  {
    number: 2,
    nama: 'Februari'
  },
  {
    number: 3,
    nama: 'Maret'
  },
  {
    number: 4,
    nama: 'April'
  },
  {
    number: 5,
    nama: 'Mei'
  },
  {
    number: 6,
    nama: 'Juni'
  },
  {
    number: 7,
    nama: 'Juli'
  },
  {
    number: 8,
    nama: 'Agustus'
  },
  {
    number: 9,
    nama: 'September'
  },
  {
    number: 10,
    nama: 'Oktober'
  },
  {
    number: 11,
    nama: 'November'
  },
  {
    number: 12,
    nama: 'Desember'
  },
];

const blue = '#0D4AA7';
const black = '#616161';
const red = '#C74B4C';

const Rekap = () => {
  const [hadir, setHadir] = useState();
  const [izin, setIzin] = useState();
  const [monthHadir, setMonthHadir] = useState(null);
  const [monthIzin, setMonthIzin] = useState(null);
  const Tab = createMaterialTopTabNavigator();
  const [loading, setLoading] = useState(false);

  function Kehadiran() {
    return (
      <View style={styles.content}>
        <View style={styles.slideContainer}>
          <FlatList
            data={bulan}
            horizontal={true}
            renderItem={({ item }) => (
              <View style={styles.monthSlide}>
                <TouchableOpacity onPress={() => {
                  getHadir(item.number);
                }}>
                  <Text style={styles.monthText}>{item.nama}</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => item.number}
            showsVerticalScrollIndicator={false}
            style={styles.bulanSlider}
          ></FlatList>
        </View>
        <View style={styles.content}>
          {loading && (
            <ActivityIndicator size="large" style={styles.activityIndicator} />
          )}
          {monthHadir == null && (
            <Text style={styles.monthName}>Bulan : (pilih bulan)</Text>
          )}
          {monthHadir != null && (
            <Text style={styles.monthName}>Bulan : {moment().month(monthHadir - 1).format('MMMM')}</Text>
          )}
          {hadir != null && !loading && (
            <FlatList
              data={hadir}
              renderItem={({ item }) => (
                <View style={styles.dataContainer}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>{item.tgl}</Text>
                    <Text style={styles.dayText}>{moment(item.date).format('ddd')}</Text>
                  </View>
                  <View style={styles.presensiContainer}>
                    <Text style={styles.presensiTitle}>Masuk</Text>
                    <Text style={styles.clockText}>{item.masuk}</Text>
                  </View>
                  <View style={styles.divider}>
                  </View>
                  <View style={styles.presensiContainer}>
                    <Text style={styles.presensiTitle}>Pulang</Text>
                    <Text style={styles.clockText}>{item.pulang}</Text>
                  </View>
                </View>
              )}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={true}
              style={styles.bulanSlider}
            ></FlatList>
          )}

          {hadir == null && !loading && (
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: blue }}>Rekap kosong . . .</Text>
            </View>
          )}
        </View>
      </View>
    );
  }


  function Izin() {
    return (
      <View style={styles.content}>
        <View style={styles.slideContainer}>
          <FlatList
            data={bulan}
            horizontal={true}
            renderItem={({ item }) => (
              <View style={styles.monthSlide}>
                <TouchableOpacity onPress={() => {
                  getIzin(item.number);
                }}>
                  <Text style={styles.monthText}>{item.nama}</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => item.number}
            showsVerticalScrollIndicator={false}
            style={styles.bulanSlider}
          ></FlatList>
        </View>
        <View style={styles.content}>
          {loading && (
            <ActivityIndicator size="large" style={styles.activityIndicator} />
          )}
          {monthIzin == null && (
            <Text style={styles.monthName}>Bulan : (pilih bulan)</Text>
          )}
          {monthIzin != null && (
            <Text style={styles.monthName}>Bulan : {moment().month(monthIzin - 1).format('MMMM')}</Text>
          )}
          {izin != null && !loading && (
            <FlatList
              data={izin}
              renderItem={({ item }) => (
                <View style={styles.dataIzinContainer}>
                  <View style={styles.dateIzinContainer}>
                    <Text style={styles.dateText}>{item.tgl}</Text>
                    <Text style={styles.dayText}>{moment(item.date).format('ddd')}</Text>
                  </View>
                  <View style={styles.izinContainer}>
                    <Text style={styles.presensiTitle}>Jenis Izin</Text>
                    <Text style={styles.clockText}>{item.izin}</Text>
                    <Text style={styles.presensiTitle}>Keterangan</Text>
                    <Text style={styles.clockText}>{item.keterangan}</Text>
                  </View>
                </View>
              )}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={true}
              style={styles.bulanSlider}
            ></FlatList>

          )}

          {izin == null && !loading && (
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: blue }}>Rekap kosong . . .</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  const getHadir = async (number) => {
    const userId = await AsyncStorage.getItem('userId');
    setMonthHadir(number);
    fetch('https://afanalfiandi.com/attendly/api/api.php?op=getRekap', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userId,
        bulan: number
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson != null) {
          setLoading(true);

          setTimeout(() => {
            setLoading(false);
            setHadir(responseJson);
          }, 3000);
        } else {
          setLoading(true);

          setTimeout(() => {
            setLoading(false);
            setHadir(null);
          }, 3000);
        }
      }).catch((e) => {
        console.log(e);
      })
  }

  const getIzin = async (number) => {
    const userId = await AsyncStorage.getItem('userId');
    setMonthIzin(number);
    fetch('https://afanalfiandi.com/attendly/api/api.php?op=getRekapIzin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userId,
        bulan: number
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson != null) {
          setLoading(true);

          setTimeout(() => {
            setIzin(responseJson);
            setLoading(false);
          }, 3000);
        } else {
          setLoading(true);

          setTimeout(() => {
            setIzin(null);
            setLoading(false);
          }, 3000);
        }
      }).catch((e) => {
        console.log(e);
      })
  }
  return (
    <View style={styles.container}>
      <Tab.Navigator screenOptions={{ swipeEnabled: false }}>
        <Tab.Screen name='Kehadiran' component={Kehadiran} />
        <Tab.Screen name='Izin' component={Izin} />
      </Tab.Navigator>
    </View >
  )
}

export default Rekap

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    fontSize: responsiveFontSize(2.3),
    fontWeight: 'bold',
    color: blue,
  },

  monthText: {
    marginHorizontal: 20,
    fontSize: responsiveFontSize(2),
    color: blue,
    fontWeight: '600',
    marginVertical: 10
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10
  },
  dataContainer: {
    height: 102,
    width: '100%',
    backgroundColor: '#E5E8EC',
    borderRadius: 28,
    alignItems: 'center',
    paddingHorizontal: 21,
    flexDirection: 'row',
    marginBottom: 25
  },
  dateContainer: {
    width: '26%',
    height: 88,
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dateText: {
    fontSize: responsiveFontSize(4),
    color: blue,
    fontWeight: 'bold'
  },
  dayText: {
    fontSize: responsiveFontSize(2),
    color: blue,
  },
  presensiContainer: {
    width: '36%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  divider: {
    width: '0.8%',
    height: '50%',
    backgroundColor: 'white',
  },
  presensiTitle: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
    color: blue,
    paddingVertical: 6
  },
  clockText: {
    color: '#8AABDC'
  },
  monthName: {
    color: blue,
    fontWeight: 'bold',
    marginBottom: 15,
    fontSize: responsiveFontSize(2)
  },














  izinContainer: {
    marginLeft: 20,
    height: '100%',
    justifyContent: 'center',
  },
  dataIzinContainer: {
    height: 130,
    width: '100%',
    backgroundColor: '#E5E8EC',
    borderRadius: 28,
    alignItems: 'center',
    paddingRight: 35,
    paddingLeft: 15,
    flexDirection: 'row',
    marginBottom: 25,
  },
  dateIzinContainer: {
    width: '26%',
    height: 100,
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dateText: {
    fontSize: responsiveFontSize(4),
    color: blue,
    fontWeight: 'bold'
  },
  dayText: {
    fontSize: responsiveFontSize(2),
    color: blue,
  },

  divider: {
    width: '0.8%',
    height: '50%',
    backgroundColor: 'white',
  },
  presensiTitle: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
    color: blue,
    paddingVertical: 6
  },
  clockText: {
    color: '#8AABDC',
    textAlign: 'justify'
  },
  monthName: {
    color: blue,
    fontWeight: 'bold',
    marginBottom: 15,
    fontSize: responsiveFontSize(2)
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