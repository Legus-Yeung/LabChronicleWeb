import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Pressable, Modal } from 'react-native';
import { CustomModal } from '../components/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase/compat';
import style from '../styles.js';

export default function Settings({ navigation }) {
  const [profOptions, setProfOptions] = useState(false); // State for professor options visibility
  const [userClasses, setUserClasses] = useState([]); // State for user's classes
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [deleteClassModalVisible, setDeleteClassModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null); // Optional: if you need to track which class is being deleted

  // This does the cool thing of getting the users and checking if they're an elite member (prof)
  useEffect(() => {
    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
      const uid = currentUser.uid;
      const userRef = firebase.firestore().collection('users').doc(uid);

      userRef.get().then((doc) => {
        if (doc.exists) {
          const userRole = doc.data().role;
          setProfOptions(userRole === 'prof');
        }
      });
    }

    // Fetch that prof class and show em what it be
    const fetchUserClasses = () => {
      const userId = currentUser.uid;
      const userClassesRef = firebase.firestore().collection('classroom');
      const unsubscribe = userClassesRef.where('prof', '==', userId).onSnapshot(
        (querySnapshot) => {
          const fetchedClasses = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })).sort((a, b) => b.year - a.year || a.semester.localeCompare(b.semester));
          setUserClasses(fetchedClasses);
        },
        (error) => {
          console.error('Error fetching user classes:', error);
        }
      );
      return () => unsubscribe();
    };

    fetchUserClasses();
  }, []);

  // Idk, does some cool funky stuff and send you to login
  const signOut = () => {
    firebase.auth().signOut().then(() => {
      navigation.navigate('Login');
    });
  };

  // You wanna create a class, wow
  const handleClassPress = (classId) => {
    navigation.navigate('CreateClass', { classId });
  };

  // Delete that class you're so proud of. Do it.
  const handleDeleteClass = (classId) => {
    setSelectedClassId(classId); // Optional: if you need to track which class is being deleted
    setDeleteClassModalVisible(true);
  };

  // Are you sure you really wanna delete?
  const confirmDeleteClass = async () => {
    try {
      await firebase.firestore().collection('classroom').doc(selectedClassId).delete();
      console.log('Class deleted successfully');
    } catch (error) {
      console.error('Error deleting class:', error);
    }
    setDeleteClassModalVisible(false);
  };

  // unlimited POWAR
  const handleDeleteAccount = () => {
    setDeleteAccountModalVisible(true);
  };

  // Dew it
  const confirmDeleteAccount = async () => {
    try {
      // Step 1: Delete Classes
      const classQuerySnapshot = await firebase.firestore().collection('classroom').where('prof', '==', firebase.auth().currentUser.uid).get();
      const classDeletePromises = classQuerySnapshot.docs.map(doc => doc.ref.delete());
      await Promise.all(classDeletePromises);

      // Step 2: Delete Records
      const recordQuerySnapshot = await firebase.firestore().collection('records').where('uid', '==', firebase.auth().currentUser.uid).get();
      const recordDeletePromises = recordQuerySnapshot.docs.map(doc => doc.ref.delete());
      await Promise.all(recordDeletePromises);

      // Step 3: Delete User Document
      await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).delete();

      // Step 4: Delete Authentication Record
      await firebase.auth().currentUser.delete();

      console.log('Account deleted successfully');
      navigation.navigate('Login'); // Navigate to the login screen after deletion
    } catch (error) {
      console.error('Error deleting account:', error);
    }
    setDeleteAccountModalVisible(false);
  };

  const handleEditPress = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  return (
    <View style={style.container}>
      {profOptions && (
        <Pressable
          style={style.genericButton}
          onPress={() => {
            navigation.navigate('CreateClass');
          }}>
          <Text style={style.genericButtonText}>Create New Class</Text>
        </Pressable>
      )}

      {profOptions && (
        <View style={[{ flexDirection: 'row' }, { justifyContent: 'space-between' }]}>
          <Text style={style.textStyle}>Your Classes:</Text>
          <Pressable
            style={style.editButton}
            onPress={handleEditPress}
          >
            <Text style={style.editText}>Edit</Text>
          </Pressable>
        </View>
      )}
      <FlatList
        style={style.recordButton}
        data={userClasses}
        renderItem={({ item }) => (
          <View style={style.recordContainer}>
            <TouchableOpacity style={style.input} onPress={() => handleClassPress(item.id)}>
              <Text style={style.inputText}>{`${item.year} ${item.semester} - ${item.className}`}</Text>
            </TouchableOpacity>
            {isEditing && (
              <TouchableOpacity style={{ flex: 1 }} onPress={() => handleDeleteClass(item.id)}>
                <Ionicons name='trash-outline' size={30} style={style.deleteIcon} />
              </TouchableOpacity>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <Pressable
        style={[style.genericButton, { backgroundColor: 'rgb(185,0,0)' }]}
        onPress={handleDeleteAccount}>
        <Text style={style.genericButtonText}>Delete Account</Text>
      </Pressable>

      <Pressable
        style={style.signupButton}
        onPress={signOut}>
        <Text style={style.signupText}>Logout</Text>
      </Pressable>

      <CustomModal
        visible={deleteClassModalVisible}
        message="Are you sure you want to delete this class?"
        onConfirm={() => {
          confirmDeleteClass();
          setDeleteClassModalVisible(false); // Close modal after confirmation
        }}
        onCancel={() => setDeleteClassModalVisible(false)}
      />

      <CustomModal
        visible={deleteAccountModalVisible}
        message="Are you sure you want to delete your account? This action is irreversible."
        onConfirm={() => {
          confirmDeleteAccount();
          setDeleteAccountModalVisible(false); // Close modal after confirmation
        }}
        onCancel={() => setDeleteAccountModalVisible(false)}
      />
    </View>
  );
}
