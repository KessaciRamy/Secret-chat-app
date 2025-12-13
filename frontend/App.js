import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './Screens/homePage';
import { FormScreen } from './Screens/formPage'
import { WaitingRoomScreen } from './Screens/waitingRoomPage'
import { DashboardScreen } from "./Screens/dashboardPage";
import { ChatScreen } from "./Screens/chatPage";
const Stack = createStackNavigator();

export default function App(){
    return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateForm" component={FormScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="WaitingRoom" component={WaitingRoomScreen} />
        <Stack.Screen name="Chat" component={ChatScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}