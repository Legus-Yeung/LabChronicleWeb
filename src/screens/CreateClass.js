import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, Text, Pressable, Alert } from 'react-native';
import { DropdownComponent } from '../components/index.js';
import firebase from 'firebase/compat';
import style from '../styles.js';

export default function CreateClass({ route, navigation }) {
  const { classId } = route.params || {};

  const [className, setClassName] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [students, setStudents] = useState('');
  const [userEmails, setUserEmails] = useState([]); // Store fetched user emails
  const [isLoading, setIsLoading] = useState(false);

  const semesterItems = [
    { label: 'Fall', value: 'Fall' },
    { label: 'Winter', value: 'Winter' },
    { label: 'Summer', value: 'Summer' },
  ];

  useEffect(() => {
    // If classId is present, fetch existing record details for editing
    if (classId) {
      fetchExistingClass(classId);
    }
  }, [classId]);

  const fetchExistingClass = async (id) => {
    try {
      const classRef = firebase.firestore().collection('classroom').doc(id);
      const doc = await classRef.get();

      if (doc.exists) {
        const classData = doc.data();
        // Set state with existing record details for editing
        setClassName(classData.className);
        setSemester(classData.semester);
        setYear(classData.year);
        const studentsArray = classData.students || [];
        const userEmailPromises = studentsArray.map(uid => fetchUserEmail(uid));
        const userEmailResults = await Promise.all(userEmailPromises);
        setStudents(userEmailResults.join(', ')); // Set the students' emails in the input field
        setUserEmails(userEmailResults);
      } else {
        console.log('Record not found');
      }
    } catch (error) {
      console.error('Error fetching existing record:', error);
    }
  };

  const fetchUserEmail = async (uid) => {
    try {
      const doc = await firebase.firestore().collection('users').doc(uid).get();
      if (doc.exists) {
        return doc.data().email;
      }
    } catch (error) {
      console.error('Error fetching user email:', error);
    }
  };

  const saveClass = async () => {
    setIsLoading(true);

    if (!className || !semester || !year) {
      Alert.alert('Error', 'Class name, semester and year fields are required');
      setIsLoading(false);
      return;
    }
    try {
      const currentYear = new Date().getFullYear();

      if (students) {
        // If students field is provided, fetch user UIDs
        const studentEmails = students.split(',').map(email => email.trim());
        const userEmailPromises = studentEmails.map(email => fetchUserUid(email));
        userIds = await Promise.all(userEmailPromises);
      } else {
        userIds = [];
      }

      const classData = {
        className,
        semester,
        year: year || currentYear,
        prof: firebase.auth().currentUser.uid,
        students: userIds,
      };

      if (classId) {
        await firebase.firestore().collection('classroom').doc(classId).update(classData);
      } else {
        await firebase.firestore().collection('classroom').add(classData);
      }

      setIsLoading(false);
      navigation.navigate('Home');
    } catch (error) {
      setIsLoading(false);
      console.error('Error saving class:', error);
    }
  };

  const fetchUserUid = async (email) => {
    try {
      const querySnapshot = await firebase.firestore().collection('users').where('email', '==', email).get();
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
      }
    } catch (error) {
      console.error('Error fetching user UID:', error);
    }
  };
  //styling added is temporary, kinda ugly but at least spreads out the year and add student sections

  return (
    <View style={style.analyticsContainer}>
      <ScrollView>
        <TextInput
          placeholder='Class Name'
          value={className}
          onChangeText={setClassName}
          style={style.notesInput}
        />
        <DropdownComponent
          label='Semester'
          data={semesterItems}
          onValueChange={setSemester}
          initialValue={semester}
        />
        <TextInput
          placeholder='Year'
          value={year}
          onChangeText={setYear}
          style={style.notesInput}
          keyboardType='number-pad'
        />
        <TextInput
          placeholder='Add students (comma-separated emails)'
          value={students}
          onChangeText={setStudents}
          style={style.notesInput}
        />
        <Text style={[style.inputText, {marginHorizontal: 12}]}>ie. adam@gmail.com, sally@gmail.com, ...</Text>
        <Pressable style={style.genericButton} onPress={saveClass} disabled={isLoading}>
          <Text style={style.genericButtonText}>{isLoading ? 'Saving...' : 'Save Class'}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
