import { StyleSheet, Dimensions, ActivityIndicator, Image, Text, View, TextInput, TouchableOpacity, Alert, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const blue = '#0D4AA7';
const black = '#3d3d3d';
const red = '#C74B4C';
const grey = '#DBDBDB';
const SignIn = () => {

  const [idUser, setId] = useState();
  const [nip, setNip] = useState();
  const [password, setPassword] = useState();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);


  const submit = async () => {
    fetch('https://afanalfiandi.com/attendly/api/api.php?op=login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nip: nip,
        password: password
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          if (responseJson == 'Failed') {
            Alert.alert('', 'NIP atau Password salah!');
          } else {
            const id = responseJson.id;
            AsyncStorage.setItem('userId', id);
            navigation.navigate('Home');
          }
        }, 2500);

      })
      .catch((e) => {
        console.log(e);
      })
  }

  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image source={require('../assets/img/login-img.png')} />
      </View>
      {loading && (
        <ActivityIndicator size="large" style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          color: blue
        }} />
      )}
      <View style={styles.formContainer}>

        <Text style={styles.h1}>
          Masuk untuk melanjutkan
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.h2}>
            NIP
          </Text>

          <TextInput onChangeText={setNip} value={nip} style={styles.input} placeholderTextColor={grey} placeholder="Masukkan NIP Anda"></TextInput>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.h2}>
            Password
          </Text>

          <TextInput onChangeText={setPassword} value={password} style={styles.input} secureTextEntry={true} placeholderTextColor={grey} placeholder="Masukkan Password Anda"></TextInput>
        </View>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={submit} style={styles.submitBtn}>
            <Text style={styles.btnText}>Masuk</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.inputContainer}>
          <Text style={styles.copyText}>Lupa Kata Sandi?</Text>
          <Text style={styles.ownerText}>Hubungi Admin</Text>
        </View> */}


      </View>
    </View>
  )
}

export default SignIn

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
  },
  formContainer: {
    paddingHorizontal: width * 0.055,
    paddingVertical: 10
  },
  inputContainer: {
    marginVertical: 15
  },
  h1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: black
  },
  h2: {
    fontSize: 16,
    fontWeight: 'bold',
    color: blue
  },
  input: {
    borderWidth: 1,
    borderColor: '#DBDBDB',
    paddingVertical: width * 0.013,
    paddingHorizontal: width * 0.03,
    borderRadius: 5,
    marginTop: 10,
    color: black
  },
  submitBtn: {
    backgroundColor: blue,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: 'white'
  },
  copyText: {
    fontWeight: 'bold',
    color: '#B5B5B5'
  },
  ownerText: {
    color: '#F7B44C',
    fontWeight: 'bold'
  }

})