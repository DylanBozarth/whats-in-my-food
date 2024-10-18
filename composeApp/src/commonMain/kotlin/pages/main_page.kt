import android.content.Intent
import android.os.Bundle
import android.util.Log
/*import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_main.*
import kotlin.collections.HashMap

class MainActivity : AppCompatActivity() {
    private val toggleNames: MutableMap<String, List<String>> = mutableMapOf()
    private val toggleStates: MutableMap<String, Boolean> = mutableMapOf()
    private val filteredNames: MutableList<String> = mutableListOf()
    private var showAllSelected: Boolean = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        setupToggleNames()
        setupUI()
        loadToggleStates()
    }

    private fun setupToggleNames() {
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

    private fun setupUI() {
        // Set up RecyclerView
        recyclerView.layoutManager = LinearLayoutManager(this)
        val adapter = ToggleAdapter(toggleNames, toggleStates) { category, checked ->
            handleToggleChange(category, checked)
        }
        recyclerView.adapter = adapter

        // Set up the search bar
        searchBar.addTextChangedListener { text ->
            val query = text.toString()
            filterList(query)
        }

        // Show all selected button
        showSelectedButton.setOnClickListener {
            showAllSelected = !showAllSelected
            showSelectedButton.text = if (showAllSelected) "Show All" else "Show Selected"
            adapter.updateList(filteredNames)
        }

        // Scan button
        scanButton.setOnClickListener {
            // Handle barcode scanning logic
            startActivity(Intent(this, BarcodeScannerActivity::class.java))
        }
    }

    private fun filterList(query: String) {
        filteredNames.clear()
        toggleNames.forEach { (category, list) ->
            if (category.contains(query, true) || list.any { it.contains(query, true) }) {
                filteredNames.add(category)
                filteredNames.addAll(list.filter { it.contains(query, true) })
            }
        }
        recyclerView.adapter?.notifyDataSetChanged()
    }

    private fun handleToggleChange(itemName: String, isChecked: Boolean) {
        toggleStates[itemName] = isChecked
        saveToggleStates()
    }

    private fun loadToggleStates() {
        val prefs = getSharedPreferences("toggle_states", MODE_PRIVATE)
        val savedStates = prefs.getString("toggle_states", null)
        if (savedStates != null) {
            val loadedStates = Gson().fromJson(savedStates, HashMap::class.java)
            toggleStates.putAll(loadedStates)
        }
    }

    private fun saveToggleStates() {
        val prefs = getSharedPreferences("toggle_states", MODE_PRIVATE)
        val editor = prefs.edit()
        val savedStates = Gson().toJson(toggleStates)
        editor.putString("toggle_states", savedStates)
        editor.apply()
    }

    private fun showLoadingDialog() {
        val dialog = AlertDialog.Builder(this)
            .setView(layoutInflater.inflate(R.layout.dialog_loading, null))
            .setCancelable(false)
            .create()
        dialog.show()
    }
}
 */