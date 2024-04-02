import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Modal, Pressable, TouchableOpacity } from 'react-native';
import { cropItems, pestItems, diseaseItems, arthropodItems, counts, healthItems, summaryOpts, dateRanges } from '../fieldDefinitions';
import { MultiSelectComponent, Histogram, StackedHist, DropdownComponent, ModalHeader } from '../components/index.js';
import { Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/compat';
import style from '../styles.js';

const CustomModal = ({ visible, onConfirm, onCancel, message }) => (
  <Modal visible={visible} transparent>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
      <View style={{ width: '80%', backgroundColor: "white", borderRadius: 10, padding: 20, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}>
        <Text style={{ marginBottom: 20 }}>{message}</Text>
        <Pressable onPress={onConfirm} style={{ marginBottom: 10, backgroundColor: 'blue', padding: 10, borderRadius: 5, width: '80%', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 16 }}>Confirm</Text>
        </Pressable>
        <Pressable onPress={onCancel} style={{ backgroundColor: 'gray', padding: 10, borderRadius: 5, width: '80%', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 16 }}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

export default function ClassAnalytics({ route, navigation }) {
  const { classId } = route.params;
  const [userRecords, setUserRecords] = useState([]);
  const [crop, setCrop] = useState([]);
  const [summaryOptions, setSummaryOptions] = useState([]);
  const [notesVisible, setNotesVisible] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [allRecordsVisible, setAllRecordsVisible] = useState(false);
  const [cropVisible, setCropVisible] = useState({});
  const [cropNotesVisible, setCropNotesVisible] = useState({});
  const [viewRecord, setViewRecord] = useState({});
  const [recordNotes, setRecordNotes] = useState({});
  const [viewUnresolved, setViewUnresolved] = useState(false);
  const [resolveModalVisible, setResolveModalVisible] = useState(false);
  const [recordIdToResolve, setRecordIdToResolve] = useState(null);
  const [className, setClassName] = useState();

  const toggleCropVisible = (date) => {
    setCropVisible(prevState => ({
      ...prevState,
      [date]: !prevState[date]
    }));
  };

  const toggleCropNotesVisible = (date, crop) => {
    setCropNotesVisible(prevState => ({
      ...prevState,
      [date]: {
        ...(prevState[date] || {}), // Ensure cropNotesVisible[date] is initialized as an object
        [crop]: !((prevState[date] || {})[crop]) // Toggle the visibility of crop notes
      }
    }));
  };

  const toggleViewRecord = (date) => {
    setViewRecord(prevState => ({
      ...prevState,
      [date]: !prevState[date]
    }));
  };

  const toggleRecordNotes = (date, crop) => {
    setRecordNotes(prevState => ({
      ...prevState,
      [date]: {
        ...(prevState[date] || {}),
        [crop]: !((prevState[date] || {})[crop])
      }
    }));
  };

  const toggleViewUnresolved = () => {
    setViewUnresolved(prevState => !prevState);
  };

  const handleCloseClass = () => {
    navigation.navigate('Analytics');
  }

  useEffect(() => {
    fetchUserRecords();
  }, []);

  const fetchUserRecords = async () => {
    try {
      const classDoc = await firebase.firestore().collection('classroom').doc(classId).get();
      if (!classDoc.exists) {
        console.error(`No classroom document found with id: ${classId}`);
        return;
      }
      const classData = classDoc.data();
      const studentUids = classData.students;
      const profUid = classData.prof;
      setClassName(classData.className);
  
      if (!studentUids) {
        console.error(`No 'students' field found in classroom document with id: ${classId}`);
        return;
      }
  
      // Fetch user names for students
      const studentNamePromises = studentUids.map(async (uid) => {
        const userDoc = await firebase.firestore().collection('users').doc(uid).get();
        if (userDoc.exists) {
          return { uid, name: userDoc.data().name };
        } else {
          console.error(`No user document found for UID: ${uid}`);
          return { uid, name: 'Unknown' }; // Provide a default name if user document not found
        }
      });
  
      // Fetch user name for professor
      const profNamePromise = firebase.firestore().collection('users').doc(profUid).get();
      const profNameResult = await profNamePromise;
      const profName = profNameResult.exists ? profNameResult.data().name : 'Unknown';
  
      const studentNames = await Promise.all(studentNamePromises);
      const profRecord = { uid: profUid, name: profName };
  
      const studentQueries = studentNames.map(({ uid }) =>
        firebase.firestore().collection('records').where('uid', '==', uid).get()
      );
  
      const profQuery = firebase.firestore().collection('records').where('uid', '==', profUid).get();
  
      const queries = [...studentQueries, profQuery];
      const recordSnapshots = await Promise.all(queries);
      const records = recordSnapshots.flatMap((snapshot, index) =>
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), name: index < studentNames.length ? studentNames[index].name : profRecord.name }))
      );
  
      
      records.sort((a, b) => {
        const dateA = a.location?.timestamp.toDate() ?? new Date(0); // Fallback to epoch if null
        const dateB = b.location?.timestamp.toDate() ?? new Date(0); // Fallback to epoch if null
        return dateB - dateA;
      });
  
      setUserRecords(records);
    } catch (error) {
      console.error('Error fetching user records: ', error);
    }
  };

  const handleDateRangeSelection = (days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
  
    return userRecords.filter(record => {
      const recordDate = record.location?.timestamp.toDate();
      return recordDate && recordDate >= startDate && recordDate <= endDate;
    });
  };

  const prepareData = (selectedField, selectedCrop) => {
    // Filter by date
    const filteredRecords = selectedDateRange
      ? handleDateRangeSelection(selectedDateRange)
      : userRecords;

    // Filter by crop
    const records = filteredRecords.filter(record => record.crop === selectedCrop);

    // Used to check if there is a count field associated with this field ie. spiderMites and spiderMiteCount
    const countField = `${selectedField}Count`;
    const totalRecords = records.length;

    // Find the label associated with the data for chart title
    const items = [...pestItems, ...diseaseItems, ...arthropodItems];
    const matchingItem = items.find(item => item.value === selectedField);
    const label = matchingItem ? matchingItem.label : selectedField;
    const shortName = matchingItem ? matchingItem.shortName : selectedField;
    const shortNameLegend = shortName + ' - ' + label + ' | ';

    // For health observations
    if (selectedField === 'healthObservations') {
      const data = healthItems.map(item => {
        const count = records.filter(record => record.healthObservation === item.value).length;
        return count;
      });

      return { data: data, xAxis: healthItems.map(item => item.shortName) };

      // If there is a count for this field
    } else if (records.length > 0 && records[0].hasOwnProperty(countField)) {
      // Count field exists, generate data and x-axis from counts
      const data = counts.map(countOption => {
        const count = records.filter(record => record[countField] === countOption.value).length;
        return count;
      });

      const sumOfCounts = data.reduce((acc, count) => acc + count, 0);
      const absenceCount = totalRecords - sumOfCounts;

      return { data: [absenceCount, ...data], xAxis: ['0', ...counts.map(countOption => countOption.label)], label: shortName, shortNameLegend };

      // Otherwise just check for whether it is present or absent
    } else {
      // Count field does not exist, check for presence and absence
      const presenceCount = records.filter(record => {
        // Check all three fields for the selected option
        return (
          record.pests.includes(selectedField) ||
          record.diseases.includes(selectedField) ||
          record.arthropodBeneficials.includes(selectedField)
        );
      }).length;

      const absenceCount = totalRecords - presenceCount;

      return { data: [absenceCount, presenceCount], xAxis: ['Absence', 'Presence'], label: shortName, shortNameLegend };
    }
  };

  const prepareStackedHistData = (selectedCategory, selectedCrop) => {
    const matchingItem = summaryOpts.find(summaryOpts => summaryOpts.value === selectedCategory);
    const title = matchingItem ? matchingItem.label : selectedCategory;
    const items = selectedCategory === 'pests' ? pestItems :
      selectedCategory === 'diseases' ? diseaseItems :
        selectedCategory === 'arthropodBeneficials' ? arthropodItems :
          [];

    // Initialize arrays to store labels, legend, and data for stacked bar chart
    let countLabels = [];
    let countLegend = [];
    let countData = [];
    let countShortNames = ' | ';

    let presenceLabels = [];
    let presenceLegend = [];
    let presenceData = [];
    let presenceShortNames = ' | ';


    // Iterate over items and prepare data for each item
    items.forEach(item => {
      const { data, xAxis, label, shortNameLegend } = prepareData(item.value, selectedCrop);

      // Check if item has counts
      if (xAxis.length > 2) {
        countLegend = xAxis;
        countLabels = countLabels.concat(label);
        countData.push(data);
        countShortNames = countShortNames + shortNameLegend;
      } else {
        presenceLegend = xAxis;
        presenceLabels = presenceLabels.concat(label);
        presenceData.push(data);
        presenceShortNames = presenceShortNames + shortNameLegend;
      }
    });

    return { title, countLabels, countLegend, countData, countShortNames, presenceLabels, presenceLegend, presenceData, presenceShortNames };
  };

  const renderHist = () => {
    return summaryOptions.map(option => {
      if (option === 'healthObservations') {
        const { data, xAxis } = prepareData(option, crop);

        // Render regular Histogram for other options
        return (
          <Histogram
            key={option}
            data={data}
            xAxis={xAxis}
            title={'Health Observations'}
          />
        );
      } else {
        const { title, countLabels, countLegend, countData, countShortNames, presenceLabels, presenceLegend, presenceData, presenceShortNames } = prepareStackedHistData(option, crop);
        const countColors = ['#89f8a8', '#f5f270', '#f5b770', '#f88b89'];
        const presenceColors = ['#89f8a8', '#f88b89'];
        const countKey = `${option}_count`;
        const presenceKey = `${option}_presence`;

        return (
          <View key={option}>
            {countLegend.length > 0 &&
              <StackedHist
                key={countKey}
                labels={countLabels}
                legend={countLegend}
                data={countData}
                barColors={countColors}
                title={`${title} - Counts`}
                shortNameLegend={countShortNames}
              />
            }

            {presenceLabels.length > 0 &&
              <StackedHist
                key={presenceKey}
                labels={presenceLabels}
                legend={presenceLegend}
                data={presenceData}
                barColors={presenceColors}
                title={`${title} - Presence`}
                shortNameLegend={presenceShortNames}
              />
            }
          </View>
        );
      }
    });
  };
  //
  // FOR SHOW NOTES BUTTON
  //
  const renderNotesPopup = () => {
    // Filter out records that don't contain notes
    const filteredRecords = userRecords.filter(record => record.notes !== '');

    // Group records by date and crop
    const groupedRecords = filteredRecords.reduce((groups, record) => {
      const dateKey = record.location?.timestamp.toDate().toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      const matchingItem = cropItems.find(crop => crop.value === record.crop);
      const cropKey = matchingItem ? matchingItem.label : record.crop;

      if (!groups[dateKey]) {
        groups[dateKey] = {};
      }

      if (!groups[dateKey][cropKey]) {
        groups[dateKey][cropKey] = [];
      }

      groups[dateKey][cropKey].push(record);
      return groups;
    }, {});

    // Check if there are no records
    if (Object.keys(groupedRecords).length === 0) {
      return (
        <Modal visible={notesVisible} onRequestClose={() => setNotesVisible(false)}>
          <View style={{ padding: 30 }}>
            <Text>No notes to display.</Text>
          </View>
          <Pressable
            style={style.genericButton}
            onPress={() => setNotesVisible(false)}
          >
            <Text style={style.genericButtonText}>Close</Text>
          </Pressable>
        </Modal>
      );
    }

    // Render the popup
    return (
      <Modal visible={notesVisible} onRequestClose={() => setNotesVisible(false)}>
        <View style={{ position: 'absolute', top: 17, left: 10, zIndex: 10 }}>
          <TouchableOpacity onPress={() => setNotesVisible(false)}>
            <Ionicons name="arrow-back" size={23} color="white" />
          </TouchableOpacity>
        </View>
        <ModalHeader title={`${className} Notes`}/>
        <ScrollView contentContainerStyle={{flexGrow: 1}} style={{paddingHorizontal: 15}}>
          {/* <View style={{paddingTop: 20}}>
            <Text style={style.headerTextStyle}>Student Notes</Text>
          </View> */}
          {Object.entries(groupedRecords).map(([date, crops]) => (
            <View key={date}>
              <Pressable onPress={() => toggleCropVisible(date)}>
                <Text style={style.headerTextStyle}>{date}</Text>
              </Pressable>
              <View style={style.listBorderLeft}>
                {cropVisible[date] && Object.entries(crops).map(([crop, records]) => (
                  <View key={crop}>
                    <Pressable onPress={() => toggleCropNotesVisible(date, crop)}>
                      <Text style={style.subheaderTextStyle}>{crop}</Text>
                    </Pressable>
                    <View style={style.listBorderLeft}>
                      {cropNotesVisible[date] && cropNotesVisible[date][crop] &&
                        records.filter(record => record.notes && record.notes.trim() !== '')
                          .map((record, index) => (
                            <Text key={index} style={{ paddingLeft: 5 }}>
                              {record.name}: {record.notes}
                            </Text>
                          ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
        {/* <View style={{justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 5}}>
            <Text></Text>
            <Pressable
              style={style.genericButton}
              onPress={() => setNotesVisible(false)}
            >
              <Text style={style.genericButtonText}>Return</Text>
            </Pressable>
          </View> */}
      </Modal>
    );
  };

  const handleResolve = (recordId) => {
    setRecordIdToResolve(recordId);
    setResolveModalVisible(true);
  };
  
  const confirmResolve = async () => {
      try {
        // Update the record in the database
        await firebase.firestore().collection('records').doc(recordIdToResolve).update({
          resolved: 'Y'
        });
        // Refetch the records
        fetchUserRecords();
      } catch (error) {
        console.error('Error resolving record: ', error);
      }
    setResolveModalVisible(false);
  };

  // Function to find the label by value across all item arrays
  const findLabelByValue = (value) => {
    const allItems = [...pestItems, ...diseaseItems, ...arthropodItems, ...healthItems]; // Combine all your items arrays
    const matchingItem = allItems.find(item => item.value === value);
    return matchingItem ? matchingItem.label : value; // Return the label if found, otherwise return the original value
  };

  const renderAllRecordsPopup = () => {
    // Filter for unresolved records where originallyInPerimeter and inPerimeter are empty and not resolved
    const unresolvedRecords = userRecords.filter(record =>
      (!record.originallyInPerimeter || !record.inPerimeter) && !record.resolved
    );

    // Exclude unresolved records from the rest of the grouped records
    const resolvedOrOtherRecords = userRecords.filter(record =>
      !((!record.originallyInPerimeter || !record.inPerimeter) && !record.resolved)
    );

    // Group the resolved or other records by date and crop for display below
    const groupedRecords = resolvedOrOtherRecords.reduce((groups, record) => {
      const dateKey = record.location?.timestamp.toDate().toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      const matchingItem = cropItems.find(crop => crop.value === record.crop);
      const cropKey = matchingItem ? matchingItem.label : record.crop;

      if (!groups[dateKey]) {
        groups[dateKey] = {};
      }

      if (!groups[dateKey][cropKey]) {
        groups[dateKey][cropKey] = [];
      }

      groups[dateKey][cropKey].push(record);
      return groups;
    }, {});

    //
    // FOR SHOW RECORDS
    //
    return (
      <Modal visible={allRecordsVisible} onRequestClose={() => setAllRecordsVisible(false)}>
        <View style={{ position: 'absolute', top: 17, left: 10, zIndex: 10 }}>
          <TouchableOpacity onPress={() => setAllRecordsVisible(false)}>
            <Ionicons name="arrow-back" size={23} color="white" />
          </TouchableOpacity>
        </View>
        <ModalHeader title={`${className} Records`}/>
        <View style={[{justifyContent: 'space-between'},{alignContent: 'space-between'},{flexDirection: 'column'}, {flex: 1}]}>
          <ScrollView contentContainerStyle={{flexGrow: 1}} style={{paddingHorizontal: 15}}>
            {/* <View style={{paddingTop: 20}}>
              <Text style={style.headerTextStyle}>Records</Text>
            </View> */}
            {/* Display Unresolved Records */}
            {unresolvedRecords.length > 0 && (
              <>
                <Pressable onPress={toggleViewUnresolved}>
                  <Text style={style.headerTextStyle}>Unresolved</Text>
                </Pressable>
                {viewUnresolved && unresolvedRecords.map((record, index) => (
                  <View key={index} style={style.resolvedContainer}>
                    {/**this view required, elsewise text will be beside one another instead of on top*/}
                    <View>
                      <Text style={{ color: record.originallyInPerimeter === '' ? 'red' : (record.inPerimeter === '' ? 'orange' : 'black') }}>
                        Date: {record.location?.timestamp.toDate().toLocaleString()}
                      </Text>
                      <Text style={{ color: record.originallyInPerimeter === '' ? 'red' : (record.inPerimeter === '' ? 'orange' : 'black') }}>
                        Crop: {record.crop}
                      </Text>
                      <Text style={{ color: record.originallyInPerimeter === '' ? 'red' : (record.inPerimeter === '' ? 'orange' : 'black') }}>
                        Student: {record.name}
                      </Text>
                    </View>
                    {/* Resolve button for unresolved records */}
                    <View>
                      <Pressable
                        style={style.genericButton}
                        onPress={() => handleResolve(record.id)}
                      >
                        <Text style={style.genericButtonText}>Resolve</Text>
                      </Pressable>
                      <CustomModal
                        visible={resolveModalVisible}
                        onConfirm={() => {
                          setResolveModalVisible(false);
                        }}
                        onCancel={() => setResolveModalVisible(false)}
                        message="Do you wish to resolve this record?"
                      />
                    </View>
                  </View>
                ))}
              </>
            )}
            {/* Display Resolved or Other Records */}
            {Object.entries(groupedRecords).sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA)).map(([date, crops]) => (
              <View key={date}>
                <Pressable onPress={() => toggleViewRecord(date)}>
                  <Text style={style.headerTextStyle}>{date}</Text>
                </Pressable>
                <View style={style.listBorderLeft}>
                  {viewRecord[date] && Object.entries(crops).map(([crop, records]) => (
                    <View key={crop}>
                      <Pressable onPress={() => toggleRecordNotes(date, crop)}>
                        <Text style={style.subheaderTextStyle}>{crop}</Text>
                      </Pressable>
                      <View style={style.listBorderLeft}>
                        {recordNotes[date] && recordNotes[date][crop] && records.map((record, index) => (
                          <View key={index}>
                            <Text style={style.subsubheaderTextStyle}>Student: {record.name}</Text>
                            {record.pests && record.pests.length > 0 && (
                              <>
                                <Text style={{ paddingLeft: 5 }}>Pests:</Text>
                                <View style={style.listBorderLeft}>
                                  {record.pests.map((pest, pestIndex) => (
                                    <Text key={pestIndex} style={{ paddingLeft: 5 }}>
                                      {findLabelByValue(pest)}
                                      {record[`${pest}Count`] ? `: ${record[`${pest}Count`]}` : ''}
                                    </Text>
                                  ))}
                                </View>
                              </>
                            )}
                            {record.diseases && record.diseases.length > 0 && (
                              <>
                                <Text style={{ paddingLeft: 5 }}>Diseases:</Text>
                                <View style={style.listBorderLeft}>
                                  {record.diseases.map((disease, diseaseIndex) => (
                                    <Text key={diseaseIndex} style={{ paddingLeft: 5 }}>{findLabelByValue(disease)}</Text>
                                  ))}
                                </View>
                              </>
                            )}
                            {record.arthropodBeneficials && record.arthropodBeneficials.length > 0 && (
                              <>
                                <Text style={{ paddingLeft: 5 }}>Beneficial Arthropods:</Text>
                                <View style={style.listBorderLeft}>
                                  {record.arthropodBeneficials.map((arthropod, arthropodIndex) => (
                                    <Text key={arthropodIndex} style={{ paddingLeft: 5 }}>{findLabelByValue(arthropod)}</Text>
                                  ))}
                                </View>
                              </>
                            )}
                            {record.healthObservation && (
                              <Text style={{ paddingLeft: 5 }}>Health Observation: {findLabelByValue(record.healthObservation)}</Text>
                            )}
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
            
          </ScrollView>
          {/* <View style={{justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 5}}>
            <Pressable
              style={style.genericButton}
              onPress={() => setAllRecordsVisible(false)}
            >
              <Text style={style.genericButtonText}>Return</Text>
            </Pressable>
          </View> */}
        </View>
      </Modal>
    );
  };
  //THE MODAL VIEW IS A TEMPORARY FIX FOR WEB AS SCROLLVIEW DOESN"T WORK :3
  return (
    <Modal>
      <View style={{ position: 'absolute', top: 17, left: 10, zIndex: 10 }}>
        <TouchableOpacity onPress={() => handleCloseClass()}>
          <Ionicons name="arrow-back" size={23} color="white" />
        </TouchableOpacity>
      </View>
      <ModalHeader title={`${className} Analytics`}/>
      <View style={[{justifyContent: 'space-between'},{alignContent: 'space-between'},{flexDirection: 'column'}, {flex: 1}]}>
        <ScrollView
          style={style.createContainer}
          stickyHeaderIndices={[0]}>
          <View>
            <View
              style={[
                { flexDirection: 'row' },
                { justifyContent: 'center' },
                { backgroundColor: '#FFFFFF' },
                { paddingVertical: 8 }]}>
              <Pressable
                style={style.genericButton}
                onPress={() => { setNotesVisible(true); }}
              >
                <Text style={style.genericButtonText}>Show Notes</Text>
              </Pressable>
              {renderNotesPopup()}

              <Pressable
                style={style.genericButton}
                onPress={() => { setAllRecordsVisible(true); }}
              >
                <Text style={style.genericButtonText}>Show Records</Text>
              </Pressable>
              {renderAllRecordsPopup()}
            </View>
            <DropdownComponent
              label='Date range'
              data={dateRanges}
              onValueChange={setSelectedDateRange}
              initialValue={selectedDateRange}
            />
          </View>

          <DropdownComponent
            label='Crop'
            data={cropItems}
            onValueChange={setCrop}
            initialValue={crop}
          />
          <MultiSelectComponent
            placeholder='What summary would you like to view?'
            data={summaryOpts}
            onSelectionChange={setSummaryOptions}
            initialSelected={summaryOptions}
          />
          
          {crop && summaryOptions.length > 0 && renderHist()} 
        </ScrollView>
        {/* <View style={{justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 5}}>
          <Pressable
            style={style.genericButton}
            onPress={() => handleCloseClass()}
          >
            <Text style={style.genericButtonText}>Return</Text>
          </Pressable>
        </View> */}
      </View>
    </Modal>
  );
}