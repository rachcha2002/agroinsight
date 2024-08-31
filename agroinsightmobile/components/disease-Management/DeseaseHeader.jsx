import { View, Text,Image } from 'react-native'
import React from 'react'
import { images,icons } from '../../constants'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { router } from 'expo-router'

const DeseaseHeader = () => {
    const handlePress = () => {
        router.push('/disease/createcomplaint'); // Navigate to the create complaint screen
      };

 
  return (
    <View className="justify-between items-center flex-row ">
            <View className="flex-1 items-center pl-7">
              <Image
                source={images.agroinsightlogo}
                className="w-15 h-10"
                resizeMode="contain"
              />
            </View>
            <View className="mt-1.5 mr-0.5">
              <TouchableOpacity onPress={handlePress}>
                <Image
                  source={icons.plusgreen}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
  )
}

export default DeseaseHeader