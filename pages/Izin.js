import { StyleSheet, Modal, ActivityIndicator, Alert, Dimensions, FlatList, TextInput, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-modern-datepicker';
import moment from 'moment'
import 'moment/locale/id';
import ImagePicker, { showImagePicker, launchCamera, launchImageLibrary } from 'react-native-image-picker';
const options = {
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const blue = '#0D4AA7';
const black = '#3d3d3d';
const red = '#C74B4C';
const grey = '#DBDBDB';


const Izin = () => {
    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState('');
    const [tglCuti, setTglCuti] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [izinModal, setIzinModal] = useState(false);
    const [izin, setJenisIzin] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [izinText, setIzinText] = useState('');

    const [fotouri, setUri] = useState();
    const [fototype, setType] = useState();
    const [fotoname, setName] = useState();
    const [loading, setLoading] = useState();

    const [dataIzin, setDataIzin] = useState(
        [
            { id: 1, name: "Sakit" },
            { id: 2, name: "Kegiatan" },
            { id: 3, name: "Lain-lain" },
        ]
    );


    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => {
            setJenisIzin(item.id);
            setIzinText(item.name);
            setIzinModal(!izinModal);
        }}
            style={styles.izinOption}
        >
            <Text style={{ color: black, textAlign: 'center' }}>{item.name}</Text>
        </TouchableOpacity>
    );

    const handleLaunchCamera = async () => {
        const result = await launchImageLibrary(options);

        if (result.didCancel) {
            console.log('Cancel');
        } else if (result.error) {
            console.log('ImagePicker Error: ', result.error);
        } else {
            setUri(result.assets[0].uri);
            setName(result.assets[0].fileName);
            setType(result.assets[0].type);
        }
    };

    const submit = async () => {
        const userId = await AsyncStorage.getItem('userId');

        const tgl = moment(tglCuti).format('YYYY-MM-DD');

        const formData = new FormData();
        formData.append('id', userId);
        formData.append('tgl', tgl);
        formData.append('keterangan', keterangan);
        formData.append('izin', izin);
        formData.append('file', {
            uri: fotouri,
            type: fototype,
            name: fotoname
        });

        let res = await fetch('https://afanalfiandi.com/attendly/api/api.php?op=addizin', {
            method: 'post',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data; ',
            },
        }).then((response) => response.json())
            .then((json) => {
                setLoading(true);
                setTimeout(() => {
                    if (json == "1") {
                        Alert.alert('', 'File Sudah Ada!');
                    } else if (json == "2") {
                        Alert.alert('', 'Ukuran File Terlalu Besar!');
                    } else if (json == "3") {
                        setJenisIzin('');
                        setTglCuti('');
                        setKeterangan('');
                        setName(null);
                        Alert.alert('', 'Berhasil!', [
                            {
                                text: 'OK',
                                onPress: () => navigation.navigate('Home')
                            }
                        ]);
                    } else {
                        Alert.alert('', 'Gagal!');
                    }

                    setLoading(false);
                }, 3500);
            })
    }
    return (
        <View style={[styles.container, modalVisible ? { opacity: 0.2 } : { opacity: 1 }]}>
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
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Home');
                }}>
                    <Image source={require('../assets/img/icon/back-blue.png')} />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.h1}>Pengajuan Cuti</Text>
                </View>
            </View>
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.h2}>
                        Tanggal Cuti
                    </Text>

                    <TouchableOpacity style={[styles.input, { padding: 12 }]} onPress={() => {
                        setModalVisible(!modalVisible)
                    }}>
                        {tglCuti == '' && (
                            <Text style={{ color: black }}>Pilih Tanggal</Text>
                        )}
                        {tglCuti != '' && (
                            <Text style={{ color: black }}>{moment(tglCuti).format('dddd, DD MMMM YYYY')}</Text>
                        )}

                    </TouchableOpacity>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalView}>
                                <DatePicker
                                    onSelectedChange={date => setSelectedDate(date)}
                                    mode="calendar"
                                />
                                <View style={styles.dateBtnContainer}>
                                    <TouchableOpacity style={[styles.dateBtn, { backgroundColor: red }]} onPress={() => {
                                        setModalVisible(!modalVisible);
                                    }}>
                                        <Text style={styles.btnText}>Batal</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.dateBtn} onPress={() => {
                                        const tgl = selectedDate;
                                        const tanggal = new Date(tgl);
                                        setTglCuti(moment(tanggal.toISOString()));
                                        setModalVisible(!modalVisible);
                                    }}>
                                        <Text style={styles.btnText}>Pilih Tanggal</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>


                <View style={styles.inputContainer}>
                    <Text style={styles.h2}>
                        Izin
                    </Text>

                    <TouchableOpacity style={[styles.input, { padding: 12 }]} onPress={() => {
                        setIzinModal(!izinModal)
                    }}>
                        {izin == '' && (
                            <Text style={{ color: black }}>Pilih Izin</Text>
                        )}
                        {izin != '' && (
                            <Text style={{ color: black }}>{izinText}</Text>
                        )}

                    </TouchableOpacity>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={izinModal}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            setIzinModal(!izinModal);
                        }}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalView}>
                                <FlatList
                                    data={dataIzin}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.id}
                                />
                            </View>
                        </View>
                    </Modal>
                </View>


                <View style={styles.inputContainer}>
                    <Text style={styles.h2}>
                        Keterangan
                    </Text>

                    <TextInput underlineColorAndroid="transparent"
                        numberOfLines={10}
                        multiline={true}
                        style={[styles.input, { paddingVertical: 7, paddingHorizontal: 12 }]}
                        placeholder="Keterangan"
                        placeholderTextColor={grey}
                        onChangeText={setKeterangan}
                        value={keterangan}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.h2}>
                        Foto Kelengkapan
                    </Text>

                    <TouchableOpacity style={[styles.input, { padding: 12 }]} onPress={() => {
                        handleLaunchCamera();
                    }}>
                        <Text style={{color: black}}>Ambil Foto</Text>
                    </TouchableOpacity>
                    <Text style={styles.h3}>
                        Sertakan foto kelengkapan Anda jika ada.
                    </Text>
                    {fotoname != null && (
                        <View style={styles.photoContainer}>
                            <Image style={styles.photo} source={{ uri: fotouri }} />
                            <TouchableOpacity style={styles.closeBtn} onPress={() => {
                                setName(null);
                                setType(null);
                                setUri(null);
                            }} >
                                <Image style={styles.closeImg} source={require('../assets/img/icon/close-black.png')} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={[styles.inputContainer, { position: 'absolute', bottom: 0, right: 0, left: 0 }]}>
                    <TouchableOpacity style={styles.submitBtn} onPress={submit}>
                        <Text style={styles.btnText}>Kirim</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Izin

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    h1: {
        fontSize: 18,
        fontWeight: 'bold',
        color: blue
    },
    h2: {
        fontSize: 16,
        fontWeight: 'bold',
        color: black
    },
    h3: {
        fontSize: 14,
        color: black,
        marginTop: 10
    },
    formContainer: {
        flex: 1
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
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    modalView: {
        width: width - 41,
        backgroundColor: "white",
        paddingVertical: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 3
    },
    dateBtn: {
        backgroundColor: blue,
        width: '40%',
        margin: 15,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 10
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold'
    },
    dateBtnContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    photoContainer: {
        marginTop: 15,
        width: 120
    },
    photo: {
        width: 120,
        height: 120,
    },
    closeBtn: {
        position: 'absolute',
        right: 8,
        top: 8,
    },
    closeImg: {
        width: 15,
        height: 15,
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 10
    },
    izinOption: {
        padding: 8
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
})