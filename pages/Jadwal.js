import { StyleSheet, FlatList, ActivityIndicator, Dimensions, Text, TouchableOpacity, Image, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions'
import { useNavigation } from '@react-navigation/native'
import { Calendar, CalendarList } from 'react-native-calendars';
import moment from 'moment';
import 'moment/locale/id';
import { LocaleConfig } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const blue = '#0D4AA7';
const black = '#616161';
const red = '#C74B4C';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const Jadwal = () => {

  LocaleConfig.locales['id'] = {
    monthNames: [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
    ],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agust', 'Sept', 'Okt', 'Nov', 'Des'],
    dayNames: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    dayNamesShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
    today: "Hari ini"
  };
  LocaleConfig.defaultLocale = 'id';

  const [data, setData] = useState(null);
  const [dataHari, setDataHari] = useState({
    id: '',
    hari: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      getHari();
      getDefaultJadwal();
    }, 3000);
  }, []);

  const getHari = () => {
    fetch('https://afanalfiandi.com/attendly/api/api.php?op=getHari', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((response) => response.json())
      .then((responseJson) => {
        setDataHari(responseJson);
      })
      .catch((e) => {
        console.log(e);
      })
  }

  const getData = async (day) => {
    const userId = await AsyncStorage.getItem('userId');


    fetch('https://afanalfiandi.com/attendly/api/api.php?op=getJadwal', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userId,
        hari: day
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        setLoading(true);
        setTimeout(() => {
          setData(responseJson);
          setLoading(false);
        }, 3000);
      })
      .catch((e) => {
        console.log(e);
      })
  }

  const getDefaultJadwal = async () => {
    const userId = await AsyncStorage.getItem('userId');
    fetch('https://afanalfiandi.com/attendly/api/api.php?op=getJadwal', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userId,
        hari: 1
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        setData(responseJson);
      })
      .catch((e) => {
        console.log(e);
      })
  }
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Jadwal</Text>
      </View>
      <View style={styles.calendarContainer}>
        <FlatList
          data={dataHari}
          horizontal={true}
          renderItem={({ item }) => (
            <View style={styles.monthSlide}>
              <TouchableOpacity onPress={() => {
                getData(item.id);
              }}>
                <Text style={styles.monthText}>{item.hari}</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.bulanSlider}
        ></FlatList>
      </View>
      {loading && (
        <ActivityIndicator size="large" style={styles.activityIndicator} />
      )}
      {!loading && (
        <View style={{ flex: 1 }}>

          <View style={styles.dataContainer}>
            {data != null && (
              <FlatList
                data={data}
                renderItem={({ item }) => (
                  <View style={styles.cardContainer}>
                    <View style={styles.card}>
                      <View style={[styles.col, styles.col1]}>
                        <Text style={[styles.h1, { color: blue }]}>{item.hari}</Text>
                      </View>
                      <View style={[styles.col, { width: '73%', marginLeft: '2%', justifyContent: 'center' }]}>
                        <Text style={[styles.h2, { color: 'white' }]}>Kode Mapel : {item.kode}</Text>
                        <Text style={[styles.h3, { color: 'white', fontWeight: 'bold' }]}>{item.mapel}</Text>
                        <Text style={[styles.h2, { color: 'white' }]}>{item.jam}</Text>
                        <Text style={[styles.h2, { color: 'white' }]}>{item.ruang}</Text>
                      </View>
                    </View>
                  </View>
                )}
                keyExtractor={item => item.id}
              ></FlatList>
            )}

            {data == null && !loading &&(
              <View style={styles.emptyContainer}>
                <Text style={styles.h2}>Jadwal kosong</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  )
}

export default Jadwal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.3),
    color: blue
  },
  dataContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10
  },


  monthText: {
    marginHorizontal: 20,
    fontSize: responsiveFontSize(2),
    color: blue,
    fontWeight: '600',
    marginVertical: 10
  },
  cardContainer: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: 10
  },
  card: {
    backgroundColor: blue,
    borderRadius: 20,
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 105,
    shadowColor: blue,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 2,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  h1: {
    fontSize: width * 0.05,
    color: black,
    fontWeight: 'bold'
  },
  h2: {
    color: black,
    fontSize: width * 0.04,
  },
  h3: {
    color: black,
    fontSize: 18
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  col: {
    marginHorizontal: 3
  },
  col1: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30
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