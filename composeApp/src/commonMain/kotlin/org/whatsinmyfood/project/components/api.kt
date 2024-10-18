/*
import android.content.Context
import android.content.Intent
import android.util.Log
import okhttp3.OkHttpClient
import okhttp3.Request
import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.IOException
import java.util.concurrent.TimeUnit

data class Product(
    val code: String,
    val product: Map<String, Any>
)

var ingredientResults: MutableList<String> = mutableListOf()
var filteredResults: MutableList<Map<String, String>> = mutableListOf()

suspend fun makeGetRequest(barcode: String, foundThings: MutableList<String>, context: Context): Boolean {
    val url = "https://world.openfoodfacts.org/api/v0/product/$barcode.json"
    val client = OkHttpClient.Builder()
        .callTimeout(8, TimeUnit.SECONDS)
        .build()

    val request = Request.Builder()
        .url(url)
        .build()

    return try {
        val response = withContext(Dispatchers.IO) { client.newCall(request).execute() }
        if (response.isSuccessful) {
            val responseBody = response.body?.string() ?: return false
            Log.d("makeGetRequest", "Make get request")

            val decodedJson = Gson().fromJson(responseBody, Product::class.java)
            val product = decodedJson.product

            // Assume that the product contains ingredients as a string
            val ingredientsText = product["ingredients_text"]?.toString() ?: ""
            ingredientResults.add(ingredientsText)

            filteredResults = ingredientResults
                .map { mapOf("key" to it.toLowerCase()) }
                .toMutableList()

            Log.d("makeGetRequest", "make get request success")
            findThingsInIngredients(filteredResults, foundThings, context)

            true // Success
        } else {
            showAlert(context, "Scanning failure", "The scan failed")
            false // Failure
        }
    } catch (e: IOException) {
        showAlert(context, "Unknown error", "The error is $e")
        false // Failure
    }
}

fun findThingsInIngredients(filteredResults: List<Map<String, String>>, foundThings: MutableList<String>, context: Context) {
    val desiredStrings = GlobalVariables.lookingForThings.map { it.toLowerCase() }.toMutableList()

    // Match against the keyword lists
    for (entry in GlobalVariables.keywordLists) {
        val keyword = entry.keys.first()
        val list = entry.values.first()

        if (desiredStrings.contains(keyword)) {
            desiredStrings.addAll(list.map { it.toLowerCase() })
        }
    }

    // Clean up strings by replacing spaces with dashes
    val cleanedUpStrings = filteredResults
        .map { it["key"]?.replace("\\s+".toRegex(), "-") ?: "" }

    val commonElements = mutableListOf<String>()
    for (desiredString in desiredStrings) {
        val matchFound = cleanedUpStrings.any { it.contains(desiredString) }
        if (matchFound && !commonElements.contains(desiredString)) {
            commonElements.add(desiredString)
        }
    }

    foundThings.addAll(commonElements)

    if (foundThings.isNotEmpty()) {
        val intent = Intent(context, ResultsActivity::class.java).apply {
            putStringArrayListExtra("passedResults", ArrayList(foundThings))
        }
        context.startActivity(intent)
    } else {
        showAlert(context, "All good", "This food item is free from ingredients you are looking for")
    }
}

fun showAlert(context: Context, title: String, message: String) {
    val builder = android.app.AlertDialog.Builder(context)
    builder.setTitle(title)
        .setMessage(message)
        .setPositiveButton("OK") { dialog, _ -> dialog.dismiss() }
        .show()
}
 */