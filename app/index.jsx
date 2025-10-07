import { SafeAreaView } from "react-native-safe-area-context"
import HomePage from "../pages/home-page"
import ResultsPage from "../pages/results-page.jsx"
import { GlobalProvider } from "../components/global_variables"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { StartCamera } from "../pages/barcode-scanner"

const Tab = createMaterialTopTabNavigator()
const Stack = createStackNavigator()

export default function Main() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GlobalProvider>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomePage} />
          <Tab.Screen name="Scan" component={StartCamera} />
          <Tab.Screen name="Results" component={ResultsPage} />
        </Tab.Navigator>
      </GlobalProvider>
    </SafeAreaView>
  )
}
