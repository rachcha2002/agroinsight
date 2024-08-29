import { View, Text,Image } from 'react-native'
import React from 'react'
import { images } from '../../constants'
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
            <View className="mt-1.5">
            <TouchableOpacity onPress={handlePress}>
          <View className="bg-green-500 rounded-lg p-2 mr-0.5">
            <Text className="text-white text-center">Add</Text>
          </View>
        </TouchableOpacity>
            </View>
          </View>
  )
}

export default DeseaseHeader