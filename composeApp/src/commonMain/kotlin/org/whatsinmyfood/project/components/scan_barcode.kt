/*import android.content.Context
import android.content.Intent
import androidx.activity.result.ActivityResultLauncher
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

// Declare a function type for the state update callback
typealias StateUpdateCallback = (String) -> Unit

// Function to handle barcode scanning and API request
suspend fun handleBarcodeScan(
    context: Context,
    onUpdate: StateUpdateCallback,
    foundThings: MutableList<String>,
    barcodeScannerLauncher: ActivityResultLauncher<Intent>
) {
    // Launch the barcode scanner and get the result
    val res = suspendCoroutine<String?> { continuation ->
        val intent = Intent(context, SimpleBarcodeScannerActivity::class.java)
        barcodeScannerLauncher.launch(intent) {
            continuation.resume(it)
        }
    }

    // If a barcode string was found
    res?.let {
        onUpdate(it) // Call the callback to update the state
        makeGetRequest(it, foundThings, context) // Make the API request
    }
}
*/