import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthLoadingScreen from '../designationNavigator/AuthLoadingScreen'
import { NavigationContainer } from '@react-navigation/native';

const AuthLoader = createStackNavigator();

export const Navigators = () => {
    return (
        <NavigationContainer>
            <AuthLoader.Navigator>
                <AuthLoader.Screen name="AuthLoadingScreen" component={AuthLoadingScreen} options={{ headerShown: false }} />
            </AuthLoader.Navigator>
        </NavigationContainer>
    )
}
