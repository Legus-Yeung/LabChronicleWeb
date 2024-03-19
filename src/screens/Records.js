import React, { useState, useEffect } from 'react';
import { Pressable, Modal, Text, View, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { MultiSelectComponent, DropdownComponent, ModalHeader } from '../components/index.js';
import { cropItems, observationItems, pestItems, counts, diseaseItems, arthropodItems, healthItems } from '../fieldDefinitions';
import { Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/compat';
import * as Location from 'expo-location';
import style from '../styles.js';

export default function Records({ route, navigation }) {
  const { recordId } = route.params || {};

  const [crop, setCrop] = useState('');
  const [observations, setObservations] = useState([]);
  const [pests, setPests] = useState([]);
  const [spiderMitesCount, setSpiderMitesCount] = useState('');
  const [aphidsCount, setAphidsCount] = useState('');
  const [thripsCount, setThripsCount] = useState('');
  const [caterpillarsCount, setCaterpillarsCount] = useState('');
  const [diseases, setDiseases] = useState([]);
  const [arthropodBeneficials, setArthropodBeneficials] = useState([]);
  const [healthObservation, setHealthObservation] = useState('');
  const [location, setLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inPerimeter, setInPerimeter] = useState('');
  const [originallyInPerimeter, setOriginallyInPerimeter] = useState('');

  useEffect(() => {
    if (recordId) {
      fetchExistingRecord(recordId);
    }

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      let tempLocation = await Location.getCurrentPositionAsync({});
      if (tempLocation !== null) {
        setCurrentLocation({
          ...tempLocation,
          timestamp: new Date(tempLocation.timestamp),
        });
        console.log(tempLocation);
        perimeterCheck(tempLocation);
      }
    })();
  }, [recordId]);

  const handleCloseClass = () => {
    navigation.navigate('Dashboard');
  }

  const fetchExistingRecord = async (id) => {
    try {
      const recordRef = firebase.firestore().collection('records').doc(id);
      const doc = await recordRef.get();

      if (doc.exists) {
        const recordData = doc.data();
        // Set state with existing record details for editing
        setCrop(recordData.crop);
        setObservations(recordData.observations);
        setPests(recordData.pests);
        setSpiderMitesCount(recordData.spiderMitesCount);
        setAphidsCount(recordData.aphidsCount);
        setThripsCount(recordData.thripsCount);
        setCaterpillarsCount(recordData.caterpillarsCount);
        setDiseases(recordData.diseases);
        setArthropodBeneficials(recordData.arthropodBeneficials);
        setHealthObservation(recordData.healthObservation);
        setLocation(recordData.location);
        setNotes(recordData.notes);
        setOriginallyInPerimeter(recordData.originallyInPerimeter);
      } else {
        console.log('Record not found');
      }
    } catch (error) {
      console.error('Error fetching existing record:', error);
    }
  };

  const saveRecord = async () => {
    setIsLoading(true);

    if (!crop) {
      Alert.alert('Error', 'Crop field is required');
      setIsLoading(false);
      return;
    }

    const record = {
      crop,
      observations,
      pests,
      spiderMitesCount,
      aphidsCount,
      thripsCount,
      caterpillarsCount,
      diseases,
      arthropodBeneficials,
      healthObservation,
      uid: firebase.auth().currentUser.uid,
      lastLocation: currentLocation,
      location: location || currentLocation,
      originallyInPerimeter: originallyInPerimeter || inPerimeter, // if false, big bad
      inPerimeter: inPerimeter, // if false, medium bad
      notes,
    };

    if (recordId) {
      // If in edit mode, update the existing record
      await firebase.firestore().collection('records').doc(recordId).update(record);
    } else {
      // If in create mode, add a new record
      console.log('Saving Record');
      await firebase.firestore().collection('records').add(record);
    }

    // Finally, reset loading state
    setIsLoading(false);
    navigation.navigate('Home');
  };

  const perimeterCheck = async (tempLocation) => {
    // Replace with the two opposite corners of the location they'll be taking data
    const point1 = { latitude: 49.09911154470586, longitude: -121.97391434480325 };
    const point2 = { latitude: 49.09846159305772, longitude: -121.97082707752811 };

    if (
      tempLocation.coords.latitude >= Math.min(point1.latitude, point2.latitude) &&
      tempLocation.coords.latitude <= Math.max(point1.latitude, point2.latitude) &&
      tempLocation.coords.longitude >= Math.min(point1.longitude, point2.longitude) &&
      tempLocation.coords.longitude <= Math.max(point1.longitude, point2.longitude)
    ) {
      setInPerimeter('y');
      console.log('Current location is within the perimeter');
    }
    else {
      console.log('Current location is not within the perimeter');
    }
  };

  return (
    <Modal>
      <View style={{ position: 'absolute', top: 17, left: 10, zIndex: 10 }}>
        <TouchableOpacity onPress={() => handleCloseClass()}>
          <Ionicons name="arrow-back" size={23} color="white" />
        </TouchableOpacity>
      </View>
      <ModalHeader title="Add Record" />
      <KeyboardAvoidingView
        style={[style.createContainer, { flex: 1 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <ScrollView>
      <View style={{ marginBottom: 20 }}>
        <ScrollView>
          <View style={{ paddingTop: 8 }}>
            <DropdownComponent
              label='Crop'
              data={cropItems}
              onValueChange={setCrop}
              initialValue={crop}
            />
          </View>
          <MultiSelectComponent
            placeholder='What observations did you make?'
            data={observationItems}
            onSelectionChange={setObservations}
            initialSelected={observations}
          />

          {observations.includes('pests') && (
            <MultiSelectComponent
              placeholder='Select pests'
              data={pestItems}
              onSelectionChange={setPests}
              initialSelected={pests}
            />
          )}

          {pests.includes('spiderMites') && (
            <DropdownComponent
              label='Number of spider mites'
              data={counts}
              onValueChange={setSpiderMitesCount}
              initialValue={spiderMitesCount}
            />
          )}

          {pests.includes('aphids') && (
            <DropdownComponent
              label='Number of aphids'
              data={counts}
              onValueChange={setAphidsCount}
              initialValue={aphidsCount}
            />
          )}

          {pests === 'thrips' && (
            <DropdownComponent
              label='Number of thrips'
              data={counts}
              onValueChange={setThripsCount}
              initialValue={thripsCount}
            />
          )}

          {pests === 'caterpillars' && (
            <DropdownComponent
              label='Number of caterpillars'
              data={counts}
              onValueChange={setCaterpillarsCount}
              initialValue={caterpillarsCount}
            />
          )}

          {observations.includes('diseases') && (
            <MultiSelectComponent
              placeholder='Select diseases'
              data={diseaseItems}
              onSelectionChange={setDiseases}
              initialSelected={diseases}
            />
          )}

          {observations.includes('beneficial') && (
            <MultiSelectComponent
              placeholder='Arthropod beneficials spotted'
              data={arthropodItems}
              onSelectionChange={setArthropodBeneficials}
              initialSelected={arthropodBeneficials}
            />
          )}

          <DropdownComponent
            label='Crop health status'
            data={healthItems}
            onValueChange={setHealthObservation}
            initialValue={healthObservation}
          />
          <TextInput
            placeholder='Put your notes here student!'
            value={notes}
            style={style.notesInput}
            onChangeText={setNotes}
          />
          <Pressable
            style={style.genericButton}
            onPress={saveRecord}
            disabled={isLoading}
          >
            <Text style={style.genericButtonText}>{isLoading ? 'Saving...' : 'Save Record'}</Text>
          </Pressable>
        </ScrollView>
      </View>
      </ScrollView>
      {/* <View style={{justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 5}}>
        <Pressable
          style={style.signupButton}
          onPress={() => handleCloseClass()}
        >
          <Text style={style.signupText}>Return</Text>
        </Pressable>
      </View> */}
    </KeyboardAvoidingView>
    </Modal>
  );
}
