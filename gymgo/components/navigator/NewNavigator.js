import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthLoadingScreen from '../common/AuthLoadingScreen';

const AuthLoading = createStackNavigator();

export const Navigator = () => {
    return (
        <NavigationContainer>
            <AuthLoading.Navigator>
                <AuthLoading.Screen name="AuthLoadingScreen" component={AuthLoadingScreen} options={{ headerShown: false }} />
            </AuthLoading.Navigator>
        </NavigationContainer>
    )
}

