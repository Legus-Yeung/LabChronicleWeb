import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';

const MultiSelectComponent = ({ data, placeholder, onSelectionChange, initialSelected }) => {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    // Update the value in the state when the initialValue prop changes
    setSelected(initialSelected || null);
  }, [initialSelected]);

  //handles the change of selecting a different item
  const handleSelectionChange = (items) => {
    setSelected(items);

    // Call the provided callback function with the selected values
    if (onSelectionChange) {
      onSelectionChange(items);
    }
  };

  return (
    <View style={styles.container}>
      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        search
        data={data}
        labelField='label'
        valueField='value'
        placeholder={placeholder}
        searchPlaceholder='Search...'
        value={selected}
        onChange={handleSelectionChange}
        selectedStyle={styles.selectedStyle}
      />
    </View>
  );
};

export default MultiSelectComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  dropdown: {
    color: '#FFFFFF',
    height: 50,
    backgroundColor: 'transparent',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  selectedStyle: {
    borderRadius: 12,
  },
});