import { StyleSheet, FlatList, Text, Image, View, TouchableOpacity } from 'react-native'
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
    nama: 'Desember '
  },
];

const blue = '#0D4AA7';
const black = '#616161';
const red = '#C74B4C';

const Rekap = () => {
  const [data, setData] = useState();
  const [month, setMonth] = useState(null);
  const Tab = createMaterialTopTabNavigator();

  function Kehadiran() {
    return (
      <View>
        <Text>Kehadiran</Text>
      </View>
    );
  }
  function Izin() {
    return (
      <View>
        <Text>Izin</Text>
      </View>
    );
  }

  const selectMonth = async (number) => {
    const userId = await AsyncStorage.getItem('userId');
    setMonth(number);
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
          setData(responseJson);
        } else {
          setData(null);
        }
      }).catch((e) => {
        console.log(e);
      })
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Rekap Kehadiran</Text>
      </View>
      <View style={styles.slideContainer}>
        <FlatList
          data={bulan}
          horizontal={true}
          renderItem={({ item }) => (
            <View style={styles.monthSlide}>
              <TouchableOpacity onPress={() => {
                selectMonth(item.number);
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
        {month == null && (
          <Text style={styles.monthName}>Bulan : (pilih bulan)</Text>
        )}
        {month != null && (
          <Text style={styles.monthName}>Bulan : {moment().month(month - 1).format('MMMM')}</Text>
        )}
        {data != null && (
          <FlatList
            data={data}
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

        {data == null && (
          <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: blue }}>Rekap kosong . . .</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default Rekap

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 25,
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
  slideContainer: {
    paddingVertical: 15
  },
  monthText: {
    marginHorizontal: 20,
    fontSize: responsiveFontSize(2),
    color: blue,
    fontWeight: '600',
    marginVertical: 10
  },
  content: {
    flex: 1
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
  }
})  