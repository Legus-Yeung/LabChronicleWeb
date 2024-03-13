import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Pressable, Alert, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { cropItems } from '../fieldDefinitions';
import firebase from 'firebase/compat';
import style from '../styles.js';

export default function Dashboard({ navigation }) {
  const [displayName, setDisplayName] = useState('');
  const [userRecords, setUserRecords] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // State for edit mode

  useEffect(() => {
    // Fetch user's display name
    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
      setDisplayName(currentUser.displayName);
    }

    // Fetch user's records and set up a real-time listener
    const fetchUserRecords = () => {
      const userId = currentUser.uid;
      const userRecordsRef = firebase.firestore().collection('records');

      // Set up a real-time listener for changes in the records collection
      const unsubscribe = userRecordsRef.where('uid', '==', userId).onSnapshot(
        (querySnapshot) => {
          const fetchedRecords = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          fetchedRecords.sort((a, b) => b.location.timestamp.toDate() - a.location.timestamp.toDate());
          setUserRecords(fetchedRecords);
        },
        (error) => {
          console.error('Error fetching user records:', error);
        }
      );

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    };

    fetchUserRecords();
  }, []);

  const handleRecordPress = (recordId) => {
    // Navigate to the Records screen with the record ID to enable editing
    navigation.navigate('Records', { recordId });
  };

  const handleEditPress = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  const handleDeleteRecord = (recordId) => {
    // Display a confirmation dialog before deleting the record
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this record?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await firebase.firestore().collection('records').doc(recordId).delete();
              console.log('Class deleted successfully');
            } catch (error) {
              console.error('Error deleting class:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderRecordItem = ({ item }) => {
    const matchingItem = cropItems.find((crop) => crop.value === item.crop);
    const label = matchingItem ? matchingItem.label : item.crop;
    return (
      <View style={style.recordContainer}>
        <TouchableOpacity
          style={style.input}
          onPress={() => handleRecordPress(item.id)}>
          <View>
            <Text style={style.inputText}>{label}</Text>
          </View>
        </TouchableOpacity>
        {isEditing && (
          <TouchableOpacity style={{ flex: 1 }} onPress={() => handleDeleteRecord(item.id)}>
            <Ionicons name='trash-outline' size={30} style={style.deleteIcon} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderDateHeading = ({ section: { date } }) => (
    //style dateHeading doesn't exist
    <Text style={style.dateHeading}>{date}</Text>
  );

  // Group records by date
  const groupedRecords = userRecords.reduce((groups, record) => {
    const dateKey = record.location.timestamp.toDate().toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    if (!groups[dateKey]) {
      groups[dateKey] = { date: dateKey, data: [] };
    }
    groups[dateKey].data.push(record);
    return groups;
  }, {});

  const groupedRecordsArray = Object.values(groupedRecords);

  return (
    <View style={style.container}>
      <View style={style.headerContainerDashboard}>
        {displayName ?
          <Text style={style.headerTextStyle}>
            Hello {displayName}!
          </Text>
          :
          <Text style={style.textStyle}>
            Welcome to your Lab Chronicle!
          </Text>
        }
        <Pressable
          style={style.genericButton}
          onPress={() => navigation.navigate('Records')}
        >
          <Text style={style.genericButtonText}>Add Record</Text>
        </Pressable>
      </View>
      <View style={[{ flexDirection: 'row' }, { justifyContent: 'space-between' }]}>
        <Text style={style.textStyle}>Your Records:</Text>
        <Pressable
          style={[style.editButton, { alignSelf: 'center' }]}
          title='Edit'
          onPress={handleEditPress}
        >
          <Text style={style.editText}>Edit</Text>
        </Pressable>
      </View>
      <FlatList
        style={style.recordButton}
        data={groupedRecordsArray}
        renderItem={({ item }) => (
          <>
            {renderDateHeading({ section: item })}
            <FlatList
              data={item.data}
              renderItem={renderRecordItem}
              keyExtractor={(record) => record.id}
            />
          </>
        )}
        keyExtractor={(group) => group.date}
      />
    </View>
  );
};