import { Image, PermissionsAndroid, Dimensions, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const blue = '#0D4AA7';
const black = '#3d3d3d';
const red = '#C74B4C';

const GrantLocation = () => {
    const navigation = useNavigation();

    const getPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Aktifkan Izin Lokasi",
                    message:
                        "Untuk menggunakan aplikasi, beri izin lokasi",
                    buttonNeutral: "Tanya Nanti",
                    buttonNegative: "Batal",
                    buttonPositive: "Izinkan"
                }
            );
            RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                interval: 10000,
                fastInterval: 5000,
            })
                .then((data) => {
                    AsyncStorage.setItem('grantLocation', '1');
                    navigation.navigate('SignIn');
                })
                .catch((err) => {
                    console.log(err);
                })

        } catch (err) {
            console.log(err);
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.imgContainer}>
                <Image style={styles.img} source={require('../assets/img/grant-bg.png')} />
            </View>
            <View style={styles.content}>
                <Text style={styles.headerText}>Ijinkan Lokasi Anda</Text>
                <Text style={styles.contentText}>Anda perlu memberikan Attend.ly akses lokasi agar dapat melakukan presensi kehadiran.</Text>

                <TouchableOpacity onPress={getPermission} style={styles.button}>
                    <Text style={styles.btnText}>Ijinkan Lokasi</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default GrantLocation

const styles = StyleSheet.create({
    container: {
        height: height,
        width: width,
        backgroundColor: 'white'
    },
    imgContainer: {
        height: '65%',
        width: '100%'
    },
    img: {
        height: '100%'
    },
    content: {
        paddingHorizontal: '5.5%',
        paddingVertical: '7%',
        height: '25%',
        alignItems: 'center'
    },
    headerText: {
        fontSize: width * 0.05,
        color: blue,
        fontWeight: 'bold'
    },
    contentText: {
        color: blue,
        marginTop: 10,
        fontSize: width * 0.035,
        textAlign: 'center'
    },
    button: {
        backgroundColor: blue,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        padding: width * 0.025,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    btnText: {
        color: 'white',
        fontSize: width * 0.035,
        fontWeight: 'bold'
    }
})