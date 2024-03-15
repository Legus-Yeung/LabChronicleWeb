import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Image, ScrollView, KeyboardAvoidingView, Platform, Dimensions, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { firebase } from '../firebase/config.js';
import style from '../styles.js';

const auth = getAuth(firebase);

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const dimensions = Dimensions.get('window');
  const imageWidth = dimensions.width;
  //const imageHeight = dimensions.height;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      if (user) {
        navigation.navigate('Home');
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const onSignupPress = () => {
    navigation.navigate('Registration');
  };

  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user);

      await AsyncStorage.setItem('userEmail', email);
      navigation.navigate('Home', { userEmail: email });

    } catch (error) {
      setModalVisible(true);
      console.log('Error signing in:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={style.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView>
      <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={style.centeredView}>
            <View style={style.modalView}>
              <Text style={style.modalText}>Invalid email or password</Text>
              <Button
                title="Close"
                onPress={() => setModalVisible(!modalVisible)}
              />
            </View>
          </View>
        </Modal>
        <View style={[{paddingBottom: 5},{marginBottom: 5}]}>
          <Image
            style={{ width: '100%' }}
            resizeMode='contain'
            source={require('../../assets/ufvlogo.png')}
          />
        </View>
        <TextInput
          style={style.input}
          placeholder='Email'
          value={email}
          keyboardType='email-address'
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={style.input}
          placeholder='Password'
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <TouchableOpacity style={style.loginButton} onPress={handleEmailLogin}>
          <Text style={style.loginText}>Login</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ paddingTop: 20, fontSize: 16 }}>
            Don't have an account?
            <Text style={{ color: 'rgb(0,187,211)' }} onPress={onSignupPress}> Sign up!</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
