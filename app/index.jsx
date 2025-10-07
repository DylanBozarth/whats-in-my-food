import { SafeAreaView } from "react-native-safe-area-context"
import HomePage from "../pages/home-page"
import ResultsPage from "../pages/results-page.jsx"
import { GlobalProvider } from "../components/global_variables"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { StartCamera } from "../pages/barcode-scanner"
import { Ionicons } from "@expo/vector-icons"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

export default function Main() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GlobalProvider>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName

              if (route.name === "Home") {
                iconName = focused ? "home" : "home-outline"
              } else if (route.name === "Scan") {
                iconName = focused ? "barcode" : "barcode-outline"
              } else if (route.name === "Results") {
                iconName = focused ? "list" : "list-outline"
              }

              return <Ionicons name={iconName} size={size} color={color} />
            },
            tabBarActiveTintColor: "#007AFF",
            tabBarInactiveTintColor: "gray",
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={HomePage} />
          <Tab.Screen name="Scan" component={StartCamera} />
          <Tab.Screen name="Results" component={ResultsPage} />
        </Tab.Navigator>
      </GlobalProvider>
    </SafeAreaView>
  )
}
