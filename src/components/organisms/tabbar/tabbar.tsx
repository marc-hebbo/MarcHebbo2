import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Home, UserCircle, PlusCircle } from 'lucide-react-native';
import { styles } from './styles';

export const TabBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    { name: 'ProductList', icon: Home },
    { name: 'AddProduct', icon: PlusCircle },
    { name: 'ProfileEdit', icon: UserCircle },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(({ name, icon: Icon }) => {
        const isActive = route.name === name;

        // Profile icon always black, others follow active/inactive color
        const color = (name === 'ProfileEdit' || name === 'AddProduct') ? '#000' : isActive ? '#000' : '#999';

        return (
          <TouchableOpacity
            key={name}
            style={styles.tabButton}
            onPress={() => navigation.navigate(name as never)}
          >
            <Icon
              size={28}
              color={color}
              strokeWidth={2}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
