import { SafeAreaView } from "react-native-safe-area-context"
import HomePage from "../pages/home-page"
import ResultsPage from "../pages/results-page.jsx"
import { GlobalProvider } from "../components/global_variables"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { StartCamera } from "../pages/barcode-scanner"
import { Ionicons } from "@expo/vector-icons"

const Tab = createMaterialTopTabNavigator()
const Stack = createStackNavigator()

export default function Main() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GlobalProvider>
        <Tab.Navigator
          tabBarPosition="bottom"
          swipeEnabled={true}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color }) => {
              let iconName

              if (route.name === "Home") {
                iconName = focused ? "home" : "home-outline"
              } else if (route.name === "Scan") {
                iconName = focused ? "barcode" : "barcode-outline"
              } else if (route.name === "Results") {
                iconName = focused ? "list" : "list-outline"
              }

              return <Ionicons name={iconName} size={24} color={color} />
            },
            tabBarActiveTintColor: "#007AFF",
            tabBarInactiveTintColor: "gray",
            tabBarShowLabel: true,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "600",
              textTransform: "none",
            },
            tabBarStyle: {
              backgroundColor: "#ffffff",
              borderTopWidth: 1,
              borderTopColor: "#e0e0e0",
              elevation: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              height: 60,
            },
            tabBarIndicatorStyle: {
              backgroundColor: "#007AFF",
              height: 3,
              top: 0,
            },
            tabBarItemStyle: {
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            },
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
