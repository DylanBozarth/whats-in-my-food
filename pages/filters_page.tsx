import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScanButton from '../components/scan_button.tsx';
import ToggleSwitch from '../components/toggles.tsx';
import { PermissionsAndroid } from 'react-native';
import foodLists from '../components/food_list.tsx'

const FiltersPage = () => {
  const [barCodeScanResult, setBarCodeScanResult] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showAllSelected, setShowAllSelected] = useState(false);
  const [toggleStates, setToggleStates] = useState({});
  const [filteredNames, setFilteredNames] = useState([]);
  const [isExpanded, setIsExpanded] = useState({});
  const [isTitleVisible, setIsTitleVisible] = useState({});
  const _searchInputRef = useRef(null);

  const toggleNames = {
    'Added Sugar': [...foodLists],
    /*'Inflammatory foods': [...seedOils],
    'Vegetarian': [...nonVegetarian],
    'Vegan': [...nonVegan],
    'Common Allergens': [...commonAllergens],
    'Religious abstentions': [...haram],
    'Artificial colors and flavors': [...artificialAdditivesInFood],
    'Caffeine': [],
    'Internationally banned products': bannedInEU,
    'Placeholder': [] */
  };

  useEffect(() => {
    (async () => {
      const savedStates = await AsyncStorage.getItem('toggleStates');
      if (savedStates) {
        setToggleStates(JSON.parse(savedStates));
      } else {
        console.log("This is a first-time user");
      }
      requestPermissions();
    })();
    filterList('');
  }, []);

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'We need access to your camera to scan barcodes.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const saveToggleStates = async () => {
    await AsyncStorage.setItem('toggleStates', JSON.stringify(toggleStates));
  };

  const filterList = (query) => {
    const cleanQuery = query.replace(/\s+/g, '').toLowerCase();
    const filteredList = [];

    Object.entries(toggleNames).forEach(([category, items]) => {
      const isVisible =
        category.toLowerCase().includes(cleanQuery) ||
        items.some((item) => item.toLowerCase().includes(cleanQuery));

      setIsTitleVisible((prevState) => ({ ...prevState, [category]: isVisible }));
      setIsExpanded((prevState) => ({ ...prevState, [category]: isVisible }));

      if (isVisible) {
        filteredList.push(category, ...items.filter((name) => name.toLowerCase().includes(cleanQuery)));
      }
    });
    setFilteredNames(filteredList);
  };

  const toggleAllItemsInCategory = (category, value) => {
    const updatedToggleStates = { ...toggleStates };
    toggleNames[category].forEach((item) => {
      updatedToggleStates[item.toLowerCase()] = value;
    });
    setToggleStates(updatedToggleStates);
    saveToggleStates();
  };

  const handleToggleChange = (itemName, newValue) => {
    const updatedToggleStates = { ...toggleStates, [itemName]: newValue };
    setToggleStates(updatedToggleStates);
    saveToggleStates();
  };

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: 'grey' }}>
      <View style={{ marginBottom: 10 }}>
        <Button
          title={showAllSelected ? 'Show everything' : 'Show All Selected'}
          onPress={() => {
            setShowAllSelected(!showAllSelected);
            filterList('');
          }}
        />
      </View>

      <View style={{ marginBottom: 10 }}>
        <TextInput
          ref={_searchInputRef}
          placeholder="Search"
          onChangeText={(text) => {
            setSearchText(text);
            filterList(text);
          }}
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            paddingLeft: 10,
          }}
        />
      </View>

      <FlatList
        data={Object.keys(toggleNames)}
        keyExtractor={(item) => item}
        renderItem={({ item: category }) => {
          return isTitleVisible[category] ? (
            <View>
              <TouchableOpacity
                onPress={() => {
                  setIsExpanded((prevState) => ({
                    ...prevState,
                    [category]: !prevState[category],
                  }));
                }}
                style={{
                  backgroundColor: isExpanded[category] ? 'green' : 'red',
                  padding: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  {category}
                </Text>
                <Text style={{ color: 'white' }}>
                  {isExpanded[category] ? '-' : '+'}
                </Text>
              </TouchableOpacity>

              {isExpanded[category] &&
                toggleNames[category].map((name) => (
                  <ToggleSwitch
                    key={name}
                    passedName={name}
                    isHighlighted={toggleStates[name.toLowerCase()]}
                    onChanged={(value) => handleToggleChange(name.toLowerCase(), value)}
                  />
                ))}
            </View>
          ) : null;
        }}
      />

      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <ScanButton onScanResult={(result) => setBarCodeScanResult(result)} />
      </View>

      {barCodeScanResult ? (
        <Alert message={`Scanned: ${barCodeScanResult}`} />
      ) : null}
    </View>
  );
};

export default FiltersPage;
