import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import Icon from '../../components/common/Icon';
import ContactsComponent from '../../components/ContactsComponent';
import {CONTACT_DETAIL} from '../../constants/routeNames';
import getContacts from '../../context/actions/contacts/getContacts';
import {GlobalContext} from '../../context/Provider';
import {navigate} from '../../navigations/SideMenu/RootNavigator';

const Contacts = ({navigation}) => {
  // console.log('navigation:>>', navigation);
  // console.log('navigation:>>', navigation.navigate);

  const [sortBy, setSortBy] = React.useState(null);
  const {setOptions, toggleDrawer} = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const contactsRef = useRef([]);

  const {
    contactsDispatch,
    contactsState: {
      getContacts: {data, loading, error},
    },
  } = useContext(GlobalContext);

  // console.log('contactsState:>>', contactsState);
  // console.log('data:>>', data);
  // console.log('loading:>>', loading);

  useEffect(() => {
    getContacts()(contactsDispatch);
  }, []);

  // console.log('dortBs:>>', sortBy);
  const getSettings = async () => {
    const sortPref = await AsyncStorage.getItem('sortBy');
    // console.log('sortPref:', sortPref);
    if (sortPref) {
      setSortBy(sortPref);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getSettings();
      return () => {};
    }, []),
  );

  useEffect(() => {
    const prev = contactsRef.current;

    contactsRef.current = data;

    const newList = contactsRef.current;

    if (newList.length - prev.length === 1) {
      const newContacts = newList.find(
        (item) => !prev.map((i) => i.id).includes(item.id),
      );

      // console.log('newContacts', newContacts);
      navigate(CONTACT_DETAIL, {item: newContacts});
    }
  }, [data.length]);

  useEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            toggleDrawer();
          }}>
          <Icon type="material" size={25} style={{padding: 10}} name="menu" />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <ContactsComponent
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      data={data}
      loading={loading}
      sortBy={sortBy}
    />
  );
};

export default Contacts;