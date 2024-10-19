package org.whatsinmyfood.project

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material.Button
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import org.jetbrains.compose.resources.painterResource
import org.jetbrains.compose.ui.tooling.preview.Preview

import whats_in_my_food.composeapp.generated.resources.Res
import whats_in_my_food.composeapp.generated.resources.compose_multiplatform

@Composable
@Preview
fun App() {
    val toggleNames: MutableMap<String, List<String>> = mutableMapOf()
    val toggleStates: MutableMap<String, Boolean> = mutableMapOf()
    val filteredNames: MutableList<String> = mutableListOf()
    var showAllSelected: Boolean = false

    fun setupToggleNames() {
        toggleNames["Added Sugar"] = listOf("Sugar", "High fructose corn syrup")
        toggleNames["Inflammatory foods"] = listOf("vegetable oil", "canola oil")
        toggleNames["Vegetarian"] = listOf("Beef", "Pork", "Chicken")
        toggleNames["Vegan"] = listOf("Gelatin", "Honey")
        toggleNames["Common Allergens"] = listOf("Peanuts", "Almonds", "Cashews")
        toggleNames["Religious abstentions"] = listOf("Pork", "Alcohol")
        toggleNames["Artificial colors and flavors"] = listOf("Red 40", "Yellow 5")
        toggleNames["Internationally banned products"] = listOf("BHA", "BHT")
        // Add more categories...
    }
    fun filterList(query: String) {
        filteredNames.clear()
        toggleNames.forEach { (category, list) ->
            if (category.contains(query, true) || list.any { it.contains(query, true) }) {
                filteredNames.add(category)
                filteredNames.addAll(list.filter { it.contains(query, true) })
            }
        }
        recyclerView.adapter?.notifyDataSetChanged()
    }

    fun handleToggleChange(itemName: String, isChecked: Boolean) {
        toggleStates[itemName] = isChecked
        saveToggleStates()
    }

    fun loadToggleStates() {
        val prefs = getSharedPreferences("toggle_states", MODE_PRIVATE)
        val savedStates = prefs.getString("toggle_states", null)
        if (savedStates != null) {
            val loadedStates = Gson().fromJson(savedStates, HashMap::class.java)
            toggleStates.putAll(loadedStates)
        }
    }

    fun saveToggleStates() {
        val prefs = getSharedPreferences("toggle_states", MODE_PRIVATE)
        val editor = prefs.edit()
        val savedStates = Gson().toJson(toggleStates)
        editor.putString("toggle_states", savedStates)
        editor.apply()
    }

    fun showLoadingDialog() {
        val dialog = AlertDialog.Builder(this)
            .setView(layoutInflater.inflate(R.layout.dialog_loading, null))
            .setCancelable(false)
            .create()
        dialog.show()
    }
    // theme starting
    MaterialTheme {
        var showContent by remember { mutableStateOf(false) }
        Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
            Button(onClick = { showContent = !showContent }) {
                Text("Click me!")
            }
            Text("Oh yeah")
        }
    }
}