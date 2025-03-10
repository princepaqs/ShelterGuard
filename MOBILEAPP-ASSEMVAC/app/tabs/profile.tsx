import { Entypo } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export default class profile extends Component {
  render() {
    return (
        <LinearGradient
            colors={['#0097b2', '#7ed957']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="flex-1"
          >
            <TouchableOpacity onPress={() => router.replace('./homepage')} className='absolute w-16 items-center top-12 left-5 bg-[#0f8799] rounded-3xl'>
                <Entypo name="chevron-left" size={45} color="white" />
            </TouchableOpacity>
        </LinearGradient>
    )
  }
}
