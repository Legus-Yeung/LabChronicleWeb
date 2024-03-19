import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Modal, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { firebase } from '../firebase/config.js';
import style from '../styles.js';

const auth = getAuth(firebase);
const emailExistError = 'FirebaseError: Firebase: The email address is already in use by another account. (auth/email-already-in-use).';

export default function RegistrationScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [name, setUserName] = useState('');
  const [errorText, setErrorText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  //this should probably send to a new screen
  const handleEmailSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.toLowerCase(), password);
      const uid = userCredential.user.uid;

      const db = getFirestore(firebase);
      const usersCollection = collection(db, 'users');
      const userRef = doc(usersCollection, uid);

      const emailQuery = query(usersCollection, where('email', '==', email));
      const emailSnapshot = await getDocs(emailQuery);

      if (emailSnapshot.empty) {
        await setDoc(userRef, { email: email.toLowerCase(), name: name, role: 'student' });
        await updateProfile(auth.currentUser, { displayName: name });
        console.log('User signed up:', userCredential.user);

        await AsyncStorage.setItem('userEmail', email);
        navigation.navigate('Home', { userEmail: email });

      } 
      //I hate this block
    } catch (error) {
      if(error == emailExistError){
        setModalVisible(true);
        console.log('Error: User with the email already exists.');
        setErrorText('Error: User with the email already exists.');
      } else {
        setModalVisible(true);
        console.log('Error signing up:', error);
        setErrorText('Invalid email or password.');
      }
    }
  };

  if (user) {
    navigation.navigate('Home', { userEmail: email });
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={style.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView>
        <View style={[{paddingBottom: 5},{marginBottom: 5}]}>
          <Image
            style={{ width: '100%' }}
            resizeMode='contain'
            source={require('../../assets/ufvlogo.png')}
          />
        </View>
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
              <Text style={style.modalText}>{errorText}</Text>
              <Button
                title="Close"
                onPress={() => setModalVisible(!modalVisible)}
              />
            </View>
          </View>
        </Modal>
        <TextInput
          style={style.input}
          placeholder='Name'
          value={name}
          onChangeText={(text) => setUserName(text)}
        />
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
        <Text style={[{color: 'black'}, {marginHorizontal: 12}, {paddingBottom: 10}]}>
          Password must be at least 6 characters long.
        </Text>
        <TouchableOpacity style={style.signupButton} onPress={handleEmailSignup}>
          <Text style={style.signupText}>Signup</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

