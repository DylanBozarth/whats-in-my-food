/*
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.button.MaterialButton
import com.google.android.material.card.MaterialCardView

class ResultsPageActivity : AppCompatActivity() {

    private lateinit var passedResults: List<String>
    private val keywordLists: List<Map<String, List<String>>> = listOf() // Initialize with actual data
    private val lookingForThings: List<String> = listOf() // Initialize with actual data

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_results_page)

        passedResults = intent.getStringArrayListExtra("passedResults") ?: listOf()

        val categorizedResults = categorizeResults(passedResults, keywordLists, lookingForThings)

        // Set up RecyclerView with categorized results
        val recyclerView = findViewById<RecyclerView>(R.id.recyclerViewResults)
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = ResultsAdapter(categorizedResults)

        // Handle adjust filters button
        val adjustFiltersButton = findViewById<Button>(R.id.adjustFiltersButton)
        adjustFiltersButton.setOnClickListener {
            val intent = Intent(this, HomePageActivity::class.java)
            startActivity(intent)
        }

        // Handle scan again button
        val scanAgainButton = findViewById<Button>(R.id.scanAgainButton)
        scanAgainButton.setOnClickListener {
            // Implement scanning logic here (e.g., launching a barcode scanner activity)
            handleBarcodeScan(this, {}, passedResults)
        }
    }

    private fun categorizeResults(
        passedResults: List<String>,
        keywordLists: List<Map<String, List<String>>>,
        lookingForThings: List<String>
    ): Map<String, List<String>> {
        // Convert lookingForThings and passedResults to lowercase and replace spaces with hyphens
        val lowercaseLookingForThings = lookingForThings.map { it.lowercase().replace(" ", "-") }
        val lowercasePassedResults = passedResults.map { it.lowercase().replace(" ", "-") }

        val categorizedResults = mutableMapOf<String, MutableList<String>>()

        // Convert all keywords and elements in keyword lists to lowercase and replace spaces with hyphens
        val lowercaseKeywordLists = keywordLists.map { map ->
            map.mapKeys { it.key.lowercase().replace(" ", "-") }
                .mapValues { it.value.map { elem -> elem.lowercase().replace(" ", "-") } }
        }

        // Add all keyword maps to categorizedResults
        lowercaseKeywordLists.forEach { map ->
            map.forEach { (key, value) ->
                categorizedResults[key] = mutableListOf()
            }
        }

        // Filter the categorizedResults to include only the keys from lowercaseLookingForThings
        val filteredResults = categorizedResults.filterKeys { lowercaseLookingForThings.contains(it) }

        // Iterate through lowercasePassedResults and keyword lists to categorize results
        lowercasePassedResults.forEach { result ->
            lowercaseKeywordLists.forEach { keywordMap ->
                keywordMap.forEach { (keyword, list) ->
                    if (list.any { result.contains(it) }) {
                        if (lowercasePassedResults.contains(result)) {
                            filteredResults[keyword]?.add(result)
                        }
                    }
                }
            }
        }

        return filteredResults.filter { it.value.isNotEmpty() } // Return only non-empty results
    }
}
 */