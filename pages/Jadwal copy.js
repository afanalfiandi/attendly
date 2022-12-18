import { StyleSheet, FlatList, Text, TouchableOpacity, Image, View } from 'react-native'
import React, { useState } from 'react'
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

  const [data, setData] = useState();
  const getData = async (day) => {
    const tgl = day.dateString;
    const userId = await AsyncStorage.getItem('userId');
    fetch('https://afanalfiandi.com/attendly/api/api.php?op=getJadwal', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userId,
        tgl: tgl
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson != null) {
          setData(responseJson);
        } else {
          setData(null);
        }
      })
      .catch((e) => {
        console.log(e);
      })
  }
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/img/icon/back-blue.png')} />
        </TouchableOpacity> */}
        <Text style={styles.headerText}>Jadwal</Text>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={day => {
            getData(day)
          }}
          firstDay={1}
          onPressArrowLeft={subtractMonth => subtractMonth()}
          onPressArrowRight={addMonth => addMonth()}
          disableAllTouchEventsForDisabledDays={true}
          renderHeader={(month) => {
            const date = month.toISOString();
            return (
              <Text style={{ fontWeight: 'bold', color: blue, fontSize: responsiveFontSize(2.2) }}>{moment(date).format('MMMM')}</Text>
            )
          }}
          enableSwipeMonths={true}
          onMonthChange={() =>
            setData(null)
          }
        />
      </View>
      <View style={styles.dataContainer}>
        {data != null && (
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <View style={styles.listContainer}>
                <View style={styles.date}>
                  <Text style={styles.dateText}>{item.tgl}</Text>
                  <Text style={styles.dayText}>{moment(item.date).format('ddd')}</Text>
                </View>
                <View style={styles.jenisContainer}>
                  <Text style={styles.jenisText}>{item.kegiatan}</Text>
                  <Text style={styles.jamText}>{item.jam}</Text>
                </View>
              </View>
            )}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={true}
          ></FlatList>
        )}
        {data == null && (
          <View style={{ width: '100%', height: '40%', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: blue }}>Jadwal kosong . . .</Text>
          </View>
        )}
      </View>
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
    flex: 1
  },
  listContainer: {
    width: '100%',
    height: responsiveHeight(13),
    backgroundColor: '#E5E8EC',
    marginBottom: 20,
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  date: {
    width: '22%',
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  jenisContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  jamText: {
    color: blue,
    fontSize: responsiveFontSize(2)
  },
  jenisText: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.3),
    color: blue,
    marginBottom: 10
  },
  dateText: {
    fontSize: responsiveFontSize(4),
    color: blue
  },
  dayText: {
    color: blue,
    fontWeight: 'bold'
  }
})